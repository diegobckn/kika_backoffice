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

export default ({
  inputState,
  sucursalInfo,
  validationState,
  withLabel = true,
  autoFocus = false,
  fieldName = "select",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  labelEmpty = "SELECCIONAR",
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

  const setByString = (valueString) => {
    var found = -1
    if (!sucursalInfo) {
      // console.log("sale por que region es incorrecto")
      setSelected(-1)
      return
    }
    sucursalInfo.puntoVenta.forEach((sucInfo) => {
      if (sucInfo.sPuntoVenta == valueString) {
        found = sucInfo.idCaja
      }
    })
    setSelected(found)
  }

  const loadList = async () => {
    if (!sucursalInfo) {
      // console.log("sale por que region es incorrecto")
      setSelected(-1)
      return
    }
    // console.log("loadList comuna")
    setSelectList(sucursalInfo.puntoVenta)
  }

  useEffect(() => {
    // console.log("")

    validate()
    setSelected(-1)
    // console.log(inputRegionState)
    // console.log("carga inicial comuna")
  }, [])

  useEffect(() => {
    // console.log("")
    // console.log("selectedregion es:", (selectedRegion + ""))
    if (sucursalInfo) {
      setSelected(-1)
      setSelectList([])
      loadList()
    }
  }, [sucursalInfo])


  useEffect(() => {
    // console.log("")
    // console.log("cambio algo en comuna")
    if (!sucursalInfo) return
    if (selected === -1 && selectList.length === 0) {
      // console.log("debe cargar")
      loadList()
    }
    if (selectList.length > 0 && selectedOriginal !== "" && selected === -1) {
      if (Validator.isNumeric(selectedOriginal)) {
        // console.log("todo numero..")
        setSelected(selectedOriginal)
      } else {
        // console.log("no es todo numero..")
        // console.log("carga original",selectedOriginal)
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


      <TextField
        select
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
          {labelEmpty}
        </MenuItem>

        {selectList.map((selectOption, ix) => (
          <MenuItem
            key={ix}
            value={selectOption.idCaja}
          >
            {selectOption.sPuntoVenta}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
};
