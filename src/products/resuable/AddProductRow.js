import React, { useEffect, useState } from 'react'
import { CurrencyRupee } from '@mui/icons-material';
import { Grid, InputAdornment, TextField } from '@mui/material'
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';

function AddProductRow({ products, setProducts, index }) {
    const [settings, setSettings] = useState(null)
    const [categoryData, setCategoryData] =useState(null)
    const dataRef = collection(db, "Settings");
    const categoryRef = collection(db, "category");
    const [rowData, setRowData] = useState({
        name: "",
        description: "",
        saleType: "",
        saleTypeList: [],
        onSale: false,
        file: null,
        subCategory: "",
        measureUnit: "",
        quantity: 0,
        price: 0,
        category: "",
        saleValue: "",
        categories: []
    })
    const [category, setCategory] = useState("")
    const [subCategoryList, setSubCategoryList] = useState([])
    const [categoryList, setCategoryList] = useState([])
    useEffect(() => {
        getSettingsData()
    }, [])
    useEffect(()=>{
        if (categoryData) 
        setSubCategoryList(
            Object.keys(categoryData.find((i) => i.name === category)?.subCategory || {})
          );    
        }, [category])
    useEffect(()=>{
        console.log("SETTTINGS IN ADD PRODUCTS", settings)
        if (settings) {
            console.log(settings[0])
            let newRowData = {...rowData}
            newRowData["onSale"] = settings[0]["onSale"]
            newRowData["saleType"] = settings[0]["defaultSaleType"]
            newRowData["saleTypeList"] = settings[0]["saleType"]
            newRowData["defaultUnit"] = settings[0]["defaultUnit"]
            newRowData["categories"] = settings[0]["categories"]
            // newRowData["category"] = Object.keys(settings[0]["categories"])
            setCategory(settings[0]["defaultCategory"])
            newRowData["measureUnit"] = settings[0]["defaultUnit"]
            setRowData(newRowData)
        }
    }, [settings])
    useEffect(()=>{
        if(categoryData){
            setCategoryList(categoryData.map((i) => i.name));
            setSubCategoryList(
                Object.keys(categoryData.find((i) => i.name === category)?.subCategory || {})
              );
        }
    },[categoryData])
    const getSettingsData = async () => {
        const data = await getDocs(dataRef);
        const categoryData = await getDocs(categoryRef);
        setCategoryData(categoryData.docs.map((doc) => ({ ...doc.data() })));
        setSettings(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    const handleChange = async (event) => {
        let data = {}
        if (event.target.name==="category") {
            setCategory(event.target.value)
            return 
        }
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
                        {rowData["saleTypeList"]?.map((option) => (
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
                    value={category}
                    onChange={handleChange}
                    size="small"
                    sx={{ minWidth: "100%" }}
                >
                    {categoryList?.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={2.5}>
                <TextField
                    error={false}
                    id="subCategory"
                    label="Sub Category"
                    select
                    name='subCategory'
                    value={rowData["subCategory"]}
                    onChange={handleChange}
                    size="small"
                    sx={{ minWidth: "100%" }}
                >
                    {subCategoryList?.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
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
                    {settings && settings[0]["unit"]?.map((option) => (
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