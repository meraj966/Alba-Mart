import React, { useState } from "react";
import { Box, Typography, Grid } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "58%",
  transform: "translate(-50%, -50%)",
//   width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function ProductsAvailability({ title, data }) {
  const [value, setValue] = useState("");
  console.log(data, "unavaibale");
  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" sx={{textAlign: 'center'}} component="h2">
        {title}
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        {value}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={2}> <b>Name</b> </Grid>
        <Grid item xs={2}> <b>Category</b> </Grid>
        <Grid item xs={2}> <b>SubCategory</b> </Grid>
        <Grid item xs={2}> <b>Unit</b> </Grid>
        <Grid item xs={2}> <b>Price</b> </Grid>
        <Grid item xs={2}> <b>Stock Quantity</b> </Grid>
        {data && data?.map((row) => (
          <>
            <Grid item xs={2}> {row.name} </Grid>
            <Grid item xs={2}> {row.category} </Grid>
            <Grid item xs={2}> {row.subCategory} </Grid>
            <Grid item xs={2}> {row.measureUnit} </Grid>
            <Grid item xs={2}> {row.price} </Grid>
            <Grid item xs={2}> {row.stockValue} </Grid>
          </>
        ))}
      </Grid>
    </Box>
  );
}

export default ProductsAvailability;
