import React, { useState } from 'react'
import map from "lodash/map";
import isNull from "lodash/isNull";
import { Box, IconButton, Typography, Button } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BulkAddRow from './resuable/BulkAddRow';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Swal from "sweetalert2";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase-config";
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useAppStore } from '../appStore';

const { v4: uuidv4 } = require('uuid');

function BulkAddForm({ closeEvent }) {
    const [products, setProducts] = useState([]);
    const [rows, setRows] = useState([1]);
    const [percent, setPercent] = useState(0)
    const dataRef = collection(db, "Menu");
    const setData = useAppStore((state) => state.setRows);

    const getUsers = async () => {
        const data = await getDocs(dataRef);
        setData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const addItem = async (url) => {
        Object.values(products).map(async (prod) => {
            console.log(prod)
            await addDoc(dataRef, {
                name: prod["name"],
                description: prod["description"],
                price: Number(prod["price"]),
                menutype: prod["menuType"],
                category: prod["category"],
                file: url,
                onSale: prod["onSale"],
                measureUnit: prod["measureUnit"],
                saleValue: prod["saleValue"],
                date: String(new Date())
            });
            getUsers();
            closeEvent();
        })
        getUsers();
        closeEvent();
        Swal.fire("Submitted!", "Your file has been submitted.", "success");
    }

    const handleUpload = () => {
        const files = map(products, "file")
        console.log(files)
        if (files.every(isNull)) {
            Swal.fire("Failed!", "Please upload an image first!", "error");
        } else {
            const storageRef = []
            files.every(file => {
                const storageRef = ref(storage, `/images/${file.name + uuidv4()}`)
                const uploadTask = uploadBytesResumable(storageRef, file);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const percent = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );

                        // update progress
                        setPercent(percent);
                    },
                    (err) => console.log(err),
                    () => {
                        // download url
                        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                            console.log(url);
                            addItem(url);
                        });
                    }
                );
            })
            console.log(files, storageRef)
        }
    }
    console.log(products, rows)
    return (
        <>
            <Box sx={{ width: 'auto' }}>
                <Typography variant='h5' align='center'>
                    Add Multiple Products
                </Typography>
                <IconButton style={{ position: 'absolute', top: '0', right: '0' }} onClick={closeEvent}>
                    <CloseIcon />
                </IconButton>
                {rows.map((index) => (
                    <Card sx={{ marginTop: "25px", border: "1px solid" }}>
                        <CardHeader action={
                            <IconButton aria-label="close" onClick={() => {
                                const i = rows.indexOf(index)
                                const prods = { ...products }
                                const newRows = [...rows]
                                if (i > -1) {
                                    newRows.splice(i, 1)
                                    delete prods[`${index}-Row`]
                                }
                                setProducts(prods)
                                setRows(newRows)
                            }}>
                                <CloseIcon />
                            </IconButton>
                        } />
                        <CardContent>
                            <BulkAddRow key={index * 2} index={`${index}-Row`} setProducts={setProducts} products={products} />
                        </CardContent>
                    </Card>
                ))}
                <IconButton onClick={() =>
                    setRows([...rows, rows.length ? rows[rows.length - 1] + 1 : 1])
                } style={{ display: 'block', margin: '15px auto 0' }}>
                    <AddCircleIcon />
                </IconButton>
                <Typography variant="h5" align="right">
                    <Button variant="contained" style={{ width: '200px', marginRight: '25px' }} onClick={handleUpload}>
                        Submit
                    </Button>
                </Typography>
            </Box>
        </>
    )
}

export default BulkAddForm