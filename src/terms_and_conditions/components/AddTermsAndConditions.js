import React, { useState } from "react";
import { collection, addDoc, updateDoc, setDoc, doc } from "firebase/firestore";
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function AddTermsAndConditions({ data, isEditMode, refreshTermsAndConditions, handleClose }) {
  const [userOrDeliveryBoy, setUserOrDeliveryBoy] = useState(isEditMode ? data.for : "");
  const [description, setDescription] = useState(isEditMode ? data.description : "");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isEditMode) {
      await updateDoc(doc(db, "TermsAndConditions", data.id), {
        for: userOrDeliveryBoy,
        description,
      }).then(() => {
        Swal.fire("Succesfull!", "Terms and conditions added", "success");
      });
    } else {
      await setDoc(doc(collection(db, "TermsAndConditions"), userOrDeliveryBoy), {
        for: userOrDeliveryBoy,
        description,
      }).then(() => {
        Swal.fire("Succesfull!", "Terms and conditions added", "success");
      });
    }
    refreshTermsAndConditions();
    handleClose();
  };

  const handleUserOrDeliveryBoyChange = (event) => {
    setUserOrDeliveryBoy(event.target.value);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  return (
    <Card sx={{ marginTop: "25px", border: "1px solid" }}>
      <CardHeader title="Add Terms & Condition" />
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
          <Grid item xs={12}>
            <ReactQuill value={description} onChange={handleDescriptionChange} />
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

export default AddTermsAndConditions;

