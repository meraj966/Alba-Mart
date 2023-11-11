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
  const [selectedDeliveryBoys, setSelectedDeliveryBoys] = useState({});

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
    setSelectedDeliveryBoys({
      ...selectedDeliveryBoys,
      [order.id]: e.target.value,
    });
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
          value={selectedDeliveryBoys[order.id] || ""}
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
      await updateDoc(doc(db, "Order", id), {
        ...orders.find((i) => i.id === id),
        deliveryBoy: selectedDeliveryBoys[id], // Save the selected delivery boy ID
        deliveryBoyResponse: "none",
        orderStatus: "processing",
        processingDate: formattedDate,
      });
    });
  
    setIsEdit(false);
    setUpdatedOrders([]);
    setSelectedDeliveryBoys({}); // Reset selected delivery boys state
    refreshOrders();
  };  

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.orderDate)?.getTime() || 0;
    const dateB = new Date(b.orderDate)?.getTime() || 0;
    return dateB - dateA;
  });

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
              {sortedOrders.map((order, index) => {
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
                      {order && order.orderDate ? order.orderDate.split(" ")[0] : ""}
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
          rows={sortedOrders}
          columns={getOrdersGridColumns(
            users,
            isEdit,
            null,
            deliveryBoy
          )}
          autoHeight={true}
        ></DataGrid>
      )}
    </Box>
  );
}

export default OrdersList;
