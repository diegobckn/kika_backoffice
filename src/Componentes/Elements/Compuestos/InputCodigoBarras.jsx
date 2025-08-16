import React, { useState, useContext, useEffect } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel,
  Typography
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import Validator from "../../../Helpers/Validator";
import Product from "../../../Models/Product";
import { Check, Dangerous } from "@mui/icons-material";


const InputCodigoBarras = ({
  inputState,
  validationState = null,
  withLabel = true,
  autoFocus = false,
  fieldName = "number",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  minLength = null,
  canAutoComplete = false,
  maxLength = 20,
  required = false,
  vars = null
}) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);


  const [number, setNumber] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")
  const [validation, setValidation] = validationState ? validationState : vars ? vars[1][fieldName] : useState(null)

  const [keyPressed, setKeyPressed] = useState(false)
  const [codigoNoRepetido, setCodigoNoRepetido] = useState(null)
  const [largo, setLargo] = useState(0)


  const validate = () => {
    const len = (number + "").length
    const reqOk = (!required || (required && len > 0))
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
    }

    const vl = {
      "badMinlength": badMinlength,
      "badMaxlength": badMaxlength,
      "require": !reqOk,
      "empty": len == 0,
      "allOk": (reqOk && !badMinlength && !badMaxlength),
      "message": message
    }
    setValidation(vl)
  }

  const checkKeyDown = (event) => {
    if (!canAutoComplete && event.key == "Unidentified") {
      event.preventDefault();
      return false
    } else {
      setKeyPressed(true)
    }
    if (Validator.isTeclaControl(event)) {
      return
    }
    if (!Validator.isNumeric(event.key)) {
      event.preventDefault();
      return false
    }
  }

  const checkChange = (event) => {
    if (!canAutoComplete && !keyPressed) {
      return
    }
    const value = event.target.value
    if (value == " ") {
      showMessage(":Valor erroneo")

      return false
    }
    setNumber(value);

    setCodigoNoRepetido(null)
  }

  const checkChangeBlur = (event) => {
    if (typeof (number) == "string" && number.substr(-1) == " ") {
      setNumber(number.trim())
    }

    checkCodigo()
  }

  const checkCodigo = () => {
    // console.log("checkCodigo")
    if (number === "") return
    Product.getInstance().findByCodigoBarras({
      codigoProducto: number
    }, (prods) => {
      // console.log(prods)
      if (prods.length > 0) {
        showMessage("Ya existe el codigo ingresado")
        setCodigoNoRepetido(false)
      } else {
        showMessage("Codigo correcto")
        setCodigoNoRepetido(true)
      }
    }, (err) => {

    })
  }

  useEffect(() => {
    validate()
  }, [])


  useEffect(() => {
    validate()
    setLargo(number.length)
  }, [number])

  return (
    <>
      {withLabel && (
        <InputLabel sx={{ marginBottom: "2%" }}>
          {label}
        </InputLabel>
      )}
      <TextField
        fullWidth
        autoFocus={autoFocus}
        margin="normal"
        required={required}
        type="text"
        label={label}
        value={number}
        onChange={checkChange}
        onBlur={checkChangeBlur}
        onKeyDown={checkKeyDown}

        InputProps={{
          inputMode: "numeric", // Establece el modo de entrada como numérico
          pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
          endAdornment: (
            <InputAdornment position="end">
              <Check sx={{
                color: "#06AD16",
                display: (codigoNoRepetido && number != "" ? "flex" : "none"),
                marginRight: "10px"
              }} />

              <Dangerous sx={{
                color: "#CD0606",
                display: ((codigoNoRepetido !== null && codigoNoRepetido === false) ? "flex" : "none")
              }} />

              <Typography>{largo}</Typography>
            </InputAdornment>
          ),

        }}
      />
    </>
  );
};

export default InputCodigoBarras;
