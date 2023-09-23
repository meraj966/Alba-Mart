import React, { useEffect, useState } from "react";
import PageTemplate from "../pages/reusable/PageTemplate";
import { Button, Card, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../firebase-config";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [user, setUser] = useState({});
  const [subTotal, setSubTotal] = useState(0);

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
      }
    } catch (error) {
      console.log("Error fetching order details:", error);
    }
  };

  return (
    <PageTemplate
      title={
        <>
          <span>Order Details</span>
          <Link to={`/order-preview/${id}`}>
            <Button variant="contained" sx={{ marginLeft: "20px" }}>
              Preview
            </Button>
          </Link>
        </>
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>MRP</TableCell>
                  <TableCell>Sale Price</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(order.products || {}).map((productId) => (
                  <TableRow key={productId}>
                    <TableCell>{order.products[productId].name}</TableCell>
                    <TableCell>
                      <img
                        src={order.products[productId].image}
                        alt={order.products[productId].name}
                        height="70px"
                        width="70px"
                        style={{ borderRadius: "15px" }}
                        loading="lazy"
                      />
                    </TableCell>
                    <TableCell>{order.products[productId].mrp}</TableCell>
                    <TableCell>{order.products[productId].rate}</TableCell>
                    <TableCell>{order.products[productId].amount}</TableCell>
                    <TableCell>{order.products[productId].unit}</TableCell>
                    <TableCell>{order.products[productId].quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
          Total Discount Amount:
        </Grid>
        <Grid item xs={8} />
        <Grid item>{order?.totalMrp - order?.totalRate}</Grid>
      </Grid>
    </PageTemplate>
  );
}

export default OrderDetails;
