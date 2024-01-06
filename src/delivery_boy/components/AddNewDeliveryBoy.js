import React, { useState, useEffect } from "react";
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
import { addDoc, collection, doc, updateDoc, getDoc } from "firebase/firestore";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { uploadImages } from "../../firebase_utils";

function AddNewDeliveryBoy({ closeModal, isEditMode, refreshDeliveryBoys, data }) {
  const [name, setName] = useState(isEditMode ? data.name : "");
  const [phoneNumber, SetPhoneNumber] = useState(isEditMode ? data.phoneNumber : "");
  const [alternateNumber, SetAlternateNumber] = useState(isEditMode ? data.alternateNumber : "");
  const [joinDate, setJoinDate] = useState(
    isEditMode ? data.joinDate : "dd-mm-yyyy"
  );
  const [address, setAddress] = useState(isEditMode ? data.address : "");
  const [dlnumber, setDlNumber] = useState(isEditMode ? data.dlnumber : "");
  const [percent, setPercent] = useState("");
  const [isActive, setIsActive] = useState(isEditMode ? data.isActive : false);
  const [isAvailable, setIsAvailable] = useState(isEditMode ? data.isAvailable : false);
  const [dlImageFrontFile, setDlImageFrontFile] = useState(null);
  const [dlImageBackFile, setDlImageBackFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [deliveryBoyReward, setDeliveryBoyReward] = useState(isEditMode ? data.deliveryBoyReward : 0);
  const [rejectedOrder, setRejectedOrder] = useState(0);
  const [totalRewardEarns, setTotalRewardEarns] = useState(
    isEditMode ? data.totalRewardEarns : 0
  );
  const [canceledOrder, setCanceledOrder] = useState(0);
  const [deliveredOrder, setDeliveredOrder] = useState(0);
  const [claimedReward, setClaimedReward] = useState(isEditMode ? (data.claimedReward || []).join(', ') : '');

  const handleJoinDateChange = (event) => {
    setJoinDate(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode) {
        const docRef = doc(db, 'DeliveryBoy', data.id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const existingData = docSnapshot.data();
          setName(existingData.name || "");
          SetPhoneNumber(existingData.phoneNumber || "");
          SetAlternateNumber(existingData.alternateNumber || "");

          // Keep joinDate as a string in "DD/MM/YYYY" format
          setJoinDate(existingData.joinDate || "dd-mm-yyyy");

          setAddress(existingData.address || "");
          setDlNumber(existingData.dlnumber || "");
          setIsActive(existingData.isActive || false);
          setIsAvailable(existingData.isAvailable || false);
          setDeliveryBoyReward(existingData.deliveryBoyReward || 0);
          setRejectedOrder(existingData.rejectedOrder || 0);
          setTotalRewardEarns(existingData.totalRewardEarns || 0);
          setCanceledOrder(existingData.canceledOrder || 0);
          setDeliveredOrder(existingData.deliveredOrder || 0);
          setClaimedReward((existingData.claimedReward || []).join(', ') || '');
        }
      }
    };

    fetchData();
  }, [isEditMode, data.id]);

  const saveBoy = async (urls) => {
    const updateData = {
      name,
      address,
      dlnumber,
      phoneNumber,
      alternateNumber,
      joinDate,  // Keep joinDate as a string in "DD/MM/YYYY" format
      isActive,
      isAvailable,
      deliveryBoyReward: parseInt(deliveryBoyReward),
      rejectedOrder: parseInt(rejectedOrder),
      totalRewardEarns: parseInt(totalRewardEarns),
      canceledOrder: parseInt(canceledOrder),
      deliveredOrder: parseInt(deliveredOrder),
      claimedReward: claimedReward.split(',').map(value => value.trim()),
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
    let dlFrontUrls = [];
    let dlBackUrls = [];
    let profileImageUrls = [];

    // Upload DL Front Image if provided during editing or adding new record
    if (dlImageFrontFile) {
      dlFrontUrls = await uploadImages([dlImageFrontFile]);
    }

    // Upload DL Back Image if provided during editing or adding new record
    if (dlImageBackFile) {
      dlBackUrls = await uploadImages([dlImageBackFile]);
    }

    // Upload Profile Image if provided during editing or adding new record
    if (profileImageFile) {
      profileImageUrls = await uploadImages([profileImageFile]);
    }

    // Save the delivery boy data with the respective image URLs
    await saveBoy([dlFrontUrls[0], dlBackUrls[0], profileImageUrls[0]]);
  };

  const handleSubmit = () => {
    if (!name) Swal.fire("Validation Issue!", "Please add a Title", "error");
    else submitNewDeliveryBoy();
  };

  const handleToggleChange = () => {
    setIsActive(!isActive);
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
            <TextField
              label="Join Date"
              type="date"
              value={joinDate}
              onChange={handleJoinDateChange}
              sx={{ mb: 2, display: "block" }}
            />
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
            <Divider sx={{ mt: 2, mb: 2 }} /> {/* Add the Divider */}
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={false}
              id="deliveryBoyReward"
              name="deliveryBoyReward"
              value={deliveryBoyReward}
              onChange={(e) => setDeliveryBoyReward(e.target.value)}
              label="Delivery Boy Reward"
              size="small"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={false}
              id="claimedReward"
              name="claimedReward"
              value={claimedReward}
              onChange={(e) => setClaimedReward(e.target.value)}
              label="Redeem Reward"
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
