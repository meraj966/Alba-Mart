import React, { useState } from "react";
import {
  Card,
  Grid,
  Box,
  CardHeader,
  CardContent,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
function AddNewOffer() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState("");
  const [discount, setDiscount] = useState(0)
  return (
    <Card sx={{ marginTop: "25px", border: "1px solid" }}>
      <CardHeader title="Add New Offer" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              error={false}
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Title"
              size="small"
              sx={{ minWidth: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={false}
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              label="Description"
              size="small"
              sx={{ minWidth: "100%" }}
            />
          </Grid>
          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(value) => setStartDate(value)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(value) => setEndDate(value)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4}>
            <TextField
              type="number"
              error={false}
              id="discount"
              name="discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              label="Discount"
              size="small"
              sx={{ minWidth: "100%", height: "100%" }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
    // </Box>
  );
}

export default AddNewOffer;
