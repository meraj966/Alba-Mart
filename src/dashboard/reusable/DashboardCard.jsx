import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';



const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

function DashboardCard({header, value}) {
    return (
        <Card sx={{ minWidth: 275} }>
            <CardActionArea>
                <CardContent>
                    <Typography variant="h5" component="h5" align = "center" >
                        {header}
                    </Typography>
                    <Typography variant="h5" component="h5" align = "center" color="text.secondary">
                        {value}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default DashboardCard