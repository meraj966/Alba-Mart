import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase-config";

function AddNewDeliverySlot() {
  const [day, setDay] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [numDeliveries, setNumDeliveries] = useState("");
  const [amPmFrom, setAmPmFrom] = useState("am");
  const [amPmTo, setAmPmTo] = useState("am");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const deliverySlot = {
      day,
      timeFrom: timeFrom + " " + amPmFrom,
      timeTo: timeTo + " " + amPmTo,
      numDeliveries,
    };

    try {
      const docRef = await addDoc(collection(db, "DeliverySlot"), deliverySlot);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    setDay("");
    setTimeFrom("");
    setTimeTo("");
    setNumDeliveries("");
    setAmPmFrom("am");
    setAmPmTo("am");
  };

  return (
    <div>
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
    </div>
  );
}

export default AddNewDeliverySlot;
