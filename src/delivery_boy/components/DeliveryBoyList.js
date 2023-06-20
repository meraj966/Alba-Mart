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
import { collection, getDocs, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";

function DeliveryBoyList({ openModal, deliveryboyData, handleDelete }) {
  

  return (
    <>
      <TableContainer>
        <Table aria-label="sticky table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Name
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Mobile
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                DL Number
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Date Of Join
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                DL Image(Front)
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                DL Image(Back)
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Profile Pic
              </TableCell>
              <TableCell align="left" style={{ width: "100px" }}>
                Action
              </TableCell>
              <TableCell align="left" style={{ width: "100px" }}>
                View Details
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryboyData.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                <TableCell align="left">{String(row.name)}</TableCell>
                <TableCell align="left">{String(row.phoneNumber)}</TableCell>
                <TableCell align="left">{String(row.dlnumber)}</TableCell>
                <TableCell align="left">{String(row.joinDate)}</TableCell>
                <TableCell align="left">
                  <img
                    src={row.dlImageFront}
                    height="70px"
                    width="70px"
                    style={{ borderRadius: "15px" }}
                    loading="lazy"
                  />
                </TableCell>
                <TableCell align="left">
                  <img
                    src={row.dlImageBack}
                    height="70px"
                    width="70px"
                    style={{ borderRadius: "15px" }}
                    loading="lazy"
                  />
                </TableCell>
                <TableCell align="left">
                  <img
                    src={row.profilePic}
                    height="70px"
                    width="70px"
                    style={{ borderRadius: "15px" }}
                    loading="lazy"
                  />
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
                      onClick={() => openModal(row)}
                    />
                    <DeleteIcon
                      style={{
                        fontSize: "20px",
                        color: "darkred",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDelete(row.id)}
                    />
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Link
                    to={`/deliveryboy-details/${row.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <OpenInNewIcon color="primary" />
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

export default DeliveryBoyList;
