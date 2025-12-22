import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Button,
  TextField,
  ListItem,
  Chip,
  Typography,
  Snackbar,
  InputLabel,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Icon,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import SmallButton from "../Elements/SmallButton";
import ArrowDown from "@mui/icons-material/ArrowDropDown";
import SmallDangerButton from "../Elements/SmallDangerButton";
import SmallGrayButton from "../Elements/SmallGrayButton";
import SelectList from "../Elements/Compuestos/SelectList";
import System from "../../Helpers/System";
import InputNumber from "../Elements/Compuestos/InputNumber";
import InputGeneric from "../Elements/Compuestos/InputGeneric";
import SelectRegion from "../Elements/Compuestos/SelectRegion";

export default ({
  openDialog,
  setOpendialog = (x) => { },
  onFinish = () => { }
}) => {

  const inputs = {
    nombre: useState(""),
    listaSelec: useState(0),
  }

  const validations = {
    nombre: useState(null),
    listaSelec: useState(null),
  }

  useEffect(() => {
    if (!openDialog) return

    inputs.nombre[1]("")
    inputs.listaSelec[1](-1)
  }, [openDialog])


  return (<Dialog open={openDialog} onClose={() => setOpendialog(false)} fullWidth maxWidth={"md"}>
    <DialogTitle>Importar lista de precios</DialogTitle>
    <DialogContent>

      <Grid container spacing={2}>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <InputGeneric
            inputState={inputs.nombre}
            validationState={validations.nombre}
            label={"Nombre de la lista"}
            withLabel={false}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <SelectRegion
            inputState={inputs.listaSelec}
            validationState={validations.listaSelec}
            label={"Lista seleccionada"}
            withLabel={false}
          />
        </Grid>


        <Grid item xs={12} sm={12} md={12} lg={12}>
          <SmallButton textButton={"Confirmar"} actionButton={() => {
            onFinish()
            setOpendialog(false)
          }} />
        </Grid>

      </Grid>


    </DialogContent >



  </Dialog >);
};
