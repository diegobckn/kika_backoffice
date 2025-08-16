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


const InputPhone = ({
  inputState,
  validationState,
  withLabel = true,
  autoFocus = false,
  fieldName = "phone",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  minLength = null,
  maxLength = 13,
  canAutoComplete = false,
  required = false,
  vars = null
}) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);

  const [phone, setPhone] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")
  const [validation, setValidation] = validationState ? validationState : vars ? vars[1][fieldName] : useState(null)

  const [keyPressed, setKeyPressed] = useState(false)

  const validate = () => {
    // console.log("validate de:" + fieldName)
    const formatOk = Validator.isPhone(phone)

    const len = phone.length
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
    } else if (!formatOk) {
      message = fieldName + ": El formato es incorrecto."
    }

    const vl = {
      "badMinlength": badMinlength,
      "badMaxlength": badMaxlength,
      "require": !reqOk,
      "empty": len == 0,
      "format": formatOk,
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

    if (!Validator.isKeyPhone(event)) {
      // console.log(event.key,": incorrecta")
      event.preventDefault();
      return false
    }

    return true
  }

  const checkChange = (event) => {
    if (!canAutoComplete && !keyPressed) {
      return
    }
    setPhone(event.target.value)
  }

  const checkChangeBlur = (event) => {
    validate()
  }

  useEffect(() => {
    // console.log("cambio inputState")
    // console.log(inputState)
    validate()
  }, [])

  useEffect(() => {
    validate()
  }, [phone])

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
        type="phone"
        label={label}
        value={phone}
        onChange={checkChange}
        onBlur={checkChangeBlur}
        onKeyDown={checkKeyDown}

      // onChange={handleEmailChange}
      // onKeyDown={handleEmailKeyDown}


      />
    </>
  );
};

export default InputPhone;
