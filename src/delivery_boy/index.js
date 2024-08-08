import React, { useContext, useEffect, useState } from "react";
import { Stack, Typography, Button, Modal, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import AddNewDeliveryBoy from "../delivery_boy/components/AddNewDeliveryBoy";
import DeliveryBoyList from "../delivery_boy/components/DeliveryBoyList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Autocomplete from "@mui/material/Autocomplete";
import { db } from "../firebase-config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import { AppContext } from "../context";
import {
  CONTROL_ADD_DELIVERY_BOY,
  userHasAccessToKey,
} from "../authentication/utils";

function DeliveryBoys() {
  const { userInfo } = useContext(AppContext);
  const [addNewDeliveryBoy, setAddNewDeliveryBoy] = useState(false);
  const [deliveryBoyModalData, setDeliveryBoyModalData] = useState(null);
  const [openInEditMode, setOpenInEditMode] = useState(false);
  const [deliveryboyData, setDeliveryBoyData] = useState([]);
  const [searchPhoneNumber, setSearchPhoneNumber] = useState(""); // Added state for search

  const deliveryBoyCollectionRef = collection(db, "DeliveryBoy");

  useEffect(() => {
    getBoys();
  }, []);

  const getBoys = async () => {
    const data = await getDocs(deliveryBoyCollectionRef);
    setDeliveryBoyData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleDelete = async (id) => {
    // Show the confirmation dialog using Swal.fire with custom button styles
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#1976d2", // Blue color for "Yes, delete it!"
      cancelButtonColor: "#ff5722", // Red color for "Cancel"
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(deliveryBoyCollectionRef, id));
      setDeliveryBoyData(deliveryboyData.filter((row) => row.id !== id));
      Swal.fire("Deleted!", "Your delivery boy has been deleted.", "success");
    }
  };

  const handleOpen = () => setAddNewDeliveryBoy(true);
  const handleClose = () => setAddNewDeliveryBoy(false);

  const modal = () => (
    <Modal onClose={() => setAddNewDeliveryBoy(false)} open={addNewDeliveryBoy}>
      <Box sx={{ width: "50%", margin: "0 auto", top: "50%" }}>
        <AddNewDeliveryBoy
          closeModal={() => setAddNewDeliveryBoy(false)}
          isEditMode={openInEditMode}
          data={deliveryBoyModalData}
          refreshDeliveryBoys={getBoys}
          handleClose={handleClose}
        />
      </Box>
    </Modal>
  );

  const actionBar = () => (
    <>
      <Stack direction="row" spacing={2} className="my-2 mb-2">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={deliveryboyData.map((row) => row.phoneNumber)}
          sx={{ width: 300 }}
          value={searchPhoneNumber}
          onChange={(e, v) => setSearchPhoneNumber(v)}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Search by Phone Number"
            />
          )}
        />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        {userHasAccessToKey(userInfo, CONTROL_ADD_DELIVERY_BOY) ? (
          <Button
            variant="contained"
            endIcon={<AddCircleIcon />}
            onClick={() => {
              handleOpen();
              setOpenInEditMode(false);
            }}
          >
            Add Delivery Boy
          </Button>
        ) : null}
      </Stack>
    </>
  );

  return (
    <>
      <PageTemplate
        modal={modal()}
        actionBar={actionBar()}
        title={"Delivery Boys List"}
      >
        <DeliveryBoyList
          openModal={(row) => {
            setOpenInEditMode(true);
            setDeliveryBoyModalData(row);
            handleOpen();
          }}
          deliveryboyData={
            searchPhoneNumber
              ? deliveryboyData.filter((row) =>
                  row.phoneNumber.includes(searchPhoneNumber)
                )
              : deliveryboyData // Show all list when search is empty
          }
          handleDelete={handleDelete}
        />
      </PageTemplate>
    </>
  );
}

export default DeliveryBoys;
