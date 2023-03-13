import React from "react";
import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../appStore";
import "./Dashboard.css"

export default function Dashboard() {
  const username = useAppStore((state) => state.username);
  const password = useAppStore((state) => state.password);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (
  //     username == "animess.food@gmail.com" &&
  //     password == "animess.food@gmail.com"
  //   ) {
  //     console.log("Login Successful!");
  //   } else {
  //     navigate("/");
  //   }
  // }, []);

  return (
    <>
      <div className="bgcolor">
        <Navbar />
        <Box height={70} />
        <Box sx={{ display: "flex" }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <div className="grid-container">
              <div className="card"> Customers </div>
              <div className="card"> Product </div>
              <div className="card"> Orders </div>
              <div className="card"> Today's earnings</div>
              <div className="card"> Today's orders </div>
              <div className="card"> Pending orders</div>
              <div className="card"> Today's declined orders</div>
              <div className="card"> Today's sale</div>
              <div className="card">Products sold out </div>
              <div className="card">Products in low stock</div>
            </div>
            <br />
            <div className="sales-graph">
                I'm sales graph
            </div>
            <br />
            <div className="order-list">
            <p>All order list:-</p>
            <ol>
              <li>Order no. 1 </li>
              <li>Order no. 2 </li>
              <li>Order no. 3</li>
              <li>Order no. 4 </li>
            </ol>
            </div>
          </Box>
        </Box>
      </div>
    </>
  );
}