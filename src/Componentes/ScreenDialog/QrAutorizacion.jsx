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
  CircularProgress,
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";

var prods = [];
for (let index = 1; index <= 5; index++) {
  prods.push(index);
}

const QrAutorizacion = ({
  openDialog,
  setOpenDialog,
  qrAutorizacion
}) => {

  const verDiv = ()=>{
    const allDiv = document.querySelectorAll(".divVerAutorizacion")
    if(allDiv.length>0){
      document.querySelectorAll(".divVerAutorizacion").forEach((div)=>{
        if(div){
          div.innerHTML = qrAutorizacion
        }
      })
    }else{
      setTimeout(() => {
        verDiv()
      }, 500);
    }
  }
  
  useEffect(()=>{
    if(!openDialog)return
    if(qrAutorizacion!=""){
      verDiv()
    }
  },[openDialog])
  
  return (
      <Dialog open={openDialog} maxWidth="sm" onClose={()=>{
        setOpenDialog(false)
      }}
      >
        <DialogTitle>
          Autorizacion
        </DialogTitle>
        <DialogContent>
        <Grid container item xs={12} spacing={2} sx={{

        }}>
          
              <Grid item xs={12} lg={12}>

              {qrAutorizacion ? (
                <div className="divVerAutorizacion"></div>
              ) : (
                <CircularProgress/>
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

export default QrAutorizacion;
