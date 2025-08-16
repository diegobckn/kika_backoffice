import React, { useState, useContext, useEffect } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import ModelConfig from "../../../Models/ModelConfig";
import { Check, Dangerous } from "@mui/icons-material";
import Client from "../../../Models/Client";
import Validator from "../../../Helpers/Validator";
import System from "../../../Helpers/System";
import Proveedor from "../../../Models/Proveedor";


const InputRutProveedor = ({
  inputState,
  validationState,
  withLabel = true,
  autoFocus = false,
  minLength = null,
  maxLength = null,
  canAutoComplete = false,
  label = "Rut",
  fieldName = "rut",
  required = false,
  isEdit = false,
  vars = null
}) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);

  const [rut, setRut] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")
  const [validation, setValidation] = validationState ? validationState : vars ? vars[1][fieldName] : useState(null)

  const [keyPressed, setKeyPressed] = useState(false)

  const [rutUnique, setRutUnique] = useState(null);
  const [allOk, setAllOk] = useState(null);

  const checkKeyDown = (event) => {
    if (!canAutoComplete && event.key == "Unidentified") {
      event.preventDefault();
      return false
    } else {
      setKeyPressed(true)
    }
  }

  const validateRut = (event) => {
    if (!canAutoComplete && !keyPressed) {
      return
    }
    if (!Validator.isRut(event.target.value)) {
      // console.log("no es valido")
      return false
    }

    setRut(event.target.value)
  };

  useEffect(() => {
    validate()
  }, [])


  useEffect(() => {

    if (rut != "" && rutUnique === null) {
      // console.log("cambio algo.. hago check unique")
      checkUnique()
    } else {
      validate()
    }
  }, [rutUnique, rut])

  useEffect(() => {
    // console.log("cambio rut")
    setRutUnique(null)
  }, [rut])

  const validate = () => {
    // console.log("validate de:" + fieldName)
    const len = rut.trim().length
    const reqOk = (!required || (required && len > 0))
    const uniqueOk = rutUnique === true
    const formatOk = Validator.isRutChileno(rut)

    var badMinlength = false
    var badMaxlength = false

    if (minLength && len < minLength) {
      badMinlength = true
    }

    if (maxLength && len > maxLength) {
      badMaxlength = true
    }

    var message = ""
    if (!reqOk) {
      message = fieldName + ": es requerido."
    } else if (badMinlength) {
      message = fieldName + ": debe tener " + minLength + " caracteres o mas."
    } else if (badMaxlength) {
      message = fieldName + ": debe tener " + maxLength + " caracteres o menos."
    } else if (!uniqueOk) {
      message = fieldName + ": Ya existe. Ingrese otro."
    } else if (!formatOk) {
      message = fieldName + ": El formato es incorrecto."
    }

    const vl = {
      "empty": len == 0,
      "badMinlength": badMinlength,
      "badMaxlength": badMaxlength,
      "unique": uniqueOk,
      "require": !reqOk,
      "format": formatOk,
      "allOk": (reqOk && uniqueOk && !badMinlength && !badMaxlength && formatOk),
      "message": message
    }
    // console.log("vle:", vl)
    setAllOk(vl.allOk)
    setValidation(vl)
  }
  const checkUnique = () => {
    // console.log("checkUnique")

    if (rut === "") return
    //usar distintos modelos para revision de rut 
    Proveedor.getInstance().existRut(
      { rut }
      , (proveedores) => {
        if (
          (!isEdit && proveedores.length > 0)
          ||
          (isEdit && proveedores.length > 1)
        ) {
          showMessage("Ya existe el rut ingresado")
          setRutUnique(false)
        } else {
          // if(!isEdit) showMessage("Rut disponible")
          // showMessage("Rut disponible")
          setRutUnique(true)
        }
      }, (err) => {
        // console.log(err)
        if (err.response.status == 404) {
          // showMessage("Rut disponible")
          setRutUnique(true)
        }
      })
  }

  return (
    <>
      {withLabel && (
        <InputLabel sx={{ marginBottom: "2%", }}>
          Ingresar RUT sin puntos y con gui&oacute;n
        </InputLabel>
      )}
      <TextField
        fullWidth
        margin="normal"
        // label="ej: 11111111-1"
        label={label}
        autoFocus={autoFocus}
        value={rut}
        type="text"
        required={required}
        onChange={validateRut}
        onBlur={checkUnique}
        onKeyDown={checkKeyDown}

        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Check sx={{
                color: "#06AD16",
                display: (allOk ? "flex" : "none"),
                marginRight: "10px"
              }} />

              <Dangerous sx={{
                color: "#CD0606",
                display: ((!allOk && rut.length > 0) ? "flex" : "none")
              }} />

              <Check sx={{
                color: "transparent",
                display: (allOk === null ? "flex" : "none"),
                marginRight: "10px"
              }} />
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

export default InputRutProveedor;
