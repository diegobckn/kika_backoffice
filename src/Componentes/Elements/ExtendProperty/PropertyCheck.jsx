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
      // console.log("cambio info comercio", infoComercio)
      // if (isEdit) {
      cargarPropiedad()
      // }
    }
  }, [infoComercio])


  const actualizarPropiedad = (valor) => {
    // console.log("actualizarPropiedad " + name, "valor", valor)
    // showLoading("Cargando imagen")
    Shop.updateProperty(topic, unique, name, valor, infoComercio, (resp) => {
      // console.log("respuesta del servidor", resp)
      if (resp.info != "") {
        setValueProperty(JSON.parse(resp.info))
      }
      // hideLoading()
    }, (er) => {
      // hideLoading()
      showMessage(er)
    })
  }

  const cargarPropiedad = () => {
    // showLoading("Cargando imagen")
    Shop.getProperty(topic, unique, name, infoComercio, (resp) => {
      // console.log("respuesta del servidor", resp)
      if (resp.info != "") {
        setValueProperty(JSON.parse(resp.info))
      }
      // hideLoading()
    }, (er) => {
      // hideLoading()
      showMessage(er)
    })
  }


  useEffect(() => {
    if (valueProperty != null) {
      // console.log("cambio", valueProperty)
      // console.log("type cambio", typeof (valueProperty))
      actualizarPropiedad(valueProperty)
    }
  }, [valueProperty])

  const changeCheck = () => {
    if (valueProperty === null) {
      setValueProperty(true)
      return
    }
    setValueProperty(!valueProperty)
  }


  return infoComercio ? (<div style={{
    padding: "10px",
    // backgroundColor: "#f0f0f0",
  }}>
    {/* <InputName
      onRef={cambiaRef}
      label={label}
      inputState={[valueProperty, setValueProperty]}
      validationState={[val_valueProperty, setVal_valueProperty]}
    /> */}

    <label>
      {label}
      <input
        checked={valueProperty}
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
