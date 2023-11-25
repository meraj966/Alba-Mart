import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../firebase-config";
import { useReactToPrint } from "react-to-print";
import numberToWords from "number-to-words";
import "./OrderPreview.css";
import { capitalize } from "lodash";

function capitalizeFirstLetter(sentence) {
  return sentence.replace(/\b\w/g, (char) => char.toUpperCase());
}

function OrderPreview() {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState({});
  const [user, setUser] = useState({});
  const [netAmountInWords, setNetAmountInWords] = useState("");
  const [totalQty, setTotalQty] = useState(0);

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

        // Calculate total quantity
        const qtyArray = Object.values(order.products).map(product => product.quantity);
        const totalQtyValue = qtyArray.reduce((total, qty) => total + qty, 0);
        setTotalQty(totalQtyValue);

        // Convert Net Amount to words
        const netAmountWords = numberToWords.toWords(order.netPrice);
        const capitalizedNetAmountWords = capitalizeFirstLetter(netAmountWords);
        setNetAmountInWords(capitalizedNetAmountWords);
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
        <h2 className="print-fixheader">*** CASH MEMO ***</h2>
        <h2 className="print-albamart">ALBA MART</h2>
        <h2 className="print-fixheader">ALBA COLONY, RANIPUR ROAD</h2>
        <h2 className="print-fixheader">PHULWARISHARIF, PATNA-801505</h2>
        <h2 className="print-fixheader">MOB: 7004944881, 7488581099</h2>

        <div className="separation-line" />

        <p className="custdetail">Payment Mode: {order?.paymentType}</p>
        <p className="custdetail">Order Id: {"AM-" + order?.orderNumber}</p>
        <p className="custdetail">Customer Name: {user?.name}</p>
        <p className="custdetail">Mob: {user?.phoneNo}</p>
        {order && order.orderDate && (
          <>
            <p className="custdetail">Date: {order.orderDate.split(" ")[0]}</p>
          </>
        )}
        <p className="custdetail">Address: {user?.address}</p>

        <div className="separation-line" />

        <table className="bill-table">
          <thead>
            <tr>
              <th>S No.</th>
              <th>Name</th>
              <th>Unit</th>
              <th>Qty</th>
              <th>Mrp</th>
              <th>Price</th>
              <th>Amt</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(products).map((productId, index) => {
              const product = products[productId];
              return (
                <React.Fragment key={productId}>
                  <tr>
                    <td>{index + 1}</td>
                    <td colSpan="6">{product.name}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>{product.unit}</td>
                    <td>{product.quantity}</td>
                    <td>{product.mrp}.00</td>
                    <td>{product.rate}.00</td>
                    <td>{product.amount}.00</td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        <div className="separation-line" />

        <strong>
          <p className="noofitems">No. of Items: <span>{totalQty}</span></p>
          <div className="separation-line" />
          <p className="formatted-line">Sub Total Price: <span>{order?.totalMrp}.00</span></p>
          <p className="formatted-line">Tax: <span>0.00</span></p>
          <p className="formatted-line">Delivery Charge: <span>{order?.deliveryCharge}.00</span></p>
          <p className="formatted-line">Promo Code Discount: <span>- {order?.promoCodeValue}.00</span></p>
          <p className="formatted-line">Total Discount Amount: <span>{order?.totalMrp - order?.totalRate}.00</span></p>
          <p className="formatted-line">Net Amount: <span>{order?.netPrice}.00</span></p>
          <p className="formatted-line">Rs {netAmountInWords}</p>
          <p className="formatted-line">You Saved Rs {order?.totalMrp - order?.totalRate}.00 on this order</p>
        </strong>

        <div className="separation-line" />
        <strong>
          <p>Term & Condition</p>
        </strong>
        <p>1. All Disputes Subject To Patna Jurisdiction Only</p>
        <p>2. Price Includes Applicable Taxes</p>
        <p>3. Goods Once Sold Not To Be Taken Back</p>
        <p>4. Thank You For Visit</p>
        <h2 className="print-fixheader">**********</h2>
      </div>

      <Button
        variant="contained"
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: "1",
        }}
        onClick={handlePrint}
      >
        Print
      </Button>
    </div>
  );
}

export default OrderPreview;
