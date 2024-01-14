import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Typography, Box, Switch } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { collection, updateDoc, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase-config";
import Swal from "sweetalert2";
import { useAppStore } from "../appStore";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { getDiscountedPrice } from "../utils";
import SelectInput from "../components/reusable/SelectInput";
import ReactQuill from "react-quill";
import { uploadImages } from "../firebase_utils";

// import uuid from 'uuid/package.json';
const { v4: uuidv4 } = require("uuid");

export default function EditForm({ fid, closeEvent }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const empCollectionRef = collection(db, "Menu");
  const setRows = useAppStore((state) => state.setRows);
  const rows = useAppStore((state) => state.rows);
  // console.log(rows)
  const [brandName, setBrandName] = useState('')
  const [brandNameList, setBrandNameList] = useState([])
  const [percent, setPercent] = useState(0);
  const [measureUnit, setMeasureUnit] = useState("");
  const [unitList, setUnitList] = useState([])
  const [quantity, setQuantity] = useState("");
  const [onSale, setOnSale] = useState(fid.onSale);
  const [saleType, setSaleType] = useState(fid.saleType);
  const [saleTypeList, setSaleTypeList] = useState([]);
  const [saleValue, setSaleValue] = useState(fid.saleValue);
  const settingsDataRef = collection(db, "Settings");
  const [stockValue, setStockValue] = useState("");
  const [maxLimit, setMaxLimit] = useState("");
  const [purchaseRate, setPurchaseRate] = useState("");
  const [barcode, setBarcode] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [showProduct, setShowProduct] = useState(false);
  const [saleTag, setSaleTag] = useState("");
  const categoryRef = collection(db, "category");

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

  // Function to handle generating and saving the barcode
  const handleGenerateBarcode = async () => {
    // Get the last generated barcode from the database
    const lastGeneratedBarcode = await getLastGeneratedBarcode();

    // Increment the last generated barcode by 1
    const newBarcodeNumber = (parseInt(lastGeneratedBarcode) + 1).toString().padStart(6, "0");

    // Save the new barcode in the "Barcode" document with ID "Barcode"
    const barcodeRef = doc(db, "Barcode", "Barcode");

    try {
      await setDoc(barcodeRef, { code: newBarcodeNumber });
      setBarcode(newBarcodeNumber); // Update the displayed barcode
    } catch (error) {
      console.error("Error saving barcode: ", error);
    }
  };
  useEffect(() => {
    if (categoryData)
      setSubCategoryList(
        Object.keys(
          categoryData.find((i) => i.name === category)?.subCategory || {}
        )
      );
  }, [category]);
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
  useEffect(() => {
    // console.log("FID: " + fid.id);
    setName(fid.name);
    setDescription(fid.description);
    setPrice(fid.price);
    setCategory(fid.category);
    setMeasureUnit(fid.measureUnit);
    setQuantity(fid.quantity);
    setSubCategory(fid.subCategory);
    setStockValue(fid.stockValue);
    setMaxLimit(fid.maxLimit);
    setPurchaseRate(fid.purchaseRate);
    setShowProduct(fid.showProduct);
    setBrandName(fid.brandName);
    setBarcode(fid.barcode);
    setSaleTag(fid.saleTag || "");
  }, []);

  useEffect(() => {
    getSettingsData();
  }, []);
  // console.log("SELECTED _ CATEGORY ", category, subCategory)
  const getSettingsData = async () => {
    const categoryData = await getDocs(categoryRef);
    const data = await getDocs(settingsDataRef);
    let settings = data.docs.map((doc) => ({ ...doc.data() }));
    setSaleTypeList(settings[0].saleType);
    setUnitList(settings[0].unit);
    setBrandNameList(settings[0].brandNameList);
    setCategoryData(categoryData.docs.map((doc) => ({ ...doc.data() })));
  };
  const getUsers = async () => {
    const data = await getDocs(empCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  const createDoc = async () => {
    if (!name) {
      Swal.fire("Error", "Name is required field.", "error");
      return;
    }
    if (!quantity) {
      Swal.fire("Error", "Quantity is required field.", "error");
      return;
    }
    if (!price) {
      Swal.fire("Error", "Price is a required field.", "error");
      return;
    }

    if (!purchaseRate) {
      Swal.fire("Error", "Purchase Rate is a required field.", "error");
      return;
    }

    if (!stockValue) {
      Swal.fire("Error", "Stock Value is a required field.", "error");
      return;
    }
    if (onSale && (!saleValue || parseInt(saleValue, 10) <= 0)) {
      Swal.fire(
        "Failed!",
        "Please enter Sale Value for the product on sale.",
        "error"
      );
      return;
    }
    const userDoc = doc(db, "Menu", fid.id);
    const newFields = {
      // id: doc.id,
      name,
      description,
      price: Number(price),
      subCategory,
      category,
      stockValue: parseInt(stockValue),
      maxLimit,
      purchaseRate,
      barcode: barcode || "",
      showProduct,
      onSale,
      saleType,
      quantity,
      brandName,
      measureUnit,
      saleValue: onSale ? parseInt(saleValue) : 0,
      salePrice: getDiscountedPrice(saleType, Number(price), onSale ? saleValue : 0),
      saleTag,
      realSalePrice: onSale && !saleTag ? getDiscountedPrice(saleType, Number(price), onSale ? saleValue : 0) : Number(price),
      realSaleValue: onSale && !saleTag ? saleValue : 0,
      realOnSale: onSale && !saleTag ? onSale : false,
      realSaleType: onSale && !saleTag ? saleType : "",
    };
    if (parseInt(saleValue, 10) > parseInt(price, 10) || parseInt(saleValue, 10) > parseInt(purchaseRate, 10)) {
      Swal.fire(
        "Error",
        "Sale value cannot be greater than purchase rate or price.",
        "error"
      );
      return;
    }
    await updateDoc(userDoc, newFields);
    getUsers();
    closeEvent();
    Swal.fire("Submitted!", "Your file has been updated.", "success");
  };

  const saveDataWithUrl = async (url) => {
    console.log("urll", url)
    if (!name) {
      Swal.fire("Error", "Name is required field.", "error");
      return;
    }
    if (!quantity) {
      Swal.fire("Error", "Quantity is required field.", "error");
      return;
    }
    if (!price) {
      Swal.fire("Error", "Price is a required field.", "error");
      return;
    }

    if (!purchaseRate) {
      Swal.fire("Error", "Purchase Rate is a required field.", "error");
      return;
    }

    if (!stockValue) {
      Swal.fire("Error", "Stock Value is a required field.", "error");
      return;
    }
    if (onSale && (!saleValue || parseInt(saleValue, 10) <= 0)) {
      Swal.fire(
        "Failed!",
        "Please enter Sale Value for the product on sale.",
        "error"
      );
      return;
    }
    const userDoc = doc(db, "Menu", fid.id);
    const newFields = {
      // id: doc.id,
      name: name,
      description: description,
      price: Number(price),
      subCategory: subCategory,
      category: category,
      stockValue: parseInt(stockValue),
      maxLimit,
      purchaseRate,
      barcode: barcode || "",
      quantity,
      url,
      showProduct,
      onSale,
      saleType,
      brandName,
      measureUnit,
      saleValue: onSale ? parseInt(saleValue) : 0,
      salePrice: getDiscountedPrice(saleType, Number(price), onSale ? saleValue : 0),
      saleTag,
      realSalePrice: onSale && !saleTag ? getDiscountedPrice(saleType, Number(price), onSale ? saleValue : 0) : Number(price),
      realSaleValue: onSale && !saleTag ? saleValue : 0,
      realOnSale: onSale && !saleTag ? onSale : false,
      realSaleType: onSale && !saleTag ? saleType : "",
    };
    await updateDoc(userDoc, newFields);
    getUsers();
    closeEvent();
    Swal.fire("Submitted!", "Your file has been updated.", "success");
  };

  const handleUpload = async () => {
    if (!file) {
      if (parseInt(quantity, 10) < 0) {
        Swal.fire("Failed!", "Unit quantity cannot be a negative number.", "error");
        return;
      }

      // Check for negative Price values
      if (parseInt(price, 10) < 0) {
        Swal.fire("Failed!", "MRP or Price cannot be a negative number.", "error");
        return;
      }

      // Check for negative Purchase Rate values
      if (parseInt(purchaseRate, 10) < 0) {
        Swal.fire("Failed!", "Purchase Rate cannot be a negative number.", "error");
        return;
      }

      // Check for negative stock values
      if (parseInt(stockValue, 10) < 0) {
        Swal.fire("Failed!", "Product Stock Value cannot be a negative number.", "error");
        return;
      }

      // Check for negative sale values when onSale is true
      if (onSale && parseInt(saleValue, 10) < 0) {
        Swal.fire("Failed!", "Sale Value cannot be a negative number.", "error");
        return;
      }
      createDoc();
      //  else {
      //   // const name = new Date().getTime() + file.name
      //   const storageRef = ref(storage, `/images/${file.name + uuidv4()}`);

      //   // progress can be paused and resumed. It also exposes progress updates.
      //   // Receives the storage reference and the file to upload.
      //   const uploadTask = uploadBytesResumable(storageRef, file);

      //   uploadTask.on(
      //     "state_changed",
      //     (snapshot) => {
      //       const percent = Math.round(
      //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      //       );

      //       // update progress
      //       setPercent(percent);
      //     },
      //     (err) => console.log(err),
      //     () => {
      //       // download url
      //       getDownloadURL(uploadTask.snapshot.ref).then((url) => {
      //         // console.log(url);
      //         createUserWithFile(url);
      //       });
      //     }
      //   );
      // }
    } else {
      console.log(file, "fileeess")
      let urls = await uploadImages(file);
      let x = Promise.resolve(urls)
      console.log(x, "xxxxx ")
      await saveDataWithUrl(urls)
    }
  };

  const handleSaleTypeChange = (event) => {
    setSaleType(event.target.value);
  };
  const handleSaleValueChange = (event) => {
    setSaleValue(event.target.value);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };
  const handleSetQuantity = (event) => {
    setQuantity(event.target.value);
  };
  const handleChangeUnit = (event) => {
    setMeasureUnit(event.target.value);
  };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handlePicChange = (event) => {
    setFile(event.target.files);
  };

  const handleSubCategoryChange = (event) => {
    setSubCategory(event.target.value);
  };
  const handleChangeOnSale = (event) => {
    const isChecked = event.target.checked;
    setOnSale(isChecked);

    if (!isChecked) {
      setSaleValue(0);
    }
  };
  const handleChangeShowProduct = (event) => {
    setShowProduct(event.target.checked);
  };
  return (
    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      <Box sx={{ m: 2 }} />
      <Typography variant="h5" align="center">
        Edit Product
      </Typography>
      <IconButton
        style={{ position: "absolute", top: "0", right: "0" }}
        onClick={closeEvent}
      >
        <CloseIcon />
      </IconButton>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <TextField
            error={false}
            id="name"
            name="name"
            value={name}
            onChange={handleNameChange}
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
            value={price}
            onChange={handlePriceChange}
            size="small"
            sx={{ minWidth: "100%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyRupeeIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={1.5}>
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
        <Grid item xs={0.8}>
          <FormControlLabel
            control={
              <Checkbox
                checked={onSale}
                onChange={handleChangeOnSale}
                name="onSale"
              />
            }
            name="onSale"
            sx={{ minWidth: "100%" }}
            label="Sale"
          />
        </Grid>
        <Grid item xs={2.6}>
          {onSale && (
            <TextField
              error={false}
              id="saleType"
              label="SaleType"
              select
              name="saleType"
              value={saleType}
              onChange={handleSaleTypeChange}
              size="small"
              sx={{ minWidth: "100%" }}
            >
              {saleTypeList.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>
        <Grid item xs={2.6}>
          {onSale && (
            <TextField
              error={false}
              id="SaleValue"
              name="saleValue"
              type="number"
              value={saleValue}
              onChange={handleSaleValueChange}
              label="Sale Value(Discount Rate)"
              size="small"
              sx={{ minWidth: "100%" }}
            />
          )}
        </Grid>
        <Grid item xs={1.5}>
          <TextField
            error={false}
            id="measureUnit"
            label="Unit"
            select
            name="measureUnit"
            value={measureUnit}
            onChange={handleChangeUnit}
            size="small"
            sx={{ minWidth: "100%" }}
          >
            {unitList.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={2}>
          <TextField
            error={false}
            id="quantity"
            label="Quantity"
            type="number"
            name="quantity"
            value={quantity}
            onChange={handleSetQuantity}
            size="small"
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={2}>
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
            error={false}
            id="barcode"
            label="Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            size="small"
            sx={{ minWidth: "100%" }}
          />
          <Button
            variant="contained"
            onClick={handleGenerateBarcode} // Call the barcode generation function here
            sx={{ marginTop: 1 }}
          >
            Generate Barcode
          </Button>
        </Grid>
        <Grid item xs={2}>
          <TextField
            error={false}
            id="maxLimit"
            label="Max Limit On Product"
            type="number"
            name="maxLimit"
            value={maxLimit}
            onChange={(e) => setMaxLimit(e.target.value)}
            size="small"
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            error={false}
            id="category"
            label="Category"
            select
            value={category}
            onChange={handleCategoryChange}
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
        <Grid item xs={3}>
          <TextField
            error={false}
            id="subCategory"
            label="Sub Category"
            select
            value={subCategory}
            onChange={handleSubCategoryChange}
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
        <Grid item xs={3}>
          <SelectInput
            id="brandName"
            label={'Brand Name'}
            size={'small'}
            sx={{ minWidth: '100%' }}
            data={brandNameList}
            value={brandName}
            onChange={e => setBrandName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <input type="file" multiple onChange={handlePicChange} accept="/image/*" />
          <p>{percent}% completed</p>
        </Grid>
        <Grid item xs={12}>
          <ReactQuill value={description} onChange={handleDescriptionChange} />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={showProduct}
                onChange={handleChangeShowProduct}
                name="showProduct"
              />
            }
            name="showProduct"
            sx={{ minWidth: "100%" }}
            label="Show Product"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            <Button variant="contained" onClick={handleUpload}>
              Submit
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}
