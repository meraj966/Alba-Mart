import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

function OrdersList({orders}) {
  return (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left">Order ID</TableCell>
            <TableCell align="left">Cust Name</TableCell>
            <TableCell align="left">Cust Contact</TableCell>
            <TableCell align="left">Total Amount</TableCell>
            <TableCell align="left">Payment Mode</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Others..</TableCell>
            <TableCell align="left">View</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders && orders.map(order=> (
            <TableRow hover tabIndex={-1} key={order.id}>
              <TableCell align="left">{order.orderId}</TableCell>
              <TableCell align="left">{}</TableCell>
              <TableCell align="left">{}</TableCell>
              <TableCell align="left">{}</TableCell>
              <TableCell align="left">{}</TableCell>
              <TableCell align="left">{order.orderStatus}</TableCell>
              <TableCell align="left">{}</TableCell>
              <TableCell align="left">{}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default OrdersList;
