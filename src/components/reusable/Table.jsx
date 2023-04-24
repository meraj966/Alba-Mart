import React from "react";
import {
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
  } from "@mui/material";

function Table({ headers, body }) {
  return (
    <TableContainer>
      <MuiTable aria-label="sticky table" stickyHeader>
        <TableHead>
          <TableRow>
            {headers?.map((header) => (
              <TableCell align="left" style={{ minWidth: "100px" }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {body}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}

export default Table;
