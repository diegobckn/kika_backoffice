import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid
} from "@mui/material";
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

const EditUsuario = ({ 
  selectedUser, 
  openDialog, 
  setOpenDialog,
  onSave = ()=>{}
}) => {
  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    userData, 
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
    // remuneracionTipo: useState(-1),
    // credito: useState(""),
  }
  
  var validatorStates = {
    rut: useState(null),
    nombre : useState(null),
    apellido : useState(null),
    correo : useState(null),
    telefono : useState(null),
    codigoUsuario : useState(null),
    direccion : useState(null),
    codigoPostal : useState(null),
    // credito : useState(null),
    clave : useState(null),
    // remuneracionTipo : useState(null),
    rol : useState(null),
    region : useState(null),
    comuna : useState(null),
  }

  useEffect(() => {
    // console.log("algun cambio")
    // console.log("el rol es")
    // console.log(selectedUser.rol)
    if(!openDialog) return
    console.log("cuando carga... usuario:", selectedUser)
    if (selectedUser) {
      states.nombre[1](selectedUser.nombres || "");
      states.apellido[1](selectedUser.apellidos || "");
      states.correo[1](selectedUser.correo || "");
      states.telefono[1](selectedUser.telefono || "");
      states.direccion[1](selectedUser.direccion || "");
      states.codigoPostal[1](selectedUser.codigoPostal || "");
      states.rut[1](selectedUser.rut || "");
      states.codigoUsuario[1](selectedUser.codigoUsuario || "");
      states.clave[1](selectedUser.clave || "");
      // states.remuneracionTipo[1](selectedUser.remuneracion || "");
      // states.credito[1](selectedUser.credito || "");
      states.region[1]( parseInt(selectedUser.region) || "");
      states.comuna[1](selectedUser.comuna || "");
      states.rol[1](selectedUser.rol || "");
    }

  }, [openDialog]);



  const handleSubmit = async (event) => {
    
    if(!System.allValidationOk(validatorStates,showMessage)){
      return false
    }
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
      // remuneracion: states.remuneracionTipo[0],
      rol: states.rol[0] + "",
      region: states.region[0] + "",
      comuna: states.comuna[0] + "",
      // credito: states.credito[0],
    }

    console.log("listo para enviar:", usuario)
    showLoading("Enviando...")
    User.getInstance().edit(usuario,(resData)=>{
      hideLoading()
      showMessage(resData.descripcion);
      setTimeout(() => {
        setOpenDialog(false)
        onSave(usuario);
      }, 3000);
    },(error)=>{
      hideLoading()
      if (error.response && error.response.status === 409) {
        showMessage(error.response.data.descripcion);
      } else {
        showMessage(error)
        console.error("Error:", error);
      }
    })
  }

  

  return (
    <Dialog open={openDialog} onClose={()=>{
      setOpenDialog(false)
      }} maxWidth="lg">
      <DialogTitle>Editar Usuario</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ padding: "2%" }}>
        <Grid item xs={12} md={4}>
          <InputRutUsuario 
            inputState={states.rut}
            validationState={validatorStates.rut}
            required={true}
            autoFocus={true}
            isEdit={true}
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
              inputState={states.codigoUsuario}
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
                required={false}
                maxLength={30}
                validationState={validatorStates.clave}
              />

              
            </Grid>
            {/* <Grid item xs={12} md={4}>
              <SelectList
                inputState={states.remuneracionTipo}
                selectItems={[
                  "Diario",
                  "Semanal",
                  "Mensual",
                ]}
                fieldName="remuneracion"
                required={true}
                validationState={validatorStates.remuneracionTipo}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputNumber
                inputState={states.credito}
                required={true}
                fieldName="credito"
                validationState={validatorStates.credito}
              />
            </Grid> */}

        </Grid>
        <DialogActions>
          <Button onClick={()=>{
            setOpenDialog(false)
          }}>Cancelar</Button>
          <SendingButton
              textButton="Guardar"
              actionButton={handleSubmit}
              sending={showLoadingDialog}
              sendingText=""
              style={{
                // width:"50%",
                // margin: "0 25%",
                backgroundColor:"#950198"
              }}
            />
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default EditUsuario;
