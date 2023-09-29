import React, { useState } from "react";
import {
  Card,
  Grid,
  Box,
  CardHeader,
  CardContent,
  TextField,
  FormControlLabel,
  Typography,
  Button,
  Switch,
  Divider,
} from "@mui/material";
import Swal from "sweetalert2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase-config";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { uploadImages } from "../../firebase_utils";

function AddNewDeliveryBoy({ closeModal, isEditMode, refreshDeliveryBoys, data }) {
  const [name, setName] = useState(isEditMode ? data.name : "");
  const [phoneNumber, SetPhoneNumber] = useState(isEditMode ? data.phoneNumber : "");
  const [alternateNumber, SetAlternateNumber] = useState(isEditMode ? data.alternateNumber : "");
  const [joinDate, setJoinDate] = useState(dayjs(new Date()));
  const [address, setAddress] = useState(isEditMode ? data.address : "");
  const [dlnumber, setDlNumber] = useState(isEditMode ? data.dlnumber : "");
  const [percent, setPercent] = useState("");
  const [isActive, setIsActive] = useState(isEditMode ? data.isActive : false);
  const [isAvailable, setIsAvailable] = useState(isEditMode ? data.isAvailable : false);
  const [dlImageFrontFile, setDlImageFrontFile] = useState(null);
  const [dlImageBackFile, setDlImageBackFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [deliveryBoyReward, setDeliveryBoyReward] = useState(isEditMode ? data.deliveryBoyReward : "");


  const formatDate = (obj) => {
    return `${obj.date()}/${obj.month()}/${obj.year()}`;
  };

  const saveBoy = async (urls) => {
    const updateData = {
      name,
      address: address,
      dlnumber: dlnumber,
      phoneNumber: phoneNumber,
      alternateNumber: alternateNumber,
      joinDate: formatDate(joinDate),
      isActive: isActive,
      isAvailable: isAvailable,
      deliveryBoyReward: deliveryBoyReward,
    };

    if (urls[0]) {
      updateData.dlImageFrontFile = urls[0];
    }
    if (urls[1]) {
      updateData.dlImageBackFile = urls[1];
    }
    if (urls[2]) {
      updateData.profileImageFile = urls[2];
    }

    if (isEditMode) {
      await updateDoc(doc(db, 'DeliveryBoy', data.id), updateData).then(() => {
        Swal.fire("Submitted!", "Delivery Boy has been updated", "success");
      });
    } else {
      // Add a new delivery boy and save the document ID
      const newDocRef = await addDoc(collection(db, 'DeliveryBoy'), updateData);
      const newDocId = newDocRef.id; // Get the new document ID
      Swal.fire("Submitted!", "New Delivery Boy has been added", "success");

      // Update the document with the new document ID
      await updateDoc(doc(db, 'DeliveryBoy', newDocId), { id: newDocId });
    }
    refreshDeliveryBoys();
    closeModal();
  };  

  const submitNewDeliveryBoy = async () => {
    let res = [];

    if (isEditMode) {
      const imageFiles = [dlImageFrontFile, dlImageBackFile, profileImageFile];
      res = await uploadImages(imageFiles.filter(file => file !== null));
    } else {
      const imageFiles = [dlImageFrontFile, dlImageBackFile, profileImageFile];
      res = await uploadImages(imageFiles.filter(file => file !== null));
    }

    await saveBoy(res);
  }; 

  const handleSubmit = () => {
    if (!name) Swal.fire("Validation Issue!", "Please add a Title", "error");
    else submitNewDeliveryBoy();
  };

  const handleToggleChange = () => {
    setIsActive(!isActive);
  };

  const handleToggleChangeAvailabel = () => {
    setIsAvailable(!isAvailable);
  };

  return (
    <Card sx={{ marginTop: "25px", border: "1px solid", maxHeight: "90vh", overflow: "auto" }}>
      <CardHeader title="Delivery Boy Form" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              error={false}
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name"
              size="small"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={false}
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              label="Address"
              size="small"
              multiline // Add this prop for multiline
              rows={4} // Specify the number of rows
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              error={false}
              id="dlnumber"
              name="dlnumber"
              value={dlnumber}
              onChange={(e) => setDlNumber(e.target.value)}
              label="Dl Number"
              size="small"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={4}>
            <PhoneInput
              placeholder="Primary Phone number"
              country="IN"
              value={phoneNumber}
              onChange={SetPhoneNumber}
              defaultCountry="IN"
            />
          </Grid>
          <Grid item xs={4}>
            <PhoneInput
              placeholder="Alternate phone number"
              country="IN"
              value={alternateNumber}
              onChange={SetAlternateNumber}
              defaultCountry="IN"
            />
          </Grid>
          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Joining Date"
                value={joinDate}
                onChange={(value) => setJoinDate(value)}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <h4>Upload DL Image(Front)</h4>
            <input
              type="file"
              style={{ marginTop: "10px" }}
              onChange={(e) => setDlImageFrontFile(e.target.files[0])}
              accept="/image/*"
            />
          </Grid>
          {percent && (
            <Grid item xs={12}>
              {percent}
            </Grid>
          )}

          <Grid item>
            <h4>Upload DL Image(Back)</h4>
            <input
              type="file"
              style={{ marginTop: "10px" }}
              onChange={(e) => setDlImageBackFile(e.target.files[0])}
              accept="/image/*"
            />
          </Grid>
          {percent && (
            <Grid item xs={12}>
              {percent}
            </Grid>
          )}

          <Grid item xs={12}>
            <h4>Upload Profile Pic</h4>
            <input
              type="file"
              style={{ marginTop: "10px" }}
              onChange={(e) => setProfileImageFile(e.target.files[0])}
              accept="/image/*"
            />
          </Grid>
          {percent && (
            <Grid item xs={12}>
              {percent}
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Is Boy Active?
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={handleToggleChange}
                  name="isActive"
                />
              }
              label="Active/Deactive"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Is Boy Available?
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isAvailable}
                  onChange={handleToggleChangeAvailabel}
                  name="isAvailable"
                />
              }
              label="Active/Deactive"
            />
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ mt: 2, mb: 2 }} /> {/* Add the Divider */}
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={false}
              id="deliveryBoyReward" // Add the id for the new field
              name="deliveryBoyReward" // Add the name for the new field
              value={deliveryBoyReward} // Bind the value to the state
              onChange={(e) => setDeliveryBoyReward(e.target.value)} // Update the state
              label="Delivery Boy Reward" // Label for the new field
              size="small"
              sx={{ mb: 2 }}
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

export default AddNewDeliveryBoy;
