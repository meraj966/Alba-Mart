import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../firebase-config";
import { useReactToPrint } from "react-to-print";
import "./OrderPreview.css"; // Import custom CSS for printing

function OrderPreview() {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState({});
  const [user, setUser] = useState({});

  useEffect(() => {
    getOrderDetail();
  }, [id]);

  const getOrderDetail = async () => {
    try {
      const orderData = await getDoc(doc(db, "Order", id));
      const order = orderData.data();
      if (order) {
        const userData = await getDoc(doc(db, "UserProfile", order.userID));
        const user = userData.data();

        setOrder(order);
        setUser(user);
        setProducts(order.products || {});
      }
    } catch (error) {
      console.log("Error fetching order details:", error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const componentRef = React.useRef();

  return (
    <div>
      <div ref={componentRef} className="print-container">
        <h2 className="print-heading">Order Details</h2>
        <p>Order ID: {id}</p>
        <p>Customer Name: {user?.name}</p>
        <p>Customer Contact: {user?.phoneNo}</p>
        <p>Address: {user?.address}</p>
        <p>Landmark: {user?.landmark}</p>
        <p>Delivery Date: {order?.date}</p>
        <p>Delivery Slot: {order?.deleverySlot || "-"}</p>

        <h3 className="print-heading">Products:</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>MRP</th>
              <th>Sale Price</th>
              <th>Discount</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(products).map((productId) => (
              <tr key={productId}>
                <td>{products[productId].name}</td>
                <td>{products[productId].mrp}</td>
                <td>{products[productId].amount}</td>
                <td>{products[productId].rate}</td>
                <td>{products[productId].quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="separation-line" />

        <strong><p>Sub Total Price: {order?.totalMrp}</p>
        <p>Tax: {0}</p>
        <p>Delivery Charge: {0}</p>
        <p>Net Amount: {order?.totalRate}</p>
        <p>Total Discount Amount: {order?.totalMrp - order?.totalRate}</p></strong>
      </div>

      <Button variant="contained" 
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: "1", // Ensure the button is above the content
        }} 
        onClick={handlePrint}>
        Print
      </Button>
    </div>
  );
}

export default OrderPreview;
