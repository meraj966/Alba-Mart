import Sidenav from "../components/Sidenav";
import { Box, Typography } from "@mui/material";
import "../Dash.css";
import { db } from "../firebase-config";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { BRAND_NAME, CATEGORY, SUBCATEGORY } from "../Constants";
import Swal from "sweetalert2";
import CategoryEditForm from "../products/settings_forms/CategoryEditForm";
import Tooltip from "@mui/material/Tooltip";
import { AddCircle } from "@mui/icons-material";
import { BOX_STYLE } from "./reusable/Styles";
import PageTemplate from "./reusable/PageTemplate";
import SelectInput from "../components/reusable/SelectInput";
import SettingsEditForm from "../products/settings_forms";
import TextFieldBulkAdd from "../components/reusable/TextFieldBulkAdd";
import Image from "../components/reusable/Image";
import { saveSubCategoryImage, uploadImageAndSaveUrl } from "../firebase_utils";
import { union } from "lodash";

export default function Settings() {
  const [onSale, setOnSale] = useState(false);
  const [unit, setUnit] = useState(false);
  const [unitList, setUnitList] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [defaultBrandName, setDefaultBrandName] = useState("");
  const [brandNameList, setBrandNameList] = useState([]);
  const [saleType, setSaleType] = useState("");
  const [saleTypeList, setSaleTypeList] = useState([]);
  const [category, setCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [subCategory, setSubCategory] = useState("");
  const [subCategoryList, setSubCategoryList] = useState([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editType, setEditType] = useState("");
  const [type, setType] = useState("edit");

  const dataRef = collection(db, "Settings");
  const categoryDataRef = collection(db, "category");

  const [settings, setSettings] = useState(null);
  const [categoryData, setCategoryData] = useState(null);

  const [isBulkAdd, setIsBulkAdd] = useState(false);

  const [file, setFile] = useState(null);

  useEffect(() => {
    if (settings) {
      console.log("SETTINGS=>", settings);
      const data = settings[0];
      setOnSale(data.onSale);
      setUnit(data.defaultUnit);
      setUnitList(data.unit);
      setDefaultBrandName(data.defaultBrandName);
      setBrandNameList(data.brandNameList);
      setSaleType(data.defaultSaleType);
      setSaleTypeList(data.saleType);
      setCategory(data.defaultCategory);
    }
  }, [settings]);
  useEffect(() => {
    if (categoryData) {
      console.log("CATEGORY =>", categoryData);
      setCategoryList(categoryData.map((i) => i.name));
      setSubCategoryList(
        Object.keys(
          categoryData.find((i) => i.name === category)?.subCategory || {}
        )
      );
    }
  }, [categoryData]);

  useEffect(() => {
    if (category && categoryData)
      setSubCategoryList(
        Object.keys(
          categoryData.find((i) => i.name === category)?.subCategory || {}
        )
      );
  }, [category]);

  useEffect(() => {
    getDataFromFirestore();
  }, []);

  async function getDataFromFirestore() {
    const data = await getDocs(dataRef);
    const categoryData = await getDocs(categoryDataRef);
    setSettings(data.docs.map((doc) => ({ ...doc.data() })));
    setCategoryData(categoryData.docs.map((doc) => ({ ...doc.data() })));
  }

  const handleSubmit = async () => {
    const settingsDoc = doc(db, "Settings", "UserSettings");
    const newFields = {
      defaultCategory: category,
      defaultSaleType: saleType,
      defaultUnit: unit,
      defaultBrandName,
      onSale,
    };
    await updateDoc(settingsDoc, newFields);
    getDataFromFirestore();
    Swal.fire(
      "Updated!",
      "Your changes to default settings have been made.",
      "success"
    );
  };

  const handleEditForm = (editType, type) => {
    if (editType === SUBCATEGORY) {
      if (!subCategory) return;
    }
    setType(type);
    setEditType(editType);
    setEditOpen(!editOpen);
  };

  const handleBulkAddChange = (e) => {
    if (e.target.name === "brandName") setBrandName(e.target.value);
    if (e.target.value.includes(",")) setIsBulkAdd(true);
    else setIsBulkAdd(false);
  };

  const closeSettingsForm = () => {
    handleEditForm("", "edit");
    setIsBulkAdd(false);
  };

  const getImageUrl = () =>
    categoryData.find((i) => i.name === category).subCategory[subCategory]
      .imageUrl;

  const saveSubCategoryImage = async (url) => {
    let payload = { [subCategory]: { imageUrl: url } };
    let subCategoryData = {
      ...categoryData.find((i) => i.name === category).subCategory,
      ...payload,
    };
    const categoryDoc = doc(db, "category", category);
    await updateDoc(categoryDoc, { subCategory: subCategoryData }).then(() => {
      Swal.fire("Submitted!", "Your file has been submitted.", "success");
    });
    await getDataFromFirestore();
    setFile(null);
    handleEditForm("", "edit");
  };

  const handleCategorySave = async () => {
    if (!file) Swal.fire("Failed!", "Please upload an image first!", "error");
    else {
      uploadImageAndSaveUrl(file, saveSubCategoryImage);
    }
  };

  const handleBrandNameSave = async () => {
    const brandNames = brandName.split(",").map((i) => i.trim());
    let brandNameList = settings[0]?.brandNameList
      ? [...brandNames, ...settings[0]?.brandNameList]
      : [...brandNames];
    const settingsDoc = doc(db, "Settings", "UserSettings");
    await updateDoc(settingsDoc, { brandNameList }).then(() => {
      getDataFromFirestore();
      Swal.fire(
        "Updated!",
        "You have successfully added Brands to your list",
        "success"
      );
      setEditOpen(!editOpen);
      setBrandName('')
      isBulkAdd(false)
    });
  };

  return (
    <>
      <PageTemplate
        title="Settings"
        modal={
          <Modal
            open={editOpen}
            // onClose={handleEditClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            onClose={() => handleEditForm("", "edit")}
          >
            <Box sx={BOX_STYLE} className="editForm">
              {editType === CATEGORY && (
                <CategoryEditForm
                  closeForm={() => setEditOpen(!editOpen)}
                  formType={type}
                  handleEditForm={handleEditForm}
                  selectedCategory={category}
                  settingsData={settings}
                  refreshSettingsData={getDataFromFirestore}
                  subCategoryList={subCategoryList}
                  categoryData={categoryData}
                />
              )}
              {editType === SUBCATEGORY && (
                <SettingsEditForm
                  title="Edit SubCategory"
                  subTitle={`Sub Category - ${subCategory}`}
                  onSave={handleCategorySave}
                  submitButtonText={"SAVE"}
                  onClose={closeSettingsForm}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Image url={getImageUrl()} alt="Category Image" />
                    </Grid>
                    <Grid item xs={12}>
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </Grid>
                  </Grid>
                </SettingsEditForm>
              )}
              {editType === BRAND_NAME && (
                <SettingsEditForm
                  title={"Add Brand Name"}
                  onClose={closeSettingsForm}
                  submitButtonText={"SAVE"}
                  onSave={handleBrandNameSave}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} />
                    <Grid item xs={12}>
                      <TextFieldBulkAdd
                        id="brandName"
                        name="brandName"
                        value={brandName}
                        onChange={handleBulkAddChange}
                        label={"Brand Name"}
                        size="small"
                        placeholder={`Add brand name for eg., "Dove"`}
                        sx={{ minWidth: "100%" }}
                        isBulkAdd={isBulkAdd}
                        bulkAddAlert={
                          "Tip: By adding commas, you can add multiple brands in bulk. For e.g., Dove, Loreal, Wow, Mamaearth"
                        }
                      />
                    </Grid>
                  </Grid>
                </SettingsEditForm>
              )}
            </Box>
          </Modal>
        }
      >
        <Grid container spacing={2}>
          <Grid item xs={12}></Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <TextField
              error={false}
              id="category"
              name="category"
              label="Set Default Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size="small"
              select
              sx={{ minWidth: "100%" }}
            >
              {categoryList?.map((option) => {
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
          <Grid item>
            <Tooltip title="Edit current category">
              <IconButton
                aria-label="edit"
                onClick={() => handleEditForm(CATEGORY, "edit")}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Add Categories">
              <IconButton onClick={() => handleEditForm(CATEGORY, "add")}>
                <AddCircle />
              </IconButton>
            </Tooltip>
          </Grid>
          {/* SUB CATEGORY */}
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <TextField
              error={false}
              id="subCategory"
              name="subCategory"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              label="Sub Category"
              size="small"
              select
              sx={{ marginTop: "30px", minWidth: "100%" }}
            >
              {subCategoryList?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <Tooltip
              title="Select sub-category"
              sx={{ marginTop: "30px", minWidth: "100%" }}
            >
              <IconButton
                aria-label="edit"
                onClick={() => handleEditForm(SUBCATEGORY, "edit")}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          {/* SALE TYPE */}
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <TextField
              error={false}
              id="saleType"
              name="saleType"
              value={saleType}
              onChange={(e) => setSaleType(e.target.value)}
              label="Sale Type"
              size="small"
              select
              sx={{ marginTop: "30px", minWidth: "100%" }}
            >
              {saleTypeList?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={2}></Grid>
          {/* Unit */}
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <TextField
              id="unit"
              name="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              label="Unit"
              size="small"
              select
              sx={{ marginTop: "30px", minWidth: "100%" }}
            >
              {unitList.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <SelectInput
              id="brandName"
              label="Brand Name"
              size="small"
              sx={{ marginTop: "30px", minWidth: "100%" }}
              name="brandName"
              value={defaultBrandName}
              onChange={(e) => setDefaultBrandName(e.target.value)}
              data={brandNameList}
            />
          </Grid>
          <Grid item>
            <Tooltip title="Add Brand Name">
              <IconButton
                aria-label="edit"
                onClick={() => handleEditForm(BRAND_NAME, "edit")}
                sx={{ marginTop: "30px" }}
              >
                 <AddCircle />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
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
              label="Default On Sale"
            />
          </Grid>
          <Grid item xs={2}></Grid>
          {/* SUBMIT BUTTON */}
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <Typography variant="h5" align="right">
              <Button
                variant="contained"
                style={{ width: "200px", align: "right" }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </PageTemplate>
    </>
  );
}
