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
import { collection, addDoc, setDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase-config";
import Swal from "sweetalert2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function AddNewDeliverySlot({ data, isEditMode, refreshDeliverySlot, handleClose }) {
  console.log("data", data);

  const extractTimeFromSlot1 = (slot1Time) => {
    const parts = slot1Time.split(" ");
    return parts[0];
  };

  const extractTimeToSlot1 = (slot1Time) => {
    const parts = slot1Time.split(" ");
    return parts[3];
  };

  const extractAmPmFromSlot1 = (slot1Time) => {
    const parts = slot1Time.split(" ");
    return parts[1];
  };

  const extractAmPmToSlot1 = (slot1Time) => {
    const parts = slot1Time.split(" ");
    return parts[4];
  };

  const [day, setDay] = useState(isEditMode ? data.day : "");
  const [timeFromSlot1, setTimeFromSlot1] = useState(isEditMode ? extractTimeFromSlot1(data.slot1Time) : "");
  const [timeToSlot1, setTimeToSlot1] = useState(isEditMode ? extractTimeToSlot1(data.slot1Time) : "");
  const [numDeliveriesSlot1, setNumDeliveriesSlot1] = useState(isEditMode ? data.slot1 : "");
  const [amPmFromSlot1, setAmPmFromSlot1] = useState(isEditMode ? extractAmPmFromSlot1(data.slot1Time) : "am");
  const [amPmToSlot1, setAmPmToSlot1] = useState(isEditMode ? extractAmPmToSlot1(data.slot1Time) : "am");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isEditMode) {
      await updateDoc(doc(db, "DeliverySlot", data.id), {
        day,
        slot1: numDeliveriesSlot1,
        slot1Time: timeFromSlot1 + " " + amPmFromSlot1 + " " + "to" + " " + timeToSlot1 + " " + amPmToSlot1,
      }).then(() => {
        Swal.fire("Succesfull!", "Delivery Slot added", "success");
      });
    } else {
      await setDoc(doc(collection(db, "DeliverySlot"), day), {
        day,
        slot1: numDeliveriesSlot1,
        slot1Time: timeFromSlot1 + " " + amPmFromSlot1 + " " + "to" + " " + timeToSlot1 + " " + amPmToSlot1,
      }).then(() => {
        Swal.fire("Succesfull!", "Delivery Slot added", "success");
      });
    }
    refreshDeliverySlot();
    handleClose();
  };

  return (
    <Card sx={{ marginTop: "25px", border: "1px solid", maxHeight: "80vh", overflow: "auto" }}>
      <CardHeader title="Add Delivery Slot" />
      <CardContent>
        <form onSubmit={handleSubmit}>
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
          <h3>Slot 1</h3>
          <TextField
            id="timeFromSlot1"
            label="Time From"
            type="time"
            value={timeFromSlot1}
            onChange={(event) => setTimeFromSlot1(event.target.value)}
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
            value={amPmFromSlot1}
            label="AM/PM"
            sx={{ mb: 2 }}
            onChange={(event) => setAmPmFromSlot1(event.target.value)}
          >
            <MenuItem value="am">AM</MenuItem>
            <MenuItem value="pm">PM</MenuItem>
          </Select>
          <br />
          <br />
          <TextField
            id="timeToSlot1"
            label="Time To"
            type="time"
            value={timeToSlot1}
            onChange={(event) => setTimeToSlot1(event.target.value)}
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
            value={amPmToSlot1}
            label="AM/PM"
            sx={{ mb: 2 }}
            onChange={(event) => setAmPmToSlot1(event.target.value)}
          >
            <MenuItem value="am">AM</MenuItem>
            <MenuItem value="pm">PM</MenuItem>
          </Select>
          <br />
          <br />
          <TextField
            id="numDeliveriesSlot1"
            label="Number of Deliveries"
            type="number"
            value={numDeliveriesSlot1}
            onChange={(event) => setNumDeliveriesSlot1(event.target.value)}
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
