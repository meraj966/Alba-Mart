import React, { useEffect, useState, useRef } from "react";
import PageTemplate from "../pages/reusable/PageTemplate";
import { Button, Card, Grid } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useParams } from "react-router";
import { getProductByIds } from "../firebase_utils";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../firebase-config";
import ProductsList from "../products/ProductsList";
import "../orders/OrderDetails.css";

import { useReactToPrint } from "react-to-print";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({});
  const [subTotal, setSubTotal] = useState(0);

  const componentRef = useRef();

  useEffect(() => {
    getOrderDetail();
  }, []);
  useEffect(() => {
    if (order && Object.keys(order).length > 0) setOrderProducts();
  }, [order]);
  const setOrderProducts = async () => {
    let total = 0
    let products = Object.keys(order.products)?.map((i) => {
      let product = order.products[i]
      total = (total + Number(product.amount))
      return {
      id: i,
      price: product.mrp,
      name: product.name,
      amount: product.amount,
      rate: product.rate,
      quantity: product.quantity
    }});
    setSubTotal(total)
    const userData = await getDoc(doc(db, "UserProfile", order.userID));
    setUser(userData.data())
    console.log(userData.data());
    setProducts(products);
  };
  console.log(order);
  const getOrderDetail = async () => {
    try {
      const orderData = await getDoc(doc(db, "Order", id));
      const order = orderData.data();
      if (order) {
        const userData = await getDoc(doc(db, "UserProfile", order.userID));
        const user = userData.data();
        const productIds = Object.keys(order.products || {});

        if (productIds.length > 0) {
          const fetchedProducts = await getProductByIds(productIds);
          const products = productIds.map((productId) => {
            const product = fetchedProducts.find((p) => p.id === productId);
            if (product) {
              return {
                id: productId,
                url: order.products[productId].image,
                price: order.products[productId].mrp,
                name: product.name,
                amount: order.products[productId].amount,
                rate: order.products[productId].rate,
                quantity: order.products[productId].unit,
              };
            }
            return null;
          });

          setOrder(order);
          setUser(user);
          setProducts(products.filter(Boolean));
          setOrderProducts(); // Call the function to update the products
        } else {
          setOrder(order);
          setUser(user);
          setProducts([]);
        }
      } else {
        setOrder({});
        setUser({});
        setProducts([]);
      }
    } catch (error) {
      console.log("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    getOrderDetail();
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      const tableCell = componentRef.current.querySelector(".hide-on-print");
      if (tableCell) {
        tableCell.classList.add("hidden-on-print");
      }
    },
    onAfterPrint: () => {
      const tableCell = componentRef.current.querySelector(".hide-on-print");
      if (tableCell) {
        tableCell.classList.remove("hidden-on-print");
      }
    }
  });
  

  return (
    <PageTemplate
      title={
        <div>
          <span>Order Details</span>
          <Button
            variant="contained"
            endIcon={<PrintIcon />}
            sx={{ float: "right" }}
            onClick={handlePrint} // Call handlePrint function when the button is clicked
          >
            Print
          </Button>
        </div>
      }
    >
      <div ref={componentRef}>
        <Grid container spacing={2} sx={{ padding: "10px" }}>
          <Grid item xs={2}>
            Order ID:
          </Grid>
          <Grid item xs={10}>
            {id}
          </Grid>
          <Grid item xs={2}>
            Customer Name:
          </Grid>
          <Grid item xs={4}>
            {user?.name}
          </Grid>
          <Grid item xs={2}>
            Customer Contact:
          </Grid>
          <Grid item xs={4}>
            {user?.phoneNo}
          </Grid>
          <Grid item xs={2}>
            Address:
          </Grid>
          <Grid item xs={4}>
            {user?.address}
          </Grid>
          <Grid item xs={2}>
            Landmark:
          </Grid>
          <Grid item xs={4}>
            {user?.landmark}
          </Grid>
          <Grid item xs={2}>
            Delivery Date:
          </Grid>
          <Grid item xs={4}>
            {order?.date}
          </Grid>
          <Grid item xs={2}>
            Delivery Slot:
          </Grid>
          <Grid item xs={4}>
            {order?.deleverySlot || "-"}
          </Grid>
          <Card sx={{ width: "100%", marginTop: "10px" }}>
            <ProductsList
              rows={products}
              isDetailView={true}
              isOrderDetailView={true}
            />
          </Card>
          <Grid item xs={2}>
            Sub Total Price:
          </Grid>
          <Grid item xs={8} />
          <Grid item>{order?.totalMrp}</Grid>
          <Grid item xs={2}>
            Tax:
          </Grid>
          <Grid item xs={8} />
          <Grid item>{0}</Grid>
          <Grid item xs={2}>
            Delivery Charge:
          </Grid>
          <Grid item xs={8} />
          <Grid item>{0}</Grid>
          <Grid item xs={2}>
            Net Amount:
          </Grid>
          <Grid item xs={8} />
          <Grid item>{order?.totalRate}</Grid>
          <Grid item xs={2}>
            Total Dis Amount:
          </Grid>
          <Grid item xs={8} />
          <Grid item>{order?.totalMrp - order?.totalRate}</Grid>
        </Grid>
      </div>
    </PageTemplate>
  );
}

export default OrderDetails;
