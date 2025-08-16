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
import SelectFetchDependiente from "../Elements/Compuestos/SelectFetchDependiente";
import SelectFetch from "../Elements/Compuestos/SelectFetch";

const theme = createTheme();


const FormSubFamilia = ({
  onSubmitSuccess,
  idCategoria,
  idSubcategoria,
  idFamilia,
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
    selectedCategoryId: useState(-1),
    selectedSubCategoryId: useState(-1),
    selectedFamilyId: useState(-1),

  };

  var validatorStates = {
    nombre: useState(null),
    selectedCategoryId: useState(""),
    selectedSubCategoryId: useState(""),
    selectedFamilyId: useState(""),
  };

  const handleSubmit = async () => {
    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false;
    }

    const actionDo = !isEdit ? Product.addSubFamily : Product.editSubFamily

    const dataRequest = {
      idCategoria: states.selectedCategoryId[0],
      idSubcategoria: states.selectedSubCategoryId[0],
      idFamilia: states.selectedFamilyId[0],
      descripcionSubFamilia: states.nombre[0]
    }
    if (isEdit) dataRequest.idSubFamilia = editData.idSubFamilia

    showLoading("Guardando...")
    actionDo(dataRequest, (responseData) => {
      const creado = responseData.subFamilias[0]

      showMessage("Realizado correctamente")
      onSubmitSuccess(creado)
      hideLoading()
    }, (err) => {
      showMessage(err)
      hideLoading()
    })
  };


  const [finCargaInicialCats, setfinCargaInicialCats] = useState(false)
  const [finCargaInicialSubCats, setfinCargaInicialSubCats] = useState(false)
  const [finCargaInicialFams, setfinCargaInicialSubFams] = useState(false)


  useEffect(() => {
    if (idCategoria != null && finCargaInicialCats) {
      states.selectedCategoryId[1](idCategoria)
    }
  }, [idCategoria, finCargaInicialCats])


  useEffect(() => {
    if (idSubcategoria != null && finCargaInicialSubCats) {
      states.selectedSubCategoryId[1](idSubcategoria)
    }
  }, [idSubcategoria, finCargaInicialSubCats])


  useEffect(() => {
    if (idFamilia != null && finCargaInicialFams) {
      states.selectedFamilyId[1](idFamilia)
    }
  }, [idFamilia, finCargaInicialFams])


  useEffect(() => {
    if (isEdit && editData) {
      // console.log("editData para nombre", editData)
      states.nombre[1](editData.descripcion)
    }
  }, [isEdit, editData])


  useEffect(() => {
    if (isEdit && editData && finCargaInicialCats) {
      // console.log("editData para cat", editData)
      states.selectedCategoryId[1](editData.idCategoria)
    }
  }, [isEdit, editData, finCargaInicialCats])

  useEffect(() => {
    if (isEdit && editData && finCargaInicialSubCats) {
      // console.log("editData para subcar", editData)
      states.selectedSubCategoryId[1](editData.idSubcategoria)
    }
  }, [isEdit, editData, finCargaInicialSubCats])

  useEffect(() => {
    if (isEdit && editData && finCargaInicialFams) {
      // console.log("editData para subcar", editData)
      states.selectedFamilyId[1](editData.idFamilia)
    }
  }, [isEdit, editData, finCargaInicialFams])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <h4>{!isEdit ? "Ingreso" : "Editar"} Subfamilia</h4>
      <Box>
        <Grid container spacing={2}>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <SelectFetch
              inputState={states.selectedCategoryId}
              validationState={validatorStates.selectedCategoryId}
              fetchFunction={Product.getInstance().getCategories}
              fetchDataShow={"descripcion"}
              fetchDataId={"idCategoria"}
              fieldName={"Categoria"}
              required={true}

              onFinishFetch={async () => {
                // cargaAnteriorDeSesion(setSelectedCategoryId, "ultimaCategoriaGuardada")
                setfinCargaInicialCats(true)
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <SelectFetchDependiente
              inputState={states.selectedSubCategoryId}
              inputOtherState={states.selectedCategoryId}
              validationState={validatorStates.selectedSubCategoryId}
              fetchFunction={(cok, cwr) => {
                Product.getInstance().getSubCategories(states.selectedCategoryId[0], cok, cwr)
              }}
              fetchDataShow={"descripcion"}
              fetchDataId={"idSubcategoria"}
              fieldName={"SubCategoria"}
              required={true}
              onFinishFetch={async () => {
                // cargaAnteriorDeSesion(setSelectedSubCategoryId, "ultimaSubcategoriaGuardada")
                if (finCargaInicialCats) {
                  setfinCargaInicialSubCats(true)
                }
              }}
            />

          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <SelectFetchDependiente
              inputState={states.selectedFamilyId}
              inputOtherState={states.selectedSubCategoryId}
              validationState={validatorStates.selectedFamilyId}
              fetchFunction={(cok, cwr) => {
                Product.getInstance().getFamiliaBySubCat({
                  categoryId: states.selectedCategoryId[0],
                  subcategoryId: states.selectedSubCategoryId[0],
                }, cok, cwr)
              }}
              fetchDataShow={"descripcion"}
              fetchDataId={"idFamilia"}
              fieldName={"Familia"}
              required={true}
              onFinishFetch={async () => {
                // cargaAnteriorDeSesion(setSelectedSubCategoryId, "ultimaSubcategoriaGuardada")
                if (finCargaInicialSubCats) {
                  setfinCargaInicialSubFams(true)
                }
              }}
            />

          </Grid>


          <Grid item xs={12} sm={6} md={12}>
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

export default FormSubFamilia;
