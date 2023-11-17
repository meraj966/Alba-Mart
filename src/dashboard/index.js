import React, { useEffect, useState } from "react";
import { Grid, Link, Modal } from "@mui/material";
import DashboardCard from "./reusable/DashboardCard";
import DashboardCardStock from "./reusable/DashboardCardStock";
import RevenueChart from "./reusable/RevenueChart";
import { PRODUCTS_UNAVAILABLE, PRODUCTS_LOW_STOCK } from "../Constants";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import PageTemplate from "../pages/reusable/PageTemplate";
import { sum } from "lodash";
import MuiAlert from "@mui/material/Alert";
import ProductsAvailability from "./reusable/ProductsAvailability";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import { writeFile } from "exceljs";
import ExcelJS from "exceljs";

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
  const [todayEarn, setTodayEarn] = useState(0);
  const [todayOrderCount, setTodayOrderCount] = useState(0);

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
    const data = await getDocs(collection(db, "UserProfile"));
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
    setLowStockProd(res.filter((i) => i.stockValue < 4 && i.stockValue !== 0));
  };

  const getOrders = async () => {
    const data = await getDocs(collection(db, "Order"));
    const orderData = data.docs.map((doc) => ({ ...doc.data() }));

    const todayDeliveredOrders = orderData.filter(
      (i) =>
        new Date(i.deliveryDate).toDateString() ===
        new Date().toDateString() &&
        i.orderStatus === "delivered"
    );

    // Calculate the sum of totalRate for today's delivered orders
    const todayEarnValue = sum(todayDeliveredOrders.map((i) => i.totalRate));

    setTodayEarn(todayEarnValue);

    const todayOrders = orderData.filter(
      (i) => new Date(i.orderDate).toDateString() === new Date().toDateString()
    );

    setTodayOrder(todayOrders);
    setTodayOrderCount(todayOrders.length);

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
    refreshPage();
    const interval = setInterval(() => {
      refreshPage();
      if (orders.length !== orderLength) {
        setTimeout(() => setInfo("Update in Orders"), 3000);
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [orders.length]);

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

  const exportToExcel = (data, fileName) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    // Define columns
    worksheet.columns = [
      { header: "Product Name", key: "name" },
      { header: "Category", key: "category" },
      { header: "Subcategory", key: "subCategory" },
      { header: "Unit", key: "unit" },
      { header: "Stock Value", key: "stockValue" },
    ];

    // Add data rows
    data.forEach((product) => {
      worksheet.addRow({
        name: product.name,
        category: product.category,
        subCategory: product.subCategory,
        unit: `${product.quantity} ${product.measureUnit}`,
        stockValue: product.stockValue,
      });
    });

    // Generate Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const handleExportUnavailable = () => {
    exportToExcel(unavailableProd, "ProductsOutOfStock.xlsx");
  };

  const handleExportLowStock = () => {
    exportToExcel(lowStockProd, "ProductsInLowStock.xlsx");
  };

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
                <DashboardCard header="Today earn" value={`Rs. ${todayEarn}`} />
              </RouterLink>
            </Link>
          </Grid>
          <Grid item xs={3}>
            <Link underline="none">
              <RouterLink to={"/orders"} style={{ textDecoration: "none" }}>
                <DashboardCard header="Today order" value={todayOrderCount} />
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
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleExportUnavailable}
              style={{ marginRight: "350px" }}
            >
              Export Products Out of Stock
            </Button>
            <Button
              variant="contained"
              onClick={handleExportLowStock}
            >
              Export Products in Low Stock
            </Button>
          </Grid>
          <Grid item xs={12}>
            {/* Add the RevenueChart component here */}
            <RevenueChart />
          </Grid>
        </Grid>
      </PageTemplate>
    </>
  );
}
