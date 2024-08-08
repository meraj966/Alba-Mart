import React, { useContext, useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Button,
  Box,
  Modal,
  TextField,
} from "@mui/material";
import AddVariant from "./components/AddVarient";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";
import VarientList from "./components/VarientList";
import Swal from "sweetalert2";
import {
  CONTROL_ADD_VARIANT,
  userHasAccessToKey,
} from "../authentication/utils";
import { AppContext } from "../context";

function Varient() {
  const { userInfo } = useContext(AppContext);
  const [addVarient, setVarient] = useState(false);
  const handleOpen = () => setVarient(true);
  const handleClose = () => setVarient(false);
  const [varientModalData, setVarientModalData] = useState(null);
  const [openInEditMode, setOpenInEditMode] = useState(false);
  const [varientData, setVarientData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const ref = collection(db, "Variant");

  useEffect(() => {
    getVarientData();
  }, []);

  const getVarientData = async () => {
    const data = await getDocs(ref);
    setVarientData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this! Kindly remove products from variant before delete it !!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#ff5722",
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(ref, id));
      setVarientData(varientData.filter((row) => row.id !== id));
      Swal.fire("Deleted!", "Your variant has been deleted.", "success");
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredVarientData = varientData.filter((variant) =>
    variant.variantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const modal = () => (
    <Modal onClose={() => setVarient(false)} open={addVarient}>
      <Box sx={{ width: "50%", margin: "0 auto", top: "50%" }}>
        <AddVariant
          closeModal={() => setVarient(false)}
          isEditMode={openInEditMode}
          data={varientModalData}
          refreshVarient={getVarientData}
          handleClose={handleClose}
        />
      </Box>
    </Modal>
  );

  const actionBar = () => (
    <>
      <Stack direction="row" spacing={2} className="my-2 mb-2">
        {/* Add search bar */}
        <TextField
          label="Search Variant"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
        />
        {userHasAccessToKey(userInfo, CONTROL_ADD_VARIANT) ? (
          <Button
            variant="contained"
            endIcon={<AddCircleIcon />}
            onClick={() => {
              handleOpen();
              setOpenInEditMode(false);
            }}
          >
            Add Variant
          </Button>
        ) : null}
      </Stack>
    </>
  );
  return (
    <>
      <PageTemplate modal={modal()} actionBar={actionBar()} title={"Variant"}>
        <VarientList
          openModal={(row) => {
            setOpenInEditMode(true);
            setVarientModalData(row);
            handleOpen();
          }}
          varientData={filteredVarientData}
          handleDelete={handleDelete}
        />
      </PageTemplate>
    </>
  );
}

export default Varient;
