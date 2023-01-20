import React, { useState } from 'react'
import { Box, IconButton, Typography, Button } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BulkAddRow from './resuable/BulkAddRow';

function BulkAddForm({ closeEvent }) {
    const [rows, setRows] = useState(1);

    const handleUpload = () => console.log("handling submit")
    return (
        <>
            <Box sx={{ width: 'auto' }}>
                <Typography variant='h5' align='center'>
                    Add Multiple Products
                </Typography>
                <IconButton style={{ position: 'absolute', top: '0', right: '0' }} onClick={closeEvent}>
                    <CloseIcon />
                </IconButton>
                {[...Array(rows)].map((i, index) => (
                    <>
                        <BulkAddRow key={index + 1} />
                        {console.log(index)}
                    </>

                ))}
                <IconButton onClick={() => setRows(rows + 1)} style={{ display: 'block', margin: '15px auto 0' }}>
                    <AddCircleIcon />
                </IconButton>
                <Typography variant="h5" align="right">
                    <Button variant="contained" style={{width: '200px', marginRight: '25px'}} onClick={handleUpload}>
                        Submit
                    </Button>
                </Typography>
            </Box>
        </>
    )
}

export default BulkAddForm