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
import { SALE_TYPE } from "../Constants";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from '@mui/material/IconButton';
import CloseIcon from "@mui/icons-material/Close";

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

const EditForm = ({ closeEvent }) => {

    return (
        <div>
            <IconButton
                style={{ position: "absolute", top: "0", right: "0" }}
                onClick={closeEvent}
            >
                <CloseIcon />
            </IconButton>
        </div>
    )
}
export default function Settings() {
    const [data, setData] = useState({})
    const [editOpen, setEditOpen] = useState(false)
    const [menu, setMenu] = useState("")
    const [category, setCategory] = useState("")
    const [saleType, setSaleType] = useState("")
    const [onSale, setOnSale] = useState(false)
    const [unit, setUnit] = useState("")
    const [settings, setSettings] = useState({})
    const handleUnitChange = (event) => setUnit(event.target.value)
    const handleChangeOnSale = (event) => setOnSale(event.target.checked)
    const handleMenuChange = (event) => setMenu(event.target.value)
    const handleCategoryChange = (event) => setCategory(event.target.value)
    const handleSaleTypeChange = (event) => setSaleType(event.target.value)

    const dataRef = collection(db, "Settings");

    useEffect(() => {
        setMenu(data["defaultMenu"])
        setCategory(data["defaultCategory"])
        setSaleType(data["defaultSaleType"])
        setOnSale(data["onSale"])
        setUnit(data["defaultUnit"])
        setSettings(data)
    }, [data])

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const data = await getDocs(dataRef);
        data.docs.map((doc) => {
            setData({ ...doc.data(), id: doc.id })
        });
    };


    console.log("SEttings data", data, settings)
    return (
        <>
            <div className="bgcolor">
                <Modal open={editOpen}
                    // onClose={handleEditClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description">
                    <Box sx={style} className="editForm">
                        <EditForm closeEvent={() => setEditOpen(false)} />
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
                                    id="menu"
                                    name="menu"
                                    value={menu}
                                    onChange={handleMenuChange}
                                    label="Menu"
                                    size="small"
                                    select
                                    sx={{ marginTop: "30px", minWidth: "100%" }}
                                >
                                    {settings["menu"] && settings["menu"].map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton aria-label="edit" onClick={() => setEditOpen(!editOpen)} sx={{ marginTop: "30px" }}>
                                    <EditIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <TextField
                                    error={false}
                                    id="category"
                                    name="category"
                                    value={category}
                                    onChange={handleCategoryChange}
                                    label="Category"
                                    size="small"
                                    select
                                    sx={{ marginTop: "30px", minWidth: "100%" }}
                                >
                                    {settings["category"] && settings["category"].map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton aria-label="edit" onClick={() => setEditOpen(!editOpen)} sx={{ marginTop: "30px" }}>
                                    <EditIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <TextField
                                    error={false}
                                    id="saleType"
                                    name="saleType"
                                    value={saleType}
                                    onChange={handleSaleTypeChange}
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
                                <IconButton aria-label="edit" onClick={() => setEditOpen(!editOpen)} sx={{ marginTop: "30px" }}>
                                    <EditIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <TextField
                                    error={false}
                                    id="unit"
                                    name="unit"
                                    value={unit}
                                    onChange={handleUnitChange}
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
                                <IconButton aria-label="edit" onClick={() => setEditOpen(!editOpen)} sx={{ marginTop: "30px" }}>
                                    <EditIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={<Checkbox checked={onSale} onChange={handleChangeOnSale} name="onSale" />}
                                    name="onSale"
                                    sx={{ minWidth: "100%" }}
                                    label="Sale" />
                            </Grid>
                            <Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </div>
        </>
    );
}
