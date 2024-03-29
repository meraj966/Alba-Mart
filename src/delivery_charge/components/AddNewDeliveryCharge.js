import React, { useState } from "react";
import {
  Card,
  Grid,
  CardHeader,
  CardContent,
  TextField,
  Typography,
  Button,
  Switch,
} from "@mui/material";
import Swal from "sweetalert2";
import { db } from "../../firebase-config";
import { addDoc, collection, doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";

function AddNewDeliveryCharge({ closeModal, isEditMode, refreshDeliveryChargess, data }) {
  const [charge, setCharge] = useState(isEditMode ? data.charge : "");
  const [pincode, setPincode] = useState(isEditMode ? data.pincode : "");
  const [maximumValue, setMaximumValue] = useState(isEditMode ? data.maximumValue : "");
  const [minimumValue, setMinimumValue] = useState(isEditMode ? data.minimumValue : "");
  const [fastDelivery, setFastDelivery] = useState(isEditMode ? data.fastDelivery : false);
  const [activeNow, setActiveNow] = useState(isEditMode ? data.activeNow : false);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const updatedData = {
      charge: Number(charge),
      maximumValue: Number(maximumValue),
      minimumValue: Number(minimumValue),
      fastDelivery,
      activeNow,
      pincode: Number(pincode)
    };
  
    if (isEditMode) {
      // Check if pincode has been modified
      if (pincode !== data.pincode) {
        // Delete the existing document with the old pincode
        await deleteDoc(doc(db, 'DeliveryCharge', data.id));
        
        // Set the new document with the updated pincode
        await setDoc(doc(collection(db, "DeliveryCharge"), pincode), updatedData);
      } else {
        // Update the existing document with the same pincode
        await updateDoc(doc(db, 'DeliveryCharge', data.id), updatedData);
      }
  
      Swal.fire("Submitted!", "Delivery Charges have been updated", "success");
    } else {
      // Add new document with the specified pincode
      await setDoc(doc(collection(db, "DeliveryCharge"), pincode), {
        pincode: Number(pincode),
        ...updatedData,
      });
  
      Swal.fire("Submitted!", "New Delivery Charges have been added", "success");
    }
  
    refreshDeliveryChargess();
    closeModal();
  };  

  return (
    <Card sx={{ marginTop: "25px", border: "1px solid", maxHeight: "80vh", overflow: "auto" }}>
      <CardHeader title="Delivery Charges Form" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              error={false}
              id="pincode"
              name="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              label="Pin Code"
              size="small"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              error={false}
              id="maximumValue"
              name="maximumValue"
              value={maximumValue}
              onChange={(e) => setMaximumValue(e.target.value)}
              label="Maximum Value"
              size="small"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              error={false}
              id="minimumValue"
              name="minimumValue"
              value={minimumValue}
              onChange={(e) => setMinimumValue(e.target.value)}
              label="Minimum Value"
              size="small"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              error={false}
              id="charge"
              name="charge"
              value={charge}
              onChange={(e) => setCharge(e.target.value)}
              label="Delivery Charge"
              size="small"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Fast Delivery:</Typography>
            <Switch
              checked={fastDelivery}
              onChange={(e) => setFastDelivery(e.target.checked)}
              name="fastDelivery"
              color="primary"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Delivery Available Here?</Typography>
            <Switch
              checked={activeNow}
              onChange={(e) => setActiveNow(e.target.checked)}
              name="activeNow"
              color="primary"
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

export default AddNewDeliveryCharge;
