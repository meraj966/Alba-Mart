import React, { useState } from "react";
import { Modal, Stack, Typography, Button } from "@mui/material";
import AddNewOffer from "../offers/components/AddNewOffer";
import OfferList from "../offers/components/OfferList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function OfferSettings() {
  const [addNewOffer, setAddNewOffer] = useState(false);
  const modal = () => (
    <Modal onClose={() => setAddNewOffer(false)} open={addNewOffer}>
      <AddNewOffer />
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
          Add Offer
        </Button>
      </Stack>
    </>
  );
  return (
    <>
      <PageTemplate
        modal={modal()}
        actionBar={actionBar()}
        title={"Offer Settings"}
      >
        <OfferList />
      </PageTemplate>
    </>
  );
}

export default OfferSettings;
