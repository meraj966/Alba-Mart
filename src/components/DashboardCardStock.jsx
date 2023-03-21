import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';


function DashboardCardStock({value,header}) {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardActionArea>
                <CardContent>
                    <Typography variant="h4" component="h4" align="center" >
                        {value}
                    </Typography>
                    <Typography variant="h4" component="h4" align="center" color="text.secondary">
                        {header}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default DashboardCardStock