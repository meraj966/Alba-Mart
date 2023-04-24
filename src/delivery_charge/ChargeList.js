import React from "react";
import {TableCell, TableRow} from '@mui/material'
import Table from "../components/reusable/Table";
import { DELIVERY_CHARGE_TABLE_HEADERS } from "../Constants";

function ChargeList({ data }) {
  const tableBody = () =>
    data.map((row, index) => (
      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
        <TableCell align="left">{index+1}</TableCell>
        <TableCell align="left">{row.criteria}</TableCell>
        <TableCell align="left">{row.condition}</TableCell>
        <TableCell align="left"> {row.condition === 'IN RANGE' ?`${row.value} - ${row.value2 || "No upper limit"}` : row.value}</TableCell>
        <TableCell align="left" sx={{fontWeight: '700'}}>{row.deliveryCharge}</TableCell>
      </TableRow>
    ));
  return (
    <Table headers={DELIVERY_CHARGE_TABLE_HEADERS} body={tableBody()}></Table>
  );
}

export default ChargeList;
