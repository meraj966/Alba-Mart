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
import DeleteIcon from "@mui/icons-material/Delete";
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
  const [defaultBrandName, setDefaultBrandName] = useState("");
  const [brandName, setBrandName] = useState(defaultBrandName);
  const [brandNameList, setBrandNameList] = useState([]);
  const [saleType, setSaleType] = useState("");
  const [saleTypeList, setSaleTypeList] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editType, setEditType] = useState("");
  const [type, setType] = useState("edit");
  const [selectedBrandForEdit, setSelectedBrandForEdit] = useState(defaultBrandName);

  const dataRef = collection(db, "Settings");

  const [settings, setSettings] = useState(null);

  const [isBulkAdd, setIsBulkAdd] = useState(false);
  const [selectedBrandName, setSelectedBrandName] = useState("");

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
      // setCategory(data.defaultCategory);
    }
  }, [settings]);

  useEffect(() => {
    getDataFromFirestore();
  }, []);

  async function getDataFromFirestore() {
    const data = await getDocs(dataRef);
    setSettings(data.docs.map((doc) => ({ ...doc.data() })));
  }

  const handleSubmit = async () => {
    const settingsDoc = doc(db, "Settings", "UserSettings");
    const newFields = {
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

  const handleEditForm = (editType, type, selectedBrand) => {
    setSelectedBrandForEdit(selectedBrand);
    setType(type);
    setEditType(editType);
    setBrandName(selectedBrand);
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

  const handleDeleteBrandName = (brandNameToDelete) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete the brand name "${brandNameToDelete}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with deletion
        deleteBrandName(brandNameToDelete);
      }
    });
  };

  const deleteBrandName = async (brandNameToDelete) => {
    // Find the index of the brand name to delete
    const indexToDelete = brandNameList.indexOf(brandNameToDelete);
    if (indexToDelete !== -1) {
      // Create a new array without the deleted brand name
      const updatedBrandNameList = [
        ...brandNameList.slice(0, indexToDelete),
        ...brandNameList.slice(indexToDelete + 1),
      ];

      // Update the brand name list in Firestore
      const settingsDoc = doc(db, "Settings", "UserSettings");
      await updateDoc(settingsDoc, { brandNameList: updatedBrandNameList });

      // Update local state and provide feedback to the user
      setBrandNameList(updatedBrandNameList);
      Swal.fire("Deleted!", `Brand name "${brandNameToDelete}" has been deleted.`, "success");
    }
  };

  const handleBrandNameSave = async () => {
    if (!brandName.trim()) {
      Swal.fire("Error!", "Brand Name cannot be blank.", "error");
      return;
    }

    const brandNames = brandName.split(",").map((i) => i.trim());
    let updatedBrandNameList;

    if (selectedBrandForEdit) {
      // Update existing brand name
      const index = brandNameList.indexOf(selectedBrandForEdit);
      updatedBrandNameList = [...brandNameList];
      if (index !== -1) {
        updatedBrandNameList[index] = brandNames[0];
      }
    } else {
      // Add new brand name
      updatedBrandNameList = settings[0]?.brandNameList
        ? [...brandNames, ...settings[0]?.brandNameList]
        : [...brandNames];
    }

    const settingsDoc = doc(db, "Settings", "UserSettings");
    await updateDoc(settingsDoc, { brandNameList: updatedBrandNameList }).then(() => {
      getDataFromFirestore();
      Swal.fire(
        "Updated!",
        "You have successfully modified/added Brands to your list",
        "success"
      );
      setEditOpen(!editOpen);
      setBrandName('');
      setIsBulkAdd(false);
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
          // onClose={() => handleEditForm("", "edit")}
          >
            <Box sx={BOX_STYLE} className="editForm">
              {editType === BRAND_NAME && (
                <SettingsEditForm
                  title={"Edit Brand Name"}
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
          {/* Sale Type */}
          <Grid item xs={3}>
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

          {/* Unit */}
          <Grid item xs={3}>
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

          {/* Brand Name */}
          <Grid item xs={3}>
            <TextField
              id="brandName"
              name="brandName"
              value={defaultBrandName}
              onChange={(e) => setDefaultBrandName(e.target.value)}
              label="Brand Name"
              size="small"
              select
              sx={{ marginTop: "30px", minWidth: "100%" }}
            >
              {brandNameList
                .slice()
                .sort()
                .map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => handleDeleteBrandName(option)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </MenuItem>
                ))}
            </TextField>
          </Grid>

          {/* Edit Brand Name Icon */}
          <Grid item xs={1}>
            <Tooltip title="Edit Brand Name">
              <IconButton
                aria-label="edit"
                onClick={() => handleEditForm(BRAND_NAME, "edit", defaultBrandName)}
                sx={{ marginTop: "30px" }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          {/* Add Brand Name Icon */}
          <Grid item xs={1}>
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

          {/* Default On Sale */}
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

          {/* Submit Button */}
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
