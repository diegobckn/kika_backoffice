import React, { useState, useEffect, useContext } from "react";

import { Grid, Paper, Dialog, Box, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";


import InputName from "../Elements/Compuestos/InputName";
import InputFile from "../Elements/Compuestos/InputFile"
import SelectPasarela from "../Elements/Compuestos/SelectPasarela"
import SelectImpresora from "../Elements/Compuestos/SelectImpresora";

import SendingButton from "../Elements/SendingButton";
import User from "../../Models/User";
import System from "../../Helpers/System";
import Pasarela from "../../Models/Pasarela";
import SelectSucursal from "../Elements/Compuestos/SelectSucursal";
import TiposPasarela from "../../definitions/TiposPasarela";
import SucursalCaja from "../../Models/SucursalCaja";

export default function IngresoCajaSucursal({
  onClose,
  openDialog,
  setOpendialog,
  onCreate
}) {
  const { showLoading, hideLoading, showLoadingDialog, showMessage } =
    useContext(SelectedOptionsContext);

  var states = {
    nombre: useState(""),
    sucursal: useState(""),

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

    // console.log("Datos antes de enviar:", data);
    showLoading("Enviando...");
    const caj = new SucursalCaja()
    caj.add(data, (responseData) => {
      hideLoading();
      showMessage(responseData.descripcion)
      if (onCreate) onCreate()
    }, (error) => {
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
      maxWidth={"md"}
    >
      <Paper elevation={16} square>
        <Grid container spacing={2} sx={{ padding: "2%" }} >
          <Grid item xs={12}>
            <h2>Ingreso Caja Sucursal</h2>
          </Grid>

          <Grid item xs={12} md={6}>
            <InputName
              inputState={states.nombre}
              fieldName="Descripcion"
              required={true}
              validationState={validatorStates.nombre}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <SelectSucursal
              label="Sucursal"
              fieldName="sucursal"
              required={true}
              vars={[states, validatorStates]}
            />
          </Grid>

          <SendingButton
            textButton="Guardar Caja"
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
