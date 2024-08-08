import React, { useContext, useEffect, useState } from "react";
import { Stack, Typography, Button, Box, Modal } from "@mui/material";
import AddContactDetails from "./components/AddContactDetails";
import ContactDetailsList from "../contact_us/components/ContactDetailsList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";
import { AppContext } from "../context";
import { CONTROL_ADD_CONTACT_DETAILS, userHasAccessToKey } from "../authentication/utils";

function ContactDetails() {
  const {userInfo} = useContext(AppContext);
  const [addContactDetails, setContactdetails] = useState(false);
  const handleOpen = () => setContactdetails(true);
  const handleClose = () => setContactdetails(false);
  const [contactDetailsModalData, setContactDetailsModalData] = useState(null);
  const [openInEditMode, setOpenInEditMode] = useState(false);
  const [contactDetailsData, setContactDetailsData] = useState([]);
  const ref = collection(db, "ContactUs");

  useEffect(() => {
    getContactDetailsData();
  }, []);

  const getContactDetailsData = async () => {
    const data = await getDocs(ref);
    setContactDetailsData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(ref, id));
    setContactDetailsData(contactDetailsData.filter((row) => row.id !== id));
  };

  const modal = () => (
    <Modal onClose={() => setContactdetails(false)} open={addContactDetails}>
      <Box sx={{ width: "50%", margin: "0 auto", top: "50%" }}>
        <AddContactDetails
          closeModal={() => setContactdetails(false)}
          isEditMode={openInEditMode}
          data={contactDetailsModalData}
          refreshContactDetails={getContactDetailsData}
          handleClose={handleClose}
        />
      </Box>
    </Modal>
  );

  const actionBar = () => (
    <>
      <Stack direction="row" spacing={2} className="my-2 mb-2">
        {/* must have some filters */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        {userHasAccessToKey(userInfo, CONTROL_ADD_CONTACT_DETAILS) ? 
        <Button
          variant="contained"
          endIcon={<AddCircleIcon />}
          onClick={() => {
            handleOpen();
            setOpenInEditMode(false);
          }}
        >
          Add Contact Details
        </Button>:null}
      </Stack>
    </>
  );
  return (
    <>
      <PageTemplate
        modal={modal()}
        actionBar={actionBar()}
        title={"Contact Details"}
      >
        <ContactDetailsList
          openModal={(row) => {
            setOpenInEditMode(true);
            setContactDetailsModalData(row);
            handleOpen();
          }}
          contactDetailsData={contactDetailsData}
          handleDelete={handleDelete}
        />
      </PageTemplate>
    </>
  );
}

export default ContactDetails;
