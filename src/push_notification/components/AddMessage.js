import React, { useState, useEffect } from "react";
import {
  Card,
  Grid,
  CardHeader,
  CardContent,
  TextField,
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  InputAdornment,
} from "@mui/material";
import Swal from "sweetalert2";
import { getDocs, collection, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { uploadImages } from "../../firebase_utils";
import SearchIcon from "@mui/icons-material/Search";

function AddMessage({ closeModal, isEditMode, refreshMessages, data }) {
  const [body, setBody] = useState(isEditMode ? data.body : "");
  const [title, setTitle] = useState(isEditMode ? data.title : "");
  const [type, setType] = useState(isEditMode ? data.type : "");
  const [image, setImage] = useState(null);
  const [percent, setPercent] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(
    isEditMode ? data.product : ""
  );

  const [productsData, setProductsData] = useState([]);

  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [filteredProducts, setFilteredProducts] = useState([]); // New state for filtered products

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products when search term changes
    const filtered = productsData.filter((product) =>
      `${product.name} - ${product.quantity} ${product.measureUnit}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, productsData]);


  const fetchProducts = async () => {
    const productsCollectionRef = collection(db, "Menu");
    const productsSnapshot = await getDocs(productsCollectionRef);
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProductsData(products);
  };

  const saveMessage = async (urls, selectedProductId = null) => {
    const messageData = {
      body,
      title,
      type,
      image: urls[0],
    };

    if (type === "Product") {
      messageData.product = selectedProductId;
    } else {
      messageData.product = ""; // Set product to blank if type is not Product
    }

    if (isEditMode) {
      await updateDoc(doc(db, "GlobalNotification", data.id), messageData).then(() => {
        Swal.fire("Submitted!", "Message has been updated", "success");
      });
    } else {
      await addDoc(collection(db, "GlobalNotification"), messageData).then(() => {
        Swal.fire("Submitted!", "New message has been added", "success");
      });
    }
    refreshMessages();
    closeModal();
  };

  const submitNewMessage = async () => {
    let selectedProductId = null;

    if (type === "Product") {
      const selectedProductObj = productsData.find(
        (product) => product.id === selectedProduct
      );

      if (!selectedProductObj) {
        Swal.fire("Validation Issue!", "Selected product not found", "error");
        return;
      }

      selectedProductId = selectedProduct;
    }

    const res = await uploadImages([image]);
    await saveMessage(res, selectedProductId);
  };

  const handleSubmit = () => {
    if (!title) {
      Swal.fire("Validation Issue!", "Please add a Title", "error");
    } else {
      submitNewMessage();
    }
  };

  return (
    <Card sx={{ marginTop: "25px", border: "1px solid", maxHeight: "80vh", overflow: "auto" }}>
      <CardHeader title="Push Notification Form" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              error={false}
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Title"
              size="small"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={false}
              id="body"
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              label="Body"
              size="small"
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl size="small" sx={{ minWidth: "100%" }}>
              <InputLabel htmlFor="type">Type</InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Type"
                inputProps={{
                  name: "type",
                  id: "type",
                }}
              >
                <MenuItem value="Offers">Offers</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
                <MenuItem value="Product">Product</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {type === "Product" && (
            <Grid item xs={4}>
              <FormControl size="small" sx={{ minWidth: "100%" }}>
                <InputLabel htmlFor="product">Product</InputLabel>
                <Select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  label="Product"
                  inputProps={{
                    name: "product",
                    id: "product",
                  }}
                  // Open the dropdown menu by setting the MenuProps prop
                  MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                >
                  {/* Use filteredProducts instead of productsData */}
                  {filteredProducts.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {`${product.name} - ${product.quantity} ${product.measureUnit}`}
                    </MenuItem>
                  ))}
                </Select>
                {/* Search input for filtering products */}
                <TextField
                  id="search-product"
                  label="Search Product"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12}>
            <h4>Upload Image</h4>
            <input
              type="file"
              style={{ marginTop: "10px" }}
              onChange={(e) => setImage(e.target.files[0])}
              accept="/image/*"
            />
          </Grid>
          {percent && <Grid item xs={12}>{percent}</Grid>}
          <Grid item xs={12}>
            <Typography variant="h5" align="right">
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default AddMessage;
