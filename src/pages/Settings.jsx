import Sidenav from "../components/Sidenav";
import { Box, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import "../Dash.css";
import { db } from "../firebase-config";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from '@mui/material/IconButton';
import Button from "@mui/material/Button";
import { CATEGORY, SUBCATEGORY } from "../Constants";
import Swal from "sweetalert2";
import CategoryEditForm from "../products/settings_forms/CategoryEditForm";
import Tooltip from '@mui/material/Tooltip';
import { AddCircle } from "@mui/icons-material";
import SubCategoryEditForm from "../products/settings_forms/SubCategoryEditForm";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function Settings() {
    const [settings, setSettings] = useState(null)
    const dataRef = collection(db, "Settings");

    const [editOpen, setEditOpen] = useState(false)
    const [editType, setEditType] = useState("")
    const [type, setType] = useState("edit")

    const [category, setCategory] = useState("")
    const [categoryList, setCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [subCategory, setSubCategory] = useState()
    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])

    const [saleType, setSaleType] = useState([])
    const [defaultSaleType, setDefaultSaleType] = useState("")

    const [unit, setUnit] = useState([])
    const [defaultUnit, setDefaultUnit] = useState("")

    const [onSale, setOnSale] = useState(false)
    useEffect(() => {
        if (settings) {
            const data = settings[0]
            let subCategoryList = (data.subCategory && data.subCategory[data.defaultCategory]) ? Object.keys(data.subCategory[data.defaultCategory]): []
            console.log(data, "settings useeffect data")
            setCategory(data.defaultCategory)
            setCategoryList(Object.keys(data.category))
            setSubCategoryList(subCategoryList)
            setSaleType(data.saleType)
            setDefaultSaleType(data.defaultSaleType)
            setUnit(data.unit)
            setDefaultUnit(data.defaultUnit)
            setOnSale(data.onSale)
            setCategories(data.category)
            setSubCategories(data.subCategory)
        }
        console.log(category, categoryList)
    }, [settings])

    useEffect(() => {
        getSettingsData()
    }, [])

    useEffect(() => {
        setSubCategoryList((subCategories && subCategories[category]) && Object.keys(subCategories[category]))  
    }, [category])

    const getSettingsData = async () => {
        const data = await getDocs(dataRef);
        setSettings(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const handleEditForm = (editType, type) => {
        console.log("DATAAAAAAAAAAAAAAAAAAa", editType, subCategory)
        if (editType === SUBCATEGORY && !subCategory) return
        setType(type)
        setEditType(editType)
        setEditOpen(!editOpen)
    }

    const handleSubmit = async () => {
        const settingsDoc = doc(db, "Settings", "UserSettings")
        const newFields = {
            defaultCategory: category,
            defaultSaleType,
            defaultUnit,
            onSale
        }
        await updateDoc(settingsDoc, newFields)
        getSettingsData()
        Swal.fire("Updated!", "Your changes to default settings have been made.", "success")
    }

    console.log(subCategoryList, settings, category, categoryList, "SETINGSSsss")
    return (
        <>
            <div className="bgcolor">
                <Modal open={editOpen}
                    // onClose={handleEditClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description">
                    <Box sx={style} className="editForm">
                        {editType === CATEGORY &&
                            <CategoryEditForm
                                closeForm={() => setEditOpen(!editOpen)}
                                formType={type}
                                handleEditForm={handleEditForm}
                                selectedCategory={category}
                                settingsData={settings}
                                refreshSettingsData={getSettingsData}
                                subCategoryList={subCategoryList}
                            />
                        }
                        {(editType === SUBCATEGORY) && 
                            <SubCategoryEditForm
                                category = {category}
                                refreshSettingsData={getSettingsData}
                                subCategories={subCategories}
                                handleEditForm={handleEditForm}
                                subCategory={subCategory}
                            />
                        }
                    </Box>
                </Modal>
                <Navbar />
                <Box height={70} />
                <Box sx={{ display: "flex" }}>
                    <Sidenav />
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                        <Typography variant="h5" align="center">
                            SETTINGS
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} ></Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <TextField
                                    error={false}
                                    id="category"
                                    name="category"
                                    label="Set Default Category"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    size="small"
                                    select
                                    sx={{ minWidth: "100%" }}
                                >
                                    {categoryList?.map((option) => {
                                        return (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        )
                                    })
                                    }
                                </TextField>
                            </Grid>
                            <Grid item >
                                <Tooltip title="Edit current category">
                                    <IconButton aria-label="edit" onClick={() => handleEditForm(CATEGORY, "edit")} >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item >
                                <Tooltip title="Add Categories">
                                    <IconButton onClick={() => handleEditForm(CATEGORY, "add")}>
                                        <AddCircle />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <TextField
                                    error={false}
                                    id="subCategory"
                                    name="subCategory"
                                    value={subCategory}
                                    onChange={e=>setSubCategory(e.target.value)}
                                    label="Select Sub Category to Edit"
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
                            <Grid item xs={2}>
                                <Tooltip title="Edit SubCategory">
                                    <IconButton aria-label="edit" style={{marginTop: "30px"}} onClick={() => handleEditForm(SUBCATEGORY, "edit")} >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <TextField
                                    error={false}
                                    id="saleType"
                                    name="saleType"
                                    value={defaultSaleType}
                                    onChange={(e) => setDefaultSaleType(e.target.value)}
                                    label="Sale Type"
                                    size="small"
                                    select
                                    sx={{ marginTop: "30px", minWidth: "100%" }}
                                >
                                    {saleType?.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={2}>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <TextField
                                    error={false}
                                    id="unit"
                                    name="unit"
                                    value={defaultUnit}
                                    onChange={(e) => setDefaultUnit(e.target.value)}
                                    label="Unit"
                                    size="small"
                                    select
                                    sx={{ marginTop: "30px", minWidth: "100%" }}
                                >
                                    {unit.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={2}></Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={<Checkbox checked={onSale} onChange={(e)=>setOnSale(e.target.checked)} name="onSale" />}
                                    name="onSale"
                                    sx={{ minWidth: "100%" }}
                                    label="Default On Sale" />
                            </Grid>
                            <Grid item xs={2}>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <Typography variant="h5" align="right">
                                    <Button variant="contained" style={{ width: '200px', align: 'right' }} onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </div>
        </>
    );
}
