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
import dayjs from "dayjs";
import Product from "../../Models/Product";
import Model from "../../Models/Model";
import InputGeneric from "../Elements/Compuestos/InputGeneric";
export const defaultTheme = createTheme();

export default function ({
  openDialog,
  setOpenDialog,
  envase,
  onComplete,
  isEdit = false,
}) {
  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    showMessage
  } = useContext(SelectedOptionsContext);

  var states = {
    grupo: useState(""),
    entrada: useState(""),
    valor: useState(""),
  }

  var validatorStates = {
    grupo: useState(null),
    entrada: useState(null),
    valor: useState(null),
  }

  useEffect(() => {
    if (!openDialog) return
    // console.log("cuando carga... product:", product)
    // console.log("cuando carga... isEdit:", isEdit)
    if (isEdit && envase) {
      states.grupo[1](envase.grupo || "");
      states.entrada[1](envase.entrada || "");
      states.valor[1](envase.valor || "");
    } else {
      states.grupo[1]("");
      states.entrada[1]("");
      states.valor[1]("");
    }

  }, [openDialog, isEdit]);


  const checkForm = () => {
    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false
    }
    const grupo = (states.grupo[0])
    const entrada = (states.entrada[0])
    const valor = (states.valor[0])

    // console.log("desde", desde)
    // console.log("hasta", hasta)

    if (parseFloat(valor) < 0) {
      showMessage("Precio incorrecto")
      return
    }

    if (isEdit) {
      Model.updateEnvase({ grupo, entrada, valor }, () => {
        onComplete()
        setOpenDialog(false)
        showMessage("Actualizado correctamente")
      }, () => {
        showMessage("No se pudo actualizar")
      })
    } else {

    }

  }

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

          <Grid item xs={12} md={4}>
            <InputGeneric
              inputState={states.grupo}
              label="grupo"
              validationState={validatorStates.grupo}
              readonly={true}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputGeneric
              inputState={states.entrada}
              label="entrada"
              validationState={validatorStates.entrada}
              readonly={true}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputNumber
              isDecimal={true}
              inputState={states.valor}
              required={true}
              fieldName="valor"
              validationState={validatorStates.valor}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <SmallSecondaryButton
              textButton="Guardar"
              actionButton={checkForm}
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
