import React, { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import {
  Button,
  Modal,
  Typography,
  Paper,
  Divider,
  Box,
  Stack,
  AutoComplete,
  Skeleton,
  TextField,
} from "@mui/material";
import AddNewOffer from "../offers/AddNewOffer";
import OfferList from "../offers/OfferList";

function OfferSettings() {
  const [addNewOffer, setAddNewOffer] = useState(false);

  return (
    <>
      <Modal onClose={() => setAddNewOffer(false)} open={addNewOffer}>
        <AddNewOffer />
      </Modal>
      <div className="bgcolor">
        <Navbar />
        <Box height={70} />
        <Box sx={{ display: "flex" }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <OfferList/>
          </Box>
        </Box>
      </div>
    </>
  );
}

export default OfferSettings;
