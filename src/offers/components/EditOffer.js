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
  Box,
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
import { getDiscountedPrice } from "../../utils";

function EditOffer() {
  const { id } = useParams();
  const [offerData, setOfferData] = useState([]);
  const productsRef = collection(db, "Menu");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isOfferLive, setIsOfferLive] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const formatDate = (obj) => {
    return !isNaN(obj?.date())
      ? `${obj.year()}-${obj.month() + 1 < 10 ? "0" + (obj.month() + 1) : obj.month() + 1}-${obj.date() < 10 ? "0" + obj.date() : obj.date()}`
      : "";
  };

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
    products = products.filter((i) => ["", id].includes(i.saleTag));
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
      let product = newProds[i];
      if (product.isSelected) {
        product["saleTag"] = id;
        product["onSale"] = product.isSelected;
        product["saleType"] = "%";
        product["saleValue"] = discount;
        product["salePrice"] = getDiscountedPrice(
          "%",
          product["price"],
          discount
        );
      } else {
        if (product.saleTag === id) {
          product["saleTag"] = "";
          product["onSale"] = false;
          product["saleType"] = "%";
          product["saleValue"] = "";
          product["salePrice"] = "";
        }
      }
      const prodDoc = doc(db, "Menu", product["id"]);
      await updateDoc(prodDoc, { ...product });
      if (product.isSelected) selectedProdIds.push(product["id"]);
      delete product.isSelected;
    }
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

  const filteredProducts = selectedProducts.filter((product) => {
    const productName = product.name.toLowerCase();
    const search = searchQuery.toLowerCase();
    return productName.includes(search);
  });

  return (
    <PageTemplate
      title={`Edit Offer | ${offerData?.title}`}
      subTitle={
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
          className="my-4 mb-4"
        >
          <TextField
            type="text"
            id="search"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            label="Search by Product Name"
            size="small"
            sx={{ width: "250px" }}
          />
          <Box sx={{ width: "16px" }} /> {/* Add space between search bar and title */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(value) => setStartDate(value)}
              className="date-picker"
              format="YYYY-MM-DD"
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              value={endDate}
              className="date-picker"
              onChange={(value) => setEndDate(value)}
              format="YYYY-MM-DD"
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
            sx={{ width: "100px" }}
          />
          <FormGroup>
            <FormControlLabel
              label="Is offer Live"
              control={
                <Switch
                  checked={isOfferLive}
                  onChange={(e) => setIsOfferLive(e.target.checked)}
                />
              }
            />
          </FormGroup>
        </Stack>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {filteredProducts.length ? (
            <ProductsList
              rows={filteredProducts}
              isEditOffer={true}
              handleSelectedProducts={handleSelectedProducts}
              saleValue={discount}
            />
          ) : null}
        </Grid>
        <Grid item xs={12}>
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
      </Grid>
    </PageTemplate>
  );
}

export default EditOffer;
