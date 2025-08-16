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
import axios from "axios";
import Sucursal from "../../../Models/Sucursal";


const SelectUser = ({
  inputState,
  validationState,
  withLabel = true,
  autoFocus = false,
  fieldName = "select",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  required = false,
  vars = null
}) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);

  const [selectList, setSelectList] = useState([])
  const [selected, setSelected] = useState(-1)

  const [selectedOriginal, setSelectedOriginal] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")
  const [validation, setValidation] = validationState ? validationState : vars ? vars[1][fieldName] : useState(null)
  
  const validate = () => {
    // console.log("validate de:" + fieldName)
    // const len = selected.length
    // console.log("len:", len)
    // const reqOk = (!required || (required && len > 0))
    const empty = (selected == "" || selected == null || selected == -1)
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
    // console.log("vale:", vl)
    setValidation(vl)
  }

  const checkChange = (event) => {
    setSelected(event.target.value)
    setSelectedOriginal(event.target.value)
  }

  const loadList = async () => {
    User.getAll((responseData, response) => {
      setSelectList(responseData);
    }, (error) => {
      showMessage(error)
    })
  }

  const setByString = (valueString) => {
    selectList.forEach((item) => {
      if (item.sucursal == valueString) {
        setSelected(item.idSucursal)
        setSelectedOriginal(item.idSucursal)
      }
    })
  }

  useEffect(() => {
    validate()
    setSelected(-1)
    loadList()
  }, [])

  useEffect(() => {
    // console.log("cambio algo en roles")
    if (selectList.length > 0 && selectedOriginal !== "" && selected === -1) {
      if (Validator.isNumeric(selectedOriginal)) {
        // console.log("todo numero..")
        setSelected(selectedOriginal)
      } else {
        // console.log("no es todo numero..")
        setByString(selectedOriginal)
      }
    } else {
      validate()
    }
    // console.log("selected es:", selected)
  }, [selected, selectList.length])



  return (
    <>
      {withLabel && (
        <InputLabel sx={{ marginBottom: "2%" }}>
          {label}
        </InputLabel>
      )}


      <Select
        sx={{
          marginTop: "17px"
        }}
        fullWidth
        autoFocus={autoFocus}
        required={required}
        label={label}
        value={selected !== "" ? selected : -1}
        onChange={checkChange}
      >
        <MenuItem
          key={-1}
          value={-1}
        >
          SELECCIONAR
        </MenuItem>

        {selectList.map((selectOption, ix) => (
          <MenuItem
            key={ix}
            value={selectOption.codigoUsuario}
          >
            {selectOption.nombres + " " + selectOption.apellidos}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default SelectUser;
