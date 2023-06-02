import React, { useEffect, useState } from "react";
import PageTemplate from "../pages/reusable/PageTemplate";
import { Button, Card, Grid, Table } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useParams } from "react-router";
import { getProductByIds } from "../firebase_utils";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../firebase-config";
import ProductsList from "../products/ProductsList";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  useEffect(() => {
    getOrderDetail();
  }, []);
  useEffect(() => {
    if (order && Object.keys(order).length > 0) setOrderProducts();
  }, [order]);
  const setOrderProducts = async () => {
    // let products = Object.keys(order.products);
    // console.log(products)
    let total = 0
    let products = Object.keys(order.products).map((i) => {
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
    const data = await getDoc(doc(db, "Order", id));
    setOrder(data.data());
  };
  return (
    <PageTemplate
      title={
        <div>
          <span>Order Details</span>
          <Button
            variant="contained"
            endIcon={<PrintIcon />}
            sx={{ float: "right" }}
          >
            Print
          </Button>
        </div>
      }
    >
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
        <Grid item>{subTotal}</Grid>
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
        <Grid item>{0}</Grid>
        <Grid item xs={2}>
          Order Status
        </Grid>
        <Grid item xs={8} />
        <Grid item>{order?.orderStatus}</Grid>
      </Grid>
    </PageTemplate>
  );
}

export default OrderDetails;
