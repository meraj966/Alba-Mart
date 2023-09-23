import React, { useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import {
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Card,
  Grid,
  CardHeader,
  CardContent,
} from "@mui/material";
import dayjs from "dayjs";
import Swal from "sweetalert2";

function AddNewPromoCode({
  data,
  isEditMode,
  refreshPromoCodes,
  handleClose,
}) {
  const [promoCode, setPromoCode] = useState(isEditMode ? data.code : "");
  const [message, setMessage] = useState(isEditMode ? data.message : "");
  const [numUsers, setNumUsers] = useState(isEditMode ? data.numUsers : 0);
  const [startDate, setStartDate] = useState(
    isEditMode ? data.startDate : "dd-mm-yyyy"
  );
  const [endDate, setEndDate] = useState(isEditMode ? data.endDate : "dd-mm-yyyy");
  const [minOrderAmount, setMinOrderAmount] = useState(
    isEditMode ? data.minOrderAmount : 0
  );
  const [discountType, setDiscountType] = useState(
    isEditMode ? data.discountType : "%"
  );
  const [discount, setDiscount] = useState(isEditMode ? data.discount : 0);
  const [maxDiscount, setMaxDiscount] = useState(
    isEditMode ? data.maxDiscount : 0
  );
  const [discountStatus, setDiscountStatus] = useState(
    isEditMode ? data.discountStatus : true
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEditMode) {
      // Check if promo code already exists in the database
      const promoCodeRef = doc(db, 'PromoCode', promoCode);
      const promoCodeSnapshot = await getDoc(promoCodeRef);

      if (promoCodeSnapshot.exists()) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Promo Code - '${promoCode}' is an existing promo code. Please add another.`,
        });
        return;
      }
    }

    if (isEditMode) {
      // Update promo code
      await updateDoc(doc(db, 'PromoCode', promoCode), {
        code: promoCode,
        message,
        numUsers,
        minOrderAmount,
        discountType,
        discount,
        maxDiscount,
        discountStatus,
        startDate,
        endDate,
      });
      Swal.fire('Successful!', 'Promo code updated', 'success');
    } else {
      // Add new promo code
      await setDoc(doc(collection(db, 'PromoCode'), promoCode), {
        code: promoCode,
        message,
        numUsers,
        minOrderAmount,
        discountType,
        discount,
        maxDiscount,
        discountStatus,
        startDate,
        endDate,
      });
      Swal.fire('Successful!', 'Promo code added', 'success');
    }
    refreshPromoCodes();
    handleClose();
  };

  const handlePromoCodeChange = (event) => {
    setPromoCode(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleNumUsersChange = (event) => {
    setNumUsers(parseInt(event.target.value));
  };

  const handleDiscountChange = (event) => {
    setDiscount(parseInt(event.target.value));
  };

  const handleDiscountTypeChange = (event) => {
    setDiscountType(event.target.value);
  };

  const handleMaxDiscountChange = (event) => {
    setMaxDiscount(parseInt(event.target.value));
  };

  const handleMinOrderAmountChange = (event) => {
    setMinOrderAmount(parseInt(event.target.value));
  };

  const handleDiscountStatusChange = (event) => {
    setDiscountStatus(event.target.checked);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  return (
    <Card sx={{ marginTop: "25px", border: "1px solid", maxHeight: "90vh", overflow: "auto" }}>
      <CardHeader title="Add Promo Code" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              label="Promo Code"
              type="text"
              value={promoCode}
              onChange={handlePromoCodeChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Message"
              type="text"
              value={message}
              onChange={handleMessageChange}
              multiline
              rows={4}
              sx={{ mb: 2, display: "block" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="No. of User"
              type="number"
              value={numUsers}
              onChange={handleNumUsersChange}
              sx={{ mb: 2, display: "block" }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Min Order amount"
              type="number"
              value={minOrderAmount}
              onChange={handleMinOrderAmountChange}
              sx={{ mb: 2, display: "block" }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              sx={{ mb: 2, display: "block" }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl sx={{ mb: 2, minWidth: "80%" }}>
              <InputLabel>Discount Type</InputLabel>
              <Select value={discountType} onChange={handleDiscountTypeChange}>
                <MenuItem value="%">%</MenuItem>
                <MenuItem value="RS">RS</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Discount"
              type="number"
              value={discount}
              onChange={handleDiscountChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Max Discount"
              type="number"
              value={maxDiscount}
              onChange={handleMaxDiscountChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <div>
            <Typography variant="h6">Discount Status</Typography>
            <Switch
              checked={discountStatus}
              onChange={handleDiscountStatusChange}
              color="primary"
              name="discountStatus"
              inputProps={{ "aria-label": "Discount Status" }}
            />
          </div>
          <Grid item xs={12}>
            <Typography variant="h5" align="right">
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default AddNewPromoCode;
