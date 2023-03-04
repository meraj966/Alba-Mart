import React, { useState } from 'react'
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { split } from 'lodash';

function CategoryForm({defaultCategory, category, categories,settingsData, setSettingsData}) {
    const [selectedCategory, setSelectedCategory] = useState(defaultCategory)
    const [newCategory, setNewCategory] = useState("")
    const handleCategoryChange = (e) => setNewCategory(e.target.value)
    const handleDefaultCategoryChange = (e) => setSelectedCategory(e.target.value)
    const style = { width: '200px' }
    const handleUpdate = () => {
        let newCategories = {}
        const category = split(newCategory, ",").map(i=>i.trim())
        category.forEach(i=> newCategories[i] = [])
        setSettingsData({...settingsData, categories: {...categories, ...newCategories}, defaultCategory: selectedCategory})
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
                <TextField
                    id="category"
                    name="category"
                    value={selectedCategory}
                    onChange={handleDefaultCategoryChange}
                    label="Update Default Category"
                    size="small"
                    select
                    sx={{ minWidth: "100%" }}
                >
                    {category?.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    error={false}
                    id="addCategory"
                    name="addCategory"
                    value={newCategory}
                    onChange={handleCategoryChange}
                    label="Add New Category"
                    size="small"
                    sx={{ minWidth: "100%" }}
                />
            </Grid>
            <Grid item xs={12}>
            <Typography variant="h5" align="right">
                <Button variant="contained" style={style} onClick={handleUpdate}>
                    UPDATE
                </Button>
            </Typography>
            </Grid>
        </Grid>
    )
}

export default CategoryForm