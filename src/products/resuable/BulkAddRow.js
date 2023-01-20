import React, { useState } from 'react'
import { CurrencyRupee, FileUpload } from '@mui/icons-material';
import { Grid, InputAdornment, TextField } from '@mui/material'
import IconButton from "@mui/material/IconButton";
import { ITEM_CATEGORY, ITEM_TYPE, MEASURE_UNIT, SALE_TYPE } from '../../Constants';
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function BulkAddRow() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [saleType, setSaleType] = useState("");
    const [onSale, setOnSale] = useState(false);
    const [file, setFile] = useState("");
    const [menutype, setMenutype] = useState("");
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState("");
    const handleSetOnSale = (event) => {
        setOnSale(event.target.checked)

    }
    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };
    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleMenuTypeChange = (event) => {
        setMenutype(event.target.value);
    };

    const handlePicChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSaleTypeChange = (event) => {
        setSaleType(event.target.value)
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={1.5}>
                <TextField
                    error={false}
                    id="name"
                    name="name"
                    multiline
                    value={name}
                    onChange={handleNameChange}
                    label="Name"
                    size="small"
                    sx={{ marginTop: "30px", minWidth: "100%" }}
                />
            </Grid>
            <Grid item >
                <TextField
                    error={false}
                    multiline
                    id="description"
                    name="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    label="Description"
                    size="small"
                    sx={{ marginTop: "30px", minWidth: "100%" }}
                />
            </Grid>
            <Grid item xs={1.4}>
                <TextField
                    error={false}
                    id="category"
                    label="Category"
                    select
                    value={category}
                    onChange={handleCategoryChange}
                    size="small"
                    sx={{ marginTop: "30px", minWidth: "100%" }}
                >
                    {ITEM_CATEGORY.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={1.5}>
                <TextField
                    error={false}
                    id="menutype"
                    label="Menu Type"
                    select
                    value={menutype}
                    onChange={handleMenuTypeChange}
                    size="small"
                    sx={{ marginTop: "30px", minWidth: "100%" }}
                >
                    {ITEM_TYPE.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={1.2}>
                <TextField
                    error={false}
                    id="measureUnit"
                    label="Unit"
                    select
                    value={menutype}
                    onChange={handleMenuTypeChange}
                    size="small"
                    sx={{ marginTop: "30px", minWidth: "100%" }}
                >
                    {MEASURE_UNIT.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={1.3}>
                <TextField
                    error={false}
                    id="price"
                    label="Price"
                    type="number"
                    value={price}
                    onChange={handlePriceChange}
                    size="small"
                    sx={{ marginTop: "30px", minWidth: "100%" }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <CurrencyRupee />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item xs={0.7}>
                <FormControlLabel
                    control={<Checkbox checked={onSale} onChange={handleSetOnSale} />}
                    name={"onSale"}
                    sx={{ marginTop: "30px", minWidth: "100%" }}
                    label="Sale" />

            </Grid>
            {onSale && <>
                <Grid item xs={1}>
                    <TextField
                        error={false}
                        id="saleType"
                        label="SaleType"
                        select
                        value={saleType}
                        onChange={handleSaleTypeChange}
                        size="small"
                        sx={{ marginTop: "30px", minWidth: "100%" }}
                    >
                        {SALE_TYPE.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={1}>
                    <TextField
                        error={false}
                        id="name"
                        name="name"
                        multiline
                        value={name}
                        onChange={handleNameChange}
                        label="Sale Value"
                        size="small"
                        sx={{ marginTop: "30px", minWidth: "100%" }}
                    />
                </Grid>
            </>}
            <Grid item sm={0.4}>
                <IconButton onClick={() => console.log("upload logic")} sx={{ marginTop: "30px", marginLeft: '8px' }}>
                    <FileUpload />
                </IconButton>
            </Grid>
        </Grid>
    )
}

export default BulkAddRow