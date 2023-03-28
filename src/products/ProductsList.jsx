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

export default function ProductsList({
  rows,
  setFormid,
  handleEditOpen,
  getMenuData,
  isDetailView,
}) {
  console.log("product list", rows);
  return (
    <>
      {rows.length > 0 && (
        <>
          <TableContainer>
            <Table stickyHeader aria-label="Products">
              <TableHead>
                <TableRow>
                  <TableCell align="left" >Name</TableCell>
                  <TableCell align="left">MRP</TableCell>
                  <TableCell align="left">Sale Price</TableCell>
                  <TableCell align="left">Stock Value</TableCell>
                  <TableCell align="left">Quantity</TableCell>
                  <TableCell align="left">Is Product Live</TableCell>
                  {!isDetailView && <TableCell align="left">Action</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  return (
                    <Product
                      data={row}
                      {...row}
                      setFormid={setFormid}
                      handleEditOpen={handleEditOpen}
                      deleteProd={getMenuData}
                      isDetailView={isDetailView}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {rows.length == 0 && (
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
