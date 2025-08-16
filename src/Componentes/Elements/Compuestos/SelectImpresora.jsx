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


const SelectImpresora = ({
    inputState,
    validationState,
    withLabel = true,
    autoFocus = false,
    fieldName="select",
    label = fieldName[0].toUpperCase() + fieldName.substr(1),
    required = false
  }) => {

    const {
      showMessage
    } = useContext(SelectedOptionsContext);

    const apiUrl = ModelConfig.get().urlBase;
    
    const [selectList, setSelectList] = useState([])
    const [selected, setSelected] = useState(-1)
    const [selectedOriginal, setSelectedOriginal] = inputState
    const [validation, setValidation] = validationState ?? useState(null)

  const validate = ()=>{
    // console.log("validate de:" + fieldName)
    // const len = selected.length
    // console.log("len:", len)
    // const reqOk = (!required || (required && len > 0))
    const empty = (selected == "" || selected == null || selected ==-1)
    const reqOk = !required || (required && !empty)
    

    var message = ""
    if(!reqOk){
      message = fieldName + ": es requerido."
    }

    const vl = {
      "require": !reqOk,
      "empty": empty,
      "allOk" : (reqOk),
      "message" : message
    }
    // console.log("vale:", vl)
    setValidation(vl)
  }
  
  const checkChange = (event)=>{
    setSelected(event.target.value)
    setSelectedOriginal(event.target.value)
  }
  
  const checkChangeBlur = (event)=>{
    
  }

  const loadList = async()=>{
    try {
      const response = await axios.get(
        apiUrl + `/Usuarios/GetAllRolUsuario`
      );
      setSelectList([
        { id: 1, tipoImpresion: "Impresora 80 mm, Marca, Modelo" },
        { id: 2, tipoImpresion: "Impresora 57 mm, Marca, Modelo" }
      ]);
      // setSelectList(response.data.usuarios);
      // console.log("ROLES", response.data.usuarios);
    } catch (error) {
      console.log(error);
    }
  }

  const setByString = (valueString)=>{
    selectList.forEach((item)=>{
      if(item.tipoImpresion == valueString){
        setSelected(item.id)
        setSelectedOriginal(item.id)
      }
    })
  }

  useEffect(()=>{
    validate()
    setSelected(-1)
    loadList()
  },[])

  useEffect(()=>{
    // console.log("cambio algo en roles")
    if(selectList.length>0 && selectedOriginal !== "" && selected === -1){
      if(Validator.isNumeric(selectedOriginal)){
        // console.log("todo numero..")
        setSelected(selectedOriginal)
      }else{
        // console.log("no es todo numero..")
        setByString(selectedOriginal)
      }
    }else{
      validate()
    }
    // console.log("selected es:", selected)
  },[selected, selectList.length])



  return (
    <>
      {withLabel && (
      <InputLabel sx={{ marginBottom: "2%" }}>
        {label}
      </InputLabel>
      )}
    

      <Select
      sx={{
        marginTop:"17px"
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

        {selectList.map((selectOption,ix) => (
          <MenuItem
            key={ix}
            value={selectOption.tipoImpresion}
          >
            {selectOption.tipoImpresion}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default SelectImpresora;
