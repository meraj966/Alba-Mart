import React from "react";
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
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import Swal from "sweetalert2";

function OfferList({ offerData, getOfferData }) {
  const deleteOffer = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.value) {
        const menuRef = collection(db, 'Menu')
        let data = await getDocs(menuRef)
        const selectedDoc = doc(db, "Offers", id);
        await deleteDoc(selectedDoc);
        Swal.fire("Deleted!", "Selected offer has been deleted", "success");
        const menuData = data.docs.map(doc=>({...doc.data(), id: doc.id}))
        menuData.forEach(async data => {
          if (data.saleTag === id)
            await updateDoc(doc(db,"Menu", data.id), {saleTag: ''})
        })
        getOfferData();
      }
    });
  };
  console.log(offerData);
  return (
    <>
      <TableContainer>
        <Table aria-label="sticky table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Title
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Start Date
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                End Date
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Discount
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Is Offer Live
              </TableCell>
              <TableCell align="left" style={{ width: "100px" }}>
                Action
              </TableCell>
              <TableCell align="left" style={{ width: "100px" }}>
                View Products
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offerData.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                <TableCell align="left">{String(row.title)}</TableCell>
                <TableCell align="left">{String(row.startDate) || '-'}</TableCell>
                <TableCell align="left">{String(row.endDate) || '-'}</TableCell>
                <TableCell align="left">
                  {String(row.discountPercent)}
                </TableCell>
                <TableCell align="left">
                  {String(row.isOfferLive ? "Yes" : "No")}
                </TableCell>
                <TableCell sx={{ paddingLeft: "5px" }}>
                  <Stack direction="row">
                    <Tooltip title="Edit products in offer">
                      <IconButton onClick={() => console.log("edit")}>
                        <Link
                          to={`/edit-offer/${row.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <EditIcon
                            style={{
                              fontSize: "20px",
                              color: "blue",
                              cursor: "pointer",
                            }}
                            className="cursor-pointer"
                          />
                        </Link>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Offer">
                      <IconButton onClick={() => deleteOffer(row.saleTag)}>
                        <DeleteIcon
                          style={{
                            fontSize: "20px",
                            color: "darkred",
                            cursor: "pointer",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Link
                    to={`/offer-details/${row.id}`}
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

export default OfferList;
