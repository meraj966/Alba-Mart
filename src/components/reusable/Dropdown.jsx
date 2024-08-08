import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function Dropdown({ label, value, onChange, data, defaultValue, sx }) {
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          label={label}
          value={value}
          onChange={onChange}
          sx={sx}
          defaultValue={defaultValue}
        >
          {data &&
            data.map((i, index) => (
              <MenuItem key={i.value + index} value={i.value}>
                {i.label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default Dropdown;
