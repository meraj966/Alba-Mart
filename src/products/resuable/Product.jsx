import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";
import PreviewIcon from '@mui/icons-material/Preview';
import Swal from "sweetalert2";
import {
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "../../firebase-config";
import { Box, Modal } from "@mui/material";
import ProductPopup from "./ProductPopup";
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
  stockValue,
  showProduct,
}) {
  let salePrice = price;
  let discount = 0;
  const [open, setOpen] = useState(false);
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
  const afterSalePrice =
    saleType == "RS"
      ? String(price - saleValue)
      : String(price - saleValue / 100);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "20px",
  };
  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <ProductPopup
            id={id}
            name={name}
            date={date}
            url={url}
            onSale={onSale}
            price={price}
            saleType={saleType}
            saleValue={saleValue}
            description={description}
            category={category}
            subCategory={subCategory}
            quantity={quantity}
            measureUnit={measureUnit}
            deleteProd={deleteProd}
            handleEditOpen={handleEditOpen}
            setFormid={setFormid}
            data={data}
          />
        </Box>
      </Modal>
      <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
      >
        <TableCell align="left">{name}</TableCell>
        <TableCell align="left">{price}</TableCell>
        <TableCell align="left">{afterSalePrice}</TableCell>
        <TableCell align="left">{stockValue}</TableCell>
        <TableCell align="left">{quantity}</TableCell>
        <TableCell align="left">{showProduct ? "Yes" : "No"}</TableCell>
        <TableCell align="left">
          <Stack spacing={2} direction="row">
            <PreviewIcon
              style={{
                fontSize: "20px",
                cursor: "pointer",
                color: open ? "black" : "gray",
              }}
              onClick={() => setOpen(true)}
            />
            <EditIcon
              style={{
                fontSize: "20px",
                color: "#1976d2",
                cursor: "pointer",
              }}
              className="cursor-pointer"
              onClick={() => {
                editData(id, name, price, subCategory, category);
              }}
            />
            <DeleteIcon
              style={{
                fontSize: "20px",
                color: "darkred",
                cursor: "pointer",
              }}
              onClick={() => {
                deleteProduct();
              }}
            />
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
}

export default Product;
