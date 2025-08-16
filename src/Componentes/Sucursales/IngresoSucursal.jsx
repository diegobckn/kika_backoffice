import React, { useState, useEffect, useContext } from "react";

import { Grid, Paper, Dialog, Typography, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

import InputName from "../Elements/Compuestos/InputName";
import SelectRegion from "../Elements/Compuestos/SelectRegion";
import SelectComuna from "../Elements/Compuestos/SelectComuna";

import SendingButton from "../Elements/SendingButton";

import Sucursal from "../../Models/Sucursal";

import System from "../../Helpers/System";
import InputFile from "../Elements/Compuestos/InputFile";
import SelectUser from "../Elements/Compuestos/SelectUser";
export const defaultTheme = createTheme();

export default function Ingreso({ 
  onClose, 
  openDialog, 
  setOpendialog,
  onCreate
}) {
  const { showLoading, hideLoading, showLoadingDialog, showMessage } =
    useContext(SelectedOptionsContext);

  var states = {
    nombre: useState(""),
    direccion: useState(""),

    region: useState(-1),
    comuna: useState(-1),

    // certificado: useState(-1),
    user: useState(""),
  };

  var validatorStates = {
    nombre: useState(null),
    direccion: useState(null),
    region: useState(null),
    comuna: useState(null),
    // certificado: useState(null),
    user: useState(null),
  };

  const handleSubmit = async () => {
    //Validaciones

    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false;
    }

    const sucursal = {
      descripcionSucursal: states.nombre[0],
      direccion: states.direccion[0],
      idRegion: states.region[0],
      idComuna: states.comuna[0],
      codigoUsuarioResponsable: states.user[0],
      // certificado: states.certificado[0],
    };

    console.log("Datos antes de enviar:", sucursal);
    showLoading("Enviando...");
    Sucursal.getInstance().add(
      sucursal,
      (res) => {
        console.log("llego al callok");
        onCreate()
        hideLoading();
        showMessage("Sucursal creado exitosamente");
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
      maxWidth={"md"}
    >
      <Paper elevation={16} square>
        <Grid container spacing={2} sx={{ padding: "2%" }}>
          <Grid item xs={12}>
            <h2>Ingreso Sucursal</h2>
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <InputName
              label={"Nombre "}
              inputState={states.nombre}
              fieldName="nombre"
              required={true}
              validationState={validatorStates.nombre}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <InputName
              inputState={states.direccion}
              required={true}
              fieldName="direccion"
              validationState={validatorStates.direccion}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <SelectUser
              inputState={states.user}
              required={true}
              fieldName="usuario responsable"
              validationState={validatorStates.user}
            />
          </Grid>


          <Grid item xs={12} sm={12} md={6} lg={6}>
            <SelectRegion
              inputState={states.region}
              fieldName="region"

              required={true}
              validationState={validatorStates.region}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <SelectComuna
              inputState={states.comuna}
              inputRegionState={states.region}
              fieldName="comuna"
              required={true}
              validationState={validatorStates.comuna}
            />
          </Grid>

          {/* <Grid item xs={12} sm={12} md={7} lg={7}>
            <InputFile
              inputState={states.certificado}
              fieldName="Certificado Digital"
              required={false}
              validationState={validatorStates.certificado}
              />
          </Grid> */}

          <SendingButton
            textButton="crear sucursal"
            actionButton={handleSubmit}
            sending={showLoadingDialog}
            sendingText="Registrando..."
            style={{
              width: "50%",
              margin: "20px 25%",
              backgroundColor: "#950198",
            }}
          />
        </Grid>
      </Paper>
    </Dialog>
  );
}
