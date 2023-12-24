import React, { useEffect, useState } from "react";
import PageTemplate from "../../pages/reusable/PageTemplate";
import { useParams } from "react-router-dom";
import ProductsList from "../../products/ProductsList";
import {
  Button,
  Grid,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField,
  Box,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase-config"; // Import Firebase Storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage functions
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
  const [title, setTitle] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bannerImage, setBannerImage] = useState(""); // State to store banner image URL
  const [uploadedImage, setUploadedImage] = useState(null); // State to store uploaded image URL
  const [offerDescription, setOfferDescription] = useState(""); // New state for description

  const formatDate = (obj) => {
    return !isNaN(obj?.date())
      ? `${obj.year()}-${obj.month() + 1 < 10 ? "0" + (obj.month() + 1) : obj.month() + 1}-${obj.date() < 10 ? "0" + obj.date() : obj.date()}`
      : "";
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `offer-banners/${id}`);

      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setUploadedImage(downloadURL);
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    }
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
      setTitle(offerData.title);
      setBannerImage(offerData.bannerImage);
      setOfferDescription(offerData.description); // Set description from offerData
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
    if (!title) {
      Swal.fire("Validation Issue!", "Please add a Title", "error");
      return;
    }

    if (discount < 0) {
      Swal.fire("Validation Issue!", "Discount value cannot be negative", "error");
      return;
    }

    if (!endDate) {
      Swal.fire("Validation Issue!", "Please select an End Date", "error");
      return;
    }
    try {
      const updateProductPromises = selectedProducts.map(async (product) => {
        if (product.isSelected) {
          product.saleTag = id;
          product.onSale = true;
          product.saleType = "%";
          product.saleValue = discount;
          product.salePrice = getDiscountedPrice("%", product.price, discount);
        } else if (product.saleTag === id) {
          product.saleTag = "";
          product.onSale = product.realOnSale || false;
          product.saleType = product.realSaleType || "%";
          product.saleValue = product.realSaleValue || "";
          product.salePrice = product.realSalePrice || product.Price;
        }
        const prodDoc = doc(db, "Menu", product.id);
        return updateDoc(prodDoc, { ...product });
      });

      await Promise.all(updateProductPromises);

      const selectedProdIds = selectedProducts
        .filter((product) => product.isSelected)
        .map((product) => product.id);

      const currentOfferDocRef = doc(db, "Offers", id);

      await updateDoc(currentOfferDocRef, {
        title,
        bannerImage: uploadedImage || bannerImage,
        products: selectedProdIds,
        isOfferLive,
        discountPercent: discount,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        description: offerDescription,
      });

      Swal.fire("Successful", "Updated Offer Details", "success");
      setOfferData({
        ...offerData,
        title,
        bannerImage: uploadedImage || bannerImage,
        isOfferLive,
        discountPercent: discount,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        description: offerDescription,
      });

      getProductData();
    } catch (error) {
      console.error("Error saving data: ", error);
      Swal.fire("Error", "Failed to save data", "error");
    }
  };

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
            error={false}
            id="title"
            name="title"
            value={title}
            onChange={(e) => {
              if (e.target.value.length <= 15) {
                setTitle(e.target.value);
              }
            }}
            label="Title"
            size="small"
            sx={{ width: "200px" }}
            inputProps={{ maxLength: 15 }}
          />
          <Box sx={{ width: "16px" }} />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(value) => setStartDate(value)}
              className="date-picker"
              format="YYYY-MM-DD"
            />
          </LocalizationProvider>
          <span style={{ margin: '0 12px' }}></span>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              value={endDate}
              className="date-picker"
              onChange={(value) => setEndDate(value)}
              format="YYYY-MM-DD"
            />
          </LocalizationProvider>
          <span style={{ margin: '0 12px' }}></span>
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
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="upload-image"
            onChange={handleImageUpload}
          />
          <label htmlFor="upload-image">
            <Button
              variant="contained"
              component="span"
              sx={{ marginTop: "15px" }}
            >
              Change Banner Image
            </Button>
          </label>
        </Stack>
      }
    >
      <div style={{ clear: "both", width: "80%" }}>
        <TextField
          type="text"
          error={false}
          id="description"
          name="description"
          value={offerDescription}
          onChange={(e) => {
            if (e.target.value.length <= 25) {
              setOfferDescription(e.target.value);
            }
          }}
          label="Description"
          size="small"
          sx={{ width: "80%" }}
          inputProps={{ maxLength: 25 }}
        />
      </div>
      {(uploadedImage || bannerImage) && (
        <Card>
          <CardMedia
            component="img"
            alt="Offer Banner"
            style={{
              maxWidth: '120px',
              maxHeight: '120px',
              border: '1px solid #000',
              borderRadius: '4px'
            }}
            image={uploadedImage || bannerImage}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Banner Image
            </Typography>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <hr style={{ marginTop: "20px", marginBottom: "20px" }} /> {/* Divider with margin */}
          <ProductsList
            rows={selectedProducts}
            isEditOffer={true}
            handleSelectedProducts={handleSelectedProducts}
            saleValue={discount}
          />
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
