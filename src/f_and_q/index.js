import React, { useEffect, useState } from "react";
import { Stack, Typography, Button, Box, Modal } from "@mui/material";
import AddNewFAndQ from "./components/AddNewFAndQ";
import FAndQList from "../f_and_q/components/FAndQList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";

function FAndQ() {
  const [addNewFAndQ, setAddNewFAndQ] = useState(false);
  const handleOpen = () => setAddNewFAndQ(true);
  const handleClose = () => setAddNewFAndQ(false);
  const [fAndQModalData, setFAndQModalData] = useState(null);
  const [openInEditMode, setOpenInEditMode] = useState(false);
  const [fAndQData, setFAndQData] = useState([]);
  const ref = collection(db, "FAndQ");

  useEffect(() => {
    getFAndQData();
  }, []);

  const getFAndQData = async () => {
    const data = await getDocs(ref);
    setFAndQData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(ref, id));
    setFAndQData(fAndQData.filter((row) => row.id !== id));
  };

  const modal = () => (
    <Modal onClose={() => setAddNewFAndQ(false)} open={addNewFAndQ}>
      <Box sx={{ width: "50%", margin: "0 auto", top: "50%" }}>
        <AddNewFAndQ
          closeModal={() => setAddNewFAndQ(false)}
          isEditMode={openInEditMode}
          data={fAndQModalData}
          refreshFAndQ={getFAndQData}
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
          Add F & Q
        </Button>
      </Stack>
    </>
  );
  return (
    <>
      <PageTemplate
        modal={modal()}
        actionBar={actionBar()}
        title={"F And Q"}
      >
        <FAndQList
          openModal={(row) => {
            setOpenInEditMode(true);
            setFAndQModalData(row);
            handleOpen();
          }}
          fAndQData={fAndQData}
          handleDelete={handleDelete}
        />
      </PageTemplate>
    </>
  );
}

export default FAndQ;
