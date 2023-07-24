import React, { useEffect } from "react";
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
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  arrayRemove, // Add the arrayRemove function
} from "firebase/firestore";
import { db } from "../../firebase-config";
import Swal from "sweetalert2";
import moment from "moment/moment";

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
      if (result.isConfirmed) {
        const menuRef = collection(db, "Menu");
        const selectedDoc = doc(db, "Offers", id);
        await deleteDoc(selectedDoc);
        Swal.fire("Deleted!", "Selected offer has been deleted", "success");
        getOfferData();
      }
    });
  };

  useEffect(() => {
    console.log(offerData, "offerData");
    if (offerData.length) {
      let offerPastDue = offerData.filter(
        (i) => moment(i.endDate) < moment()
      );
      if (offerPastDue.length) {
        const titles = offerPastDue.map((i) => i.title).join(", ");
        if (
          window.confirm(
            `Offers - ${titles} have past due date. Please remove products manually or select OK to REMOVE products from sale.`
          )
        ) {
          Swal.fire({
            title: "Are you sure, that you want to remove products from sale?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              let products = await getDocs(collection(db, "Menu"));
              const productData = products.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }));

              // Run through all offers and remove products from sale
              const updatePromises = offerPastDue.map((offer) => {
                const productsToUpdate = productData.filter(
                  (product) => product.saleTag === offer.id
                );

                return Promise.all(
                  productsToUpdate.map((product) =>
                    updateDoc(doc(db, "Menu", product.id), {
                      saleTag: "",
                      saleValue: 0,
                      salePrice: product.price,
                      onSale: false,
                    })
                  )
                ).then(() => {
                  // Update the 'isOfferLive' field and remove product IDs from 'products' in the 'Offers' collection
                  const offerDocRef = doc(db, "Offers", offer.id);
                  return updateDoc(offerDocRef, {
                    isOfferLive: false,
                    products: arrayRemove(...productsToUpdate.map((p) => p.id)),
                  });
                });
              });

              await Promise.all(updatePromises);

              getOfferData();
            }
          });
        }
      }
      console.log(offerPastDue, "past due date");
    }
  }, [offerData]);

  return (
        <>
          <TableContainer component={Paper}>
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
                    <TableCell align="left">
                      {String(row.startDate) || "-"}
                    </TableCell>
                    <TableCell align="left">{row.endDate || "-"}</TableCell>
                    <TableCell align="left">
                      {String(row.discountPercent)}
                    </TableCell>
                    {/* <TableCell align="left">
                      {String(row.isOfferLive ? "Yes" : "No")}
                    </TableCell> */}
                    <TableCell align="left">
                      <span
                        style={{
                          color: row.isOfferLive ? "green" : "red",
                          border: "1px solid",
                          padding: "4px",
                          borderRadius: "4px",
                        }}
                      >
                        {row.isOfferLive ? "Yes" : "No"}
                      </span>
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