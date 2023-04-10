import React, { useState } from "react";
import {
  Card,
  Grid,
  Box,
  CardHeader,
  CardContent,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
} from "@mui/material";
import Swal from "sweetalert2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase-config";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
function AddNewOffer({ closeModal, getOfferData }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState("");
  const [isOfferLive, setIsOfferLive] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [file, setFile] = useState(null);
  const [percent, setPercent] = useState("");
  const formatDate = (obj) => {
    return obj && !isNaN(obj.date()) ? `${obj.month() + 1}/${obj.date()}/${obj.year()}` : "";
  };
  const saveOffer = async (url) => {
    const offerRef = collection(db, "Offers");
    const docData = await addDoc(offerRef, {
      title,
      bannerImage: url,
      description,
      discountPercent: discount,
      endDate: formatDate(endDate),
      startDate: formatDate(startDate),
      hasBanner: Boolean(url),
      isOfferLive,
      products: [],
    });
    const id = docData.id;
    await updateDoc(doc(db, "Offers", id), { saleTag: id });
    Swal.fire("Submitted!", "New Offer has been added", "success");
    getOfferData();
    closeModal();
  };
  const submitNewOffer = async () => {
    if (file) {
      const storageRef = ref(storage, `/images/${Math.random() + file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = String(
            Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            ) + "%"
          );
          // update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            await saveOffer(url);
          });
        }
      );
    } else saveOffer("");
  };
  const handleSubmit = () => {
    if (!title) Swal.fire("Validation Issue!", "Please add a Title", "error");
    else submitNewOffer();
  };
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
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(value) => setEndDate(value)}
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isOfferLive}
                  onChange={(e) => setIsOfferLive(e.target.checked)}
                  name="isOfferLive"
                />
              }
              name="isOfferLive"
              sx={{ minWidth: "100%", marginTop: "5px" }}
              label="Is Offer Live"
            />
          </Grid>
          <Grid item>
            <input
              type="file"
              style={{ marginTop: "10px" }}
              onChange={(e) => setFile(e.target.files[0])}
              accept="/image/*"
            />
          </Grid>
          {percent && (
            <Grid item xs={12}>
              {percent}
            </Grid>
          )}
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

export default AddNewOffer;
