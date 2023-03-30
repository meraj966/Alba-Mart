import React, { useState } from "react";
import { Modal, Stack, Typography, Button } from "@mui/material";
import AddNewPromoCode from "../promo_codes/components/AddNewPromoCode";
import PromoCodeList from "../promo_codes/components/PromoCodeList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function PromoCodes() {
  const [addNewPromoCode, setAddNewPromoCode] = useState(false);
  const modal = () => (
    <Modal onClose={() => setAddNewPromoCode(false)} open={addNewPromoCode}>
      <AddNewPromoCode />
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
        <PromoCodeList />
      </PageTemplate>
    </>
  );
}

export default PromoCodes;
