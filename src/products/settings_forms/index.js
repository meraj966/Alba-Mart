import { Button, Grid, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

function SettingsEditForm({
  title,
  subTitle,
  onClose,
  children,
  submitButtonText,
  onSave,
}) {
  return (
    <>
      <Typography variant="h5" align="center">
        {title}
      </Typography>
      <Typography variant="h5">{subTitle}</Typography>
      <IconButton
        style={{ position: "absolute", top: "0", right: "0" }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      {children}

      <Grid item xs={12}>
        <Typography variant="h5" align="right" sx={{ marginTop: "12px" }}>
          <Button variant="contained" onClick={onSave}>
            {submitButtonText}
          </Button>
        </Typography>
      </Grid>
    </>
  );
}

export default SettingsEditForm;
