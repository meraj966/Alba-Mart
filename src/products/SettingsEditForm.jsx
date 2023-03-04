import React, { useState } from 'react'
import { SETTINGS_LABEL_MAP } from "../Constants";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import IconButton from '@mui/material/IconButton';
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import CategoryForm from './settings_forms/CategoryForm';

const SettingsEditForm = ({ closeEvent, edit, settingsData, setSettingsData }) => {
    let initialState = {
        category: "",
        subCategory: [],
        selectedCategory: settingsData["category"],
        categoryList: Object.keys(settingsData["categories"])
    }
    const [editData, setEditData] = useState(initialState)
    console.log(settingsData, edit, editData, "settings form data")
    const handleDataChange = (event) => {
        const data = { ...editData }
        data[event.target.name] = event.target.value
        setEditData(data)
    }
    const handleSave = () => {
        console.log(editData, settingsData, "updatedText")
    }
    return (
        <div>
            <Typography component="h2" variant="h4" style={{ textAlign: 'center' }}>
                Edit {edit==="category"? "default Category and add new Categories": "Data"}
            </Typography>
            <IconButton
                style={{ position: "absolute", top: "0", right: "0" }}
                onClick={closeEvent}
            >
                <CloseIcon />
            </IconButton>
            {edit === "category" && <CategoryForm defaultCategory={settingsData["category"]} settingsData={settingsData} setSettingsData={setSettingsData} category={Object.keys(settingsData["categories"])} categories={settingsData["categories"]} />}

        </div>
    )
}

export default SettingsEditForm