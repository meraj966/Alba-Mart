import React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { getProductDataGridColumns } from "./constants";
import { useContext } from "react";
import { AppContext } from "../context";
import {
  CONTROL_DELETE_PRODUCT,
  CONTROL_EDIT_PRODUCT,
  userHasAccessToKey,
} from "../authentication/utils";

function ProductsGrid({ data, editData, deleteProduct }) {
  const { userInfo } = useContext(AppContext);
  const hasEditAccess = userHasAccessToKey(userInfo, CONTROL_EDIT_PRODUCT);
  const hasDeleteAccess = userHasAccessToKey(userInfo, CONTROL_DELETE_PRODUCT);
  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        columns={getProductDataGridColumns(
          editData,
          deleteProduct,
          hasEditAccess,
          hasDeleteAccess
        )}
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
