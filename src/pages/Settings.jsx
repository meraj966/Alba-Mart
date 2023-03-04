import Sidenav from "../components/Sidenav";
import { Box, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import "../Dash.css";
import { db } from "../firebase-config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../appStore";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { collection, getDocs } from "firebase/firestore";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from '@mui/material/IconButton';
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import SettingsEditForm from "../products/SettingsEditForm";

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
    const [file, setFile] = useState("");
    const [data, setData] = useState({})
    const [editOpen, setEditOpen] = useState(false)
    const [settings, setSettings] = useState({})
    const [edit, setEdit] = useState("")
    const [settingsData, setSettingsData] = useState(
        { category: "", subCategory: "", categories: {}, saleType: "", onSale: false, unit: "" }
    )
    const updateSettingsData = (event) => {
        let data = { ...settingsData }
        data[event.target.name] = event.target.value
        if (event.target.name == "onSale") data[event.target.name] = event.target.checked
        setSettingsData(data);
    }
    const dataRef = collection(db, "Settings");

    useEffect(() => {
        setSettingsData({
            category: data["defaultCategory"],
            categories: data["categories"],
            saleType: data["defaultSaleType"],
            onSale: data["onSale"],
            unit: data["defaultUnit"]
        })
        setSettings(data)
    }, [data])

    useEffect(() => {
        getSettingsData();
    }, []);

    const getSettingsData = async () => {
        const data = await getDocs(dataRef);
        data.docs.map((doc) => {
            setData({ ...doc.data(), id: doc.id })
        });
    };

    const handleUpload = () => { }
    const handleEditClick = (selectedEdit) => {
        setEditOpen(!editOpen)
        setEdit(selectedEdit)
    }
    console.log(settingsData, settings, "data")
    return (
        <>
            <div className="bgcolor">
                <Modal open={editOpen}
                    // onClose={handleEditClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description">
                    <Box sx={style} className="editForm">
                        <SettingsEditForm closeEvent={() => setEditOpen(false)} edit={edit} settingsData={settingsData} setSettingsData={setSettingsData} />
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
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <TextField
                                    error={false}
                                    id="category"
                                    name="category"
                                    value={settingsData["category"]}
                                    onChange={updateSettingsData}
                                    label="Category"
                                    size="small"
                                    select
                                    sx={{ marginTop: "30px", minWidth: "100%" }}
                                >
                                    {settingsData["categories"] && Object.keys(settingsData["categories"])?.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton aria-label="edit" onClick={() => handleEditClick("category")} sx={{ marginTop: "30px" }}>
                                    <EditIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <TextField
                                    error={false}
                                    id="subCategory"
                                    name="subCategory"
                                    value={settingsData["subCategory"]}
                                    onChange={updateSettingsData}
                                    label="Sub Category"
                                    size="small"
                                    select
                                    sx={{ marginTop: "30px", minWidth: "100%" }}
                                >
                                    {settingsData["categories"] && settingsData["categories"][settingsData["category"]]?.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton aria-label="edit" onClick={() => handleEditClick("subCategory")} sx={{ marginTop: "30px" }}>
                                    <EditIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <TextField
                                    error={false}
                                    id="saleType"
                                    name="saleType"
                                    value={settingsData["saleType"]}
                                    onChange={updateSettingsData}
                                    label="Sale Type"
                                    size="small"
                                    select
                                    sx={{ marginTop: "30px", minWidth: "100%" }}
                                >
                                    {settings["saleType"] && settings["saleType"].map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton aria-label="edit" onClick={() => handleEditClick("saleType")} sx={{ marginTop: "30px" }}>
                                    <EditIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <TextField
                                    error={false}
                                    id="unit"
                                    name="unit"
                                    value={settingsData["unit"]}
                                    onChange={updateSettingsData}
                                    label="Unit"
                                    size="small"
                                    select
                                    sx={{ marginTop: "30px", minWidth: "100%" }}
                                >
                                    {settings["unit"] && settings["unit"].map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton aria-label="edit" onClick={() => handleEditClick("unit")} sx={{ marginTop: "30px" }}>
                                    <EditIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={<Checkbox checked={settingsData["onSale"]} onChange={updateSettingsData} name="onSale" />}
                                    name="onSale"
                                    sx={{ minWidth: "100%" }}
                                    label="Sale" />
                            </Grid>
                            <Grid item xs={2}>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <Typography variant="h5" align="right">
                                    <Button variant="contained" style={{ width: '200px', align: 'right' }} onClick={handleUpload}>
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
