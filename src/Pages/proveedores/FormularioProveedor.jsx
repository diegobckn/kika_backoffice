import React, { useState, useEffect, useContext } from "react";

import Tooltip from "@mui/material/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { saveAs } from "file-saver";
import * as xlsx from "xlsx/xlsx.mjs";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Grid,
  Paper,
  Box,
  TextField,
  IconButton,
  Button,
  CircularProgress,
  MenuItem,
  InputLabel,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ModelConfig from "../../Models/ModelConfig";
import { SelectedOptionsContext } from "../../Componentes/Context/SelectedOptionsProvider";
import Proveedor from "../../Models/Proveedor";
import { Check, Dangerous } from "@mui/icons-material";
import System from "../../Helpers/System";
import InputRutProveedor from "../../Componentes/Elements/Compuestos/InputRutProveedor";
import InputName from "../../Componentes/Elements/Compuestos/InputName";
import InputEmail from "../../Componentes/Elements/Compuestos/InputEmail";
import InputPhone from "../../Componentes/Elements/Compuestos/InputPhone";
import SelectRegion from "../../Componentes/Elements/Compuestos/SelectRegion";
import SelectComuna from "../../Componentes/Elements/Compuestos/SelectComuna";
import InputPage from "../../Componentes/Elements/Compuestos/InputPage";
import CriterioCosto from "../../definitions/CriterioCosto";
import BoxOptionList from "../../Componentes/Elements/BoxOptionList";

const FormularioProveedor = ({
  openDialog,
  setOpenDialog,
  onClose,
  onFinish,
  proveedorToEdit = null //si tiene info, se edita
}) => {

  const [isEdit, setIsEdit] = useState(false)

  var states = {
    rut: useState(""),
    nombreResponsable: useState(""),
    email: useState(""),
    correoResponsable: useState(""),
    razonSocial: useState(""),
    telefono: useState(""),
    telefonoResponsable: useState(""),
    direccion: useState(""),
    region: useState(-1),
    comuna: useState(-1),
    giro: useState(""),
    formaPago: useState(""),
    pagina: useState(""),
    sucursal: useState(""),
    criterioCosto: useState(0),
  };


  var validatorStates = {
    rut: useState(""),
    nombreResponsable: useState(""),
    email: useState(""),
    correoResponsable: useState(""),
    razonSocial: useState(""),
    telefono: useState(""),
    telefonoResponsable: useState(""),
    direccion: useState(""),
    region: useState(-1),
    comuna: useState(-1),
    giro: useState(""),
    formaPago: useState(""),
    pagina: useState(""),
    sucursal: useState(""),
    criterioCosto: useState(""),
  };

  const theme = createTheme();

  const {
    userData,
    showMessage
  } = useContext(SelectedOptionsContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false;
    }

    const proveedor = System.prepareStates(states)
    proveedor.region = proveedor.region + ""
    proveedor.comuna = proveedor.comuna + ""

    // console.log("Datos a enviar:", proveedor); // Aquí se muestran los datos en la consola

    if (proveedorToEdit === null) {
      Proveedor.crearNuevo(proveedor, (responseData, response) => {
        System.clearStates(states)
        setTimeout(() => {
          onClose(); ////Cierre Modal al finalizar
        }, 2000);

        setOpenDialog(false)
        onFinish(responseData)
      }, showMessage)
    } else {
      proveedor.codigoProveedor = proveedorToEdit.codigoProveedor
      Proveedor.getInstance().update(proveedor, (responseData, response) => {
        System.clearStates(states)
        setTimeout(() => {
          onClose(); ////Cierre Modal al finalizar
        }, 2000);

        setOpenDialog(false)
        onFinish(proveedor)
      }, showMessage)
    }

  };


  useEffect(() => {
    if (proveedorToEdit !== null) {
      setIsEdit(true)
      console.log("vamos a editar proveedor", proveedorToEdit)

      Object.keys(proveedorToEdit).forEach((campo => {
        if (states[campo] !== undefined) {
          states[campo][1](proveedorToEdit[campo])
        }
      }))
    }
  }, [proveedorToEdit])

  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        setOpenDialog(false);
        onClose();
      }}
      maxWidth={"lg"}
    >

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Paper
          elevation={3}
          sx={{ p: 2, borderRadius: 2, maxWidth: 1200, width: "100%" }}
        >
          {/* <form onSubmit={handleSubmit}> */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h2>Ingreso Proveedores</h2>
            </Grid>

            <Grid item xs={12} sm={4}>

              <InputRutProveedor
                inputState={states.rut}
                validationState={validatorStates.rut}
                required={true}
                autoFocus={true}
                isEdit={isEdit}
              />

            </Grid>
            <Grid item xs={12} sm={4}>
              <InputName
                inputState={states.razonSocial}
                required={true}
                fieldName="Razón Social"
                validationState={validatorStates.razonSocial}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputName
                inputState={states.giro}
                fieldName="giro"
                required={true}
                // maxLength={30}
                validationState={validatorStates.giro}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputEmail
                inputState={states.email}
                required={true}
                fieldName="Email"
                validationState={validatorStates.email}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputPhone
                inputState={states.telefono}
                required={true}
                fieldName="Telefono"
                validationState={validatorStates.telefono}
              />

            </Grid>
            <Grid item xs={12} sm={4}>
              <InputName
                inputState={states.direccion}
                fieldName="Direccion"
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


            <Grid item xs={12} sm={4}>

              <InputName
                inputState={states.sucursal}
                fieldName="Sucursal"
                required={true}
                maxLength={30}
                validationState={validatorStates.sucursal}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputPage
                inputState={states.pagina}
                fieldName="Pagina Web"
                required={true}
                maxLength={100}
                validationState={validatorStates.pagina}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputName
                inputState={states.formaPago}
                fieldName="Forma de pago"
                required={true}
                maxLength={30}
                validationState={validatorStates.formaPago}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputName
                inputState={[states.nombreResponsable[0], states.nombreResponsable[1]]}
                fieldName="nombreResponsable"
                required={true}
                validationState={validatorStates.nombreResponsable}
              />



            </Grid>
            <Grid item xs={12} sm={4}>
              <InputEmail
                inputState={states.correoResponsable}
                required={true}
                fieldName="correoResponsable"
                validationState={validatorStates.correoResponsable}
              />
            </Grid>
            <Grid item xs={12} sm={4}>


              <InputPhone
                inputState={states.telefonoResponsable}
                required={true}
                fieldName="telefonoResponsable"
                validationState={validatorStates.telefonoResponsable}
              />

            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ margin: "8px" }} >Criterio compra</Typography>
              <BoxOptionList
                optionSelected={states.criterioCosto[0]}
                setOptionSelected={states.criterioCosto[1]}
                options={
                  Object.keys(CriterioCosto).map((key) => {
                    return {
                      id: CriterioCosto[key],
                      value: key
                    }
                  })
                }
              />

            </Grid>


            <Grid item xs={12}>
              <Button
                onClick={handleSubmit}
                // type="submit" 
                // disabled={loading}
                variant="contained"
                sx={{
                  height: "50px",
                  width: "50%",
                  minWidth: "100px",
                  margin: "0 25%"
                }}
              >
                {/* {loading ? ( */}
                {/* <>
                        Guardando... <CircularProgress size={24} />
                      </> */}
                {/* ) : ( */}
                Guardar
                {/* )} */}
              </Button>
            </Grid>
          </Grid>
          {/* </form> */}
        </Paper>
      </ThemeProvider>
    </Dialog>
  );
};

export default FormularioProveedor;
