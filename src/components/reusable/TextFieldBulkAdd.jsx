import { Alert, TextField } from "@mui/material";
import React, { useState } from "react";

function TextFieldBulkAdd({
  bulkAddAlert,
  id,
  name,
  disabled,
  value,
  onChange,
  label,
  size,
  placeholder,
  sx,
  isBulkAdd
}) {
  return (
    <>
      <TextField
        id={id}
        name={name}
        disabled={disabled}
        value={value}
        onChange={onChange}
        label={label}
        size={size}
        placeholder={placeholder}
        sx={sx}
      />
      {isBulkAdd && <Alert severity="info">{bulkAddAlert}</Alert>}
    </>
  );
}

export default TextFieldBulkAdd;
