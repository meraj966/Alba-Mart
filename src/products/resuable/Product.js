import React from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from '@mui/material/Tooltip';
import Swal from "sweetalert2";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db } from "../../firebase-config";
function Product({ id, name, date, file, onSale, price, saleType, saleValue, description, category, menuType, quantity, measureUnit, deleteProd, handleEditOpen , setFormid, data}) {
    let salePrice = price
    let discount = 0
    console.log(menuType)
    if (onSale) {
        if (saleType === "%") {
            let percent = (saleValue / 100).toFixed(2);
            discount = (price * percent).toFixed(2)
            salePrice = price - discount
        } else {
            discount = saleValue
            salePrice = price - saleValue
        }
    }

    const deleteApi = async (id) => {
        const userDoc = doc(db, "Menu", id);
        await deleteDoc(userDoc);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        deleteProd();
    };

    const deleteProduct = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.value) {
                deleteApi(id);
            }
        });
    };

    const editData = (rowData) => {
        const data = {
            ...rowData,
            date: new Date(), 
        };
        setFormid(data);
        handleEditOpen();
    };

    return (<Card style={onSale && { border: "2px solid red" } || null}>
        <CardHeader
            title={name}
            subheader={new Date(date).toLocaleString()}
            action={
                <>
                    <IconButton aria-label="edit" onClick={data=>editData(data)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={deleteProduct}>
                        <DeleteIcon />
                    </IconButton>
                </>
            } />
        <CardMedia component="img" height={"194"} image={file} alt={name} />
        <CardContent>
            <Typography>{description}</Typography>
            <div style={{ display: "flex" }}>
                <Typography style={{ width: "70%" }}> {category} | {menuType} |  {quantity} {measureUnit}</Typography>
                <Tooltip title={onSale && `Actual Price:  ${price} | Discount: ${discount}`} >
                    <Typography style={{ textAlignLast: "right", width: "30%" }}>
                        <>Price: <b>&#8377;{salePrice}</b></>
                    </Typography>
                </Tooltip>

            </div>
        </CardContent>
    </Card>
    )
}

export default Product