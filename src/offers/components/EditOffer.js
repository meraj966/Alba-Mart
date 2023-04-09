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
function EditOffer() {
  const { id } = useParams();
  const [offerData, setOfferData] = useState([]);
  const productsRef = collection(db, "Menu");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isOfferLive, setIsOfferLive] = useState(false);
  const [discount, setDiscount] = useState(0);
    console.log(selectedProducts,)
  useEffect(() => {
    getOfferData();
    getProductData();
  }, []);

  useEffect(() => {
    setIsOfferLive(offerData.isOfferLive);
    setDiscount(offerData.discountPercent)
  }, [offerData]);
  const getOfferData = async () => {
    const offerData = await getDoc(doc(db, "Offers", id));
    setOfferData(offerData.data());
  };

  const getProductData = async () => {
    const data = await getDocs(productsRef);
    const products = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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
      selectedProdIds.push(newProds[i]["id"]);
      delete newProds[i].isSelected;
    }
    console.log(selectedProdIds, "selectedproda");
    await updateDoc(currentOffer, {
      products: selectedProdIds,
      isOfferLive,
      discountPercent: discount
    }).then(() => {
      Swal.fire("Successful", "Updated Offer Details", "success");
    });
    getProductData();
  };
  return (
    <PageTemplate
      title={`Edit Offer | ${offerData?.title}`}
      subTitle={
        <Stack direction={"row"} sx={{float:'right'}} spacing={2} className="my-2 mb-2">
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
