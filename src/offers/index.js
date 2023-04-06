import React, { useState } from "react";
import { Modal, Stack, Typography, Button } from "@mui/material";
import OfferList from "../offers/components/OfferList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { BOX_STYLE } from "../pages/reusable/Styles";
import { Box } from "@mui/system";
import AddNewOffer from "./components/AddNewOffer";

function OfferSettings() {
  const [addNewOffer, setAddNewOffer] = useState(false);
  const modal = () => (
    <Modal onClose={() => setAddNewOffer(false)} open={addNewOffer}>
      <Box sx={{ width: '50%', margin: '0 auto', top: '50%' }}>
        <AddNewOffer />
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
          onClick={() => setAddNewOffer(true)}
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
