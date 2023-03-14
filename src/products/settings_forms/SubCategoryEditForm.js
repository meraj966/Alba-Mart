import { IconButton, Typography, Grid, Box, Button} from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";

import React, { useState } from 'react'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../firebase-config';
import { uuidv4 } from '@firebase/util';
import { doc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

function SubCategoryEditForm({ handleEditForm, subCategory, subCategories, category, refreshSettingsData}) {
    const [file, setFile] = useState(null)
    const subCategoryImageUrl = subCategories[category][subCategory]?.imageUrl
    const handleSave = async () => {
        if(file) uploadImageFile()
        refreshSettingsData()
        // Swal.fire("Updated!", "You have successfully added new categories.", "success")
        handleEditForm("", "edit")
    }

    const saveSubCategoryImage = async (url) => {
        let newSubCategory = {...subCategories, }
        newSubCategory[category][subCategory].imageUrl = url
        console.log("Save sub CATEGORYYYYYYYYYYYYYYY", newSubCategory, subCategory, category)
        const settingsDoc = doc(db, "Settings", "UserSettings")
        const newFields = { subCategory: newSubCategory }
        await updateDoc(settingsDoc, newFields)
    }

    const uploadImageFile = async () => {
        const storageRef = ref(storage, `/images/${uuidv4() + file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on("state_changed", (snapshot) => { }, err => console.log(err), () => {
            getDownloadURL(uploadTask.snapshot.ref).then(url => {
                saveSubCategoryImage(url)
            })
        })
    }
    return (
        // for uploading subcategory images to db
        <>
            <Typography variant="h5" align="center">
                Edit SubCategory
            </Typography>
            <IconButton
                style={{ position: "absolute", top: "0", right: "0" }}
                onClick={() => handleEditForm("", "edit")}
            > <CloseIcon />
            </IconButton>
            <Grid container spacing={2}>
                <Grid item xs={12} />
                <Grid item xs={12}>
                    <Typography variant="h5">
                        Sub Category - {subCategory}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Box
                        component="img"
                        sx={{
                            height: 233,
                            width: 350,
                            maxHeight: { xs: 233, md: 167 },
                            maxWidth: { xs: 350, md: 250 },
                        }}
                        alt="Category image"
                        src={subCategoryImageUrl}
                    />
                </Grid>
                <Grid item xs={12}>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" align="right">
                        <Button variant="contained" onClick={handleSave}>
                            SAVE
                        </Button>
                    </Typography>
                </Grid>
            </Grid>
        </>
    )
}

export default SubCategoryEditForm