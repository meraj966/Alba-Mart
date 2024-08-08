import React, { useContext } from "react";
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
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";
import {
  CONTROL_DELETE_DELIVERY_CHARGES,
  CONTROL_EDIT_DELIVERY_CHARGES,
  userHasAccessToKey,
} from "../../authentication/utils";
import { AppContext } from "../../context";

function DeliveryChargeList({ openModal, deliveryChargeData, handleDelete }) {
  const { userInfo } = useContext(AppContext);
  if (!deliveryChargeData) {
    return null; // Return null or a loading indicator if deliveryboyData is undefined
  }

  return (
    <>
      <TableContainer>
        <Table aria-label="sticky table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Pin Code</strong>
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Maximum Value</strong>
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Minimum Value</strong>
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Delivery Charge</strong>
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Is It Fast Delivery</strong>
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Is Delivery Available</strong>
              </TableCell>
              <TableCell align="left" style={{ width: "100px" }}>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryChargeData.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                <TableCell align="left">{String(row.pincode)}</TableCell>
                <TableCell align="left">{String(row.maximumValue)}</TableCell>
                <TableCell align="left">{String(row.minimumValue)}</TableCell>
                <TableCell align="left">{String(row.charge)}</TableCell>
                <TableCell align="left">
                  {row.fastDelivery ? "Yes" : "No"}
                </TableCell>
                <TableCell align="left">
                  {row.activeNow ? "Yes" : "No"}
                </TableCell>
                <TableCell align="left">
                  <Stack spacing={2} direction="row">
                    {userHasAccessToKey(
                      userInfo,
                      CONTROL_EDIT_DELIVERY_CHARGES
                    ) ? (
                      <EditIcon
                        style={{
                          fontSize: "20px",
                          color: "blue",
                          cursor: "pointer",
                        }}
                        className="cursor-pointer"
                        onClick={() => openModal(row)}
                      />
                    ) : null}
                    {userHasAccessToKey(
                      userInfo,
                      CONTROL_DELETE_DELIVERY_CHARGES
                    ) ? (
                      <DeleteIcon
                        style={{
                          fontSize: "20px",
                          color: "darkred",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDelete(row.id)}
                      />
                    ) : null}
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

export default DeliveryChargeList;
