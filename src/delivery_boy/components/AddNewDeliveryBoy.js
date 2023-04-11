// import React, { useState } from 'react';
// import { collection, addDoc } from "firebase/firestore";
// import { db, storage } from "../../firebase-config";
// import { TextField, Button, FormControl, InputLabel, Select, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
// import PhoneInput from 'react-phone-number-input';
// import 'react-phone-number-input/style.css';


// function AddNewDeliveryBoy() {
//   const [name, setName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [alternateNumber, setAlternateNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [dlNumber, setDLNumber] = useState('');
//   const [dateOfJoin, setDateOfJoin] = useState('dd-mm-yyyy');

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // Submit data to Firebase collection
//     try {
//       const docRef = await addDoc(collection(db, "DeliveryBoy"), {
//         name: name,
//         phoneNumber: phoneNumber,
//         alternateNumber:alternateNumber,
//         address: address,
//         dlNumber: dlNumber,
//         dateOfJoin:dateOfJoin
//       });
//       console.log('Data submitted successfully with ID: ', docRef.id);
//       // Reset form fields after successful submission
//       setName('');
//       setPhoneNumber('');
//       setAddress('');
//       setDLNumber('');
//       setDateOfJoin('dd-mm-yyyy')
//     } catch (error) {
//       console.error('Error submitting data: ', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <TextField
//         label="Name"
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         sx={{ mb: 2 }}
//       />
//       <br />
//       <PhoneInput
//         placeholder="Enter phone number"
//         country="IN"
//         value={phoneNumber}
//         onChange={setPhoneNumber}
//         defaultCountry="IN"
//       />
//       <br />
//       <PhoneInput
//         placeholder="Alternate phone number"
//         country="IN"
//         value={alternateNumber}
//         onChange={setAlternateNumber}
//         defaultCountry="IN"
//       />
//       <br />
//       <TextField
//         label="Address"
//         type="text"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//         sx={{ mb: 2 }}
//       />
//       <br />
//       <TextField
//         label="DL Number"
//         type="text"
//         value={dlNumber}
//         onChange={(e) => setDLNumber(e.target.value)}
//         sx={{ mb: 2 }}
//       />
//       <br />
//       <TextField
//         label="Date Of Join"
//         type="date"
//         value={dateOfJoin}
//         onChange={(e) => setDateOfJoin(e.target.value)}
//         sx={{ mb: 2, display: 'block' }}
//       />
//       <br />
//       <Button 
//         type="submit" 
//         variant="contained"
//         sx={{
//           mt: "10px",
//           mr: "20px",
//           borderRadius: 28,
//           color: "#ffffff",
//           minWidth: "170px",
//           backgroundColor: "#FF9A01",
//         }}
//       >
//         Submit
//       </Button>
//     </form>
//   );
// }

// export default AddNewDeliveryBoy;

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
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
function AddNewDeliveryBoy({ closeModal, getDeliveryBoyData, data }) {
  const [name, setName] = useState("");
  const [phoneNumber, SetPhoneNumber] = useState("")
  const [alternateNumber, SetAlternateNumber] = useState("")
  const [joinDate, setJoinDate] = useState(dayjs(new Date()));
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  const [percent, setPercent] = useState("")
  const formatDate = (obj) => {
    return `${obj.date()}/${obj.month()}/${obj.year()}`;
  };
  const saveBoy = async (url) => {
    console.log(joinDate,  dayjs(joinDate));
    const offerRef = collection(db, "DeliveryBoy");
    const docData = await addDoc(offerRef, {
      name,
      bannerImage: url,
      address: address,
      phoneNumber: phoneNumber,
      alternateNumber: alternateNumber,
      joinDate: formatDate(joinDate),
    });
    const id = docData.id;
    await updateDoc(doc(db, "DeliveryBoy", id), { saleTag: id });
    Swal.fire("Submitted!", "New Delivery Boy has been added", "success");
    getDeliveryBoyData()
    closeModal();
  };
  const submitNewDeliveryBoy = async () => {
    const storageRef = ref(storage, `/images/${Math.random() + file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = String(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) +
          "%"
        );
        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          await saveBoy(url);
        });
      }
    );
  };
  const handleSubmit = () => {
    if (!name) Swal.fire("Validation Issue!", "Please add a Title", "error");
    else submitNewDeliveryBoy();
  };
  return (
    <Card sx={{ marginTop: "25px", border: "1px solid" }}>
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
              sx={{ mb: 2, display: 'block' }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              error={false}
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              label="Address"
              size="small"
              sx={{ mb: 2, display: 'block' }}
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

export default AddNewDeliveryBoy;
