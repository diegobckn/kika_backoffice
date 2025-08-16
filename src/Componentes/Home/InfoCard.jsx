/* eslint-disable no-unused-vars */
import React from 'react'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { AddCircle } from "@mui/icons-material";
import Login from '../../Pages/Login';


const numero = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    100.000
  </Box>
);

const card = (
  <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 14, display:"flex",  justifyContent:"center"}} color="text.secondary" gutterBottom>
       VENTAS
      </Typography>
      <Typography variant="h5" component="div">
       {numero}
      </Typography>
      <IconButton component={Link} to="/login" color="primary" aria-label="Link">
      <AddCircle />
    </IconButton>

      
    </CardContent>
    <CardActions>
      <Button size="small">mas</Button>
    </CardActions>
  </React.Fragment>
);

export default function OutlinedCard() {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}

