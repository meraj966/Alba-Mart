import React, { useState } from "react";
import { Stack, Typography, Button, Box, Modal } from "@mui/material";
import AddNewPromoCode from "../promo_codes/components/AddNewPromoCode";
import PromoCodeList from "../promo_codes/components/PromoCodeList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function PromoCodes() {
  const [addNewPromoCode, setAddNewPromoCode] = useState(false);
  const handleOpen = () => setAddNewPromoCode(true);
  const handleClose = () => setAddNewPromoCode(false);
  const [promoCodeModalData, setPromoCodeModalData] = useState(null)

  const modal = () => (
        <Modal onClose={() => setAddNewPromoCode(false)} open={addNewPromoCode}>
          <Box sx={{ width: '50%', margin: '0 auto', top: '50%' }}>
            <AddNewPromoCode closeModal={()=>setAddNewPromoCode(false)} data={promoCodeModalData} />
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
          onClick={handleOpen}
        >
          Add Promo Code
        </Button>
      </Stack>
    </>
  );
  return (
    <>
      <PageTemplate modal={modal()} actionBar={actionBar()} title={"Promo Codes"}>
        <PromoCodeList openModal={(row)=> {setPromoCodeModalData(row)
        handleOpen()}}/>
      </PageTemplate>

    </>
  );
}

export default PromoCodes;
