import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import OrdersList from "../orders/OrdersList";
import PageTemplate from "./reusable/PageTemplate";
import Dropdown from "../components/reusable/Dropdown";
import { ORDER_TYPE_DROPDOWN_VALUES } from "../Constants";
import { collection, getDocs, onSnapshot, query, where, doc, updateDoc } from "@firebase/firestore";
import { db } from "../firebase-config";
import UndoIcon from "@mui/icons-material/Undo";
import { cloneDeep } from "lodash";
import Swal from "sweetalert2";

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
    listenForRejectedOrders(); // Add this line to listen for rejected orders
  }, []);

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Order"), (snapshot) => {
      const updatedOrders = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    });
    return () => {
      unsubscribe();
    };
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
        {isEdit ? (
          <Button
            onClick={() => setIsEdit(false)}
            style={{
              fontSize: "16px",
              color: "white",
              backgroundColor: "#1976d2",
              padding: "5px 10px", // Adjust the padding for size
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Update Delivery Boy
            <UndoIcon style={{ marginLeft: "5px", fontSize: "16px", color: "black" }} />
          </Button>
        ) : (
          <Button
            onClick={() => setIsEdit(!isEdit)}
            style={{
              fontSize: "16px",
              color: "white",
              backgroundColor: "#1976d2",
              padding: "5px 10px", // Adjust the padding for size
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Update Delivery Boy
            <EditIcon style={{ marginLeft: "5px", fontSize: "16px" }} />
          </Button>
        )}
      </div>
    </div>
  );

  const listenForRejectedOrders = () => {
    const ordersCollection = collection(db, "Order");
    const q = query(ordersCollection, where("deliveryBoyResponse", "==", "reject"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        const orderNumber = orderData.orderNumber;

        Swal.fire({
          title: `Delivery Boy rejected to accept the order for AM-${orderNumber}`,
          text: "Kindly reassign the delivery boy.",
          icon: "warning",
          confirmButtonText: "OK",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await updateDeliveryBoyResponse(doc.id);
          }
        });
      });
    });

    return () => {
      unsubscribe();
    };
  };

  const updateDeliveryBoyResponse = async (orderId) => {
    const orderRef = doc(collection(db, "Order"), orderId);
    const updatedData = {
      deliveryBoyResponse: "none",
      deliveryBoy: "",
      orderStatus: "placed",
    };

    try {
      await updateDoc(orderRef, updatedData);
      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

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
