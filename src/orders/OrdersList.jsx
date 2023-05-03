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
import { Stack } from "@mui/system";
import Dropdown from "../components/reusable/Dropdown";
import { ORDER_TYPE_DROPDOWN_VALUES } from "../Constants";
import Swal from "sweetalert2";

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
    return (
      <Dropdown
        label="Delivery Boy"
        value={orders[index].deliveryBoy}
        data={map(deliveryBoy, (i) => ({ value: i.id, label: i.name }))}
        onChange={(e) => handleChange(e, index, order, "deliveryBoy")}
      />
    );
  };
  const statusDropdown = (index, order) => (
    <Dropdown
      label="Status"
      value={orders[index].orderStatus}
      onChange={(e) => handleChange(e, index, order, "orderStatus")}
      data={ORDER_TYPE_DROPDOWN_VALUES}
    />
  );
  const handleSave = () => {
    updatedOrders.forEach(async (id) => {
      await updateDoc(doc(db, "Order", id), {
        ...orders.find((i) => i.id === id)
      });
    });
    setIsEdit(false);
    setUpdatedOrders([]);
    refreshOrders();
  };

  return (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left">Order ID</TableCell>
            <TableCell align="left">Cust Name</TableCell>
            <TableCell align="left">Cust Contact</TableCell>
            <TableCell align="left">Total Amount</TableCell>
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
                  <TableCell align="left">{order.orderId}</TableCell>
                  <TableCell align="left">{user?.name}</TableCell>
                  <TableCell align="left">{user?.phoneNo}</TableCell>
                  <TableCell align="left">
                    {sum(map(Object.values(order.products), "amount"))}
                  </TableCell>
                  <TableCell align="left">{order.paymentMode || "-"}</TableCell>
                  <TableCell align="left">
                    {isEdit ? statusDropdown(index, order) : order.orderStatus}
                  </TableCell>
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
  );
}

export default OrdersList;
