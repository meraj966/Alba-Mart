import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";

import Swal from "sweetalert2";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import Carousel from "./Carousel";
function Product({
  id,
  name,
  date,
  url,
  onSale,
  price,
  saleType,
  saleValue,
  description,
  category,
  subCategory,
  quantity,
  measureUnit,
  deleteProd,
  handleEditOpen,
  setFormid,
  data,
}) {
  let salePrice = price;
  let discount = 0;
  if (onSale) {
    if (saleType === "%") {
      let percent = (saleValue / 100).toFixed(2);
      discount = (price * percent).toFixed(2);
      salePrice = price - discount;
    } else {
      discount = saleValue;
      salePrice = price - saleValue;
    }
  }

  const deleteApi = async (id) => {
    const userDoc = doc(db, "Menu", id);
    await deleteDoc(userDoc);
    Swal.fire("Deleted!", "Your file has been deleted.", "success");
    deleteProd();
  };

  const deleteProduct = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        deleteApi(id);
      }
    });
  };

  const editData = () => {
    const newData = {
      ...data,
      date: new Date(),
    };
    console.log("EDIT DATA", data);
    setFormid(newData);
    handleEditOpen();
  };
  const afterSalePrice = saleType == "RS" ? String(price - saleValue) : String(price - (saleValue/100))

  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      <TableCell align="left" >{name}</TableCell>
      <TableCell align="left" >{afterSalePrice}</TableCell>
      <TableCell align="left">{String(category)}</TableCell>
      <TableCell align="left">{String(subCategory)}</TableCell>
      <TableCell align="left">{String(date)}</TableCell>
      <TableCell align="left">
        <Stack spacing={2} direction="row">
          <EditIcon
            style={{
              fontSize: "20px",
              color: "blue",
              cursor: "pointer",
            }}
            className="cursor-pointer"
            onClick={() => {
              editData(
                id,
                name,
                price,
                subCategory,
                category
              );
            }}
          />
          <DeleteIcon
            style={{
              fontSize: "20px",
              color: "darkred",
              cursor: "pointer",
            }}
            onClick={() => {
            //   deleteUser(id);
            }}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );
}

export default Product;
