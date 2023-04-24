import React from "react";
import { Button, Typography } from "@mui/material";

function SaveBtn({ disabled, onSave }) {
  return (
    <Typography variant="h5" align="right">
      <Button
        sx={{ marginTop: "5px" }}
        disabled={disabled}
        onClick={onSave}
        type="submit"
        variant="contained"
      >
        Save
      </Button>
    </Typography>
  );
}

export default SaveBtn;
