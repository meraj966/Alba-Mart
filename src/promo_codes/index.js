import React, { useEffect, useState } from "react";
import { Stack, Typography, Button, Box, Modal, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import AddNewPromoCode from "../promo_codes/components/AddNewPromoCode";
import PromoCodeList from "../promo_codes/components/PromoCodeList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";

function PromoCodes() {
  const [addNewPromoCode, setAddNewPromoCode] = useState(false);
  const handleOpen = () => setAddNewPromoCode(true);
  const handleClose = () => setAddNewPromoCode(false);
  const [promoCodeModalData, setPromoCodeModalData] = useState(null);
  const [openInEditMode, setOpenInEditMode] = useState(false);
  const [promocodeData, setPromoCodeData] = useState([]);
  const ref = collection(db, "PromoCode");
  const [filterValue, setFilterValue] = useState(""); // State for filter value

  useEffect(() => {
    getPromoCodeData();
    // Check and update promo code status when the component mounts
    checkAndUpdatePromoCodeStatus();
  }, []);

  const getPromoCodeData = async () => {
    const data = await getDocs(ref);
    setPromoCodeData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(ref, id));
    setPromoCodeData(promocodeData.filter((row) => row.id !== id));
  };

  const checkAndUpdatePromoCodeStatus = async () => {
    // Get the current date
    const currentDate = new Date();

    // Loop through promo codes
    for (const promoCode of promocodeData) {
      // Convert endDate from a string to a Date object
      const endDate = new Date(promoCode.endDate);

      // Check if the endDate has passed
      if (endDate < currentDate && promoCode.discountStatus) {
        // Update discountStatus to false in the database
        const promoCodeRef = doc(ref, promoCode.id);
        await updateDoc(promoCodeRef, { discountStatus: false });

        // Update the promoCodeData in state to reflect the change
        setPromoCodeData((prevData) =>
          prevData.map((item) =>
            item.id === promoCode.id
              ? { ...item, discountStatus: false }
              : item
          )
        );
      }
    }
  };

  const handleFilterChange = (event) => {
    // Set the selected filter value
    setFilterValue(event.target.value);
  };

  // Filter the table data based on the selected filter value
  const filteredPromoCodeData = filterValue
    ? promocodeData.filter(
        (row) =>
          (filterValue === "Active" && row.discountStatus === true) ||
          (filterValue === "Deactive" && row.discountStatus === false)
      )
    : promocodeData;

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
        <FormControl variant="outlined" sx={{ minWidth: "250px" }}>
          <InputLabel id="filter-label">Filter By PromoCode Status</InputLabel>
          <Select
            labelId="filter-label"
            id="filter"
            value={filterValue}
            label="Filter By PromoCode Status"
            onChange={handleFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Deactive">Deactive</MenuItem>
          </Select>
        </FormControl>
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
          promocodeData={filteredPromoCodeData} // Pass filtered data to PromoCodeList
          handleDelete={handleDelete}
        />
      </PageTemplate>
    </>
  );
}

export default PromoCodes;
