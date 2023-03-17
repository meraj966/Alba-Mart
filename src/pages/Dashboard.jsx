import React from "react";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../appStore";
import "./Dashboard.css";
import { Grid } from "@mui/material";
import DashboardCard from "../components/DashboardCard";
import Box from "@mui/material/Box";
import DashboardCardStock from "../components/DashboardCardStock";
import ButtonBase from "@mui/material/ButtonBase";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ProductsAvailability from "../components/popover/ProductsAvailability";
import { useState } from "react";
import ProductsLowStock from "../components/popover/ProductsLowStock";
import { PRODUCTS_AVAILABILITY, PRODUCTS_LOW_STOCK } from "../Constants";

export default function Dashboard() {
  const username = useAppStore((state) => state.username);
  const password = useAppStore((state) => state.password);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [modalType, setModalType] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [value, setValue] = useState("");
  const handleProductAvailable = () => {
    setModalType(PRODUCTS_AVAILABILITY);
    setOpen(true);
  };
  const handleProductLowStock = () => {
    setModalType(PRODUCTS_LOW_STOCK);
    setOpen(true);
  };

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
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <>
                  {modalType === PRODUCTS_AVAILABILITY && (
                    <ProductsAvailability
                      title="Products sold out"
                      value={value}
                    />
                  )}

                  {modalType === PRODUCTS_LOW_STOCK && (
                    <ProductsLowStock
                      title="Products in low stock"
                      value={value}
                    />
                  )}
                </>
              </Modal>
              <Grid item xs={3}>
                <Link
                  underline="none"
                  onClick={() => {
                    console.info("I'm a Customer.");
                  }}
                >
                  <DashboardCard header="Customers" value="102" />
                </Link>
              </Grid>
              <Grid item xs={3}>
                <Link
                  underline="none"
                  onClick={() => {
                    console.info("I'm a Product.");
                  }}
                >
                  <DashboardCard header="Product" value="500" />
                </Link>
              </Grid>
              <Grid item xs={3}>
                <Link
                  underline="none"
                  onClick={() => {
                    console.info("I'm a Order.");
                  }}
                >
                  <DashboardCard header="Orders" value="2000" />
                </Link>
              </Grid>
              <Grid item xs={3}>
                <Link
                  underline="none"
                  onClick={() => {
                    console.info("I'm Today's earnings.");
                  }}
                >
                  <DashboardCard header="Today earn" value={`Rs. ${1000}`} />
                </Link>
              </Grid>
              <Grid item xs={3}>
                <Link
                  underline="none"
                  onClick={() => {
                    console.info("I'm Today's order.");
                  }}
                >
                  <DashboardCard header="Today order" value="0" />
                </Link>
              </Grid>
              <Grid item xs={3}>
                <Link
                  underline="none"
                  onClick={() => {
                    console.info("I'm pending order.");
                  }}
                >
                  <DashboardCard header="Pending order" value="2" />
                </Link>
              </Grid>
              <Grid item xs={3}>
                <Link
                  underline="none"
                  onClick={() => {
                    console.info("I'm today declined.");
                  }}
                >
                  <DashboardCard header="Today Declined" value="4" />
                </Link>
              </Grid>
              <Grid item xs={3}>
                <Link
                  underline="none"
                  onClick={() => {
                    console.info("I'm today's sale.");
                  }}
                >
                  <DashboardCard header="Today Sale" value="35" />
                </Link>
              </Grid>
              <Grid item xs={6}>
                <Link underline="none" onClick={handleProductAvailable}>
                  <DashboardCardStock value="0" header="Products sold out" />
                </Link>
              </Grid>
              <Grid item xs={6}>
                <Link underline="none" onClick={handleProductLowStock}>
                  <DashboardCardStock
                    value="0"
                    header="Products in low stock"
                  />
                </Link>
              </Grid>
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
