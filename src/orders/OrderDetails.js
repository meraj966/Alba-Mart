import React, { useEffect, useState } from "react";
import PageTemplate from "../pages/reusable/PageTemplate";
import { Button, Card, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "@firebase/firestore";
import { db } from "../firebase-config";
import Swal from "sweetalert2";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [user, setUser] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [showResetStockButton, setShowResetStockButton] = useState(true); // State variable to control button visibility
  const [refundComment, setRefundComment] = useState("");
  const [refundedValue, setRefundedValue] = useState("yes");
  const [isFormDisabled, setFormDisabled] = useState(false); // Added state to track form disabled state

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderData = await getDoc(doc(db, "Order", id));
        const order = orderData.data();

        // Check the refunded field value and disable the form accordingly
        if (order && order.refunded) {
          setFormDisabled(true);
        }
      } catch (error) {
        console.log("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [id]);

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

  const isReturnOrder = order.cancelComment === "return";
  const handleResetStock = async () => {
    // Display SweetAlert confirmation
    const confirmation = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'Resetting stock will update the stock values. Do you really want to proceed?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reset stock!'
    });

    if (confirmation.isConfirmed) {
      try {
        for (const productId of Object.keys(order.products || {})) {
          const product = order.products[productId];
          const menuDocRef = doc(db, "Menu", productId);
          const menuDocSnapshot = await getDoc(menuDocRef);
          const currentStockValue = parseInt(menuDocSnapshot.data().stockValue || "0", 10);
          const newStockValue = currentStockValue + product.quantity;
          await updateDoc(menuDocRef, {
            stockValue: newStockValue
          });
        }

        await updateDoc(doc(db, "Order", id), {
          cancelComment: "returned"
        });

        // Display SweetAlert success message
        Swal.fire({
          icon: "success",
          title: "Sale Value Updated",
          text: "The stock values have been updated successfully.",
        }).then((result) => {
          if (result.isConfirmed) {
            setShowResetStockButton(false);
          }
        });
      } catch (error) {
        console.log("Error resetting stock:", error);

        // Display SweetAlert error message
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error while resetting the stock. Please try again.",
        });
      }
    }
  };

  const handleRefundSubmit = async (event) => {
    event.preventDefault();

    // Display SweetAlert confirmation
    const confirmation = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'Do you really want to submit the refund information?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    });

    if (confirmation.isConfirmed) {
      try {
        let updateFields = {
          refunded: refundedValue === "yes",
        };

        if (order?.orderStatus === "canceled") {
          updateFields.paymentStatus = refundComment;
        } else if (order?.orderStatus === "delivered" && order?.deliveryComment === "One or more item missing from order corresponding amount will be refunded") {
          updateFields.deliveryComment = refundComment;
        }

        await updateDoc(doc(db, "Order", id), updateFields);

        // Display SweetAlert success message
        Swal.fire({
          icon: "success",
          title: "Form Submitted!",
          text: "Refund information has been successfully submitted.",
        });

        // Update the state to indicate form submission
        setFormDisabled(true);

        console.log("Order updated successfully with refund comment and refunded value.");
      } catch (error) {
        console.error("Error updating order:", error);

        // Display SweetAlert error message
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error while updating the order. Please try again.",
        });
      }
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
          {showResetStockButton && isReturnOrder && (
            <Button variant="contained" sx={{ marginLeft: "20px" }} onClick={handleResetStock}>
              Reset Stock
            </Button>
          )}
        </>
      }
    >
      <Grid container spacing={2} sx={{ padding: "10px" }}>
        <Grid item xs={2}>
          Order ID:
        </Grid>
        <Grid item xs={4}>
          {"AM-" + order?.orderNumber}
        </Grid>
        <Grid item xs={2}>
          Payment Mode:
        </Grid>
        <Grid item xs={4}>
          {order?.paymentType}
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
          {order?.deliveryDate || "-"}
        </Grid>
        <Grid item xs={2}>
          Delivery Slot:
        </Grid>
        <Grid item xs={4}>
          {order?.deliverySlotNumber || "-"}
        </Grid>
        <Grid item xs={2}>
          Delivery Time:
        </Grid>
        <Grid item xs={4}>
          {order?.deliveryTime || "-"}
        </Grid>
        <Grid item xs={2}>
          Order Status:
        </Grid>
        <Grid item xs={4}>
          {order?.orderStatus || "-"}
        </Grid>
        {order?.orderStatus === "canceled" && (
          <Grid item xs={2}>
            Cancel Reason:
          </Grid>
        )}
        {order?.orderStatus === "canceled" && (
          <Grid item xs={4}>
            {order?.cancelReason}
          </Grid>
        )}
        {order?.orderStatus === "canceled" && (
          <Grid item xs={2}>
            Refund Comment:
          </Grid>
        )}
        {order?.orderStatus === "canceled" && (
          <Grid item xs={4}>
            {order?.paymentStatus}
          </Grid>
        )}
        {(order?.orderStatus === "canceled") || (order?.orderStatus === "delivered" && order?.refunded === true) && (
          <Grid item xs={2}>
            Refund ?:
          </Grid>
        )}
        {(order?.orderStatus === "canceled") || (order?.orderStatus === "delivered" && order?.refunded === true) && (
          <Grid item xs={4}>
            {order?.refunded ? 'Yes' : 'No'}
          </Grid>
        )}
        {order?.orderStatus === "delivered" && (
          <>
            <Grid item xs={2}>
              Delivery Comment:
            </Grid>
            <Grid item xs={4}>
              {order?.deliveryComment}
            </Grid>
          </>
        )}
        <Grid item xs={2}>
          Transaction ID:
        </Grid>
        <Grid item xs={4}>
          {order?.orderId}
        </Grid>

        <Grid item xs={2}>
          Reference Transaction ID:
        </Grid>
        <Grid item xs={2}>
          {order?.TransactionId}
        </Grid>

        <Grid item xs={20}>
          <hr></hr>
        </Grid>

        {/* Refund Form order*/}
        {((order?.orderStatus === "canceled" && order?.paymentStatus === "| Amount will be refunded to original payment_method in 48 working hours") || (order?.orderStatus === "delivered" && order?.deliveryComment === "One or more item missing from order corresponding amount will be refunded")) && (
          <form onSubmit={handleRefundSubmit} style={{ marginBottom: "10px" }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <label>Refund Comment:</label>
              </Grid>
              <Grid item xs={8}>
                <textarea
                  placeholder="Refund Comment"
                  value={refundComment}
                  onChange={(e) => setRefundComment(e.target.value)}
                  style={{ width: "100%", height: "80px", padding: "8px" }}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={4}>
                <label>Refunded ?</label>
              </Grid>
              <Grid item xs={4} style={{ display: "flex", alignItems: "center" }}>
                <label style={{ marginRight: "10px" }}>
                  <input
                    type="radio"
                    value="yes"
                    checked={refundedValue === "yes"}
                    onChange={() => setRefundedValue("yes")}
                    disabled={isFormDisabled}
                  />
                  Yes
                </label>
              </Grid>
              <Grid item xs={12}>
                <button
                  type="submit"
                  disabled={isFormDisabled}
                  style={{
                    backgroundColor: "#4CAF50", // Green color
                    color: "white",
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </Grid>
              <Grid item xs={20}>
                <hr></hr>
              </Grid>
            </Grid>
          </form>
        )}

        <Card sx={{ width: "100%", marginTop: "10px" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>MRP</TableCell>
                  <TableCell>Sale Price</TableCell>
                  <TableCell>Amount</TableCell>
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
                    <TableCell>{order.products[productId].unit}</TableCell>
                    <TableCell>{order.products[productId].quantity}</TableCell>
                    <TableCell>{order.products[productId].mrp}.00</TableCell>
                    <TableCell>{order.products[productId].rate}.00</TableCell>
                    <TableCell>{order.products[productId].amount}.00</TableCell>
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
        <Grid item>{order?.totalMrp}.00</Grid>
        <Grid item xs={2}>
          Tax:
        </Grid>
        <Grid item xs={8} />
        <Grid item>{0}.00</Grid>
        <Grid item xs={2}>
          Delivery Charge:
        </Grid>
        <Grid item xs={8} />
        <Grid item>{order?.deliveryCharge}.00</Grid>
        <Grid item xs={2}>
          Promo Code:
        </Grid>
        <Grid item xs={8} />
        <Grid item>- {order?.promoCodeValue}.00</Grid>
        <Grid item xs={2}>
          Total Discount Amount:
        </Grid>
        <Grid item xs={8} />
        <Grid item>- {order?.totalMrp - order?.totalRate}.00</Grid>
        <Grid item xs={2}>
          Net Amount:
        </Grid>
        <Grid item xs={8} />
        <Grid item>{order?.netPrice}.00</Grid>
      </Grid>
    </PageTemplate>
  );
}

export default OrderDetails;
