import React from "react";
import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../appStore";
import "./Dashboard.css"
import { Grid } from "@mui/material";

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
            <Grid container spacing={2}>
              <Grid item xs={4}>
                Customers
              </Grid>
              <Grid item xs={4}>
                Product
              </Grid>
              <Grid item xs={4}>
                Orders                
              </Grid>
              <Grid item xs={4}>
                Today's Earnings
              </Grid>
              <Grid item xs={4}>
                Today's Orders
              </Grid>
              <Grid item xs={4}>
                Pending Orders                
              </Grid>
              <Grid item xs={4}>
                Today's Declined Orders
              </Grid>
              <Grid item xs={4}>
                Today's Sale
              </Grid>
              <Grid item xs={4}>
                Products sold out          
              </Grid>
              <Grid item xs={4}>
                Products in low stock     
              </Grid>
              <Grid item xs={8}></Grid>
              <Grid item xs={12}>
                Im sales graph
              </Grid>
            </Grid>
          </Box>
        </Box>
      </div>
    </>
  );
}