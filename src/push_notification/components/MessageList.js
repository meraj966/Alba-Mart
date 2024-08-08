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
import { CONTROL_DELETE_NOTIFICATIONS, CONTROL_EDIT_NOTIFICATIONS, userHasAccessToKey } from "../../authentication/utils";
import { AppContext } from "../../context";

function MessageList({ openModal, messageData, handleDelete }) {
  const {userInfo} = useContext(AppContext);
  
  return (
    <>
      <TableContainer>
        <Table aria-label="sticky table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Title</strong>
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Body</strong>
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Type</strong>
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Image</strong>
              </TableCell>
              <TableCell align="left" style={{ width: "100px" }}>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messageData.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                <TableCell align="left">{String(row.title)}</TableCell>
                <TableCell align="left">{String(row.body)}</TableCell>
                <TableCell align="left">{String(row.type)}</TableCell>
                <TableCell align="left">
                  <img
                    src={row.image}
                    height="70px"
                    width="70px"
                    style={{ borderRadius: "15px" }}
                    loading="lazy"
                  />
                </TableCell>
                <TableCell align="left">
                  <Stack spacing={2} direction="row">
                    {userHasAccessToKey(userInfo, CONTROL_EDIT_NOTIFICATIONS) ?
                    <EditIcon
                      style={{
                        fontSize: "20px",
                        color: "blue",
                        cursor: "pointer",
                      }}
                      className="cursor-pointer"
                      onClick={() => openModal(row)}
                    /> :null}
                    {userHasAccessToKey(userInfo, CONTROL_DELETE_NOTIFICATIONS) ? 
                    <DeleteIcon
                      style={{
                        fontSize: "20px",
                        color: "darkred",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDelete(row.id)}
                    />:null}
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

export default MessageList;
