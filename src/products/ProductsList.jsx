import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Product from "./resuable/Product";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Skeleton } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
import "../orders/OrderDetails.css";

export default function ProductsList({
  rows,
  setFormid,
  handleEditOpen,
  getMenuData,
  isDetailView,
  handleSelectedProducts,
  isEditOffer,
  isOrderDetailView
}) {
  const [selectAll, setSelectAll] = useState(false);
  const productSelected = (id, checked) => {
    let products = [...rows];
    products.map((prod) => {
      if (prod.id === id) {
        prod.isSelected = checked;
      }
    });
    handleSelectedProducts([...products]);
  };

  const handleSelectAll = (e) => {
    let products = [...rows];
    products.map((prod) => (prod["isSelected"] = e.target.checked));
    handleSelectedProducts([...products]);
    setSelectAll(e.target.checked);
  };

  return (
    <>
      {rows.length > 0 && (
        <>
          <TableContainer>
            <Table stickyHeader aria-label="Products">
              <TableHead>
                <TableRow>
                  {isEditOffer && (
                    <TableCell align="left">
                      <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                      ></Checkbox>
                    </TableCell>
                  )}
                  <TableCell align="left">Name</TableCell>
                  {!isOrderDetailView &&
                  <TableCell align="left">
                    <span className="hide-on-print">Prod Img</span>
                  </TableCell>}

                  <TableCell align="left">MRP</TableCell>
                  <TableCell align="left">Sale Price</TableCell>
                  <TableCell align="left">Discount</TableCell>
                  {!isOrderDetailView && <TableCell align="left">Stock Value</TableCell>}
                  <TableCell align="left">Quantity</TableCell>
                  {!isOrderDetailView && <TableCell align="left">Is Product Live</TableCell>}
                  {isDetailView || isEditOffer ? null : (
                    <TableCell align="left">Action</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.length > 0 &&
                  rows?.map((row) => {
                    return (
                      <Product
                        data={row}
                        {...row}
                        isEditOffer={isEditOffer}
                        setFormid={setFormid}
                        handleEditOpen={handleEditOpen}
                        deleteProd={getMenuData}
                        isDetailView={isDetailView}
                        productSelected={(checked) =>
                          productSelected(row.id, checked)
                        }
                        isOrderDetailView={isOrderDetailView}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {rows.length === 0 && (
        <>
          <Paper sx={{ width: "98%", overflow: "hidden", padding: "12px" }}>
            <Box height={20} />
            <Skeleton variant="rectangular" width={"100%"} height={30} />
            <Box height={40} />
            <Skeleton variant="rectangular" width={"100%"} height={60} />
            <Box height={20} />
            <Skeleton variant="rectangular" width={"100%"} height={60} />
            <Box height={20} />
            <Skeleton variant="rectangular" width={"100%"} height={60} />
            <Box height={20} />
            <Skeleton variant="rectangular" width={"100%"} height={60} />
            <Box height={20} />
            <Skeleton variant="rectangular" width={"100%"} height={60} />
            <Box height={20} />
          </Paper>
        </>
      )}
    </>
  );
}
