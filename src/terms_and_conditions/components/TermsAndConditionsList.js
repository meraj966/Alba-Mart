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
import { AppContext } from "../../context";
import {
  CONTROL_DELETE_TERMS_AND_CONDITIONS,
  CONTROL_EDIT_TERMS_AND_CONDITIONS,
  userHasAccessToKey,
} from "../../authentication/utils";

function TermsAndConditionsList({
  openModal,
  termsAndConditionsData,
  handleDelete,
}) {
  const { userInfo } = useContext(AppContext);

  return (
    <>
      <TableContainer>
        <Table aria-label="sticky table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>User / Delivery Boy</strong>
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Description</strong>
              </TableCell>
              <TableCell align="left" style={{ width: "100px" }}>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {termsAndConditionsData?.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  <TableCell align="left">{String(row.for)}</TableCell>
                  <TableCell align="left">
                    <div
                      dangerouslySetInnerHTML={{ __html: row.description }}
                    ></div>
                  </TableCell>
                  <TableCell align="left">
                    <Stack spacing={2} direction="row">
                      {userHasAccessToKey(
                        userInfo,
                        CONTROL_EDIT_TERMS_AND_CONDITIONS
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
                        CONTROL_DELETE_TERMS_AND_CONDITIONS
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
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default TermsAndConditionsList;
