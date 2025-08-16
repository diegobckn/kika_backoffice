import React, { useState, useEffect, useContext } from "react";

import { Grid, Paper, Dialog } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";


import InputName from "../Elements/Compuestos/InputName";
import InputFile from "../Elements/Compuestos/InputFile"
import SelectPasarela from "../Elements/Compuestos/SelectPasarela"
import SelectImpresora from "../Elements/Compuestos/SelectImpresora";

import SendingButton from "../Elements/SendingButton";
import User from "../../Models/User";
import System from "../../Helpers/System";
import SucursalPreventa from "../../Models/SucursalPreventa";
import SelectSucursal from "../Elements/Compuestos/SelectSucursal";
import TiposPasarela from "../../definitions/TiposPasarela";

export default function IngresoPreVenta({ 
  onClose, 
  openDialog, 
  setOpendialog,
  onCreate
 }) {
  const { showLoading, hideLoading, showLoadingDialog, showMessage } =
    useContext(SelectedOptionsContext);

  var states = {
    nombre:useState(""),
    sucursal:useState(""),
  
   
  };

  var validatorStates = {
    
    nombre: useState(null),
    sucursal: useState(null),
    
    
  };

  const handleSubmit = async () => {
    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false;
    }
    const data = {
      "idCaja": 0,
      "idSucursal": states.sucursal[0],
      "puntoVenta": states.nombre[0],
      "idSucursalPvTipo": TiposPasarela.CAJA,
      "fechaIngreso": System.getInstance().getDateForServer(),
      "fechaUltAct": System.getInstance().getDateForServer(),
      "puntoVentaConfiguracions": [
      ]
    };

    // console.log("Datos antes de enviar:", data);return
    showLoading("Enviando...");
    const caj = new SucursalPreventa()
    caj.add(data,(responseData)=>{
      hideLoading();
      showMessage(responseData.descripcion)
      onCreate()
    },(error)=>{
      hideLoading();
      showMessage(error)
    })
  };

  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        setOpendialog(false);
        onClose();
      }}
      maxWidth={"lg"}
    >
      <Paper elevation={16} square>
        <Grid container spacing={2} sx={{ padding: "2%" }} >
          <Grid item xs={12}>
            <h2>Ingreso Pre Venta</h2>
          </Grid>

          <Grid item xs={12} md={6}>
          <InputName
              inputState={states.nombre}
              label="Descripcion"
              fieldName="descripcion"
              required={true}
              validationState={validatorStates.nombre}
            />
          </Grid>

          <Grid item xs={12} md={6}>
          <SelectSucursal
              inputState={states.sucursal}
              label="Seleccionar sucursal"
              required={true}
              fieldName="sucursal"
              validationState={validatorStates.sucursal}
            />
          </Grid>

          {/* <Grid item xs={12} md={6}>
            <SelectImpresora
              inputState={states.nombre}
              fieldName="Selecciona Tipo de Impresora "
              required={true}
              validationState={validatorStates.nombre}
            />
          </Grid> */}
          {/* <Grid item xs={12} md={6}>
            <InputFile
              inputState={states.nombre}
              fieldName="Certificado Digital"
              required={true}
              validationState={validatorStates.nombre}
            />
          </Grid> */}
          {/* <Grid item xs={12} md={6}sx={{marginBottom:"6px"}}>
            <SelectPasarela
              inputState={states.nombre}
              fieldName="Selecciona Pasarela"
              required={true}
              validationState={validatorStates.nombre}
              
            />
          </Grid> */}
         

          <SendingButton
            textButton="Guardar Pre Venta"
            actionButton={handleSubmit}
            sending={showLoadingDialog}
            sendingText="Registrando..."
            style={{
              width: "50%",
              margin: "0 25%",
              backgroundColor: "#950198",
            }}
          />
        </Grid>
      </Paper>
    </Dialog>
  );
}
