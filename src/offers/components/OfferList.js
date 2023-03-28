import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  IconButton,
} from "@mui/material";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";

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
              <TableCell align="left" style={{ width: "100px" }}>
                Action
              </TableCell>
              <TableCell align="left" style={{ width: "100px" }}>
                View Products
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
                <TableCell align="center">
                  <Link to={`/offer-details/${row.id}`} target="_blank" rel="noopener noreferrer">
                      <OpenInNewIcon color="primary"/>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default OfferList;
