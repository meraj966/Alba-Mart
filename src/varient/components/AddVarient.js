import React, { useState, useEffect } from "react";
import {
  Card,
  Grid,
  CardHeader,
  CardContent,
  TextField,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import Swal from "sweetalert2";
import { db } from "../../firebase-config";
import { collection, doc, updateDoc, setDoc, deleteDoc, getDocs, writeBatch, getDoc } from "firebase/firestore";

function AddVariant({ closeModal, isEditMode, refreshVarient, data }) {
  const [variantName, setVariantName] = useState(isEditMode ? data.variantName : "");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(isEditMode ? data.products : []);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "Menu"));
      const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      let displayedProducts = [];
      if (isEditMode) {
        displayedProducts = productsList;
      } else {
        displayedProducts = productsList.filter(product => !product.variantName);
      }

      setProducts(displayedProducts);
    };

    fetchProducts();
  }, [isEditMode]);

  const handleCheckboxChange = (event, productId) => {
    if (event.target.checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedData = {
      variantName: variantName.trim(),
      products: selectedProducts,
    };
  
    try {
      const batch = writeBatch(db);
  
      if (!isEditMode) {
        // Check if the variant name already exists when adding a new variant
        const variantRef = doc(db, "Variant", variantName);
        const variantDoc = await getDoc(variantRef);
  
        // Check if the variant name already exists
        if (variantDoc.exists()) {
          Swal.fire("Error!", "Variant name already exists. Kindly change the variant name.", "error");
          return;
        }
      }
  
      if (isEditMode) {
        // Update or delete old variant data
        if (variantName !== data.variantName) {
          await deleteDoc(doc(db, 'Variant', data.id));
          await setDoc(doc(collection(db, "Variant"), variantName), updatedData);
        } else {
          await updateDoc(doc(db, 'Variant', data.id), updatedData);
        }
  
        // Update variantName in the "Menu" collection for selected products
        selectedProducts.forEach(productId => {
          const productRef = doc(db, "Menu", productId);
          batch.update(productRef, { variantName });
        });
  
        // Remove variantName from previously selected products that are now deselected
        data.products.forEach(productId => {
          if (!selectedProducts.includes(productId)) {
            const productRef = doc(db, "Menu", productId);
            batch.update(productRef, { variantName: null });
          }
        });
  
        await batch.commit();
        Swal.fire("Submitted!", "Variant has been updated", "success");
      } else {
        // Add new variant data
        await setDoc(doc(collection(db, "Variant"), variantName), updatedData);
  
        // Update variantName in the "Menu" collection for selected products
        selectedProducts.forEach(productId => {
          const productRef = doc(db, "Menu", productId);
          batch.update(productRef, { variantName });
        });
  
        await batch.commit();
        Swal.fire("Submitted!", "New Variant has been added", "success");
      }
  
      refreshVarient();
      closeModal();
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
  };    

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reorder products to display checked ones on top
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const isSelectedA = selectedProducts.includes(a.id);
    const isSelectedB = selectedProducts.includes(b.id);

    // If both are checked or unchecked, maintain the current order
    if (isSelectedA === isSelectedB) {
      return 0;
    }

    // If A is checked and B is unchecked, A should come first
    if (isSelectedA && !isSelectedB) {
      return -1;
    }

    // If A is unchecked and B is checked, B should come first
    return 1;
  });

  return (
    <Card sx={{ marginTop: "25px", border: "1px solid", maxHeight: "80vh", overflow: "auto" }}>
      <CardHeader title="Variant Form" />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                id="variantName"
                name="variantName"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                label="Variant Name"
                size="small"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="search"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                label="Search Products"
                size="small"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Select Products</Typography>
              <FormGroup>
                {sortedProducts.map(product => (
                  <FormControlLabel
                    key={product.id}
                    control={
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => handleCheckboxChange(e, product.id)}
                      />
                    }
                    label={product.name + ' - ' + `(${product.quantity} ${product.measureUnit})`}
                  />
                ))}
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" align="right">
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}

export default AddVariant;
