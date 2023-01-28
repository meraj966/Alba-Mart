import React, { useEffect, useState } from 'react'
import { CurrencyRupee } from '@mui/icons-material';
import { Grid, InputAdornment, TextField } from '@mui/material'
import { ITEM_CATEGORY, ITEM_TYPE, MEASURE_UNIT, SALE_TYPE } from '../../Constants';
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function AddProductRow({ products, setProducts, index }) {
    const [rowData, setRowData] = useState({
        name: "",
        description: "",
        saleType: "",
        onSale: false,
        file: null,
        menuType: "",
        measureUnit: "",
        quantity: 0,
        price: 0,
        category: "",
        saleValue: ""
    })
    const handleChange = async (event) => {
        let data = {}
        data[event.target.name] = event.target.value
        if (event.target.name == "onSale") data[event.target.name] = event.target.checked
        if (event.target.name == "file" && event.target.files) data[event.target.name] = event.target.files[0]
        setRowData({ ...rowData, ...data })
    }
    useEffect(() => {
        const event = { target: { name: "name", value: "" } }
        handleChange(event)
    }, [])
    useEffect(()=> {
        setProducts({ ...products, [index]: rowData })
    },[rowData])
    return (
        <Grid container direction="row" spacing={0.8}>
            <Grid item xs={3}>
                <TextField
                    error={false}
                    id="name"
                    name="name"
                    multiline
                    value={rowData["name"]}
                    onChange={handleChange}
                    label="Name"
                    size="small"
                    sx={{ minWidth: "100%" }}
                />
            </Grid>
            <Grid item xs={3.2}>
                <TextField
                    error={false}
                    multiline
                    id="description"
                    name="description"
                    value={rowData["description"]}
                    onChange={handleChange}
                    label="Description"
                    size="small"
                    sx={{ minWidth: "100%" }}
                />
            </Grid>
            <Grid item xs={1.5}>
                <TextField
                    error={false}
                    id="price"
                    label="Price"
                    type="number"
                    name='price'
                    value={rowData['price']}
                    onChange={handleChange}
                    size="small"
                    sx={{ minWidth: "100%" }}
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
                    control={<Checkbox checked={rowData["onSale"]} onChange={handleChange} name="onSale" />}
                    name="onSale"
                    sx={{ minWidth: "100%" }}
                    label="Sale" />
            </Grid>
            <Grid item xs={1.6}>
                {rowData["onSale"] &&
                    <TextField
                        error={false}
                        id="saleType"
                        label="SaleType"
                        select
                        name='saleType'
                        value={rowData["saleType"]}
                        onChange={handleChange}
                        size="small"
                        sx={{ minWidth: "100%" }}
                    >
                        {SALE_TYPE.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>}
            </Grid>
            <Grid item xs={2}>
                {rowData["onSale"] &&
                    <TextField
                        error={false}
                        id="SaleValue"
                        name="saleValue"
                        type="number"
                        value={rowData["saleValue"]}
                        onChange={handleChange}
                        label="Sale Value"
                        size="small"
                        sx={{ minWidth: "100%" }}
                    />}
            </Grid>
            <Grid item xs={2.5}>
                <TextField
                    error={false}
                    id="category"
                    label="Category"
                    select
                    name="category"
                    value={rowData["category"]}
                    onChange={handleChange}
                    size="small"
                    sx={{ minWidth: "100%" }}
                >
                    {ITEM_CATEGORY.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={2.5}>
                <TextField
                    error={false}
                    id="menuType"
                    label="Menu Type"
                    select
                    name='menuType'
                    value={rowData["menuType"]}
                    onChange={handleChange}
                    size="small"
                    sx={{ minWidth: "100%" }}
                >
                    {ITEM_TYPE.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={1.5}>
                <TextField
                    error={false}
                    id="measureUnit"
                    label="Unit"
                    select
                    name="measureUnit"
                    value={rowData["measureUnit"]}
                    onChange={handleChange}
                    size="small"
                    sx={{ minWidth: "100%" }}
                >
                    {MEASURE_UNIT.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={1.5}>
                <TextField
                    error={false}
                    id="quantity"
                    label="Quantity"
                    type="number"
                    name='quantity'
                    value={rowData['quantity']}
                    onChange={handleChange}
                    size="small"
                    sx={{ minWidth: "100%" }}
                />
            </Grid>
            <Grid item xs={3}>
                <input type="file"  onChange={handleChange} accept="/image/*" name="file" style={{marginTop: "10px"}}/>
            </Grid>
        </Grid>
    )
}

export default AddProductRow