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
import { collection, getDocs, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";

function DeliveryBoyList({ openModal }) {
  const [deliveryboyData, setDeliveryBoyData] = useState([]);
  const ref = collection(db, "DeliveryBoy");

  useEffect(() => {
    getDeliveryBoyData();
    listenForChanges();
  }, []);

  const getDeliveryBoyData = async () => {
    const data = await getDocs(ref);
    setDeliveryBoyData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const listenForChanges = () => {
    onSnapshot(ref, (querySnapshot) => {
      const updatedData = [];
      querySnapshot.forEach((doc) => {
        updatedData.push({ ...doc.data(), id: doc.id });
      });
      setDeliveryBoyData(updatedData);
    });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(ref, id));
    setDeliveryBoyData(deliveryboyData.filter((row) => row.id !== id));
  };

  return (
    <>
      <TableContainer>
        <Table aria-label="sticky table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Name
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Mobile
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                DL Number
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Date Of Join
              </TableCell>
              <TableCell align="left" style={{ width: "100px" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryboyData.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                <TableCell align="left">{String(row.name)}</TableCell>
                <TableCell align="left">{String(row.phoneNumber)}</TableCell>
                <TableCell align="left">{String(row.dlnum)}</TableCell>
                <TableCell align="left">{String(row.doj)}</TableCell>
                <TableCell align="left">
                  <Stack spacing={2} direction="row">
                    <EditIcon
                      style={{
                        fontSize: "20px",
                        color: "blue",
                        cursor: "pointer",
                      }}
                      className="cursor-pointer"
                      onClick={()=> openModal(row)}
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

export default DeliveryBoyList;
