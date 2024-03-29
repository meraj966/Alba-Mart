import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";
import PreviewIcon from "@mui/icons-material/Preview";
import Swal from "sweetalert2";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import Checkbox from "@mui/material/Checkbox";
import { Box, Modal } from "@mui/material";
import ProductPopup from "./ProductPopup";
import { getDiscountedPrice } from "../../utils";
function Product({
  id,
  name,
  date,
  url,
  onSale,
  brandName,
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
  isDetailView,
  isSelected,
  productSelected,
  isEditOffer,
  isOrderDetailView,
  amount,
  rate,
}) {
  console.log("measureUnit", measureUnit, data)
  const [selected, setSelected] = useState(isSelected);
  const [open, setOpen] = useState(false);
  let salePrice = onSale ? getDiscountedPrice(saleType, price, saleValue) : "-";
  useEffect(() => {
    setSelected(isSelected);
  }, [isSelected]);
  const deleteApi = async (id) => {
    const userDoc = doc(db, "Menu", id);
    let productData = (await getDoc(userDoc)).data();
    if (productData.saleTag) {
      const offerDocRef = doc(db, "Offers", productData.saleTag);
      let offerData = (await getDoc(offerDocRef)).data();
      let newProducts = [...offerData.products];
      newProducts = newProducts.filter((i) => i != productData.saleTag);
      await updateDoc(offerDocRef, { products: newProducts });
    }
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
    setFormid(newData);
    handleEditOpen();
  };

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
            brandName={brandName}
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
        style={{ border: "1px solid red !important" }}
      >
        {isEditOffer && (
          <TableCell align="left" width={"5%"}>
            <Checkbox
              checked={selected}
              onChange={(e) => {
                setSelected(e.target.checked);
                productSelected(e.target.checked);
              }}
            />
          </TableCell>
        )}

        <TableCell align="left">{name}</TableCell>
        {!isOrderDetailView &&
        <TableCell align="left">
          {url && url.length > 0 && (
            <img
              src={url}
              height="70px"
              width="70px"
              style={{ borderRadius: "15px" }}
              loading="lazy"
              className={isOrderDetailView ? "hide-on-print" : ""}
            />
          )}
        </TableCell>}
        <TableCell align="left">{price}</TableCell>
        <TableCell align="left">
          {isOrderDetailView ? amount : salePrice}
        </TableCell>
        <TableCell align="left">
          {isOrderDetailView ? rate : onSale ? `${saleValue} ${saleType}` : "-"}
        </TableCell>
        {!isOrderDetailView && <TableCell align="left">{stockValue}</TableCell>}
        <TableCell align="left">{measureUnit ? `${quantity} ${measureUnit}`:`${quantity}` }</TableCell>
        {!isOrderDetailView && <TableCell align="left">{showProduct ? "Yes" : "No"}</TableCell>}
        {isDetailView || isEditOffer ? null : (
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
        )}
      </TableRow>
    </>
  );
}

export default Product;
