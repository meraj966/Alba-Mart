import React, { useState } from 'react'
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { split } from 'lodash';
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import Alert from '@mui/material/Alert';

function CategoryEditForm({ formType, closeForm, handleEditForm, selectedCategory, categories, refreshSettingsData }) {
    console.log(selectedCategory, "selected category")
    const [addCategory, setAddCategory] = useState(formType==="edit" ? selectedCategory: "")
    const [subCategory, setSubCategory] = useState("")
    const [isBulkCategoryAdd, setIsBulkCategoryAdd] = useState(false)
    const [category, setCategory] = useState(selectedCategory)
    
    useEffect(()=>{
        if (formType === "edit") setSubCategory(categories[category])
    }, [])

    const handleUpdate = async () => {
        let newCategories = {...categories}
        let newSubCategory = split(subCategory, ",").map(i=> (i.trim()))
        if (isBulkCategoryAdd) {}
        newSubCategory = (newSubCategory.length === 1 && newSubCategory[0] === "") ? [] : newSubCategory
        if (formType === "add") {
            if (isBulkCategoryAdd) {
                split(addCategory,",").map(i=>newCategories[i.trim()] = [])
            } else {
                newCategories[addCategory.trim()] = newSubCategory
            }
        } else {
            newCategories[category] = newSubCategory
        }
        const settingsDoc = doc(db, "Settings", "UserSettings")
        const newFields = {categories: newCategories}
        await updateDoc(settingsDoc, newFields)
        refreshSettingsData()
        Swal.fire("Updated!", "You have successfully added new categories.", "success")
        setAddCategory("")
        setSubCategory("")
        setCategory("")
        // closeForm()
    }
    return (
        <>
            <Typography variant="h5" align="center">
                {formType === "edit" ? "Edit Category" : "Add New Categories"} 
            </Typography>
            <IconButton
                style={{ position: "absolute", top: "0", right: "0" }}
                onClick={() => handleEditForm("", "edit")}
            >
                <CloseIcon />
            </IconButton>
            <Grid container spacing={2}>
                <Grid item xs={12}></Grid>
                <Grid item xs={12}>
                    <TextField
                        error={false}
                        id="category"
                        name="category"
                        disabled={formType === "edit"}
                        value={addCategory}
                        onChange={(e)=>{
                            if (e.target.value.includes(",")) {
                                setSubCategory("")
                                setIsBulkCategoryAdd(true)
                            }
                            else setIsBulkCategoryAdd(false)
                            setAddCategory(e.target.value)
                        }}
                        label="Category"
                        size="small"
                        placeholder='Add category... for eg., "Shampoo"'
                        sx={{ minWidth: "100%" }}
                    />
                    {isBulkCategoryAdd && <Alert severity='info'>Tip: By adding commas, you can add categories in bulk. For e.g., Shampoo,Detergent,Pulses</Alert>}
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        error={false}
                        id="subCategory"
                        name="subCategory"
                        value={subCategory}
                        disabled={isBulkCategoryAdd}
                        onChange={(e)=>setSubCategory(e.target.value)}
                        label="Sub Category"
                        size="small"
                        placeholder='Please add sub categories separated by a comma... for e.g., "Tressemme, Loreal, ClinicPlus"'
                        sx={{ minWidth: "100%" }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" align="right">
                        <Button variant="contained" onClick={handleUpdate}>
                            {formType==="edit" ? "SAVE" :"ADD CATEGORIES" } 
                        </Button>
                    </Typography>
                </Grid>
            </Grid>
        </>
    )
}

export default CategoryEditForm