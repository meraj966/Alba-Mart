import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Typography, Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { collection, updateDoc, getDocs, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase-config";
import Swal from "sweetalert2";
import { useAppStore } from "../appStore";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { getDiscountedPrice } from "../utils";
import SelectInput from "../components/reusable/SelectInput";
import ReactQuill from "react-quill";

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
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [showProduct, setShowProduct] = useState(false);
  const categoryRef = collection(db, "category");
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
    setShowProduct(fid.showProduct);
    setBrandName(fid.brandName)
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
    setUnitList(settings[0].unit)
    setBrandNameList(settings[0].brandNameList)
    setCategoryData(categoryData.docs.map((doc) => ({ ...doc.data() })));
  };
  const getUsers = async () => {
    const data = await getDocs(empCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  const createUser = async () => {
    const userDoc = doc(db, "Menu", fid.id);
    const newFields = {
      // id: doc.id,
      name,
      description,
      price: Number(price),
      subCategory,
      category,
      stockValue: parseInt(stockValue),
      showProduct,
      saleValue: parseInt(saleValue),
      onSale,
      saleType,
      quantity,
      brandName,
      salePrice: getDiscountedPrice(saleType, Number(price), saleValue),
    };
    await updateDoc(userDoc, newFields);
    getUsers();
    closeEvent();
    Swal.fire("Submitted!", "Your file has been updated.", "success");
  };

  const createUserWithFile = async (url) => {
    const userDoc = doc(db, "Menu", fid.id);
    const newFields = {
      id: doc.id,
      name: name,
      description: description,
      price: Number(price),
      subCategory: subCategory,
      category: category,
      stockValue: parseInt(stockValue),
      quantity,
      file: url,
      showProduct,
      saleValue: parseInt(saleValue),
      onSale,
      saleType,
      brandName,
      salePrice: getDiscountedPrice(saleType, Number(price), saleValue),
    };
    await updateDoc(userDoc, newFields);
    getUsers();
    closeEvent();
    Swal.fire("Submitted!", "Your file has been updated.", "success");
  };

  const handleUpload = () => {
    if (!file) {
      createUser();
    } else {
      // const name = new Date().getTime() + file.name
      const storageRef = ref(storage, `/images/${file.name + uuidv4()}`);

      // progress can be paused and resumed. It also exposes progress updates.
      // Receives the storage reference and the file to upload.
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            // console.log(url);
            createUserWithFile(url);
          });
        }
      );
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
    setFile(event.target.files[0]);
  };

  const handleSubCategoryChange = (event) => {
    setSubCategory(event.target.value);
  };
  const handleChangeOnSale = (event) => {
    setOnSale(event.target.checked);
  };
  const handleChangeShowProduct = (event) => {
    setShowProduct(event.target.checked);
  };
  return (
    <div>
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
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <TextField
            error={false}
            id="price"
            label="Price"
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
              label="Sale Value"
              size="small"
              sx={{ minWidth: "100%" }}
            />
          )}
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
        <Grid item xs={3}>
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
        <Grid item xs={3}>
          <TextField
            error={false}
            id="stockValue"
            label="Stock Value"
            type="stockValue"
            name="stockValue"
            value={stockValue}
            onChange={(e) => setStockValue(e.target.value)}
            size="small"
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <input type="file" onChange={handlePicChange} accept="/image/*" />
          <p>{percent}% completed</p>
        </Grid>
        <Grid item xs={12}>
          <ReactQuill value={description} onChange={handleDescriptionChange} />
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
