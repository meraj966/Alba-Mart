import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Stack,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import OfferList from "../offers/components/OfferList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { BOX_STYLE } from "../pages/reusable/Styles";
import { Box } from "@mui/system";
import { collection, getDocs } from "firebase/firestore";
import AddNewOffer from "./components/AddNewOffer";
import { db } from "../firebase-config";
import { AppContext } from "../context";
import { CONTROL_ADD_OFFER, userHasAccessToKey } from "../authentication/utils";

function OfferSettings() {
  const { userInfo } = useContext(AppContext);
  const [offerData, setOfferData] = useState([]);
  const [addNewOffer, setAddNewOffer] = useState(false);
  const ref = collection(db, "Offers");

  useEffect(() => {
    getOfferData();
  }, []);

  const getOfferData = async () => {
    const data = await getDocs(ref);
    setOfferData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const modal = () => (
    <Modal onClose={() => setAddNewOffer(false)} open={addNewOffer}>
      <Box sx={{ width: "50%", margin: "0 auto", top: "50%" }}>
        <AddNewOffer
          closeModal={() => setAddNewOffer(false)}
          getOfferData={getOfferData}
        />
      </Box>
    </Modal>
  );
  const actionBar = () => (
    <>
      <Stack direction="row" spacing={2} className="my-2 mb-2">
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        {userHasAccessToKey(userInfo, CONTROL_ADD_OFFER) ? (
          <Button
            variant="contained"
            endIcon={<AddCircleIcon />}
            onClick={() => setAddNewOffer(true)}
          >
            Add Offer
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
        title={"Offer Settings"}
      >
        <OfferList offerData={offerData} getOfferData={getOfferData} />
      </PageTemplate>
    </>
  );
}

export default OfferSettings;
