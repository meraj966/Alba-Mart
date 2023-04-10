import React, { useEffect, useState } from "react";
import PageTemplate from "../../pages/reusable/PageTemplate";
import { useParams } from "react-router-dom";
import ProductsList from "../../products/ProductsList";
import { useAppStore } from "../../appStore";
import {
  Button,
  Grid,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import Swal from "sweetalert2";
import { Stack } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function EditOffer() {
  const { id } = useParams();
  const [offerData, setOfferData] = useState([]);
  const productsRef = collection(db, "Menu");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isOfferLive, setIsOfferLive] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const formatDate = (obj) => {
    return obj ? `${obj.month() + 1}/${obj.date()}/${obj.year()}` : "";
  };
  console.log(selectedProducts);
  useEffect(() => {
    getOfferData();
    getProductData();
  }, []);

  useEffect(() => {
    if (offerData) {
      setIsOfferLive(offerData.isOfferLive);
      setDiscount(offerData.discountPercent);
      setStartDate(dayjs(offerData.startDate));
      setEndDate(dayjs(offerData.endDate));
    }
  }, [offerData]);

  const getOfferData = async () => {
    const offerData = await getDoc(doc(db, "Offers", id));
    setOfferData(offerData.data());
  };

  const getProductData = async () => {
    const data = await getDocs(productsRef);
    let products = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    products = products.filter(i=>['', id].includes(i.saleTag));
    products.map((prod) => (prod.isSelected = prod.saleTag === id));
    setSelectedProducts(products);
  };

  const handleSelectedProducts = (products) => {
    setSelectedProducts(products);
  };

  const save = async () => {
    let newProds = [...selectedProducts];
    let selectedProdIds = [];
    const currentOffer = doc(db, "Offers", id);
    for (let i = 0; i < newProds.length; i++) {
      newProds[i]["saleTag"] = newProds[i].isSelected ? id : "";
      const prodDoc = doc(db, "Menu", newProds[i]["id"]);
      await updateDoc(prodDoc, { ...newProds[i] });
      if (newProds[i].isSelected) selectedProdIds.push(newProds[i]["id"]);
      delete newProds[i].isSelected;
    }
    console.log(selectedProdIds, "selectedproda");
    await updateDoc(currentOffer, {
      products: selectedProdIds,
      isOfferLive,
      discountPercent: discount,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    }).then(() => {
      Swal.fire("Successful", "Updated Offer Details", "success");
    });
    getProductData();
  };
  return (
    <PageTemplate
      title={`Edit Offer | ${offerData?.title}`}
      subTitle={
        <Stack
          direction={"row"}
          sx={{ float: "right" }}
          spacing={1}
          className="my-4 mb-4"
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(value) => setStartDate(value)}
              className="date-picker"
              format="DD/MM/YYYY"
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              value={endDate}
              className="date-picker"
              onChange={(value) => setEndDate(value)}
              format="DD/MM/YYYY"
            />
          </LocalizationProvider>
          <TextField
            type="number"
            error={false}
            id="discount"
            name="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            label="Discount"
            size="small"
          />
          <FormGroup>
            <FormControlLabel
              label={"Is offer Live"}
              control={
                <Switch
                  checked={isOfferLive}
                  onChange={(e) => setIsOfferLive(e.target.checked)}
                />
              }
            ></FormControlLabel>
          </FormGroup>
        </Stack>
      }
    >
      <Grid spacing={2}>
        <Grid item xs={12}>
          {selectedProducts.length ? (
            <ProductsList
              rows={selectedProducts}
              isEditOffer={true}
              handleSelectedProducts={handleSelectedProducts}
            />
          ) : null}
        </Grid>
        <Typography variant="h5" align="right">
          <Button
            sx={{ marginTop: "5px" }}
            disabled={selectedProducts.length === 0}
            onClick={save}
            type="submit"
            variant="contained"
          >
            Save
          </Button>
        </Typography>
      </Grid>
    </PageTemplate>
  );
}

export default EditOffer;
