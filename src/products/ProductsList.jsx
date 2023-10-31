import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Product from "./resuable/Product";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import { Skeleton } from "@mui/material";

export default function ProductsList({
  rows,
  setFormid,
  handleEditOpen,
  getMenuData,
  isDetailView,
  handleSelectedProducts,
  isEditOffer,
  isOrderDetailView,
}) {
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProductsOnTop, setSelectedProductsOnTop] = useState([]);

  useEffect(() => {
    const filtered = rows.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [rows, searchQuery]);

  useEffect(() => {
    const selected = filteredRows.filter((product) => product.isSelected);
    const unselected = filteredRows.filter((product) => !product.isSelected);

    setSelectedProductsOnTop([...selected, ...unselected]);
  }, [filteredRows]);

  const productSelected = (id, checked) => {
    let products = [...filteredRows];
    products.map((prod) => {
      if (prod.id === id) {
        prod.isSelected = checked;
      }
    });
    setFilteredRows([...products]);
    handleSelectedProducts([...products]);
  };

  const handleSelectAll = (e) => {
    let products = [...filteredRows];
    products.map((prod) => (prod["isSelected"] = e.target.checked));
    setFilteredRows([...products]);
    handleSelectedProducts([...products]);
    setSelectAll(e.target.checked);
    setPage(0);
  };

  return (
    <>
      {isEditOffer && (
        <TextField
          type="text"
          id="search"
          name="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          label="Search by Product Name"
          size="small"
          sx={{ width: "250px" }}
        />
      )}

      {selectedProductsOnTop.length > 0 && (
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
                  {!isOrderDetailView && (
                    <TableCell align="left">
                      <span className="hide-on-print">Prod Img</span>
                    </TableCell>
                  )}
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
                {selectedProductsOnTop
                  ?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                  .map((row) => {
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

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={selectedProductsOnTop.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </>
      )}

      {selectedProductsOnTop.length === 0 && (
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
      )}
    </>
  );
}
