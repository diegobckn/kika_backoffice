/* eslint-disable no-redeclare */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect, useRef } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel,
  Button,
  Typography,
  Tooltip,
  Checkbox
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import ModelConfig from "../../../Models/ModelConfig";
import { Backup, ChangeCircle, Check, Close, CloudDone, Dangerous, Label, Task } from "@mui/icons-material";
import User from "../../../Models/User";
import Validator from "../../../Helpers/Validator";
import StorageSesion from "../../../Helpers/StorageSesion";
import Shop from "../../../Models/Shop";
import InputFile from "../Compuestos/InputFile";
import InputName from "../Compuestos/InputName";
import System from "../../../Helpers/System";


const PropertyCheck = ({
  topic,
  unique,
  name,
  label = name
}) => {

  const {
    showMessage,
    showConfirm,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);


  // funcionalidad imagen
  const [valueProperty, setValueProperty] = useState(null)

  const [infoComercio, setInfoComercio] = useState(null)

  useEffect(() => {
    var comSes = new StorageSesion("comercio")
    if (comSes.hasOne()) {
      setInfoComercio(comSes.cargar(1))
    }
  }, [])


  useEffect(() => {
    if (infoComercio) {
      cargarPropiedad()
    }
  }, [infoComercio])


  const actualizarPropiedad = (valor) => {
    Shop.updateProperty(topic, unique, name, valor, infoComercio, (resp) => {
      if (resp.info != "") {
        setValueProperty(JSON.parse(resp.info))
      }
    }, (er) => {
      showMessage(er)
    })
  }

  const cargarPropiedad = () => {
    Shop.getProperty(topic, unique, name, infoComercio, (resp) => {
      if (resp.info != "") {
        const decoded = (JSON.parse(resp.info))
        setValueProperty(decoded)
      }
    }, (er) => {
      showMessage(er)
    })
  }

  useEffect(() => {
    if (valueProperty != null) {
      actualizarPropiedad(valueProperty)
    }
  }, [valueProperty])

  const changeCheck = () => {
    // console.log("changeCheck")
    if (valueProperty === null) {
      setValueProperty(true)
      return
    }
    setValueProperty(!valueProperty)
  }


  return infoComercio ? (<div style={{
    padding: "10px",
  }}>


    <label>
      {label}
      <input
        checked={valueProperty != undefined ? valueProperty : false}
        onChange={changeCheck}
        type="checkbox"
        style={{
          width: "20px",
          height: "20px",
          position: "relative",
          top: "5px",
          marginLeft: "10px"
        }} />

    </label>
  </div>
  ) : (
    <></>
  );
};

export default PropertyCheck;
