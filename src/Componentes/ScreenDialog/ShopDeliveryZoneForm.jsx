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
    distance_gps: useState(0),
    price: useState(1),
  }

  var validatorStates = {
    name: useState(""),
    distance_gps: useState(""),
    price: useState(""),
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
      distance_gps: states.distance_gps[0],
      price: states.price[0],
    }

    if (isEdit && dataInitial) {
      info.id = dataInitial.id
    }


    console.log("Datos antes de enviar:", info);
    showLoading("Enviando...")
    if (!isEdit) {
      Shop.createAndAssignZoneToCommerce(infoComercio, info, (res) => {
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
    } else {
      // Shop.editZoneToCommerce(infoComercio, info, (res) => {
      //   hideLoading()
      //   showMessage("Realizado correctamente");
      //   setTimeout(() => {
      //     onSave(info)
      //     setOpenDialog(false)
      //   }, 2000);
      // }, (error) => {
      //   hideLoading()
      //   showMessage(error)
      // })
    }
  };


  useEffect(() => {
    if (!openDialog) return
    console.log("cuando carga... dataInitial:", dataInitial)
    if (dataInitial) {
      states.name[1](dataInitial.name || "");
      states.distance_gps[1](dataInitial.distance_gps || "");
      if (dataInitial.pivot && dataInitial.pivot.price != 0) {
        states.price[1](dataInitial.pivot.price || "");
      } else {
        states.price[1](dataInitial.price || "");
      }
    } else {
      states.name[1]("");
      states.distance_gps[1]("");
      states.price[1]("");
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

          <Grid item xs={12} md={4}>
            <InputName
              inputState={states.name}
              fieldName="nombre"
              required={true}
              validationState={validatorStates.name}
              readonly={isEdit}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputNumber
              isDecimal={true}
              inputState={states.distance_gps}
              required={true}
              fieldName="Distancia(en Km)"
              validationState={validatorStates.distance_gps}
              readonly={isEdit}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputNumber
              isDecimal={true}
              inputState={states.price}
              required={true}
              fieldName="Precio"
              validationState={validatorStates.price}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
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
