import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Typography,
  DialogTitle,
  Tabs,
  Tab,
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import AdminConfigTabGeneral from "./AdminConfigTabGeneral";
import AdminConfigTabComercio from "./AdminConfigTabComercio";
import AdminConfigTabImpresion from "./AdminConfigTabImpresion";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import AdminConfigTabSimpleApi from "./AdminConfigTabSimpleApi";
import ModelConfig from "../../Models/ModelConfig";
import InputName from "../Elements/Compuestos/InputName";
import InputGeneric from "../Elements/Compuestos/InputGeneric";
import SmallGrayButton from "../Elements/SmallGrayButton";

const CambiarUnaConfigSesion = ({
  openDialog,
  setOpenDialog,
  nameConfig,
  onChange,
  title = "Cambiar Valor",
  label = nameConfig,

  extraButonValue = []
}) => {

  const {
    showMessage,
    showLoading,
    showConfirm,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [nuevoValor, setNuevoValor] = useState("")

  const loadConfigSesion = () => {
    setNuevoValor(ModelConfig.get(nameConfig))
  }

  const confirmSave = () => {
    ModelConfig.change(nameConfig, nuevoValor);
    onChange(nuevoValor)
    showMessage("Guardado correctamente")
  }

  useEffect(() => {
    if (!openDialog) return
    loadConfigSesion();
  }, [openDialog])

  return (
    <Dialog open={openDialog} maxWidth="lg" onClose={() => {
      setOpenDialog(false)
    }}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        <Grid container item xs={12} spacing={2} sx={{
          minWidth: "400px",
          marginTop: "0px"
        }}>

          <Grid item xs={12} sm={12} md={12} ls={12}>
            <Typography>Valor actual</Typography>
            <Typography>{ModelConfig.get(nameConfig)}</Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={12} ls={12}>
            <InputGeneric
              inputState={[nuevoValor, setNuevoValor]}
              label={label}
              withLabel={false}
              fieldName="Valor"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} ls={12}>

            {extraButonValue.map((extraButton, ix) => (
              <SmallGrayButton
                key={ix}
                textButton={extraButton.text}
                actionButton={() => {
                  setNuevoValor(extraButton.value)
                }}
              />
            ))}
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>

        <SmallButton
          textButton={"Guardar"}
          actionButton={confirmSave}
        />
        <Button onClick={() => {
          setOpenDialog(false)
        }}>Atras</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CambiarUnaConfigSesion;
