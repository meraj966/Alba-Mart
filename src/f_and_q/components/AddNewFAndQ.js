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

function AddNewFAndQ({
  data,
  isEditMode,
  refreshFAndQ,
  handleClose,
}) {
  const [question, setQuestion] = useState(
    isEditMode ? data.question : ""
  );
  const [answer, setAnswer] = useState(
    isEditMode ? data.answer : ""
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isEditMode) {
      await updateDoc(doc(db, "FAndQ", data.id), {
        question,
        answer,
      }).then(() => {
        Swal.fire("Succesfull!", "F and Q added", "success");
      });
    } else {
      await addDoc(collection(db, "FAndQ"), {
        question,
        answer,
      }).then(() => {
        Swal.fire("Succesfull!", "F and Q added", "success");
      });
    }
    refreshFAndQ();
    handleClose();
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleAnswerChange = (value) => {
    setAnswer(value);
  };

  return (
    <Card sx={{ marginTop: "25px", border: "1px solid" }}>
      <CardHeader title="Add Terms & Condition" />
      <CardContent sx={{ overflowY: "scroll", maxHeight: "400px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Question"
              type="text"
              value={question}
              onChange={handleQuestionChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <ReactQuill value={answer} onChange={handleAnswerChange} />
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

export default AddNewFAndQ;

