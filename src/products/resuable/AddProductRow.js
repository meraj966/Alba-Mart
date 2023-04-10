import React, { useEffect, useState } from "react";
import { CurrencyRupee } from "@mui/icons-material";
import { Grid, InputAdornment, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { uuidv4 } from "@firebase/util";
import { uploadImages } from "../../firebase_utils";

function AddProductRow({ saveDone, setSaveDone, products, setProducts, index, save, setSave }) {
  const [settings, setSettings] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const dataRef = collection(db, "Settings");
  const categoryRef = collection(db, "category");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [saleType, setSaleType] = useState("");
  const [saleTypeList, setSaleTypeList] = useState([]);
  const [saleValue, setSaleValue] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [files, setFiles] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [stockValue, setStockValue] = useState("");
  const [measureUnit, setMeasureUnit] = useState("");
  const [measureUnitList, setMeasureUnitList] = useState([]);

  const [category, setCategory] = useState("");
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const saveRowData = async (url) => {
    const menuRef = collection(db, "Menu");
    const docData = await addDoc(menuRef, {
      name,
      description,
      price,
      onSale,
      saleType,
      saleValue,
      category,
      subCategory,
      measureUnit,
      quantity,
      stockValue,
      url,
      showProduct,
      date: String(new Date()),
    });
    const id = docData.id;
    await updateDoc(doc(db, "Menu", id), { id }).then(
      delete products[index]
    );
  };

  const handleSave = async () => {
    let urls = await uploadImages(files);
    await saveRowData(urls).then(()=> {
      setSaveDone([...saveDone, "SAVED"])
      setSave(false);
    });
  };
  useEffect(() => {
    if (save) handleSave();
  }, [save]);

  useEffect(() => {
    getSettingsData();
  }, []);

  useEffect(() => {
    if (categoryData)
      setSubCategoryList(
        Object.keys(
          categoryData.find((i) => i.name === category)?.subCategory || {}
        )
      );
  }, [category]);

  useEffect(() => {
    if (settings) {
      let data = settings[0];
      setOnSale(data.onSale);
      setSaleType(data.defaultSaleType);
      setSaleTypeList(data.saleType);
      setMeasureUnit(data.defaultUnit);
      setCategory(data.defaultCategory);
      setMeasureUnitList(data.unit);
    }
  }, [settings]);

  useEffect(() => {
    if (categoryData) {
      setCategoryList(categoryData.map((i) => i.name));
      setSubCategoryList(
        Object.keys(
          categoryData.find((i) => i.name === category)?.subCategory || {}
        )
      );
    }
  }, [categoryData]);

  const getSettingsData = async () => {
    const data = await getDocs(dataRef);
    const categoryData = await getDocs(categoryRef);
    setCategoryData(categoryData.docs.map((doc) => ({ ...doc.data() })));
    setSettings(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    let rowData = {
      name,
      description,
      price,
      onSale,
      saleType,
      saleValue,
      category,
      subCategory,
      measureUnit,
      quantity,
      files,
      saleTag: '',
      showProduct
    };
    setProducts({ ...products, [index]: rowData });
  }, [
    name,
    description,
    price,
    onSale,
    saleType,
    saleValue,
    category,
    subCategory,
    measureUnit,
    quantity,
    files,
    showProduct
  ]);

  return (
    <Grid container direction="row" spacing={0.8}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={showProduct}
              onChange={(e) => setShowProduct(e.target.checked)}
              name="showProduct"
            />
          }
          name="showProduct"
          sx={{ minWidth: "100%" }}
          label="Show Product"
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          error={false}
          id="name"
          name="name"
          multiline
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Name"
          size="small"
          sx={{ minWidth: "100%" }}
        />
      </Grid>
      <Grid item xs={3.2}>
        <TextField
          error={false}
          multiline
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Description"
          size="small"
          sx={{ minWidth: "100%" }}
        />
      </Grid>
      <Grid item xs={1.5}>
        <TextField
          error={false}
          id="price"
          label="Price"
          type="number"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          size="small"
          sx={{ minWidth: "100%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CurrencyRupee />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={0.7}>
        <FormControlLabel
          control={
            <Checkbox
              checked={onSale}
              onChange={(e) => setOnSale(e.target.checked)}
              name="onSale"
            />
          }
          name="onSale"
          sx={{ minWidth: "100%" }}
          label="Sale"
        />
      </Grid>
      <Grid item xs={1.6}>
        {onSale && (
          <TextField
            error={false}
            id="saleType"
            label="SaleType"
            select
            name="saleType"
            value={saleType}
            onChange={(e) => setSaleType(e.target.value)}
            size="small"
            sx={{ minWidth: "100%" }}
          >
            {saleTypeList?.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Grid>
      <Grid item xs={2}>
        {onSale && (
          <TextField
            error={false}
            id="SaleValue"
            name="saleValue"
            type="number"
            value={saleValue}
            onChange={(e) => setSaleValue(e.target.value)}
            label="Sale Value"
            size="small"
            sx={{ minWidth: "100%" }}
          />
        )}
      </Grid>
      <Grid item xs={2.5}>
        <TextField
          error={false}
          id="category"
          label="Category"
          select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          size="small"
          sx={{ minWidth: "100%" }}
        >
          {categoryList?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={2.5}>
        <TextField
          error={false}
          id="subCategory"
          label="Sub Category"
          select
          name="subCategory"
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          size="small"
          sx={{ minWidth: "100%" }}
        >
          {subCategoryList?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={1.5}>
        <TextField
          error={false}
          id="measureUnit"
          label="Unit"
          select
          name="measureUnit"
          value={measureUnit}
          onChange={(e) => setMeasureUnit(e.target.value)}
          size="small"
          sx={{ minWidth: "100%" }}
        >
          {measureUnitList?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={1.5}>
        <TextField
          error={false}
          id="quantity"
          label="Quantity"
          type="number"
          name="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          size="small"
          sx={{ minWidth: "100%" }}
        />
      </Grid>
      <Grid item xs={1.5}>
        <TextField
          error={false}
          id="stockValue"
          label="Stock Value"
          type="number"
          name="stockValue"
          value={stockValue}
          onChange={(e) => setStockValue(e.target.value)}
          size="small"
          sx={{ minWidth: "100%" }}
        />
      </Grid>
      <Grid item xs={3}>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          accept="/image/*"
          name="file"
          style={{ marginTop: "10px" }}
        />
      </Grid>
    </Grid>
  );
}

export default AddProductRow;
