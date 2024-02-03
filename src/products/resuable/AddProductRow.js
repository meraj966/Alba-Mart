import React, { useEffect, useState, useRef } from "react";
import { CurrencyRupee } from "@mui/icons-material";
import { Grid, InputAdornment, TextField, Switch, Button } from "@mui/material";
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
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { uuidv4 } from "@firebase/util";
import { uploadImages } from "../../firebase_utils";
import { getDiscountedPrice } from "../../utils";
import SelectInput from "../../components/reusable/SelectInput";
import ReactQuill from "react-quill";
import BarcodeScanner from "./BarcodeScanner";
import FormHelperText from '@mui/material/FormHelperText'; // Import FormHelperText

function AddProductRow({
  saveDone,
  setSaveDone,
  products,
  setProducts,
  index,
  save,
  setSave,
}) {
  const [settings, setSettings] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const dataRef = collection(db, "Settings");
  const categoryRef = collection(db, "category");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxLimit, setMaxLimit] = useState("");
  const [purchaseRate, setPurchaseRate] = useState("");
  const [price, setPrice] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brandNameList, setBrandNameList] = useState([]);
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
  const [saleTag, setSaleTag] = useState(""); // Added saleTag state

  const [barcode, setBarcode] = useState(""); // State to store scanned barcode
  const [lastGeneratedBarcode, setLastGeneratedBarcode] = useState(0);
  const [barcodeError, setBarcodeError] = useState("");
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);

  const checkExistingBarcode = async (enteredBarcode) => {
    const menuRef = collection(db, "Menu");
    const barcodeQuery = query(menuRef, where("barcode", "==", enteredBarcode));

    try {
      const querySnapshot = await getDocs(barcodeQuery);
      return querySnapshot.size > 0;
    } catch (error) {
      console.error("Error checking existing barcode: ", error);
      return false;
    }
  };

  const handleBarcodeChange = async (enteredBarcode) => {
    setBarcodeError(""); // Reset error when barcode changes
    setBarcode(enteredBarcode);

    // Check if the entered barcode already exists
    const exists = await checkExistingBarcode(enteredBarcode);
    if (exists) {
      // Barcode already exists, handle this case, e.g., show an error message
      setBarcodeError("This is an existing Barcode. Please enter a unique barcode.");
      setIsSaveDisabled(true); // Disable save button
    } else {
      setIsSaveDisabled(false); // Enable save button if barcode is unique
    }
  };

  const handleBarcodeScanned = (scannedBarcode) => {
    setBarcode(scannedBarcode);
  };

  // Function to get the last generated barcode from the database
  const getLastGeneratedBarcode = async () => {
    const barcodeRef = doc(db, "Barcode", "Barcode");

    try {
      const barcodeDoc = await getDoc(barcodeRef);
      if (barcodeDoc.exists()) {
        return barcodeDoc.data().code || 0;
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error getting last generated barcode: ", error);
      return 0;
    }
  };

  const handleGenerateBarcode = async () => {
    const lastGeneratedBarcode = await getLastGeneratedBarcode();
    const newBarcodeNumber = (parseInt(lastGeneratedBarcode) + 1).toString().padStart(6, "0");
    const barcodeRef = doc(db, "Barcode", "Barcode");
    try {
      await setDoc(barcodeRef, { code: newBarcodeNumber });
      setBarcode(newBarcodeNumber);
    } catch (error) {
      console.error("Error saving barcode: ", error);
    }
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const saveRowData = async (url) => {
    const menuRef = collection(db, "Menu");
    const realSalePrice = onSale && !saleTag ? getDiscountedPrice(saleType, price, saleValue) : price;
    const realSaleValue = onSale && !saleTag ? saleValue : 0;
    const realOnSale = onSale && !saleTag ? onSale : false;
    const realSaleType = onSale && !saleTag ? saleType : "";

    const docData = await addDoc(menuRef, {
      name,
      description,
      price: Number(price),
      onSale,
      saleType,
      saleValue: onSale ? parseInt(saleValue) : 0,
      category,
      subCategory,
      measureUnit,
      quantity,
      stockValue: parseInt(stockValue),
      maxLimit,
      purchaseRate,
      url,
      showProduct,
      saleTag: "",
      date: String(new Date()),
      salePrice: getDiscountedPrice(saleType, price, saleValue),
      realSalePrice: parseInt(realSalePrice),
      realSaleValue: parseInt(realSaleValue),
      realOnSale,
      realSaleType,
      brandName,
      barcode: barcode,
    });
    const id = docData.id;
    await updateDoc(doc(db, "Menu", id), { id }).then(delete products[index]);
  };

  const handleSave = async () => {
    if (!name) {
      alert("Name is a mandatory field. Please fill it before saving.");
      return;
    }

    if (!quantity) {
      alert("quantity is a mandatory field. Please fill it before saving.");
      return;
    }
    let urls = await uploadImages(files);
    await saveRowData(urls).then(() => {
      setSaveDone([...saveDone, "SAVED"]);
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
      setBrandName(data.defaultBrandName)
      setMeasureUnitList(data.unit);
      setBrandNameList(data.brandNameList);
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
      price: Number(price),
      onSale,
      saleType,
      saleValue: onSale ? parseInt(saleValue) : 0,
      category,
      subCategory,
      measureUnit,
      quantity,
      files,
      saleTag: "",
      showProduct,
      brandName,
      salePrice: getDiscountedPrice(saleType, price, saleValue),
      realSalePrice: onSale && !saleTag ? getDiscountedPrice(saleType, price, saleValue) : price,
      realSaleValue: onSale && !saleTag ? saleValue : 0,
      realOnSale: onSale && !saleTag ? onSale : false,
      realSaleType: onSale && !saleTag ? saleType : "",
      purchaseRate,
      stockValue: parseInt(stockValue),
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
    brandName,
    showProduct,
    purchaseRate,
    stockValue,
  ]);

  return (
    <div>
      <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />
      <Grid container direction="row" spacing={0.8}>
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
        <Grid item xs={1.5}>
          <TextField
            error={false}
            id="price"
            label="Price(MRP)"
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
        <Grid item xs={2}>
          <TextField
            error={false}
            id="purchaseRate"
            label="Purchase Rate"
            type="number"
            name="purchaseRate"
            value={purchaseRate}
            onChange={(e) => setPurchaseRate(e.target.value)}
            size="small"
            sx={{ minWidth: "100%" }}
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
            <SelectInput
              id="saleType"
              label="SaleType"
              name="saleType"
              value={saleType}
              onChange={(e) => setSaleType(e.target.value)}
              size="small"
              sx={{ minWidth: "100%" }}
              data={saleTypeList}
            />
          )}
        </Grid>
        <Grid item xs={2.5}>
          {onSale && (
            <TextField
              error={false}
              id="SaleValue"
              name="saleValue"
              type="number"
              value={saleValue}
              onChange={(e) => setSaleValue(e.target.value)}
              label="Sale Value(Discount Rate)"
              size="small"
              sx={{ minWidth: "100%" }}
            />
          )}
        </Grid>
        <Grid item xs={1.5}>
          <SelectInput
            id="measureUnit"
            label="Unit"
            name="measureUnit"
            value={measureUnit}
            onChange={(e) => setMeasureUnit(e.target.value)}
            data={measureUnitList}
            size="small"
            sx={{ minWidth: "100%" }}
          />
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
          <TextField
            error={Boolean(barcodeError)}
            id="barcode"
            label="Barcode"
            value={barcode}
            onChange={(e) => handleBarcodeChange(e.target.value)}
            size="small"
            sx={{ minWidth: "100%" }}
          />
          {barcodeError && (
            <FormHelperText error>{barcodeError}</FormHelperText>
          )}
          {!barcode && (
            <Button
              variant="contained"
              onClick={handleGenerateBarcode}
              sx={{ marginTop: 1 }}
            >
              Generate Barcode
            </Button>
          )}
        </Grid>
        <Grid item xs={2}>
          <TextField
            error={false}
            id="maxLimit"
            label="Max Limit On product"
            type="number"
            name="maxLimit"
            value={maxLimit}
            onChange={(e) => setMaxLimit(e.target.value)}
            size="small"
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={3}>
          <SelectInput
            id="category"
            label="Category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            size="small"
            sx={{ minWidth: "100%" }}
            data={categoryList}
          />
        </Grid>
        <Grid item xs={3}>
          <SelectInput
            id="subCategory"
            label="Sub Category"
            size="small"
            name="subCategory"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            sx={{ minWidth: "100%" }}
            data={subCategoryList}
          />
        </Grid>
        <Grid item xs={3}>
          <SelectInput
            id="brandName"
            label="Brand Name"
            size="small"
            sx={{ minWidth: "100%" }}
            name="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            data={brandNameList}
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
        <Grid item xs={12}>
          <ReactQuill value={description} onChange={handleDescriptionChange} />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
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
      </Grid>
    </div>
  );
}

export default AddProductRow;
