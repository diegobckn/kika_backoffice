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
import Region from "../../../Models/Region";
import Comuna from "../../../Models/Comuna";
import System from "../../../Helpers/System";


const SelectFetchDependiente = ({
  inputState,
  inputOtherState,
  validationState,
  fetchFunction,
  fetchDataShow,
  fetchDataId,
  onFinishFetch = () => { },

  refreshList = null,


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
  const [selectedOther, setSelectedOther] = inputOtherState

  const [validation, setValidation] = validationState ? validationState : vars ? vars[1][fieldName] : useState(null)

  const [cargando, setCargando] = useState(false)

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
    // console.log("la validacion de ", fieldName, '.. es', vl)
    setValidation(vl)
  }

  const checkChange = (event) => {
    setSelected(event.target.value)
  }
  const checkChangeBlur = (event) => {

  }

  const loadList = async () => {
    // console.log("loadList de ", label)

    if (!fetchDataShow || !fetchDataId || !fetchFunction) {
      return
    }

    setCargando(true)
    fetchFunction((fetchData) => {
      setCargando(false)
      setSelectList(fetchData)
    }, (error) => {
      setCargando(false)
    })
  }

  useEffect(() => {
    validate()
  }, [])

  useEffect(() => {
    // console.log("cambio el selectedOther de", label, " al valor ", selectedOther)
    setSelected(-1)
    if (selectedOther == -1) {
      if (selectList.length > 0) {
        setSelectList([])
      }
    } else {
      loadList()
    }
  }, [selectedOther])

  useEffect(() => {
    if (refreshList !== null) {
      loadList()
    }
  }, [refreshList])

  useEffect(() => {
    // console.log("cambio selectList de ", fieldName, " vale ", selectList)
    if (selectList.length > 0) {
      // console.log("haciendo el finfetch de ", fieldName)
      onFinishFetch()
    }
  }, [selectList])

  useEffect(() => {
    // console.log("cambio selected de", label, " al valor ", selected)
    inputState[1](selected)
    validate()
  }, [selected])


  useEffect(() => {
    // console.log("cambio selected desde afuera de", label, " al valor ", inputState[0])
    setSelected(inputState[0])
  }, [inputState[0]])


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
          {cargando ? "Cargando..." : "SELECCIONAR"}

        </MenuItem>

        {selectList.map((selectOption, ix) => (
          <MenuItem
            key={ix}
            value={selectOption[fetchDataId]}
          >
            {selectOption[fetchDataShow]}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default SelectFetchDependiente;
