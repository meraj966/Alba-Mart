import React, { useState } from "react";
import {
  Card,
  Grid,
  Box,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase-config";
import Swal from "sweetalert2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function AddNewDeliverySlot({ data, isEditMode, refreshDeliverySlot, handleClose }) {
  console.log("data", data)
  const [day, setDay] = useState(isEditMode ? data.day : "");
  const [timeFrom, setTimeFrom] = useState(isEditMode ? data.timeFrom : "");
  const [timeTo, setTimeTo] = useState(isEditMode ? data.timeTo : "");
  const [numDeliveries, setNumDeliveries] = useState(isEditMode ? data.numDeliveries : "");
  const [deliveryDate, setDeliveryDate] = useState(isEditMode ? data.deliveryDate : "");
  const [amPmFrom, setAmPmFrom] = useState(isEditMode ? data.amPmFrom : "am");
  const [amPmTo, setAmPmTo] = useState(isEditMode ? data.amPmTo : "am");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isEditMode) {
      await updateDoc(doc(db, 'DeliverySlot', data.id), {
        day,
        timeFrom: timeFrom + " " + amPmFrom,
        timeTo: timeTo + " " + amPmTo,
        numDeliveries,
        deliveryDate,
      }).then(() => {
        Swal.fire('Succesfull!', 'Delivery Slot added', 'success')
      })
    } else {
      await addDoc(collection(db, "DeliverySlot"), {
        day,
        timeFrom: timeFrom + " " + amPmFrom,
        timeTo: timeTo + " " + amPmTo,
        numDeliveries,
        deliveryDate,
      }).then(() => {
        Swal.fire('Succesfull!', 'Delivery Slot added', 'success')
      });
    }
    refreshDeliverySlot()
    handleClose()
  }

  return (
    <Card sx={{ marginTop: "25px", border: "1px solid" }}>
      <CardHeader title="Add Delivery Slot" />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date Of Delivery"
                value={deliveryDate}
                onChange={(value) => setDeliveryDate(value)}
              />
            </LocalizationProvider>
          </Grid>
          <br>
          </br>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="day-label">Day</InputLabel>
            <Select
              labelId="day-label"
              id="day"
              value={day}
              label="Day"
              sx={{ mb: 2 }}
              onChange={(event) => setDay(event.target.value)}
            >
              <MenuItem value="Monday">Monday</MenuItem>
              <MenuItem value="Tuesday">Tuesday</MenuItem>
              <MenuItem value="Wednesday">Wednesday</MenuItem>
              <MenuItem value="Thursday">Thursday</MenuItem>
              <MenuItem value="Friday">Friday</MenuItem>
              <MenuItem value="Saturday">Saturday</MenuItem>
              <MenuItem value="Sunday">Sunday</MenuItem>
            </Select>
          </FormControl>
          <br />
          <br />
          <TextField
            id="timeFrom"
            label="Time From"
            type="time"
            value={timeFrom}
            onChange={(event) => setTimeFrom(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
          <Select
            labelId="am-pm-from-label"
            id="am-pm-from"
            value={amPmFrom}
            label="AM/PM"
            sx={{ mb: 2 }}
            onChange={(event) => setAmPmFrom(event.target.value)}
          >
            <MenuItem value="am">AM</MenuItem>
            <MenuItem value="pm">PM</MenuItem>
          </Select>
          <br />
          <br />
          <TextField
            id="timeTo"
            label="Time To"
            type="time"
            value={timeTo}
            onChange={(event) => setTimeTo(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
          <Select
            labelId="am-pm-from-label"
            id="am-pm-from"
            value={amPmTo}
            label="AM/PM"
            sx={{ mb: 2 }}
            onChange={(event) => setAmPmTo(event.target.value)}
          >
            <MenuItem value="am">AM</MenuItem>
            <MenuItem value="pm">PM</MenuItem>
          </Select>
          <br />
          <br />
          <TextField
            id="numDeliveries"
            label="Number of Deliveries"
            type="number"
            value={numDeliveries}
            onChange={(event) => setNumDeliveries(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br />
          <br />
          <Button type="submit" variant="contained">
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default AddNewDeliverySlot;
