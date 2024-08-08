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
function ProductPopup({
  id,
  name,
  date,
  url,
  onSale,
  price,
  saleType,
  saleValue,
  description,
  brandName,
  category,
  subCategory,
  quantity,
  measureUnit,
  deleteProd,
  handleEditOpen,
  setFormid,
  clearRow,
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
    clearRow()
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
    setFormid(newData);
    handleEditOpen();
  };

  return (
    <Card style={(onSale && { border: "2px solid red" }) || null}>
      <CardHeader
        title={name}
        subheader={new Date(date).toLocaleString()}
        action={
          <>
            <IconButton aria-label="edit" onClick={editData}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={deleteProduct}>
              <DeleteIcon />
            </IconButton>
          </>
        }
      />
      {/* <CardMedia component="img" height={"194"} image={url[0]} alt={name} /> */}
      <CardMedia className="cardMedia" height={"194"} ><Carousel images={url} /> </CardMedia>

      <CardContent>
        <Typography dangerouslySetInnerHTML={{ __html: description }}></Typography>
        <div style={{ display: "flex" }}>
          <Typography style={{ width: "70%" }}>
            {brandName} | {category} | {subCategory} | {quantity} {measureUnit}
          </Typography>
          <Tooltip
            title={onSale && `Actual Price: ${price} | Discount: ${discount}`}
          >
            <Typography style={{ textAlignLast: "right", width: "30%" }}>
              <>
                Price: <b>&#8377;{salePrice}</b>
              </>
            </Typography>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductPopup;
