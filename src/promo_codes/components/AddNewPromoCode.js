import React, { useState } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase-config";
import {
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  Grid,
  Box,
  CardHeader,
  CardContent,
} from "@mui/material";
import dayjs from "dayjs";
import Swal from "sweetalert2";

function AddNewPromoCode({ data, isEditMode, refreshPromoCodes, handleClose }) {
  const [promoCode, setPromoCode] = useState(isEditMode ? data.code : "");
  const [message, setMessage] = useState(isEditMode ? data.message : "");
  const [numUsers, setNumUsers] = useState(isEditMode ? data.numUsers : 0);
  const [startDate, setStartDate] = useState(isEditMode ? data.startDate : "dd-mm-yyyy");
  const [endDate, setEndDate] = useState(isEditMode ? data.endDate: "dd-mm-yyyy");
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
  // const [startDate, setStartDate] = useState("dd-mm-yyyy"); // new state for "Start Date"
  // const [endDate, setEndDate] = useState("dd-mm-yyyy"); // new state for "End Date"

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isEditMode) {
      await updateDoc(doc(db, 'PromoCode', data.id), {
        code: promoCode,
        message,
        numUsers,
        minOrderAmount,
        discountType,
        discount,
        maxDiscount,
        discountStatus,
        startDate, // add "Start Date" to the object being saved to Firestore
        endDate, // add "End Date" to the object being saved to Firestore
      }).then(()=> {
        Swal.fire('Succesfull!', 'Promo code added', 'success')
      })
    } else {
      await addDoc(collection(db, "PromoCode"), {
        code: promoCode,
        message,
        numUsers,
        minOrderAmount,
        discountType,
        discount,
        maxDiscount,
        discountStatus,
        startDate, // add "Start Date" to the object being saved to Firestore
        endDate, // add "End Date" to the object being saved to Firestore
      }).then(()=> {
        Swal.fire('Succesfull!', 'Promo code added', 'success')
      });
    }
    refreshPromoCodes();
    handleClose()
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

  const handleDiscountStatusChange = (event, newValue) => {
    setDiscountStatus(newValue);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  return (
    <Card sx={{ marginTop: "25px", border: "1px solid" }}>
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
          <Grid item xs={4}>
            <TextField
              label="Message"
              type="text"
              value={message}
              onChange={handleMessageChange}
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
            <ToggleButtonGroup
              value={discountStatus}
              exclusive
              onChange={handleDiscountStatusChange}
              sx={{ mb: 2 }}
            >
              <ToggleButton value={true}>Enabled</ToggleButton>
              <ToggleButton value={false}>Dissabled</ToggleButton>
            </ToggleButtonGroup>
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
