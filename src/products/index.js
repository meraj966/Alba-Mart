import React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { getProductDataGridColumns } from "./constants";

function ProductsGrid({ data , open, openProductPreview, selectedProd, editData, deleteProduct }) {
  console.log(openProductPreview)
  console.log(data, "data rows");
  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        columns={getProductDataGridColumns(open, openProductPreview, selectedProd, editData, deleteProduct)}
        rows={data}
        autoHeight={true}
        sx={{ overflowX: "hidden" }}
        disableRowSelectionOnClick
        disableSelectionOnClick
      />
    </Box>
  );
}

export default ProductsGrid;
