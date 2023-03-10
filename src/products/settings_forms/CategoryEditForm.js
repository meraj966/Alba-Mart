import React, { useState } from 'react'
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { split } from 'lodash';
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase-config';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { uuidv4 } from '@firebase/util';

function CategoryEditForm({ formType, subCategoryList, closeForm, handleEditForm, selectedCategory, settingsData, refreshSettingsData }) {
    console.log(selectedCategory, "selected category")
    const [addCategory, setAddCategory] = useState(formType === "edit" ? selectedCategory : "")
    const [subCategory, setSubCategory] = useState(formType === "edit" ? subCategoryList : "")
    const [isBulkCategoryAdd, setIsBulkCategoryAdd] = useState(false)
    const [category, setCategory] = useState(selectedCategory)
    const [file, setFile] = useState(null)

    const saveCategoryImage = async (url) => {
        let newCategory = [...settingsData[0].category]
        newCategory.filter(i => i.name === category)[0].imageUrl = url
        const settingsDoc = doc(db, "Settings", "UserSettings")
        const newFields = { category: newCategory }
        await updateDoc(settingsDoc, newFields)
    }

    const uploadImageFile = async () => {
        const storageRef = ref(storage, `/images/${uuidv4() + file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on("state_changed", (snapshot) => { }, err => console.log(err), () => {
            getDownloadURL(uploadTask.snapshot.ref).then(url => {
                saveCategoryImage(url)
            })
        })
    }

    const saveNewSubCategories = async () => {
        let newSubCategory = subCategory.split(",").map(i => ({ name: i.trim(), imageUrl: '' }))
        const settingsDoc = doc(db, "Settings", "UserSettings")
        let data = { ...settingsData[0].subCategory }
        data[category] = newSubCategory
        const newFields = { subCategory: data }
        await updateDoc(settingsDoc, newFields)
    }

    const saveNewSingleCategoryWithFile = async () => {
        let data = { ...settingsData[0] }
        let { category } = data, newSubCategory = { ...data.subCategory }
        category.push({ imageUrl: "", name: addCategory.trim() })
        newSubCategory[addCategory.trim()] = subCategory.split(",").map(i => ({ name: i.trim(), imageUrl: '' }))
        console.log("SAVING==>", category, newSubCategory, file)
        const settingsDoc = doc(db, "Settings", "UserSettings")
        await updateDoc(settingsDoc, { category, subCategory: newSubCategory })
    }

    const saveBulkCategories = async () => {
        console.log(addCategory, settingsData[0])
        let data = settingsData[0], newCategory = addCategory.split(",").map(i=>({ name: i.trim(), imageUrl: '' }))
        let category = [...data.category, ...newCategory]
        const settingsDoc = doc(db, "Settings", "UserSettings")
        await updateDoc(settingsDoc, {category})
    }

    const handleUpdate = async () => {
        if (formType === "edit") {
            if (!file) saveNewSubCategories()
            else uploadImageFile()
        } else {
            console.log(addCategory, subCategory, file, settingsData)
            if (isBulkCategoryAdd) {
                saveBulkCategories()
            } else {
                // single category with file
                saveNewSingleCategoryWithFile()
                if (file) uploadImageFile()
            }
        }
        refreshSettingsData()
        Swal.fire("Updated!", "You have successfully added new categories.", "success")
        setAddCategory("")
        setSubCategory("")
        setCategory("")
        closeForm()
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
                        onChange={(e) => {
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
                        onChange={(e) => setSubCategory(e.target.value)}
                        label="Sub Category"
                        size="small"
                        placeholder='Please add sub categories separated by a comma... for e.g., "Tressemme, Loreal, ClinicPlus"'
                        sx={{ minWidth: "100%" }}
                    />
                </Grid>
                {formType === "edit" && (<Grid item xs={12}>
                    <Box
                        component="img"
                        sx={{
                            height: 233,
                            width: 350,
                            maxHeight: { xs: 233, md: 167 },
                            maxWidth: { xs: 350, md: 250 },
                        }}
                        alt="Category image"
                        src={settingsData[0].category.find(i => i.name === category).imageUrl}
                    />
                </Grid>)}
                {(formType === "edit" || !isBulkCategoryAdd) && (<Grid item xs={12}>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])}
                    />
                </Grid>)}
                <Grid item xs={12}>
                    <Typography variant="h5" align="right">
                        <Button variant="contained" onClick={handleUpdate}>
                            {formType === "edit" ? "SAVE" : "ADD CATEGORIES"}
                        </Button>
                    </Typography>
                </Grid>
            </Grid>
        </>
    )
}

export default CategoryEditForm