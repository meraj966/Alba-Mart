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
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import PageTemplate from "../pages/reusable/PageTemplate";
import { sum } from "lodash";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Dashboard() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderLength, setOrderLength] = useState(0);
  const [info, setInfo] = useState("");
  const [todayOrder, setTodayOrder] = useState([]);
  const [pendingOrder, setPendingOrder] = useState([]);
  const [unavailableProd, setUnavailableProd] = useState("");
  const [lowStockProd, setLowStockProd] = useState("");
  const [open, setOpen] = React.useState(false);
  const [modalType, setModalType] = useState("");

  const offersPastDue = (offers) =>
    offers.filter(
      (i) =>
        !(
          new Date().getMonth() + 1 <= new Date(i.endDate).getMonth() + 1 &&
          new Date().getDate() <= new Date(i.endDate).getDate() &&
          new Date().getFullYear() <= new Date(i.endDate).getFullYear()
        )
    );

  const removePastDueSaleData = async () => {
    let isUpdated = 0;
    const offersRef = collection(db, "Offers");
    let data = await getDocs(offersRef);
    const offerData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const offersPastDueDate = offersPastDue(offerData);
    if (offersPastDueDate?.length) {
      offersPastDueDate.forEach(async (i) => {
        const id = i.id; // sale tags that are past due
        products.forEach(async (data) => {
          if (data.saleTag === id) {
            await updateDoc(doc(db, "Menu", data.id), { saleTag: "" });
            isUpdated++;
          }
        });
        // Uncomment below line if you also want to flush the products added in offer once due date is passed
        // await updateDoc(doc(db, "Offers", id), { products: [] })
      });
    }
    if (isUpdated) refreshPage();
  };

  useEffect(() => {
    // Remove all products sale values where sale date is past due
    removePastDueSaleData();
  }, [products]);

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
    const data = await getDocs(collection(db, "Order"));
    const orderData = data.docs.map((doc) => ({ ...doc.data() }));
    setTodayOrder(
      orderData?.filter(
        (i) => new Date(i.date).toDateString() === new Date().toDateString()
      )
    );
    setPendingOrder(
      orderData.filter((i) => ["placed"].includes(i.orderStatus))
    );
    setOrders(orderData);
  };

  const refreshPage = () => {
    getCustomers();
    getProducts();
    getOrders();
  };

  useEffect(() => {
    refreshPage()
    const interval = setInterval(() => {
      refreshPage();
      if (orders.length != orderLength) {
        setTimeout(() => setInfo("Update in Orders"), 3000);
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
  if (!window.localStorage.getItem("token")) navigate("/");
  return (
    <>
      <PageTemplate modal={modal()} title="Dashboard">
        {info && <Alert severity="info">{info}</Alert>}
        <Grid container spacing={2} style={{ marginTop: "5px" }}>
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
            <Link underline="none">
              <RouterLink to={"/orders"} style={{ textDecoration: "none" }}>
                <DashboardCard header="Today earn" value={`Rs. ${1000}`} />
              </RouterLink>
            </Link>
          </Grid>
          <Grid item xs={3}>
            <Link underline="none">
              <RouterLink to={"/orders"} style={{ textDecoration: "none" }}>
                <DashboardCard header="Today order" value={todayOrder.length} />
              </RouterLink>
            </Link>
          </Grid>
          <Grid item xs={3}>
            <Link underline="none">
              <RouterLink to={"/orders"} style={{ textDecoration: "none" }}>
                <DashboardCard
                  header="Pending order"
                  value={pendingOrder.length}
                />
              </RouterLink>
            </Link>
          </Grid>
          <Grid item xs={3}>
            <Link underline="none">
              <RouterLink to={"/orders"} style={{ textDecoration: "none" }}>
                <DashboardCard
                  header="Today Declined"
                  value={
                    orders.filter((i) => ["Cancelled"].includes(i.orderStatus))
                      .length
                  }
                />
              </RouterLink>
            </Link>
          </Grid>
          <Grid item xs={3}>
            <Link underline="none">
              <DashboardCard
                header="Today Sale"
                value={sum(todayOrder.map((i) => i.totalRate))}
              />
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
