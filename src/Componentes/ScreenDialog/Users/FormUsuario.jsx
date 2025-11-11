import React, { useState, useEffect, useContext } from "react";

import {
  Grid,
  Paper,
  Dialog,
  Button,
  Typography
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";

import InputRutUsuario from "../../Elements/Compuestos/InputRutUsuario";
import InputName from "../../Elements/Compuestos/InputName";
import InputEmail from "../../Elements/Compuestos/InputEmail";
import InputPhone from "../../Elements/Compuestos/InputPhone";
import InputNumber from "../../Elements/Compuestos/InputNumber";
import InputPassword from "../../Elements/Compuestos/InputPassword";
import SelectList from "../../Elements/Compuestos/SelectList";
import SelectUserRoles from "../../Elements/Compuestos/SelectUserRoles";
import SelectRegion from "../../Elements/Compuestos/SelectRegion";
import SelectComuna from "../../Elements/Compuestos/SelectComuna";
import SendingButton from "../../Elements/SendingButton";
import User from "../../../Models/User";
import System from "../../../Helpers/System";
import SmallButton from "../../Elements/SmallButton";
import { height, width } from "@mui/system";
export const defaultTheme = createTheme();

export default function ({
  onSave,
  onCancel,
  dataInitial = null,
  isEdit = false
}) {
  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    showMessage
  } = useContext(SelectedOptionsContext);

  var states = {
    rut: useState(""),
    nombre: useState(""),
    apellido: useState(""),
    correo: useState(""),
    telefono: useState(""),
    codigoUsuario: useState(""),
    direccion: useState(""),
    region: useState(-1),
    comuna: useState(-1),
    rol: useState(-1),
    codigoPostal: useState(""),
    clave: useState(""),
    remuneracionTipo: useState(-1),
    credit: useState(""),
  }

  var validatorStates = {
    rut: useState(null),
    nombre: useState(null),
    apellido: useState(null),
    correo: useState(null),
    telefono: useState(null),
    codigoUsuario: useState(null),
    direccion: useState(null),
    codigoPostal: useState(null),
    credit: useState(null),
    clave: useState(null),
    remuneracionTipo: useState(null),
    rol: useState(null),
    region: useState(null),
    comuna: useState(null),
  }

  const handleSubmit = async () => {
    //Validaciones

    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false
    }
    // console.log(rut)
    // console.log(nombre)
    const usuario = {
      rut: states.rut[0],
      nombres: states.nombre[0],
      apellidos: states.apellido[0],
      correo: states.correo[0],
      telefono: states.telefono[0],
      codigoUsuario: states.codigoUsuario[0],
      direccion: states.direccion[0],
      codigoPostal: states.codigoPostal[0],
      clave: states.clave[0],
      remuneracion: states.remuneracionTipo[0],
      rol: states.rol[0] + "",
      region: states.region[0] + "",
      comuna: states.comuna[0] + "",
      credito: states.credit[0],
    }


    console.log("Datos antes de enviar:", usuario);
    showLoading("Enviando...")
    if (!isEdit) {
      User.getInstance().add(usuario, (res) => {
        hideLoading()
        showMessage("Realizado correctamente");
        setTimeout(() => {
          onSave(usuario)
        }, 2000);
      }, (error) => {
        hideLoading()
        showMessage(error)
      })
    } else {
      User.getInstance().edit(usuario, (res) => {
        hideLoading()
        showMessage("Realizado correctamente");
        setTimeout(() => {
          onSave(usuario)
        }, 2000);
      }, (error) => {
        hideLoading()
        showMessage(error)
      })
    }

  };


  useEffect(() => {
      // console.log("algun cambio")
      // console.log("el rol es")
      // console.log(dataInitial.rol)
      console.log("cuando carga... usuario:", dataInitial)
      if (dataInitial) {
        states.nombre[1](dataInitial.nombres || "");
        states.apellido[1](dataInitial.apellidos || "");
        states.correo[1](dataInitial.correo || "");
        states.telefono[1](dataInitial.telefono || "");
        states.direccion[1](dataInitial.direccion || "");
        states.codigoPostal[1](dataInitial.codigoPostal || "");
        states.rut[1](dataInitial.rut || "");
        states.codigoUsuario[1](dataInitial.codigoUsuario || "");
        states.clave[1](dataInitial.clave || "");
        // states.remuneracionTipo[1](dataInitial.remuneracion || "");
        // states.credito[1](dataInitial.credito || "");
        states.region[1]( parseInt(dataInitial.region) || "");
        states.comuna[1](dataInitial.comuna || "");
        states.rol[1](dataInitial.rol || "");
      }

    }, []);


  return (
    <Grid container spacing={2} sx={{ padding: "2%" }}>
      <Grid item xs={12}>
        <h2>{ isEdit ? "Editar Usuario" :  "Ingreso Usuario"} </h2>
      </Grid>

      <Grid item xs={12} md={4}>
        <InputRutUsuario
          inputState={states.rut}
          validationState={validatorStates.rut}
          required={true}
          autoFocus={true}
          isEdit={isEdit}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <InputName
          inputState={states.nombre}
          fieldName="nombre"
          required={true}
          validationState={validatorStates.nombre}
        />
      </Grid>
      <Grid item xs={12} md={4}>

        <InputName
          inputState={states.apellido}
          required={true}
          fieldName="apellido"
          validationState={validatorStates.apellido}
        />

      </Grid>
      <Grid item xs={12} md={4}>


        <InputEmail
          inputState={states.correo}
          required={true}
          fieldName="correo"
          validationState={validatorStates.correo}
        />

      </Grid>
      <Grid item xs={12} md={4}>
        <InputPhone
          inputState={states.telefono}
          required={true}
          fieldName="telefono"
          validationState={validatorStates.telefono}
        />



      </Grid>
      <Grid item xs={12} md={4}>

        <InputNumber
          inputState={[states.codigoUsuario[0], isEdit ? ()=>{} : states.codigoUsuario[1] ]}
          required={true}
          fieldName="codigoUsuario"
          label="Codigo usuario"
          validationState={validatorStates.codigoUsuario}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <InputName
          inputState={states.direccion}
          fieldName="direccion"
          required={true}
          maxLength={30}
          validationState={validatorStates.direccion}
        />

      </Grid>
      <Grid item xs={12} md={4}>

        <SelectRegion
          inputState={states.region}
          fieldName="region"
          required={true}
          validationState={validatorStates.region}
        />

      </Grid>
      <Grid item xs={12} md={4}>

        <SelectComuna
          inputState={states.comuna}
          inputRegionState={states.region}
          fieldName="comuna"
          required={true}
          validationState={validatorStates.comuna}
        />

      </Grid>
      <Grid item xs={12} md={4}>
        <SelectUserRoles
          inputState={states.rol}
          fieldName="rol"
          required={true}
          validationState={validatorStates.rol}
        />

      </Grid>
      <Grid item xs={12} md={4}>
        <InputNumber
          inputState={states.codigoPostal}
          required={true}
          fieldName="codigoPostal"
          label="Codigo Postal"
          validationState={validatorStates.codigoPostal}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <InputPassword
          inputState={states.clave}
          fieldName="clave"
          required={isEdit ? false : true}
          maxLength={30}
          validationState={validatorStates.clave}
        />


      </Grid>
      <Grid item xs={12} md={4}>
        <SelectList
          selectItems={[
            "Diario",
            "Semanal",
            "Mensual",
          ]}
          label="Remuneracion"
          fieldName="remuneracionTipo"
          vars={[states, validatorStates]}
          // required={true}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <InputNumber
          inputState={states.credit}
          // required={true}
          fieldName="credito"
          validationState={validatorStates.credit}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={4} lg={4}>
      </Grid>

      <Grid item xs={12} sm={12} md={2} lg={2}>
      </Grid>
      <Grid item xs={12} sm={12} md={2} lg={2}>
        <SmallButton
          actionButton={() => {
            onCancel()
          }}
          textButton={"Cancelar"}
          style={{
            width: "100%",
            margin: "0",
            height: "50px"
          }}
        />
      </Grid>


      <Grid item xs={12} sm={12} md={6} lg={6}>
        <SendingButton
          textButton="Continuar"
          actionButton={handleSubmit}
          sending={showLoadingDialog}
          sendingText="Registrando..."
          style={{
            width: "100%",
            height: "50px",
            margin: "0",
            backgroundColor: "#950198"
          }}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={2} lg={2}>
      </Grid>

    </Grid>
  );
}
