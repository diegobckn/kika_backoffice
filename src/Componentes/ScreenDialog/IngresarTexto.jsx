/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import System from "../../Helpers/System";
import TecladoPrecio from "../Teclados/TecladoPrecio";
import TecladoAlfaNumerico from "../Teclados/TecladoAlfaNumerico";
import { Visibility, VisibilityOff } from "@mui/icons-material";


const IngresarTexto = ({
  openDialog,
  setOpenDialog,
  title,
  varChanger,
  varValue,
  isEmail = false,
  isUrl = false,
  verOcultar = null,
  setVerOcultar = null,
  onEnter=()=>{}
}) => {

  const textInfoRef = useRef(null)


  const handlerSaveAction = ()=>{
    if(varValue == 0){
      alert("Debe ingresar un valor");
      return;
    }
    setOpenDialog(false)
  }

  const handleKeydownSearchInput = (e)=>{
    if(e.keyCode == 13){
      setOpenDialog(false)
      if(onEnter) onEnter()
    }
  }


  const toggleOcultarCaracteres = ()=>{
    if(!setVerOcultar)return
    setVerOcultar(!verOcultar)
  }


  useEffect(()=>{
    if(openDialog){
      System.intentarFoco(textInfoRef)
    }
  },[ openDialog, textInfoRef ])
  
  return (
    <Dialog open={openDialog} onClose={()=>{
      setOpenDialog(false)
    }} maxWidth="md">
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>

        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                margin="normal"
                fullWidth
                ref={textInfoRef}
                type={verOcultar || verOcultar === null ? "text" : "password"}
                value={varValue}
                onChange={(e) => varChanger(e.target.value)}
                onKeyDown={handleKeydownSearchInput}
                sx={{
                  marginBottom:"20px"
                }}

                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={()=>{
                          toggleOcultarCaracteres()
                        }}
                        sx={{
                          color:(setVerOcultar ? "darkgray" : "transparent")
                        }}
                        edge="end"
                      >
                        {verOcultar ? <VisibilityOff fontSize="small"  /> : <Visibility fontSize="small"  />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}


              />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
          <TecladoAlfaNumerico
            onEnter={()=>{
              setOpenDialog(false)
              if(onEnter) onEnter()
            }}
            showFlag={true}
            isEmail={isEmail}
            isUrl={isUrl}
            varChanger={varChanger}
            varValue={varValue}
            style={{
              position:"relative",
              width:"800px"
            }}
          />
          </Grid>
        </Grid>

        </DialogContent>
        <DialogActions>
          <SmallButton textButton="Aceptar" actionButton={handlerSaveAction}/>
          <Button onClick={()=>{
            setOpenDialog(false)
          }}>Volver</Button>
        </DialogActions>
      </Dialog>
  );
};

export default IngresarTexto;
