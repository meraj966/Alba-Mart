import React from "react";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../appStore";
import "./Dashboard.css"
import { Grid } from "@mui/material";
import DashboardCard from "../components/DashboardCard";
import Box from '@mui/material/Box';
import DashboardCardStock from "../components/DashboardCardStock";
import ButtonBase from '@mui/material/ButtonBase';
import Link from '@mui/material/Link';

export default function Dashboard(){
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
            </Box>
          </Box>
        </div>
      </>
    );
}
