import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function OfferList() {
  const [offerData, setOfferData] = useState([]);
  const ref = collection(db, "Offers");

  useEffect(() => {
    getOfferData();
  }, []);

  const getOfferData = async () => {
    const data = await getDocs(ref);
    setOfferData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  console.log(offerData);
  return (
    <>
      <Paper sx={{ width: "98%", overflow: "hidden", padding: "12px" }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ padding: "20px" }}
        >
          Offer Settings
        </Typography>
        <Divider />
        <Box height={10} />
        <Stack direction="row" spacing={2} className="my-2 mb-2">
          {/* Add filters here */}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          <Button
            variant="contained"
            endIcon={<AddCircleIcon />}
            // onClick={}
          >
            Add Offer
          </Button>
        </Stack>
        <Box height={10} />
        <TableContainer>
          <Table aria-label="sticky table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Title
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Start Date
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  End Date
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Discount
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Is Offer Live
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offerData.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  <TableCell align="left">{String(row.title)}</TableCell>
                  <TableCell align="left">{String(row.startDate)}</TableCell>
                  <TableCell align="left">{String(row.endDate)}</TableCell>
                  <TableCell align="left">
                    {String(row.discountPercent)}
                  </TableCell>
                  <TableCell align="left">
                    {String(row.isOfferLive ? "Yes" : "No")}
                  </TableCell>
                  <TableCell align="left">
                    <Stack spacing={2} direction="row">
                      <EditIcon
                        style={{
                          fontSize: "20px",
                          color: "blue",
                          cursor: "pointer",
                        }}
                        className="cursor-pointer"
                      />
                      <DeleteIcon
                        style={{
                          fontSize: "20px",
                          color: "darkred",
                          cursor: "pointer",
                        }}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Paper>
    </>
  );
}

export default OfferList;
