import React, { useState, useEffect, useContext } from "react";

import { Grid, Paper, Dialog } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

import InputName from "../Elements/Compuestos/InputName";
import InputNumber from "../Elements/Compuestos/InputNumber";

import SendingButton from "../Elements/SendingButton";

import User from "../../Models/User";
import MetodoImpresion from "../../Models/MetodoImpresion";
import SelectImpresora from "../Elements/Compuestos/SelectImpresora";

import System from "../../Helpers/System";

export default function IngresoMetodoImpresion({
  onClose,
  openDialog,
  setOpendialog,
}) {
  const { showLoading, hideLoading, showLoadingDialog, showMessage } =
    useContext(SelectedOptionsContext);

  var states = {
    tipoImpresion: useState(""),
    marcaImpresora: useState(""),
    modeloImpresora: useState(""),
    tiempoImpresion1: useState(""),
    tiempoImpresion2: useState(""),
  };

  var validatorStates = {
    tipoImpresion: useState(null),
    marcaImpresora: useState(null),
    modeloImpresora: useState(null),
    tiempoImpresion1: useState(null),
    tiempoImpresion2: useState(null),
  };

  const handleSubmit = async () => {
    //Validaciones

    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false;
    }

    const metodoImpresion = {
      marcaImpresora: states.marcaImpresora[0],
      tipoImpresion: states.tipoImpresion[0] + "",
      modeloImpresora: states.modeloImpresora[0],
      tiempoImpresion1: states.tiempoImpresion1[0],
      tiempoImpresion2: states.tiempoImpresion2[0],
    };

    console.log("Datos antes de enviar:", metodoImpresion);
    showLoading("Enviando...");
    MetodoImpresion.getInstance().add(
      metodoImpresion,
      (res) => {
        console.log("llego al callok");
        hideLoading();
        showMessage("Metodo Impresion creado exitosamente");
        setTimeout(() => {
          onClose();
        }, 2000);
      },
      (error) => {
        console.log("llego al callwrong", error);
        hideLoading();
        showMessage(error);
      }
    );
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
        <Grid container spacing={2} sx={{ padding: "2%" }}>
          <Grid item xs={12}>
            <h2>Ingreso Método Impresión </h2>
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectImpresora
              inputState={states.tipoImpresion}
              fieldName="Selecciona Tipo de Impresora "
              required={true}
              validationState={validatorStates.tipoImpresion}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <InputName
              inputState={states.marcaImpresora}
              fieldName="Marca Impresora"
              required={true}
              validationState={validatorStates.marcaImpresora}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputName
              inputState={states.modeloImpresora}
              fieldName="Modelo Impresora"
              required={true}
              validationState={validatorStates.modeloImpresora}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <InputNumber
              inputState={states.tiempoImpresion1}
              fieldName=" Tiempo de Impresión 1"
              required={true}
              validationState={validatorStates.tiempoImpresion1}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputNumber
              inputState={states.tiempoImpresion2}
              fieldName=" Tiempo de Impresión 2"
              required={true}
              validationState={validatorStates.tiempoImpresion2}
            />
          </Grid>

          <SendingButton
            textButton="crear método de impresión"
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
