/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Button,
  Dialog,
  Typography,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import ModelConfig from "../../Models/ModelConfig";
import Model from "../../Models/Model";
import Product from "../../Models/Product";
import SelectFetch from "../Elements/Compuestos/SelectFetch";
import SelectFetchDependiente from "../Elements/Compuestos/SelectFetchDependiente";
import InputName from "../Elements/Compuestos/InputName";
import System from "../../Helpers/System";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";


const PasoFinalCrear = ({
  dataSteps = null,
  mostrarBotones = false
}) => {

  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [ultimoIdCreado, setUltimoIdCreado] = useState(null)

  useEffect(() => {
    const sesion = Model.getInstance().sesion
    // console.log("sesion", sesion)
    var sesion1 = sesion.cargar(1)
    if (sesion1) {
      setUltimoIdCreado(sesion1.ultimoIdCreado)
    }
  }, [])

  return (
    <div style={{
      marginTop: "60px",
      width: "100%",
      textAlign: "center"
    }}>
      <p>Todos los pasos han sido completados!!.</p>

      {ultimoIdCreado && (
        <Typography variant="h3">

          <Typography sx={{
            fontSize: "18px"
          }}>
            C&oacute;digo generado
          </Typography>


          <Typography sx={{
            fontSize: "20px"
          }}>{ultimoIdCreado} </Typography>


        </Typography>
      )}
      {mostrarBotones && (
        <Box>
          <SmallButton textButton={"Crear otro"} actionButton={() => {
            console.log("crear otro")
          }} />
          <SmallButton textButton={"continuar"} actionButton={() => {
            console.log("continuar")
          }} />
        </Box>
      )}
    </div>
  );
};

export default PasoFinalCrear;
