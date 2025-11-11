import React, { useState, useContext, useEffect } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import ModelConfig from "../../../Models/ModelConfig";
import { Check, Dangerous } from "@mui/icons-material";
import User from "../../../Models/User";
import Validator from "../../../Helpers/Validator";


const SelectList = ({
  inputState,
  validationState,
  selectItems,
  withLabel = true,
  autoFocus = false,
  fieldName = "select",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  required = false,
  styles = {},
  vars = null,
  placeholder = "Seleccionar"
}) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);

  const [selectList, setSelectList] = useState(selectItems)
  const [selected, setSelected] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")
  const [validation, setValidation] = validationState ? validationState : vars ? vars[1][fieldName] : useState(null)

  const validate = () => {
    console.log("validate de:" + fieldName)
    // const len = selected.length
    // console.log("len:", len)
    // const reqOk = (!required || (required && len > 0))
    const empty = (selected === "" || selected === null || selected === -1)
    const reqOk = !required || (required && !empty)


    var message = ""
    if (!reqOk) {
      message = fieldName + ": es requerido."
    }

    const vl = {
      "require": !reqOk,
      "empty": empty,
      "allOk": (reqOk),
      "message": message
    }
    console.log("vale:", vl)
    setValidation(vl)
  }

  const checkChange = (event) => {
    setSelected(event.target.value)
  }

  const checkChangeBlur = (event) => {

  }

  useEffect(() => {
    console.log("inputState es:", inputState)
    if (!inputState) {
      inputState = []
      inputState.push(vars[0][fieldName])
      inputState.push(vars[1][fieldName])
    }
    console.log("carga inicial para ", fieldName)
    validate()
    setSelected(-1)
  }, [])

  useEffect(() => {
    validate()
    console.log("selected es:", selected)
  }, [selected])

  //capturamos algun cambio de afuera
  useEffect(() => {
    console.log("cambio inputState[0]", inputState[0])
    setSelected(inputState[0])
  }, [inputState])



  return (
    <>
      {withLabel && (
        <InputLabel sx={{ marginBottom: "2%" }}>
          {label}
        </InputLabel>
      )}


      <TextField
        select
        sx={{
          ...{
            marginTop: (withLabel ? "17px" : "")
          },
          ...styles
        }}
        fullWidth
        autoFocus={autoFocus}
        // required={required}
        label={label}
        value={selected !== "" ? selected : -1}
        onChange={checkChange}
      >
        <MenuItem
          key={-1}
          value={-1}
        >
          {placeholder}
        </MenuItem>

        {selectList.map((selectOption, ix) => (
          <MenuItem
            key={ix}
            value={ix}
          >
            {selectOption}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
};

export default SelectList;
