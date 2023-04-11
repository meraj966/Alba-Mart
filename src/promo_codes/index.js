import React, { useEffect, useState } from "react";
import { Stack, Typography, Button, Box, Modal } from "@mui/material";
import AddNewPromoCode from "../promo_codes/components/AddNewPromoCode";
import PromoCodeList from "../promo_codes/components/PromoCodeList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";

function PromoCodes() {
  const [addNewPromoCode, setAddNewPromoCode] = useState(false);
  const handleOpen = () => setAddNewPromoCode(true);
  const handleClose = () => setAddNewPromoCode(false);
  const [promoCodeModalData, setPromoCodeModalData] = useState(null);
  const [openInEditMode, setOpenInEditMode] = useState(false);
  const [promocodeData, setPromoCodeData] = useState([]);
  const ref = collection(db, "PromoCode");

  useEffect(() => {
    getPromoCodeData();
  }, []);

  const getPromoCodeData = async () => {
    const data = await getDocs(ref);
    setPromoCodeData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(ref, id));
    setPromoCodeData(promocodeData.filter((row) => row.id !== id));
  };

  const modal = () => (
    <Modal onClose={() => setAddNewPromoCode(false)} open={addNewPromoCode}>
      <Box sx={{ width: "50%", margin: "0 auto", top: "50%" }}>
        <AddNewPromoCode
          closeModal={() => setAddNewPromoCode(false)}
          isEditMode={openInEditMode}
          data={promoCodeModalData}
          refreshPromoCodes={getPromoCodeData}
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
          Add Promo Code
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
        <PromoCodeList
          openModal={(row) => {
            setOpenInEditMode(true);
            setPromoCodeModalData(row);
            handleOpen();
          }}
          promocodeData={promocodeData}
          handleDelete={handleDelete}
        />
      </PageTemplate>
    </>
  );
}

export default PromoCodes;
