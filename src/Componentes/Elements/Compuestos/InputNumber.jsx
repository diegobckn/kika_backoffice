import React, { useState, useContext, useEffect, useRef } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import Validator from "../../../Helpers/Validator";


const InputNumber = ({
  inputState,
  validationState,
  withLabel = true,
  autoFocus = false,
  fieldName = "number",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  minLength = null,
  canAutoComplete = false,
  maxLength = 20,
  required = false,
  vars = null,

  endAdornment = null,
  isDecimal = false,
  isRut = false,
  onClick = ()=>{},

  onRef = ()=>{}
}) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);

  const refInput = useRef(null)

  const [number, setNumber] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")
  const [validation, setValidation] = validationState ? validationState : vars ? vars[1][fieldName] : useState(null)

  const [keyPressed, setKeyPressed] = useState(false)

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
    console.log("checkKeyDown")
    console.log("isDecimal", isDecimal)
    console.log("Validator.isDecimal(" + event.key + ")", Validator.isDecimal(event.key))
    console.log("Validator.isNumeric(" + event.key + ")", Validator.isNumeric(event.key))
    if (!canAutoComplete && event.key == "Unidentified") {
      event.preventDefault();
      return false
    } else {
      setKeyPressed(true)
    }
    if (Validator.isTeclaControl(event)) {
      return
    }

    if (isDecimal && !Validator.isDecimal(event.key)) {
      event.preventDefault();
      return false
    }

    if (!isDecimal && !Validator.isNumeric(event.key)) {
      event.preventDefault();
      return false
    }

    console.log("pasa bien")
  }

  const checkChange = (event) => {
    // console.log("checkChange")
    
    // console.log("isDecimal", isDecimal)
    // console.log("Validator.isDecimal(" + event.target.value + ")", Validator.isDecimal(event.target.value))
    // console.log("Validator.isNumeric(" + event.target.value + ")", Validator.isNumeric(event.target.value))
    
    
    if (!canAutoComplete && !keyPressed) {
      return
    }
    // console.log("checkChange2")
    const value = event.target.value
    if (value == " ") {
      showMessage(":Valor erroneo")

      return false
    }

    if (isDecimal && Validator.isDecimal(value)) {
      setNumber(value);
      return false
    }

    if (!isDecimal && Validator.isNumeric(value)) {
      setNumber(value);
    }

    if(!isDecimal && isRut){
      const numStr = number + ""
      if(numStr.indexOf("-")>-1){
        const numSinG = numStr.replace("-","")
        if(Validator.isNumeric(numSinG)){
          setNumber(value)
        }
      }
    }
  }

  const checkChangeBlur = (event) => {
    if (typeof (number) == "string" && number.substr(-1) == " ") {
      setNumber(number.trim())
    }
  }

  useEffect(() => {
    validate()
  }, [])


  useEffect(() => {
    validate()
  }, [number])

  useEffect(() => {
    if(refInput && refInput.current){
      onRef(refInput)
    }
  }, [refInput])

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

        ref={refInput}

        onClick={()=>{
          onClick()
        }}

        InputProps={{
          endAdornment: (endAdornment ? endAdornment : null)
        }}
      />
    </>
  );
};

export default InputNumber;
