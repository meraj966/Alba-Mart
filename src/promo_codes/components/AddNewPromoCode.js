import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from "../../firebase-config";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';

function AddNewPromoCode() {
  const [promoCode, setPromoCode] = useState('');
  const [message, setMessage] = useState('');
  const [numUsers, setNumUsers] = useState(0);
  const [minOrderAmount, setMinOrderAmount] = useState(0);
  const [discountType, setDiscountType] = useState('%');
  const [discount, setDiscount] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState(0);
  const [discountStatus, setDiscountStatus] = useState(true);
  const [startDate, setStartDate] = useState('dd-mm-yyyy'); // new state for "Start Date"
  const [endDate, setEndDate] = useState('dd-mm-yyyy'); // new state for "End Date"

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'PromoCode'), {
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
      });
      console.log('Promo code added with ID:', docRef.id);
    } catch (error) {
      console.error('Error adding promo code:', error);
    }
    setPromoCode('');
    setMessage('');
    setNumUsers(0);
    setMinOrderAmount(0);
    setDiscountType('%');
    setDiscount(0);
    setMaxDiscount(0);
    setDiscountStatus(true);
    setStartDate('dd-mm-yyyy');
    setEndDate('dd-mm-yyyy');
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
    <form onSubmit={handleSubmit}>
      <TextField
        label="Promo Code"
        type="text"
        value={promoCode}
        onChange={handlePromoCodeChange}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Message"
        type="text"
        value={message}
        onChange={handleMessageChange}
        sx={{ mb: 2, display: 'block' }}
      />
      <TextField
        label="No. of User"
        type="number"
        value={numUsers}
        onChange={handleNumUsersChange}
        sx={{ mb: 2, display: 'block' }}
      />
      <TextField
        label="Min Order amount"
        type="number"
        value={minOrderAmount}
        onChange={handleMinOrderAmountChange}
        sx={{ mb: 2, display: 'block' }}
      />
      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        sx={{ mb: 2, display: 'block' }}
      />
      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        sx={{ mb: 2 }}
      />
      <FormControl sx={{ mb: 2, minWidth: "80%" }}>
        <InputLabel>Discount Type</InputLabel>
        <Select
          value={discountType}
          onChange={handleDiscountTypeChange}
        >
          <MenuItem value="%">%</MenuItem>
          <MenuItem value="RS">RS</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Discount"
        type="number"
        value={discount}
        onChange={handleDiscountChange}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Max Discount"
        type="number"
        value={maxDiscount}
        onChange={handleMaxDiscountChange}
        sx={{ mb: 2 }}
      />
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
      <Button type="submit" variant="contained"
      sx={{
        mt: "10px",
        mr: "20px",
        borderRadius: 28,
        color: "#ffffff",
        minWidth: "170px",
        backgroundColor: "#FF9A01",
      }}
      >
        Submit
      </Button>
    </form>
 );
}

export default AddNewPromoCode;
