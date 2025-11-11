/* eslint-disable react/prop-types */

/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

import {

  CssBaseline,
  Paper,
  TextField,

  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ModelConfig from "../../Models/ModelConfig";
import Product from "../../Models/Product";
import InputName from "../Elements/Compuestos/InputName";
import System from "../../Helpers/System";
import PropertyImage from "../Elements/ExtendProperty/PropertyImage";

const theme = createTheme();


const FormCategoria = ({
  onSubmitSuccess,
  isEdit = false,
  editData = null
}) => {


  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  var states = {
    nombre: useState(""),
  };

  var validatorStates = {
    nombre: useState(null),
  };

  const handleSubmit = async () => {
    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false;
    }

    const actionDo = !isEdit ? Product.addCategory : Product.editCategory

    const dataRequest = {
      descripcionCategoria: states.nombre[0]
    }
    if (isEdit) dataRequest.idCategoria = editData.idCategoria

    showLoading("Guardando categoria...")
    actionDo(dataRequest, (responseData) => {
      const categoria = responseData.categorias[0]
      categoria.descripcion = states.nombre[0]

      if (categoria.idCategoria == -1 && editData.idCategoria) {
        categoria.idCategoria = editData.idCategoria
      }

      showMessage("Realizado correctamente")
      onSubmitSuccess(categoria)
      hideLoading()
    }, (err) => {
      showMessage(err)
      hideLoading()
    })
  };


  useEffect(() => {
    if (isEdit && editData) {
      // console.log("edit", editData)
      states.nombre[1](editData.descripcion)
    }
  }, [isEdit, editData])



  // fin funcionalidad imagen



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <h4>{!isEdit ? "Ingreso" : "Editar"} Categoria</h4>
      <Box>
        <Grid container spacing={2}>


          {editData && (
            <Grid item xs={12} sm={12} md={12} lg={12}>

              <PropertyImage topic={"categoria"} unique={editData.idCategoria} />

            </Grid>
          )}

          <Grid item xs={12} sm={12} md={12} lg={12}>

            <InputName
              inputState={states.nombre}
              validationState={validatorStates.nombre}
              fieldName="Descripcion"
              required={true}
              maxLength={100}
            />
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            // disabled={!puedeAvanzar}
            sx={{
              width: "50%",
              height: "55px",
              margin: "0 25%"
            }}
          >
            Continuar
          </Button>


        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default FormCategoria;
