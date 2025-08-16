import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Grid, Paper, Dialog } from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

import InputRutUsuario from "../Elements/Compuestos/InputRutUsuario";
import InputRutCliente from "../Elements/Compuestos/InputRutCliente";

import InputName from "../Elements/Compuestos/InputName";
import InputEmail from "../Elements/Compuestos/InputEmail";
import InputPhone from "../Elements/Compuestos/InputPhone";
import InputNumber from "../Elements/Compuestos/InputNumber";
import InputPassword from "../Elements/Compuestos/InputPassword";
import InputPage from "../Elements/Compuestos/InputPage";
import SelectList from "../Elements/Compuestos/SelectList";
import SelectUserRoles from "../Elements/Compuestos/SelectUserRoles";
import SelectRegion from "../Elements/Compuestos/SelectRegion";
import SelectComuna from "../Elements/Compuestos/SelectComuna";
import SendingButton from "../Elements/SendingButton";
import User from "../../Models/User";
import Client from "../../Models/Client"
import System from "../../Helpers/System";
export const defaultTheme = createTheme();

const IngresoCL = ({ onClose, openDialog, setOpendialog }) => {
  const { showLoading, hideLoading, showLoadingDialog, showMessage } =
    useContext(SelectedOptionsContext);

  var states = {
    rut: useState(""),
    nombre: useState(""),
    apellido: useState(""),
    correo: useState(""),
    razonSocial: useState(""),
    phone: useState(""),
    direccion: useState(""),
    region: useState(-1),
    comuna: useState(-1),
    giro: useState(""),
    formaPago: useState(""),
    urlPagina: useState(""),
  };

  var validatorStates = {
    rut: useState(null),
    nombre: useState(null),
    apellido: useState(null),
    correo: useState(null),
    razonSocial: useState(null),
    phone: useState(null),
    direccion: useState(null),
    region: useState(null),
    comuna: useState(null),
    giro: useState(null),
    formaPago: useState(null),
    urlPagina: useState(null),
  };

  const handleSubmit = async () => {
    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false;
    }
    const cliente = {
      rut: states.rut[0],
      nombre: states.nombre[0],
      apellido: states.apellido[0],
      correo: states.correo[0],
      razonSocial: states.razonSocial[0],
      telefono: states.phone[0],
      direccion: states.direccion[0],
      region: states.region[0] + "",
      comuna: states.comuna[0] + "",
      giro: states.giro[0],
      formaPago: states.formaPago[0],
      urlPagina: states.urlPagina[0],
    };

    console.log("Datos antes de enviar:", cliente);
    showLoading("Enviando...");
    Client.getInstance().create(
      cliente,
      (res) => {
        console.log("llego al callok");
        hideLoading();
        showMessage("Cliente creado exitosamente");
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
            <h2>Ingreso Clientes</h2>
          </Grid>

          <Grid item xs={12} md={4}>
            <InputRutCliente
              vars={[states, validatorStates]}
              required={true}
              autoFocus={true}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputName
              vars={[states, validatorStates]}
              fieldName="nombre"
              required={true}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputName
              fieldName="apellido"
              vars={[states, validatorStates]}
              required={true}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputEmail
              fieldName="correo"
              vars={[states, validatorStates]}
              required={true}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputName
              label="Razón Social"
              fieldName="razonSocial"
              vars={[states, validatorStates]}
              required={true}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputPhone
              label="Tel&eacute;fono"
              fieldName="phone"
              vars={[states, validatorStates]}
              required={true}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <InputName
              label="Direcci&oacute;n"
              fieldName="direccion"
              required={true}
              maxLength={30}
              vars={[states, validatorStates]}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SelectRegion
              label="Regi&oacute;n"
              fieldName="region"
              required={true}
              vars={[states, validatorStates]}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SelectComuna
              fieldName="comuna"
              inputRegionState={states.region}
              required={true}
              vars={[states, validatorStates]}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputName
              fieldName="giro"
              required={true}
              maxLength={30}
              vars={[states, validatorStates]}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputName
              label="Forma de pago"
              fieldName="formaPago"
              required={true}
              maxLength={30}
              vars={[states, validatorStates]}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputPage
              label="Pagina Web"
              fieldName="urlPagina"
              required={true}
              maxLength={100}
              vars={[states, validatorStates]}
            />
          </Grid>

          <Grid item xs={12}>
            <SendingButton
              textButton="Registrar Cliente"
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
        </Grid>
      </Paper>
    </Dialog>
  );
};

export default IngresoCL;
