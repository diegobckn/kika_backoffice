import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Typography,
  DialogTitle,
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";

var prods = [];
for (let index = 1; index <= 5; index++) {
  prods.push(index);
}

const QrStockMobile = ({
  openDialog,
  setOpenDialog,
  qrLink
}) => {
  
  

  // useEffect( ()=>{
  // }, [])

  
  return (
      <Dialog open={openDialog} maxWidth="sm" onClose={()=>{
        setOpenDialog(false)
      }}
      >
        <DialogTitle>
          Stock mobile
        </DialogTitle>
        <DialogContent>
        <Grid container item xs={12} spacing={2} sx={{

        }}>
          
              <Grid item xs={12} lg={12}>


              { qrLink !="" && (
                <>
                <img src={qrLink} alt="" />
                </>
              )}


              </Grid>
        </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{
            setOpenDialog(false)
          }}>Atras</Button>
        </DialogActions>
      </Dialog>
  );
};

export default QrStockMobile;
