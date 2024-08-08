import React, { useContext, useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";
import { AppContext } from "../../context";
import {
  CONTROL_DELETE_DELIVERY_BOY,
  CONTROL_EDIT_DELIVERY_BOY,
  userHasAccessToKey,
} from "../../authentication/utils";
import { DELIVERY_BOY_DETAILS_URL } from "../../urls";

function DeliveryBoyList({ openModal, deliveryboyData, handleDelete }) {
  const { userInfo } = useContext(AppContext);

  function Cell({ name }) {
    return (
      <TableCell align="left" style={{ minWidth: "100px" }}>
        <strong>{name}</strong>
      </TableCell>
    );
  }

  return (
    <>
      <TableContainer>
        <Table aria-label="sticky table" stickyHeader>
          <TableHead>
            <TableRow>
              <Cell name={"Mobile"} />
              <Cell name={"DL Number"} />
              <Cell name={"Date Of Join"} />
              <Cell name={"DL Image(Front)"} />
              <Cell name={"DL Image(Back)"} />
              <Cell name="Profile Pic" />
              <Cell name="Reward" />
              <Cell name="Total Earned Reward" />
              <Cell name="Action" />
              <Cell name="View Details" />
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
                    src={row.dlImageFrontFile}
                    height="70px"
                    width="70px"
                    style={{ borderRadius: "15px" }}
                    loading="lazy"
                  />
                </TableCell>
                <TableCell align="left">
                  <img
                    src={row.dlImageBackFile}
                    height="70px"
                    width="70px"
                    style={{ borderRadius: "15px" }}
                    loading="lazy"
                  />
                </TableCell>
                <TableCell align="left">
                  <img
                    src={row.profileImageFile}
                    height="70px"
                    width="70px"
                    style={{ borderRadius: "15px" }}
                    loading="lazy"
                  />
                </TableCell>
                <TableCell align="left">
                  <TableCell align="left">
                    {String(row.deliveryBoyReward)}
                  </TableCell>
                </TableCell>
                <TableCell align="left">
                  <TableCell align="left">
                    {String(row.totalRewardEarns)}
                  </TableCell>
                </TableCell>
                <TableCell align="left">
                  <Stack spacing={2} direction="row">
                    {userHasAccessToKey(userInfo, CONTROL_EDIT_DELIVERY_BOY) ? (
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
                      CONTROL_DELETE_DELIVERY_BOY
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
                <TableCell align="center">
                  <Link
                    to={`${DELIVERY_BOY_DETAILS_URL}/${row.id}`}
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
