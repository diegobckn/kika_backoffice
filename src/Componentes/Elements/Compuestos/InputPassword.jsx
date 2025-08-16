import React, { useState, useContext, useEffect } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel,
  IconButton
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import ModelConfig from "../../../Models/ModelConfig";
import { Check, Dangerous, Visibility, VisibilityOff } from "@mui/icons-material";
import User from "../../../Models/User";
import Validator from "../../../Helpers/Validator";


const InputPassword = ({
  inputState,
  validationState = null,
  withLabel = true,
  autoFocus = false,
  fieldName = "password",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  minLength = null,
  maxLength = 20,
  canAutoComplete = false,
  required = false,
  vars = null
}) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);

  const [showPassword, setShowPassword] = useState(false)

  const [password, setPassword] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")
  const [validation, setValidation] = validationState ? validationState : vars ? vars[1][fieldName] : useState(null)

  const [keyPressed, setKeyPressed] = useState(false)

  const validate = () => {
    // console.log("validate de:" + fieldName)
    const len = password.length
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
    if (!Validator.isKeyPassword(event)) {
      event.preventDefault();
      return false
    }
  }

  const checkChange = (event) => {
    // console.log("checkChange de ", label)
    if (!canAutoComplete && !keyPressed) {
      return
    }

    // console.log("event.nativeEvent.inputType", event.nativeEvent.inputType)
    if(
      event.nativeEvent.inputType != 'insertText'
      && event.nativeEvent.inputType != 'deleteContentBackward'
    ) return


    const value = event.target.value
    if (value == " ") {
      showMessage(fieldName + ":Valor erroneo")

      return false
    }
    if (Validator.isPassword(value)) {
      // console.log(value + " es valido")
      setPassword(value);
    } else {
      // console.log("es incorrecta")
      showMessage(fieldName + ":Valor erroneo")

    }
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
  }, [password])

  return (
    <>
      {withLabel && (
        <InputLabel sx={{ marginBottom: "2%" }}>
          {label}
        </InputLabel>
      )}

      <TextField
        fullWidth
        margin="normal"
        autoFocus={autoFocus}
        required={required}
        label={label}
        password="clave"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={checkChange}
        onBlur={checkChangeBlur}
        onKeyDown={checkKeyDown}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => { setShowPassword(!showPassword) }}
                edge="end"
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />


    </>
  );
};

export default InputPassword;
