import React, { useState } from "react";
import {
  Modal,
} from "@mui/material";
import AddNewOffer from "../offers/components/AddNewOffer";
import OfferList from "../offers/components/OfferList";
import PageTemplate from "../pages/reusable/PageTemplate";

function OfferSettings() {
  const [addNewOffer, setAddNewOffer] = useState(false);

  return (
    <>
      <PageTemplate
        modal={
          <Modal onClose={() => setAddNewOffer(false)} open={addNewOffer}>
            <AddNewOffer />
          </Modal>
        }
        title={"Offer Settings"}
      >
        <OfferList/>
      </PageTemplate>
    </>
  );
}

export default OfferSettings;
