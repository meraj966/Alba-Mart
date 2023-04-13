import React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { PRODUCT_DATA_GRID_COLUMNS } from "./constants";

function ProductsGrid({data}) {
  console.log(data, "data rows")
  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        columns={PRODUCT_DATA_GRID_COLUMNS}
        rows={data}
        autoHeight={true}
        sx={{ overflowX: 'hidden' }}
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default ProductsGrid;
