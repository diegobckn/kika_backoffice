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
import SelectFetch from "../Elements/Compuestos/SelectFetch";

const theme = createTheme();


const FormSubCategoria = ({
  onSubmitSuccess,
  isEdit = false,
  idCategoria = null,
  editData = null
}) => {


  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [categoriesLoaded, setCategoriesLoaded] = useState(false)

  var states = {
    nombre: useState(""),
    selectedCategoryId: useState(""),
  };

  var validatorStates = {
    nombre: useState(null),
    selectedCategoryId: useState(null),
  };

  const handleSubmit = async () => {
    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false;
    }

    const actionDo = !isEdit ? Product.addSubCategory : Product.editSubCategory

    const dataRequest = {
      idCategoria: states.selectedCategoryId[0],
      descripcionSubCategoria: states.nombre[0]
    }
    if (isEdit) dataRequest.idSubcategoria = editData.idSubcategoria

    showLoading("Guardando subcategoria...")
    actionDo(dataRequest, (responseData) => {
      const subcategoria = responseData.subCategorias[0]
      subcategoria.descripcion = states.nombre[0]

      if (subcategoria.idSubcategoria == -1 && editData.idSubcategoria) {
        subcategoria.idSubcategoria = editData.idSubcategoria
      }

      showMessage("Realizado correctamente")
      onSubmitSuccess(subcategoria)
      hideLoading()
    }, (err) => {
      showMessage(err)
      hideLoading()
    })
  };


  useEffect(() => {
    if(!categoriesLoaded) return
    if (isEdit && editData) {
      states.nombre[1](editData.descripcion)
      states.selectedCategoryId[1](editData.idCategoria)
    }
  }, [isEdit, editData, categoriesLoaded])

  useEffect(() => {
    if(!categoriesLoaded) return
    if (idCategoria != null) {
      states.selectedCategoryId[1](idCategoria)
    }
  }, [idCategoria, categoriesLoaded])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <h4>{!isEdit ? "Ingreso" : "Editar"} Subcategoria</h4>
      <Box>
        <Grid container spacing={2}>

          <Grid item xs={12} sm={6} md={12} lg={12}>
            <SelectFetch
              inputState={states.selectedCategoryId}
              validationState={validatorStates.selectedCategoryId}
              fetchFunction={Product.getInstance().getCategories}
              fetchDataShow={"descripcion"}
              fetchDataId={"idCategoria"}
              fieldName={"Categoria"}
              required={true}

              onFinishFetch={async () => {
                setCategoriesLoaded(true)
              }}
            />
          </Grid>


          <Grid item xs={12} sm={6} md={12} lg={12}>
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

export default FormSubCategoria;
