import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';


function DashboardCardStock({value,header}) {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardActionArea>
                <CardContent>
                    <Typography variant="h5" component="h5" align="center" >
                        {value}
                    </Typography>
                    <Typography variant="h5" component="h5" align="center" color="text.secondary">
                        {header}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default DashboardCardStock