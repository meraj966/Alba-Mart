import React, { useState } from 'react';
import {Box,Typography} from "@mui/material";

const style = {
    position: 'absolute',
    top: '50%',
    left: '58%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


function ProductsAvailability({title}) {
    const [value, setValue] = useState("")
    return (
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                {title}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {value}
            </Typography>
        </Box>
    )
}

export default ProductsAvailability