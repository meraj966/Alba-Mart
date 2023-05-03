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
  
  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (orderType === "All Orders") {
      setFilteredOrders(null);
    } else {
      setFilteredOrders(orders.filter(o=>o.orderStatus === orderType))
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
