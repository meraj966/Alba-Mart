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
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";
import {
  CONTROL_DELETE_VARIANT,
  CONTROL_EDIT_VARIANT,
  userHasAccessToKey,
} from "../../authentication/utils";
import { AppContext } from "../../context";
import { VARIANT_DETAILS_URL } from "../../urls";

function VarientList({ openModal, varientData, handleDelete }) {
  const {userInfo} = useContext(AppContext);
  return (
    <>
      <TableContainer>
        <Table aria-label="sticky table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Variant Name</strong>
              </TableCell>
              <TableCell align="left" style={{ width: "100px" }}>
                <strong>View Details</strong>
              </TableCell>
              <TableCell align="left" style={{ width: "100px" }}>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {varientData?.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  <TableCell align="left">{String(row.variantName)}</TableCell>
                  <TableCell align="center">
                    <Link
                      to={`${VARIANT_DETAILS_URL}/${row.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <OpenInNewIcon color="primary" />
                    </Link>
                  </TableCell>
                  <TableCell align="left">
                    <Stack spacing={2} direction="row">
                      {userHasAccessToKey(userInfo, CONTROL_EDIT_VARIANT) ? (
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
                      {userHasAccessToKey(userInfo, CONTROL_DELETE_VARIANT) ? (
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
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default VarientList;
