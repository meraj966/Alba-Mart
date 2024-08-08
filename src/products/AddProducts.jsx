import React, { useEffect, useState } from "react";
import map from "lodash/map";
import isNull from "lodash/isNull";
import { Box, IconButton, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddProductRow from "./resuable/AddProductRow";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Swal from "sweetalert2";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAppStore } from "../appStore";
import CircularProgress from "@mui/material/CircularProgress";

const { v4: uuidv4 } = require("uuid");

function AddProducts({ closeEvent }) {
  const [products, setProducts] = useState({});
  const [rows, setRows] = useState([1]);
  const [percent, setPercent] = useState(0);
  const [payload, setPayload] = useState([]);
  const dataRef = collection(db, "Menu");
  const [save, setSave] = useState(false);
  const [saveDone, setSaveDone] = useState([]);
  const [error, setError] = useState("");
  const setData = useAppStore((state) => state.setRows);

  useEffect(() => {
    if (Object.keys(products).length === 0 && saveDone.length > 0) {
      getUsers();
      Swal.fire("Submitted!", "Your data has been updated.", "success");
      closeEvent();
    }
    // if (
    //   Object.keys(products).length > 0 &&
    //   saveDone.filter((i) => i === "SAVED").length ===
    //     Object.keys(products).length
    // ) {
    //   getUsers();
    //   Swal.fire("Submitted!", "Your data has been updated.", "success");
    //   closeEvent();
    // }
  }, [saveDone]);

  useEffect(() => {
    const files = map(products, "file");
  }, [payload]);

  const getUsers = async () => {
    const data = await getDocs(dataRef);
    setData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleUpload = () => {
    const files = Object.values(products).map((i) => i.files);

    // Validate Name, Quantity, Price, Purchase Rate, and Stock Value fields for each product
    const invalidProducts = Object.values(products).filter(
      (product) => !product.name || !product.quantity || !product.price || !product.purchaseRate || !product.stockValue || !product.category || !product.subCategory
    );

    if (invalidProducts.length > 0) {
      const missingFields = invalidProducts.map((product) => {
        if (!product.name) return "Name";
        if (!product.quantity) return "Quantity";
        if (!product.price) return "Price";
        if (!product.purchaseRate) return "Purchase Rate";
        if (!product.stockValue) return "Stock Value";
        if (!product.category) return "Category";
        if (!product.subCategory) return "Sub Category";
        return "";
      });

      const uniqueMissingFields = Array.from(new Set(missingFields.filter(Boolean)));

      Swal.fire(
        "Failed!",
        `Please fill the mandatory fields (${uniqueMissingFields.join(", ")}) for all products.`,
        "error"
      );
      return;
    }

    // Validate Sale Value when onSale is true
    const invalidSaleValueOnSale = Object.values(products).filter(
      (product) => product.onSale && (!product.saleValue || parseInt(product.saleValue, 10) <= 0)
    );

    if (invalidSaleValueOnSale.length > 0) {
      Swal.fire(
        "Failed!",
        "Please enter Sale Value for all products on sale.",
        "error"
      );
      return;
    }

    // Check for negative quantity values
    const negativeQuantityProducts = Object.values(products).filter(
      (product) => parseInt(product.quantity, 10) < 0
    );

    if (negativeQuantityProducts.length > 0) {
      Swal.fire(
        "Failed!",
        "Unit quantity cannot be a negative number.",
        "error"
      );
      return;
    }

    // Check for negative Price values
    const negativePriceProducts = Object.values(products).filter(
      (product) => parseInt(product.price, 10) < 0
    );

    if (negativePriceProducts.length > 0) {
      Swal.fire(
        "Failed!",
        "MRP or Price can not be a negative number.",
        "error"
      );
      return;
    }

    // Check for negative Purchase Rate values
    const negativePurchaseProducts = Object.values(products).filter(
      (product) => parseInt(product.purchaseRate, 10) < 0
    );

    if (negativePurchaseProducts.length > 0) {
      Swal.fire(
        "Failed!",
        "Purchase Rate can not be a negative number.",
        "error"
      );
      return;
    }

    // Check for negative stock values
    const negativeStockValueProducts = Object.values(products).filter(
      (product) => parseInt(product.stockValue, 10) < 0
    );

    if (negativeStockValueProducts.length > 0) {
      Swal.fire(
        "Failed!",
        "Product Stock Value can not be a negative number.",
        "error"
      );
      return;
    }

    // Check for negative sale values
    const negativeSaleValueProducts = Object.values(products).filter(
      (product) => parseInt(product.saleValue, 10) < 0
    );

    if (negativeSaleValueProducts.length > 0) {
      Swal.fire(
        "Failed!",
        "Sale Value can not be a negative number.",
        "error"
      );
      return;
    }

    // Check if saleValue is greater than purchaseRate or price
    const invalidSaleValue = Object.values(products).filter(
      (product) => parseInt(product.saleValue, 10) >= parseInt(product.price, 10) ||
        parseInt(product.saleValue, 10) >= parseInt(product.purchaseRate, 10)
    );

    if (invalidSaleValue.length > 0) {
      Swal.fire(
        "Failed!",
        "Sale value cannot be greater than or equal to purchase rate or price for any product.",
        "error"
      );
      return;
    }

    // Continue with the upload if all products have valid data
    if (
      files.includes(false) ||
      files.includes(null) ||
      files.includes(undefined)
    ) {
      Swal.fire("Failed!", "Please upload an image first!", "error");
    } else {
      setSave(true);
    }
  };

  return (
    <>
      <Box sx={{ width: "auto" }}>
        {save && <CircularProgress />}
        <Typography variant="h5" align="center">
          Add Multiple Products
        </Typography>
        <IconButton
          style={{ position: "absolute", top: "0", right: "0" }}
          onClick={closeEvent}
        >
          <CloseIcon />
        </IconButton>
        {percent != 0 && <p>{percent}% completed</p>}
        {rows.map((index) => (
          <Card
            sx={{ marginTop: "25px", border: "1px solid" }}
            key={`ADDPRODUCT-${index}`}
          >
            <CardHeader
              action={
                <IconButton
                  aria-label="close"
                  onClick={() => {
                    const i = rows.indexOf(index);
                    const prods = { ...products };
                    const newRows = [...rows];
                    if (i > -1) {
                      newRows.splice(i, 1);
                      delete prods[`${index}-Row`];
                    }
                    setProducts(prods);
                    setRows(newRows);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              }
            />
            <CardContent>
              <AddProductRow
                key={index * 2}
                index={`${index}-Row`}
                setProducts={setProducts}
                products={products}
                save={save}
                setSave={setSave}
                saveDone={saveDone}
                setSaveDone={setSaveDone}
              />
            </CardContent>
          </Card>
        ))}
        <IconButton
          onClick={() =>
            setRows([...rows, rows.length ? rows[rows.length - 1] + 1 : 1])
          }
          style={{ display: "block", margin: "15px auto 0" }}
        >
          <AddCircleIcon />
        </IconButton>
        <Typography variant="h5" align="right">
          <Button
            variant="contained"
            style={{ width: "200px", marginRight: "25px" }}
            onClick={handleUpload}
            disabled={save}
          >
            Submit
          </Button>
        </Typography>
      </Box>
    </>
  );
}

export default AddProducts;
