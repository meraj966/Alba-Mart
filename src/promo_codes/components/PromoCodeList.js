import React, { useEffect, useState } from "react";
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
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";

function PromoCodeList() {
  const [promocodeData, setPromoCodeData] = useState([]);
  const ref = collection(db, "PromoCode");

  useEffect(() => {
    getPromoCodeData();
  }, []);

  const getPromoCodeData = async () => {
    const data = await getDocs(ref);
    setPromoCodeData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(ref, id));
    setPromoCodeData(promocodeData.filter((row) => row.id !== id));
  };

    return (
      <>
        <TableContainer>
          <Table aria-label="sticky table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Promo Code
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Start Date
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  End Date
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Promo Code Dis.(%)
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Is PromoCode Live
                </TableCell>
                <TableCell align="left" style={{ width: "100px" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promocodeData.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  <TableCell align="left">{String(row.code)}</TableCell>
                  <TableCell align="left">{String(row.startDate)}</TableCell>
                  <TableCell align="left">{String(row.endDate)}</TableCell>
                  <TableCell align="left">
                    {String(row.discount)}
                  </TableCell>
                  <TableCell align="left">
                    {String(row.discountStatus ? "Yes" : "No")}
                  </TableCell>
                  <TableCell align="left">
                    <Stack spacing={2} direction="row">
                      <EditIcon
                        style={{
                          fontSize: "20px",
                          color: "blue",
                          cursor: "pointer",
                        }}
                        className="cursor-pointer"
                      />
                      <DeleteIcon
                        style={{
                          fontSize: "20px",
                          color: "darkred",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDelete(row.id)}
                      />
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
