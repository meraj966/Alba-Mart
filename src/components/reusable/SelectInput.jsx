import { MenuItem, TextField } from "@mui/material";
import React from "react";

function SelectInput({
  error,
  id,
  label,
  name,
  value,
  data,
  onChange,
  size,
  sx,
}) {
  return (
    <TextField
      id={id}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={error}
      size={size}
      sx={sx}
      select
    >
      {data &&
        data.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
    </TextField>
  );
}

export default SelectInput;
