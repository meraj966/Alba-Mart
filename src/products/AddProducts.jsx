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
    console.log(saveDone, products);
    if (
      Object.keys(products).length > 0 &&
      saveDone.filter((i) => i === "SAVED").length ===
        Object.keys(products).length
    ) {
      getUsers();
      Swal.fire("Submitted!", "Your data has been updated.", "success");
      closeEvent();
    }
  }, [saveDone]);

  useEffect(() => {
    const files = map(products, "file");
    console.log(Object.keys(payload), payload, files[0]);
  }, [payload]);

  const getUsers = async () => {
    const data = await getDocs(dataRef);
    setData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleUpload = () => {
    const files = Object.values(products).map((i) => i.files);
    console.log(products, files, "productssssssssss");
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
          >
            Submit
          </Button>
        </Typography>
      </Box>
    </>
  );
}

export default AddProducts;
