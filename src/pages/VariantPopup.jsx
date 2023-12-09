import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const VariantPopup = ({ open, handleClose }) => {
  const [formValues, setFormValues] = useState({
    fieldName1: "",
    fieldName2: "",
    // Add more fields as needed
  });
  const [rows, setRows] = useState([1]);

  const handleFormChange = (event, row) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [`${name}-${row}`]: value,
    }));
  };

  const handleCardClose = (row) => {
    // Implement logic to close the specific card
    // You can remove the card by filtering the rows
    setRows((prevRows) => prevRows.filter((r) => r !== row));
  };

  const handleSubmit = () => {
    // Handle form submission, you can add your logic here
    console.log("Form submitted with values:", formValues);
    // Add your logic to save form values to Firebase or perform any other actions
    handleClose(); // Close the modal after submission
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, // Increase the width as needed
          maxHeight: "80vh", // Set max height to enable scrolling
          overflowY: "auto", // Enable vertical scrolling
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <div style={{ width: "100%" }}>
          {/* Header with close button */}
          <IconButton
            style={{ position: "absolute", top: "0", right: "0" }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>

          {/* Content */}
          <Typography variant="h5" align="center">
            Add Multiple Variants
          </Typography>

          {/* Render dynamic cards */}
          {rows.map((row) => (
            <Card key={row} sx={{ marginTop: "25px", border: "1px solid" }}>
              <CardContent>
                {/* Close button for each card */}
                <IconButton
                  style={{ position: "absolute", top: 0, right: 0 }}
                  onClick={() => handleCardClose(row)}
                >
                  <CloseIcon />
                </IconButton>

                {/* Form fields for each card */}
                <TextField
                  label={`Field Name 1 - Row ${row}`}
                  name={`fieldName1-${row}`}
                  value={formValues[`fieldName1-${row}`] || ""}
                  onChange={(e) => handleFormChange(e, row)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label={`Field Name 2 - Row ${row}`}
                  name={`fieldName2-${row}`}
                  value={formValues[`fieldName2-${row}`] || ""}
                  onChange={(e) => handleFormChange(e, row)}
                  fullWidth
                  margin="normal"
                />
                {/* Add more fields as needed */}
              </CardContent>
            </Card>
          ))}

          {/* Add row button */}
          <IconButton
            onClick={() => setRows([...rows, rows.length ? rows[rows.length - 1] + 1 : 1])}
            style={{ display: "block", margin: "15px auto 0" }}
          >
            <AddCircleIcon />
          </IconButton>

          {/* Submit button */}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={handleClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} color="primary">
              Submit
            </Button>
          </Box>
        </div>
      </Box>
    </Modal>
  );
};

export default VariantPopup;
