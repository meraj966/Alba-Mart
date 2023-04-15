import React, { useState } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
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
      await updateDoc(doc(db, 'TermsAndConditions', data.id), {
        for: userOrDeliveryBoy,
        description,
      }).then(()=> {
        Swal.fire('Succesfull!', 'Terms and conditions added', 'success')
      })
    } else {
      await addDoc(collection(db, "TermsAndConditions"), {
        for: userOrDeliveryBoy,
        description,
      }).then(()=> {
        Swal.fire('Succesfull!', 'Terms and conditions added', 'success')
      });
    }
    refreshTermsAndConditions();
    handleClose()
  };

  const handleUserOrDeliveryBoyChange = (event) => {
    setUserOrDeliveryBoy(event.target.value);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  return (
    <Card sx={{ marginTop: "25px", border: "1px solid" }}>
      <CardHeader title="Add Term&Condition" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              label="For User Or Delivery Boy ?"
              type="text"
              value={userOrDeliveryBoy}
              onChange={handleUserOrDeliveryBoyChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={4}>
            <ReactQuill
              value={description}
              onChange={handleDescriptionChange}
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

export default AddTermsAndConditions;

