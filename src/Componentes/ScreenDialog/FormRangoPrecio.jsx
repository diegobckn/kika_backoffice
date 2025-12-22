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
export const defaultTheme = createTheme();

export default function ({
  openDialog,
  setOpenDialog,
  product,
  onComplete,
  isEdit = false,
  indexEdit = null
}) {
  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    showMessage
  } = useContext(SelectedOptionsContext);

  var states = {
    cantidadDesde: useState(""),
    cantidadHasta: useState(0),
    precioVenta: useState(1),
  }

  var validatorStates = {
    cantidadDesde: useState(null),
    cantidadHasta: useState(null),
    precioVenta: useState(null),
  }

  useEffect(() => {
    if (!openDialog) return
    // console.log("cuando carga... product:", product)
    // console.log("cuando carga... isEdit:", isEdit)
    // console.log("cuando carga... indexEdit:", indexEdit)
    if (isEdit && indexEdit !== null) {
      states.cantidadDesde[1](product.mostrarPrecioRangos[indexEdit].cantidadDesde || "");
      states.cantidadHasta[1](product.mostrarPrecioRangos[indexEdit].cantidadHasta || "");
      states.precioVenta[1](product.mostrarPrecioRangos[indexEdit].precioVenta || "");
    } else {
      states.cantidadDesde[1]("");
      states.cantidadHasta[1]("");
      states.precioVenta[1]("");
    }

  }, [openDialog, isEdit, indexEdit]);


  const checkForm = () => {
    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false
    }
    const desde = parseFloat(states.cantidadDesde[0])
    const hasta = parseFloat(states.cantidadHasta[0])
    const precio = parseFloat(states.precioVenta[0])

    // console.log("desde", desde)
    // console.log("hasta", hasta)

    if (desde > hasta || desde === 0 || hasta === 0) {
      showMessage("Cantidades incorrectas")
      return
    }

    if (precio === 0) {
      showMessage("Precio incorrecto")
      return
    }

    var tieneAnterior = false
    var tieneSiguiente = false

    var anterior = null
    var siguiente = null



    if (isEdit) {
      tieneAnterior = indexEdit !== 0
      tieneSiguiente = product.mostrarPrecioRangos.length - 1 > indexEdit

      if (tieneAnterior) {
        anterior = product.mostrarPrecioRangos[indexEdit - 1]
      }
      if (tieneSiguiente) {
        siguiente = product.mostrarPrecioRangos[indexEdit + 1]
      }
    } else {
      tieneAnterior = product.mostrarPrecioRangos.length > 0
      if (tieneAnterior) {
        anterior = product.mostrarPrecioRangos[product.mostrarPrecioRangos.length - 1]
      }
    }

    if (!tieneAnterior && !tieneSiguiente) {
      onComplete(System.prepareStates(states))
      setOpenDialog(false)
      return
    }





    if (tieneAnterior && !tieneSiguiente) {
      if (anterior.cantidadHasta < desde) {
        onComplete(System.prepareStates(states))
        setOpenDialog(false)
        return
      } else {
        showMessage("Los valores no cumplen los rangos correctos")
        return
      }
    }

    if (!tieneAnterior && tieneSiguiente) {
      if (hasta < siguiente.cantidadDesde) {
        onComplete(System.prepareStates(states))
        setOpenDialog(false)
        return
      } else {
        showMessage("Los valores no cumplen los rangos correctos")
        return
      }
    }

    //tengo ambos

    if (anterior.cantidadHasta < desde && siguiente.cantidadDesde > hasta) {
      onComplete(System.prepareStates(states))
      setOpenDialog(false)
      return
    } else {
      showMessage("Los valores no cumplen los rangos correctos")
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
            <InputNumber
              inputState={states.cantidadDesde}
              fieldName="cantidadDesde"
              required={true}
              validationState={validatorStates.cantidadDesde}
              isDecimal={true}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputNumber
              isDecimal={true}
              inputState={states.cantidadHasta}
              required={true}
              fieldName="cantidadHasta"
              validationState={validatorStates.cantidadHasta}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputNumber
              isDecimal={true}
              inputState={states.precioVenta}
              required={true}
              fieldName="precioVenta"
              validationState={validatorStates.precioVenta}
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
