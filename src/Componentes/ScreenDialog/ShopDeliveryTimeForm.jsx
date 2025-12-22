import React, { useState, useEffect, useContext } from "react";

import {
  Grid,
  Paper,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

import SmallButton from "../Elements/SmallButton";
import System from "../../Helpers/System";
import InputName from "../Elements/Compuestos/InputName";
import InputNumber from "../Elements/Compuestos/InputNumber";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import Shop from "../../Models/Shop";
import InputGeneric from "../Elements/Compuestos/InputGeneric";
export const defaultTheme = createTheme();

export default function ({
  openDialog,
  setOpenDialog,
  infoComercio,
  isEdit = false,
  dataInitial = null,
  onSave
}) {
  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    showMessage
  } = useContext(SelectedOptionsContext);

  var states = {
    name: useState(""),
  }

  var validatorStates = {
    name: useState(""),
  }

  const handleSubmit = async () => {
    //Validaciones

    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false
    }
    // console.log(rut)
    // console.log(nombre)
    const info = {
      name: states.name[0],
    }

    console.log("Datos antes de enviar:", info);
    showLoading("Enviando...")
    Shop.createAndAssignTimeToCommerce(infoComercio, info, (res) => {
      hideLoading()
      showMessage("Realizado correctamente");
      setTimeout(() => {
        onSave(info)
        setOpenDialog(false)
      }, 2000);
    }, (error) => {
      hideLoading()
      showMessage(error)
    })

  };


  useEffect(() => {
    if (!openDialog) return
    console.log("cuando carga... dataInitial:", dataInitial)
    if (dataInitial) {
      states.name[1](dataInitial.name || "");
    } else {
      states.name[1]("");
    }

  }, [openDialog]);


  return (

    <Dialog open={openDialog} maxWidth="lg" onClose={() => {
      setOpenDialog(false)
    }}
    >
      <DialogTitle>
        {isEdit ? "Editar" : "Crear"}
      </DialogTitle>
      <DialogContent>

        <Grid container spacing={2} sx={{ padding: "2%" }}>

          <Grid item xs={12} md={8}>
            <InputGeneric
              inputState={states.name}
              fieldName="Horario"
              required={true}
              validationState={validatorStates.name}
              readonly={isEdit}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <SmallSecondaryButton
              textButton="Guardar"
              actionButton={handleSubmit}
            />
          </Grid>

        </Grid>


      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setOpenDialog(false)
        }}>Atras</Button>
      </DialogActions>
    </Dialog>
  );
}
