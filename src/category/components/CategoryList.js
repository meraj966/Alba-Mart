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
  CONTROL_DELETE_CATEGORY,
  CONTROL_EDIT_CATEGORY,
  userHasAccessToKey,
} from "../../authentication/utils";
import { SUB_CATEGORY_URL } from "../../urls";

function CategoryList({ openModal, categoryData, handleDelete }) {
  const { userInfo } = useContext(AppContext);

  return (
    <>
      <TableContainer>
        <Table aria-label="sticky table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Category Name</strong>
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Category Image</strong>
              </TableCell>
              <TableCell align="left" style={{ width: "100px" }}>
                <strong>Action</strong>
              </TableCell>
              <TableCell align="left" style={{ width: "100px" }}>
                <strong>View Subcategory</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryData?.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                <TableCell align="left">{String(row.name)}</TableCell>
                <TableCell align="left">
                  <img
                    src={row.imageUrl}
                    height="70px"
                    width="70px"
                    style={{ borderRadius: "15px" }}
                    loading="lazy"
                  />
                </TableCell>
                <TableCell align="left">
                  <Stack spacing={2} direction="row">
                    {userHasAccessToKey(userInfo, CONTROL_EDIT_CATEGORY) ? (
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
                    {userHasAccessToKey(userInfo, CONTROL_DELETE_CATEGORY) ? (
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
                    to={`${SUB_CATEGORY_URL}/${row.id}`}
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

export default CategoryList;
