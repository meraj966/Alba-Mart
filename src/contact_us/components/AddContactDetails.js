import React, { useState } from "react";
import { collection, setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import {
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  Grid,
  Box,
  CardHeader,
  CardContent,
} from "@mui/material";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Import the styles for the PhoneInput component
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles for the ReactQuill component

function AddContactDetails({ data, isEditMode, refreshContactDetails, handleClose }) {
  const [userOrDeliveryBoy, setUserOrDeliveryBoy] = useState(isEditMode ? data.for : "");
  const [phoneNumber, setPhoneNumber] = useState(isEditMode ? data.phoneNumber : ""); // State for the phone number
  const [contactDetails, setContactDetails] = useState(isEditMode ? data.contactDetails : ""); // State for contact details

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isEditMode) {
      await updateDoc(doc(db, "ContactUs", data.id), {
        for: userOrDeliveryBoy,
        phoneNumber, // Store the phone number
        contactDetails, // Store the contact details
      }).then(() => {
        Swal.fire("Successful!", "Contact Details Added", "success");
      });
    } else {
      await setDoc(doc(collection(db, "ContactUs"), userOrDeliveryBoy), {
        for: userOrDeliveryBoy,
        phoneNumber, // Store the phone number
        contactDetails, // Store the contact details
      }).then(() => {
        Swal.fire("Successful!", "Contact Details Added", "success");
      });
    }
    refreshContactDetails();
    handleClose();
  };

  const handleUserOrDeliveryBoyChange = (event) => {
    setUserOrDeliveryBoy(event.target.value);
  };

  const handleContactDetailsChange = (value) => {
    setContactDetails(value);
  };

  return (
    <Card sx={{ marginTop: "25px", border: "1px solid" }}>
      <CardHeader title="Add Contact Details" />
      <CardContent sx={{ overflowY: "scroll", maxHeight: "400px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl sx={{ minWidth: 190 }}>
              <InputLabel id="userOrDeliveryBoy-label">User Or Delivery Boy</InputLabel>
              <Select
                labelId="userOrDeliveryBoy-label"
                id="userOrDeliveryBoy"
                value={userOrDeliveryBoy}
                onChange={handleUserOrDeliveryBoyChange}
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Delivery Boy">Delivery Boy</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8}>
            <PhoneInput
              placeholder="Primary Phone number"
              country="IN"
              value={phoneNumber}
              onChange={setPhoneNumber}
              defaultCountry="IN"
            />
          </Grid>
          <Grid item xs={12}>
            <ReactQuill
              value={contactDetails}
              onChange={handleContactDetailsChange}
              placeholder="Enter contact details"
            />
          </Grid>
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

export default AddContactDetails;
