import React, { useState, useEffect, useContext } from "react";

import { Grid, Paper, Dialog } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";


import InputName from "../Elements/Compuestos/InputName";
import InputNumber from "../Elements/Compuestos/InputNumber";

import SendingButton from "../Elements/SendingButton";
import User from "../../Models/User";


import System from "../../Helpers/System";


export default function IngresoPasarelaPago({ onClose, openDialog, setOpendialog }) {
  const { showLoading, hideLoading, showLoadingDialog, showMessage } =
    useContext(SelectedOptionsContext);

  var states = {
    empresaPasarela:useState(""),
    numeroMaquina: useState(""),
    marcaPasarela: useState(""),
    modeloPasarela: useState(""),
   
  };

  var validatorStates = {
    
    empresaPasarela: useState(null),
    numeroMaquina: useState(null),
    marcaPasarela: useState(null),
    modeloPasarela: useState(null),
    
  };

  // const handleSubmit = async () => {
  //   //Validaciones

  //   if (!System.allValidationOk(validatorStates, showMessage)) {
  //     return false;
  //   }
  //   // console.log(rut)
  //   // console.log(nombre)
  //   const usuario = {
  //     rut: states.rut[0],
  //     nombres: states.nombre[0],
  //     apellidos: states.apellido[0],
  //     correo: states.correo[0],
  //     telefono: states.phone[0],
  //     codigoUsuario: states.userCode[0],
  //     direccion: states.direccion[0],
  //     codigoPostal: states.postalCode[0],
  //     clave: states.clave[0],
  //     remuneracion: states.remuneracionTipo[0],
  //     rol: states.rol[0] + "",
  //     region: states.region[0] + "",
  //     comuna: states.comuna[0] + "",
  //     credito: states.credit[0],
  //   };

  //   console.log("Datos antes de enviar:", usuario);
  //   showLoading("Enviando...");
  //   User.getInstance().add(
  //     usuario,
  //     (res) => {
  //       console.log("llego al callok");
  //       hideLoading();
  //       showMessage("Usuario creado exitosamente");
  //       setTimeout(() => {
  //         onClose();
  //       }, 2000);
  //     },
  //     (error) => {
  //       console.log("llego al callwrong", error);
  //       hideLoading();
  //       showMessage(error);
  //     }
  //   );
  // };

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
            <h2>Ingreso Pasarela</h2>
          </Grid>

        
          <Grid item xs={12} md={6}>
            <InputName
              inputState={states.empresaPasarela}
              fieldName="Empresa Pasarela"
              required={true}
              validationState={validatorStates.empresaPasarela}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputNumber
              inputState={states.numeroMaquina}
              required={true}
              fieldName="Número de serie máquina"
              validationState={validatorStates.numeroMaquina}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputName
              inputState={states.marcaPasarela}
              fieldName="Marca pasarela de Pago"
              required={true}
              validationState={validatorStates.marcaPasarela}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputName
              inputState={states.modeloPasarela}
              fieldName="Modelo de pasarela de Pago"
              required={true}
              validationState={validatorStates.modeloPasarela}
            />
          </Grid>

          <SendingButton
            textButton="crear sucursal"
            // actionButton={handleSubmit}
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
