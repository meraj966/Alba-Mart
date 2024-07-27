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
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AppContext } from "../../context";
import {
  CONTROL_DELETE_PROMOCODE,
  CONTROL_EDIT_PROMOCODE,
  userHasAccessToKey,
} from "../../authentication/utils";

function PromoCodeList({ openModal, promocodeData, handleDelete }) {
  const { userInfo } = useContext(AppContext);
  const sortedPromoCodes = promocodeData.slice().sort((a, b) => {
    // Sort by Start Date in descending order
    return new Date(b.startDate) - new Date(a.startDate);
  });

  return (
    <>
      <TableContainer>
        <Table aria-label="sticky table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Promo Code</strong>
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Start Date</strong>
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>End Date</strong>
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Promo Code Dis.(%)</strong>
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Is PromoCode Live</strong>
              </TableCell>
              <TableCell align="left" style={{ width: "100px" }}>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPromoCodes.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                <TableCell align="left">{String(row.code)}</TableCell>
                <TableCell align="left">{String(row.startDate)}</TableCell>
                <TableCell align="left">{String(row.endDate)}</TableCell>
                <TableCell align="left">{String(row.discount)}</TableCell>
                <TableCell align="left">
                  <span
                    style={{
                      color: row.discountStatus ? "green" : "red",
                      border: "1px solid",
                      padding: "4px",
                      borderRadius: "4px",
                    }}
                  >
                    {row.discountStatus ? "Active" : "Deactive"}
                  </span>
                </TableCell>
                <TableCell align="left">
                  <Stack spacing={2} direction="row">
                    {userHasAccessToKey(userInfo, CONTROL_EDIT_PROMOCODE) ? (
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
                    {userHasAccessToKey(userInfo, CONTROL_DELETE_PROMOCODE) ? (
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

export default PromoCodeList;
