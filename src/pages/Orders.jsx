import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import OrdersList from "../orders/OrdersList";
import PageTemplate from "./reusable/PageTemplate";
import Dropdown from "../components/reusable/Dropdown";
import { ORDER_TYPE_DROPDOWN_VALUES } from "../Constants";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../firebase-config";
import UndoIcon from "@mui/icons-material/Undo";
import { cloneDeep } from "lodash";

export default function Orders() {
  const [orderType, setOrderType] = useState("All Orders");
  const [orders, setOrders] = useState([]);
  const [filteredOrder, setFilteredOrders] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0] // Initialize with current date
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0] // Initialize with current date
  );

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (orderType === "All Orders") {
      setFilteredOrders(null);
    } else {
      setFilteredOrders(orders.filter((o) => o.orderStatus === orderType));
    }
  }, [orderType]);

  const getOrders = async () => {
    const ref = collection(db, "Order");
    const data = await getDocs(ref);
    setOrders(data.docs.map((data) => ({ ...data.data(), id: data.id })));
  };

  const refreshOrders = async () => {
    console.log("refreshhhhhhhhhhhhhhhhhhh");
    await getOrders();
  };

  const toolbar = () => (
    <div
      style={{
        paddingLeft: "20px",
        marginBottom: "15px",
        display: "flow-root",
      }}
    >
      <div style={{ float: "left" }}>
        <Dropdown
          label={"Order Type"}
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
          data={ORDER_TYPE_DROPDOWN_VALUES}
          sx={{ minWidth: "280px" }}
        />
      </div>
      <div style={{ float: "left", marginLeft: "20px" }}>
        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ marginRight: "5px" }}
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ marginRight: "5px" }}
        />
        <Button
          onClick={() => handleFilter()}
          style={{
            marginRight: "5px",
            fontSize: "15px",
            color: "black",
            background: "#1976d2",
            color: "white",
          }}
        >
          Filter
        </Button>
        <Button
          onClick={() => handleClear()}
          style={{
            fontSize: "15px",
            color: "black",
            background: "#f44336",
            color: "white",
          }}
        >
          Clear
        </Button>
      </div>
      <div style={{ float: "right" }}>
        <Button>
          {isEdit ? (
            <UndoIcon
              style={{ marginLeft: "5px", fontSize: "20px", color: "black" }}
              onClick={() => {
                setIsEdit(false);
              }}
            />
          ) : (
            <EditIcon
              style={{ marginLeft: "5px", fontSize: "20px" }}
              onClick={() => setIsEdit(!isEdit)}
            />
          )}{" "}
        </Button>
      </div>
    </div>
  );

  const handleFilter = () => {
    // Filtering orders based on selected date range
    const filteredOrders = orders.filter((order) => {
      if (!startDate || !endDate) return true; // If start or end date is not selected, display all orders
      const orderDate = new Date(order.orderDate).getTime();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filteredOrders);
  };

  const handleClear = () => {
    // Clear the date filter and display all orders
    setStartDate(new Date().toISOString().split("T")[0]); // Reset to current date
    setEndDate(new Date().toISOString().split("T")[0]); // Reset to current date
    setFilteredOrders(null);
  };

  return (
    <>
      <PageTemplate title="Orders" toolbar={toolbar()}>
        <OrdersList
          orderData={
            filteredOrder ? cloneDeep(filteredOrder) : cloneDeep(orders)
          }
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          refreshOrders={refreshOrders}
        />
      </PageTemplate>
    </>
  );
}
