import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, MenuItem } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

const VariantPopup = ({ open, handleClose }) => {
  const [variantData, setVariantData] = useState({
    variantName: "",
    selectedProduct: "",
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from Firestore
    const fetchProducts = async () => {
      const menuRef = collection(db, "Menu");
      const menuSnapshot = await getDocs(menuRef);
      const productData = menuSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setProducts(productData);
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVariantData({
      ...variantData,
      [name]: value,
    });
  };

  const handleAddVariant = () => {
    // Add logic here to handle the addition of the variant
    // You can use the 'variantData' state to access the data
    // and perform the necessary actions.
    // Remember to call 'handleClose' to close the modal after adding the variant.
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...styles }}>
        <h2>Add Variant</h2>
        <TextField
          label="Variant Name"
          variant="outlined"
          name="variantName"
          value={variantData.variantName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Product Name"
          variant="outlined"
          name="selectedProduct"
          select
          fullWidth
          margin="normal"
          value={variantData.selectedProduct}
          onChange={handleInputChange}
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.name}>
              {product.name}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleAddVariant}>
          Add Variant
        </Button>
      </Box>
    </Modal>
  );
};

const styles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  textAlign: "center",
};

export default VariantPopup;
