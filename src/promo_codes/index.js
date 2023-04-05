import React, { useState } from "react";
import { Stack, Typography, Button } from "@mui/material";
import AddNewPromoCode from "../promo_codes/components/AddNewPromoCode";
import PromoCodeList from "../promo_codes/components/PromoCodeList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function PromoCodes() {
  const [addNewPromoCode, setAddNewPromoCode] = useState(false);
  const handleOpen = () => setAddNewPromoCode(true);
  const handleClose = () => setAddNewPromoCode(false);

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
      <PageTemplate actionBar={actionBar()} title={"Promo Codes"}>
        <PromoCodeList />
      </PageTemplate>
      {addNewPromoCode && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
            border: "1px solid #000",
            zIndex: "999",
            overflowY: "scroll",
            maxHeight: "80vh", // set a maximum height to prevent the pop-up from taking up the entire screen
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleClose}>X</button>
          </div>
          <AddNewPromoCode />
        </div>
      )}
    </>
  );
}

export default PromoCodes;
