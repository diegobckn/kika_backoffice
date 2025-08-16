import React, { useState, useContext, useEffect } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import ModelConfig from "../../../Models/ModelConfig";
import { Check, Dangerous } from "@mui/icons-material";
import User from "../../../Models/User";
import Validator from "../../../Helpers/Validator";


const InputGeneric = ({
  inputState,
  validationState,
  withLabel = true,
  autoFocus = false,
  fieldName = "generic",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  minLength = null,
  canAutoComplete = false,
  maxLength = 20,
  required = false,
  vars = null,
  onEnter = ()=>{}
}) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);

  const [generic, setGeneric] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")
  const [validation, setValidation] = validationState ? validationState : vars ? vars[1][fieldName] : useState(null)
  const [keyPressed, setKeyPressed] = useState(false)

  const validate = () => {
    // console.log("validate de:" + fieldName)
    const len = generic.length
    // console.log("len:", len)
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
    // console.log("vale:", vl)
    setValidation(vl)
  }
  const checkKeyDown = (event) => {
    if (!canAutoComplete && event.key == "Unidentified") {
      event.preventDefault();
      return false
    } else {
      setKeyPressed(true)
    }

    if(event.key == "Enter"){
      onEnter()
    }
  }

  const checkChange = (event) => {
    if (!canAutoComplete && !keyPressed) {
      return
    }
    const value = event.target.value
    if (value == " ") {
      showMessage("Valor erroneo")
      return false
    }
    // if (Validator.isNombre(value)) {
    //   // console.log(value + " es valido")
      setGeneric(value);
    // } else {
    //   // console.log("es incorrecta")
    //   showMessage("Valor erroneo")

    // }
  }

  const checkChangeBlur = (event) => {
    var vl = generic + ""
    if (vl.substr(-1) == " ") {
      setGeneric(vl.trim())
    }
  }

  useEffect(() => {
    validate()
  }, [])


  useEffect(() => {
    validate()
  }, [generic])

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
        value={generic}
        onChange={checkChange}
        onBlur={checkChangeBlur}
        onKeyDown={checkKeyDown}
      />
    </>
  );
};

export default InputGeneric;
