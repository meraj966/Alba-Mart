import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";
import OrdersList from "../orders/OrdersList";
import "../Dash.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../appStore";
import PageTemplate from "./reusable/PageTemplate";

export default function Orders() {

  return (
    <>
      <PageTemplate 
        title="Orders"
      >
        Orders Page Content
      </PageTemplate>
    </>
  );
}
