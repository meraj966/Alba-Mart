import React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Stack } from "@mui/system";
import { Typography, Button } from "@mui/material";

function ActionBarOnlyAddButton({onClick, buttonLabel}) {
  return (
    <Stack direction="row" spacing={2} className="my-2 mb-2">
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1 }}
      ></Typography>
      <Button variant="contained" endIcon={<AddCircleIcon />} onClick={onClick}>
        {buttonLabel}
      </Button>
    </Stack>
  );
}

export default ActionBarOnlyAddButton;
