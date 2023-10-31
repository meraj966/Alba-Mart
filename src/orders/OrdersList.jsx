import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { map, sum } from "lodash";
import Box from "@mui/material/Box";
import Dropdown from "../components/reusable/Dropdown";
import { ORDER_TYPE_DROPDOWN_VALUES } from "../Constants";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import { getOrdersGridColumns } from "../products/constants";

function OrdersList({ orderData, isEdit, setIsEdit, refreshOrders }) {
  const [users, setUser] = useState([]);
  const [deliveryBoy, setDeliveryBoy] = useState([]);
  const [updatedOrders, setUpdatedOrders] = useState([]);
  const [orders, setOrders] = useState([...orderData]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    getUserByOrder();
    getDeliveryBoy();
  };

  useEffect(() => {
    setOrders([...orderData]);
  }, [orderData]);

  const getDeliveryBoy = async () => {
    let deliveryBoyData = await getDocs(collection(db, "DeliveryBoy"));
    setDeliveryBoy(
      deliveryBoyData.docs.map((i) => ({ ...i.data(), id: i.id }))
    );
  };

  const getUserByOrder = async () => {
    let data = await getDocs(collection(db, "UserProfile"));
    let users = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setUser(users);
  };

  const handleChange = (e, index, order, type) => {
    let orderdata = [...orders];
    setUpdatedOrders([...updatedOrders, order.id]);
    orderdata[index][type] = e.target.value;
    setOrders([...orderdata]);
  };

  const deliveryBoyDropdown = (index, order) => {
    if (
      (order.orderStatus === "placed" || order.orderStatus === "processing") &&
      deliveryBoy.some((i) => i.isAvailable)
    ) {
      const availableDeliveryBoys = deliveryBoy
        .filter((i) => i.isAvailable)
        .map((i) => ({ value: i.id, label: i.name }));
  
      return (
        <Dropdown
          label="Delivery Boy"
          value={orders[index].deliveryBoy}
          data={availableDeliveryBoys}
          onChange={(e) => handleChange(e, index, order, "deliveryBoy")}
        />
      );
    } else {
      // Display the current delivery boy name if not editable
      return (
        <span>
          {deliveryBoy.find((i) => i.id === order.deliveryBoy)?.name || "-"}
        </span>
      );
    }
  };  

  const handleSave = async () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as "YYYY-MM-DD"
    
    updatedOrders.forEach(async (id) => {
      const orderToUpdate = orders.find((i) => i.id === id);
      const { deliveryBoy, ...restOrderData } = orderToUpdate;

      // Update both the 'deliveryBoy' and 'deliveryBoyResponse' columns
      await updateDoc(doc(db, "Order", id), {
        ...restOrderData,
        deliveryBoy,
        deliveryBoyResponse: "none",
        orderStatus: "processing", // Update orderStatus to "processing"
        processingDate: formattedDate, // Update processingDate to the current date
      });
    });

    setIsEdit(false);
    setUpdatedOrders([]);
    refreshOrders();
  };

  return (
    <Box sx={{ width: "100%" }}>
      {isEdit ? (
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="left">Order ID</TableCell>
                <TableCell align="left">Cust Name</TableCell>
                <TableCell align="left">Cust Contact</TableCell>
                <TableCell align="left">Total Amount</TableCell>
                <TableCell align="left">Order Date</TableCell>
                <TableCell align="left">Payment Mode</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">
                  {isEdit ? "Assign Delivery Boy" : "Delivery Boy"}
                </TableCell>
                <TableCell align="left">Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders &&
                orders.map((order, index) => {
                  const user = users.find((i) => i.user === order.userID);
                  return (
                    <TableRow hover tabIndex={-1} key={order.id}>
                      <TableCell align="left">AM-{order.orderNumber}</TableCell>
                      <TableCell align="left">{user?.name}</TableCell>
                      <TableCell align="left">{user?.phoneNo}</TableCell>
                      <TableCell align="left">
                        {sum(map(Object.values(order.products), "amount"))}
                      </TableCell>
                      <TableCell align="left">
                        {user && user.date ? user.date.split(" ")[0] : ""}
                      </TableCell>
                      <TableCell align="left">
                        {order.paymentType || "-"}
                      </TableCell>
                      <TableCell align="left">{order.orderStatus}</TableCell>
                      <TableCell align="left">
                        {isEdit
                          ? deliveryBoyDropdown(index, order)
                          : deliveryBoy.find((i) => i.id === order.deliveryBoy)
                            ?.name || "-"}
                      </TableCell>
                      <TableCell align="left">
                        <Link
                          to={`/order-details/${order.orderId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <OpenInNewIcon />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          {isEdit && (
            <Grid item xs={12}>
              <Button
                style={{
                  float: "right",
                  margin: "10px 10px 0",
                  background: "#1976d2",
                  color: "white",
                }}
                onClick={handleSave}
              >
                Save
              </Button>
            </Grid>
          )}
        </TableContainer>
      ) : (
        <DataGrid
          rows={orders}
          columns={getOrdersGridColumns(
            users,
            isEdit,
            null, // Pass null to prevent statusDropdown
            deliveryBoy
          )}
          autoHeight={true}
        ></DataGrid>
      )}
    </Box>
  );
}

export default OrdersList;
