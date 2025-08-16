import React, { useState, useEffect, useContext } from "react";

import { Grid, Paper, Dialog, Typography, Box } from "@mui/material";
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

export default function EditarPreVenta({ 
  onClose, 
  openDialog, 
  setOpendialog,
  data,
  onUpdate
 }) {
  const { showLoading, hideLoading, showLoadingDialog, showMessage } =
    useContext(SelectedOptionsContext);

  var states = {
    nombre:useState(""),
    sucursal:useState(""),
  
    cliente_id : useState(""),
    secret : useState(""),
    baseurl : useState(""),
    sNumber : useState(""),

  };

  var validatorStates = {
    
    nombre: useState(null),
    sucursal: useState(null),
    
    cliente_id: useState(null),
    secret: useState(null),
    baseurl: useState(null),
    sNumber: useState(null),
    
  };

  const handleSubmit = async () => {
    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false;
    }
    const dataEdit = {
      "idCaja": data.idCaja,
      "idSucursal": states.sucursal[0],
      "puntoVenta": states.nombre[0],
      "idSucursalPvTipo": data.idSucursalPvTipo,
      "fechaIngreso": System.getInstance().getDateForServer(),
      "fechaUltAct": System.getInstance().getDateForServer(),
      "puntoVentaConfiguracions": [
        {
          "fechaIngreso": System.getInstance().getDateForServer(),
          "fechaUltAct": System.getInstance().getDateForServer(),
          "idCaja": data.idCaja,
    
    
          "grupo": "Redelcom",
          "entrada": "cliente_id",
          "valor": states.cliente_id[0],
        },

        {
            "fechaIngreso": System.getInstance().getDateForServer(),
            "fechaUltAct": System.getInstance().getDateForServer(),
            "idCaja": data.idCaja,
      
      
            "grupo": "Redelcom",
            "entrada": "secret",
            "valor": states.secret[0],
        },

        {
            "fechaIngreso": System.getInstance().getDateForServer(),
            "fechaUltAct": System.getInstance().getDateForServer(),
            "idCaja": data.idCaja,
      
      
            "grupo": "Redelcom",
            "entrada": "baseurl",
            "valor": states.baseurl[0],
        },


        {
            "fechaIngreso": System.getInstance().getDateForServer(),
            "fechaUltAct": System.getInstance().getDateForServer(),
            "idCaja": data.idCaja,
      
      
            "grupo": "Redelcom",
            "entrada": "sNumber",
            "valor": states.sNumber[0],
        },
      ]
    };

    console.log("Datos antes de enviar:", dataEdit);
    showLoading("Enviando...");
    const caj = new SucursalPreventa()
    caj.add(dataEdit,(responseData)=>{
      hideLoading();
      showMessage(responseData.descripcion)
      onUpdate()
    },(error)=>{
      hideLoading();
      showMessage(error)
    })
  };


  useEffect(()=>{
    if(data){
        console.log("data",data)
        states.nombre[1](data.sPuntoVenta)
        setTimeout(() => {
          states.sucursal[1](data.idSucursal)
          console.log("data.idSucursal",data.idSucursal)
        }, 1000);



        if(data.puntoVentaConfiguracions.length>0){
          data.puntoVentaConfiguracions.forEach((cfg,ix)=>{
            if(cfg.entrada == "cliente_id"){
              states.cliente_id[1](cfg.valor)
            }else if(cfg.entrada == "secret"){
              states.secret[1](cfg.valor)
            }else if(cfg.entrada == "baseurl"){
              states.baseurl[1](cfg.valor)
            }else if(cfg.entrada == "sNumber"){
              states.sNumber[1](cfg.valor)
            }
          })
        }
    }
  },[data, openDialog])


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
            <h2>Editar Pre Venta</h2>
          </Grid>

          <Grid item xs={12} md={6}>
          <InputName
              inputState={states.nombre}
              label="Descripcion"
              required={true}
              validationState={validatorStates.nombre}
            />
          </Grid>

          <Grid item xs={12} md={6}>
          <SelectSucursal
              inputState={states.sucursal}
              label="Seleccionar sucursal"
              required={true}
              validationState={validatorStates.sucursal}
            />
          </Grid>

          
          <Box sx={{ 
            display: "flex",
            border: "1px solid dimgray",
            backgroundColor:"#F7F7F7",
            borderRadius:"3px",
            marginLeft:"15px",
            marginTop:"20px",
            padding:"20px"
            }}>

            <Grid container spacing={2} sx={{ padding: "2%" }}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography>Redelcom</Typography>
              </Grid>

              <br/>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <InputName
                  inputState={states.cliente_id}
                  required={false}
                  fieldName="cliente id"
                  validationState={validatorStates.cliente_id}
                  />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <InputName
                  inputState={states.secret}
                  required={false}
                  fieldName="secret"
                  validationState={validatorStates.secret}
                  />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <InputName
                  inputState={states.baseurl}
                  required={false}
                  fieldName="baseurl"
                  validationState={validatorStates.baseurl}
                  />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <InputName
                  inputState={states.sNumber}
                  required={false}
                  fieldName="sNumber"
                  validationState={validatorStates.sNumber}
                  />
              </Grid>
            </Grid>
          </Box>

          
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
