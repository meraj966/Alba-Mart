import React from "react";
import { useEffect } from "react";
import { Grid } from "@mui/material";
import DashboardCard from "./reusable/DashboardCard";
import DashboardCardStock from "./reusable/DashboardCardStock";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import ProductsAvailability from "./reusable/ProductsAvailability";
import { useState } from "react";
import { PRODUCTS_UNAVAILABLE, PRODUCTS_LOW_STOCK } from "../Constants";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import PageTemplate from "../pages/reusable/PageTemplate";

export default function Dashboard() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [unavailableProd, setUnavailableProd] = useState("");
  const [lowStockProd, setLowStockProd] = useState("");
  const [open, setOpen] = React.useState(false);
  const [modalType, setModalType] = useState("");
  const handleClose = () => setOpen(false);
  const handleProductUnavailable = () => {
    setModalType(PRODUCTS_UNAVAILABLE);
    setOpen(true);
  };
  const handleProductLowStock = () => {
    setModalType(PRODUCTS_LOW_STOCK);
    setOpen(true);
  };

  const getCustomers = async () => {
    const data = await getDocs(collection(db, "Address"));
    setCustomers(data.docs.length);
  };

  const getProducts = async () => {
    const data = await getDocs(collection(db, "Menu"));
    const res = data.docs.map((doc) => ({
      ...doc.data(),
      stockValue: Number(doc.data().stockValue),
    }));
    setProducts(res);
    setUnavailableProd(res.filter((i) => i.stockValue === 0));
    setLowStockProd(res.filter((i) => i.stockValue < 4));
  };

  const getOrders = async () => {
    const data = await getDocs(collection(db, "Orders"));
    setOrders(data.docs.map((doc) => ({ ...doc.data() })));
  };

  const refreshPage = () => {
    getCustomers();
    getProducts();
    getOrders();
  };

  useEffect(() => {
    refreshPage();
    const interval = setInterval(() => {
      refreshPage();
    }, 60 * 3 * 1000);
    return () => clearInterval(interval);
  }, []);

  console.log(customers, orders, products);
  const modal = () => (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <>
        {modalType === PRODUCTS_UNAVAILABLE && (
          <ProductsAvailability
            title="Products Out of Stock"
            data={unavailableProd}
          />
        )}

        {modalType === PRODUCTS_LOW_STOCK && (
          <ProductsAvailability
            title="Products in low stock"
            data={lowStockProd}
          />
        )}
      </>
    </Modal>
  );
  if (!window.sessionStorage.getItem("token")) 
      navigate("/")
  return (
    <>
      <PageTemplate modal={modal()} title="Dashboard">
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Link underline="none">
              <RouterLink to={"/Users"} style={{ textDecoration: "none" }}>
                <DashboardCard header="Customers" value={customers} />
              </RouterLink>
            </Link>
          </Grid>
          <Grid item xs={3}>
            <Link underline="none">
              <RouterLink to={"/products"} style={{ textDecoration: "none" }}>
                <DashboardCard header="Product" value={products.length} />
              </RouterLink>
            </Link>
          </Grid>
          <Grid item xs={3}>
            <Link underline="none">
              <RouterLink to={"/orders"} style={{ textDecoration: "none" }}>
                <DashboardCard header="Orders" value={orders.length} />
              </RouterLink>
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
            <Link underline="none" onClick={handleProductUnavailable}>
              <DashboardCardStock
                value={unavailableProd.length}
                header="Products sold out"
              />
            </Link>
          </Grid>
          <Grid item xs={6}>
            <Link underline="none" onClick={handleProductLowStock}>
              <DashboardCardStock
                value={lowStockProd.length}
                header="Products in low stock"
              />
            </Link>
          </Grid>
        </Grid>
      </PageTemplate>
    </>
  );
}
