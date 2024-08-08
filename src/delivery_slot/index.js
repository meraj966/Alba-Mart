import React, { useContext, useEffect, useState } from "react";
import { Stack, Typography, Button, Box, Modal } from "@mui/material";
import AddNewDeliverySlot from "../delivery_slot/components/AddNewDeliverySlot";
import DeliverySlotList from "../delivery_slot/components/DeliverySlotList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";
import Swal from "sweetalert2";
import {
  CONTROL_ADD_DELIVERY_SLOT,
  userHasAccessToKey,
} from "../authentication/utils";
import { AppContext } from "../context";

function DeliverySlots() {
  const { userInfo } = useContext(AppContext);
  const [addNewDeliverySlot, setAddNewDeliverySlot] = useState(false);
  const handleOpen = () => setAddNewDeliverySlot(true);
  const handleClose = () => setAddNewDeliverySlot(false);
  const [deliveryModalData, setDeliveryModalData] = useState(null);
  const [openInEditMode, setOpenInEditMode] = useState(false);
  const [deliveryslotData, setDeliverySlotData] = useState([]);
  const ref = collection(db, "DeliverySlot");

  useEffect(() => {
    getDeliverySlotData();
  }, []);

  const getDeliverySlotData = async () => {
    const data = await getDocs(ref);
    setDeliverySlotData(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
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
      await deleteDoc(doc(ref, id));
      setDeliverySlotData(deliveryslotData.filter((row) => row.id !== id));
      Swal.fire("Deleted!", "Your delivery slot has been deleted.", "success");
    }
  };

  const modal = () => (
    <Modal
      onClose={() => setAddNewDeliverySlot(false)}
      open={addNewDeliverySlot}
    >
      <Box sx={{ width: "50%", margin: "0 auto", top: "50%" }}>
        <AddNewDeliverySlot
          closeModal={() => setAddNewDeliverySlot(false)}
          isEditMode={openInEditMode}
          data={deliveryModalData}
          refreshDeliverySlot={getDeliverySlotData}
          handleClose={handleClose}
        />
      </Box>
    </Modal>
  );

  const actionBar = () => (
    <>
      <Stack direction="row" spacing={2} className="my-2 mb-2">
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        {userHasAccessToKey(userInfo, CONTROL_ADD_DELIVERY_SLOT) ? (
          <Button
            variant="contained"
            endIcon={<AddCircleIcon />}
            onClick={() => {
              handleOpen();
              setOpenInEditMode(false);
            }}
          >
            Add Delivery Slot
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
        title={"Delivery Slots"}
      >
        <DeliverySlotList
          openModal={(row) => {
            setOpenInEditMode(true);
            setDeliveryModalData(row);
            handleOpen();
          }}
          deliveryslotData={deliveryslotData}
          handleDelete={handleDelete}
        />
      </PageTemplate>
    </>
  );
}

export default DeliverySlots;
