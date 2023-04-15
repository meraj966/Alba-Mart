import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import OrdersList from "../orders/OrdersList";
import PageTemplate from "./reusable/PageTemplate";
import Dropdown from "../components/reusable/Dropdown";
import { ORDER_TYPE_DROPDOWN_VALUES } from "../Constants";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../firebase-config";

export default function Orders() {
  const [orderType, setOrderType] = useState(0);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    const ref = collection(db, "Order");
    const data = await getDocs(ref);
    setOrders(data.docs.map((data) => ({ ...data.data(), id: data.id })))
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
      <div style={{ float: "right" }}>
        <TextField
          id="outlined-search"
          sx={{ minWidth: "280px" }}
          label="Search"
          type="search"
        />
      </div>
    </div>
  );

  return (
    <>
      <PageTemplate title="Orders" toolbar={toolbar()}>
        <OrdersList orders={orders}/>
      </PageTemplate>
    </>
  );
}
