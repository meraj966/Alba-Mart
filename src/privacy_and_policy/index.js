import React, { useContext, useEffect, useState } from "react";
import { Stack, Typography, Button, Box, Modal } from "@mui/material";
import AddPrivacyAndPolicy from "./components/AddPrivacyAndPolicy";
import PrivacyAndPolicyList from "../privacy_and_policy/components/PrivacyAndPolicyList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";
import Swal from "sweetalert2";
import { AppContext } from "../context";
import {
  CONTROL_ADD_PRIVACY_SETTINGS,
  userHasAccessToKey,
} from "../authentication/utils";

function PrivacyAndPolicy() {
  const { userInfo } = useContext(AppContext);
  const [addPrivacyAndPolicy, setPrivacyAndPolicy] = useState(false);
  const handleOpen = () => setPrivacyAndPolicy(true);
  const handleClose = () => setPrivacyAndPolicy(false);
  const [privacyAndPolicyModalData, setPrivacyAndPolicyModalData] =
    useState(null);
  const [openInEditMode, setOpenInEditMode] = useState(false);
  const [privacyAndPolicyData, setPrivacyAndPolicyData] = useState([]);
  const ref = collection(db, "PrivacyAndPolicy");

  useEffect(() => {
    getPrivacyAndPolicyData();
  }, []);

  const getPrivacyAndPolicyData = async () => {
    const data = await getDocs(ref);
    setPrivacyAndPolicyData(
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
      setPrivacyAndPolicyData(
        privacyAndPolicyData.filter((row) => row.id !== id)
      );
      Swal.fire("Deleted!", "Your entry has been deleted.", "success");
    }
  };

  const modal = () => (
    <Modal
      onClose={() => setPrivacyAndPolicy(false)}
      open={addPrivacyAndPolicy}
    >
      <Box sx={{ width: "50%", margin: "0 auto", top: "50%" }}>
        <AddPrivacyAndPolicy
          closeModal={() => setPrivacyAndPolicy(false)}
          isEditMode={openInEditMode}
          data={privacyAndPolicyModalData}
          refreshPrivacyAndPolicy={getPrivacyAndPolicyData}
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
        {userHasAccessToKey(userInfo, CONTROL_ADD_PRIVACY_SETTINGS) ? (
          <Button
            variant="contained"
            endIcon={<AddCircleIcon />}
            onClick={() => {
              handleOpen();
              setOpenInEditMode(false);
            }}
          >
            Add Privacy & Policy
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
        title={"Privacy And Policy"}
      >
        <PrivacyAndPolicyList
          openModal={(row) => {
            setOpenInEditMode(true);
            setPrivacyAndPolicyModalData(row);
            handleOpen();
          }}
          privacyAndPolicyData={privacyAndPolicyData}
          handleDelete={handleDelete}
        />
      </PageTemplate>
    </>
  );
}

export default PrivacyAndPolicy;
