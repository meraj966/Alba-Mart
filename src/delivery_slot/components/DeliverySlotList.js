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

function DeliverySlotList({ openModal, deliveryslotData, handleDelete }) {

  
  return (
    <>
      <TableContainer>
        <Table aria-label="sticky table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Day
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Time (from)
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Time (To)
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                No. of Possible Delivery
              </TableCell>
              <TableCell align="left" style={{ width: "100px" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryslotData?.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                <TableCell align="left">{String(row.day)}</TableCell>
                <TableCell align="left">{String(row.timeFrom)}</TableCell>
                <TableCell align="left">{String(row.timeTo)}</TableCell>
                <TableCell align="left">{String(row.numDeliveries)}</TableCell>
                <TableCell align="left">
                  <Stack spacing={2} direction="row">
                    <EditIcon
                      style={{
                        fontSize: "20px",
                        color: "blue",
                        cursor: "pointer",
                      }}
                      className="cursor-pointer"
                      onClick={()=> openModal(row)}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default DeliverySlotList;
