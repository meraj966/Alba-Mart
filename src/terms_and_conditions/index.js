import React, { useEffect, useState } from "react";
import { Stack, Typography, Button, Box, Modal } from "@mui/material";
import AddTermsAndConditions from "./components/AddTermsAndConditions";
import TermsAndConditionsList from "../terms_and_conditions/components/TermsAndConditionsList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";

function TermsAndConditions() {
  const [addTermsAndConditions, setAddTermsAndConditions] = useState(false);
  const handleOpen = () => setAddTermsAndConditions(true);
  const handleClose = () => setAddTermsAndConditions(false);
  const [termsAndConditionsModalData, setTermsAndConditionsModalData] = useState(null);
  const [openInEditMode, setOpenInEditMode] = useState(false);
  const [termsAndConditionsData, setTermsAndConditionsData] = useState([]);
  const ref = collection(db, "TermsAndConditions");

  useEffect(() => {
    getTermsAndConditionsData();
  }, []);

  const getTermsAndConditionsData = async () => {
    const data = await getDocs(ref);
    setTermsAndConditionsData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(ref, id));
    setTermsAndConditionsData(termsAndConditionsData.filter((row) => row.id !== id));
  };

  const modal = () => (
    <Modal onClose={() => setAddTermsAndConditions(false)} open={addTermsAndConditions}>
      <Box sx={{ width: "50%", margin: "0 auto", top: "50%" }}>
        <AddTermsAndConditions
          closeModal={() => setAddTermsAndConditions(false)}
          isEditMode={openInEditMode}
          data={termsAndConditionsModalData}
          refreshTermsAndConditions={getTermsAndConditionsData}
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
        <Button
          variant="contained"
          endIcon={<AddCircleIcon />}
          onClick={() => {
            handleOpen();
            setOpenInEditMode(false);
          }}
        >
          Add Term & Condition
        </Button>
      </Stack>
    </>
  );
  return (
    <>
      <PageTemplate
        modal={modal()}
        actionBar={actionBar()}
        title={"Promo Codes"}
      >
        <TermsAndConditionsList
          openModal={(row) => {
            setOpenInEditMode(true);
            setTermsAndConditionsModalData(row);
            handleOpen();
          }}
          termsAndConditionsData={termsAndConditionsData}
          handleDelete={handleDelete}
        />
      </PageTemplate>
    </>
  );
}

export default TermsAndConditions;
