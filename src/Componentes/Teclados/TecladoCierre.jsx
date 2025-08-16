import React, { useState, useContext, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import System from "../../Helpers/System";
import TeclaButton from "./../Elements/TeclaButton"
import TeclaEnterButton from "./../Elements/TeclaEnterButton"
import TeclaBorrarButton from "./../Elements/TeclaBorrarButton"
import TeclaOkButton from "../Elements/TeclaOkButton";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import { KeyboardReturn } from "@mui/icons-material";


const TecladoCierre = ({
  showFlag,
  varValue, 
  varChanger, 
  onEnter,
  onChange = null,
  maxValue = 20000
}) => {

  const { 
    showMessage
  } = useContext(SelectedOptionsContext);


  const handleKeyButton = (key)=>{
    
    if(key == "enter"){
      onEnter()
      return
    }
    
    if(key == "borrar"){
      var nuevoValor = (varValue + "").slice(0, -1);
      if(nuevoValor == ""){
        nuevoValor = "0"
      }
      varChanger( nuevoValor )
      return
    }
    if(key.toLowerCase() == "limpiar"){
      varChanger( "0" )
       return
    }

    const valorAnteriorValido = (parseInt(varValue)> 0)?varValue:""
    var nuevoValor = valorAnteriorValido + ""  + key
    if(parseInt(nuevoValor)>maxValue){
      showMessage("Valor muy grande");
      return
    }

    if(onchange != null){
      const changeCustom = onchange(nuevoValor)
      if( changeCustom != undefined){
        varChanger(changeCustom)
      }else{
        varChanger(nuevoValor)
      }
     }else{
      varChanger( nuevoValor )
     }
  }

  return (
    showFlag ? (
    <div style={{
      padding: "10px",
      display: "flex",
      alignContent: "center",
      alignItems: "start",
      flexDirection:"column"

    }}>




      <table border={0} cellSpacing={0} cellPadding={0}>
        <tbody>
          <tr>
            <td colSpan={3}>
            <TeclaButton textButton="LIMPIAR" style={{
              width: "240px",
              height: "70px",
              padding:"10px 0",
              backgroundColor:"#f05a5a",
              color:"white"
            }} actionButton={handleKeyButton} />
            </td>
            <td colSpan={1}>
            <TeclaBorrarButton style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
            </td>
          </tr>
          <tr>
            <td>
              <TeclaButton textButton="1" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
            </td>
            <td>
              <TeclaButton textButton="2" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
            </td>
            <td>
              <TeclaButton textButton="3" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
            </td>
            <td rowSpan={3}>
            <TeclaButton 
              textButton={<KeyboardReturn color="primary" sx={{
              color :"#000"
            }} />}
             style={{
              width: "70px",
              alignItems:"center",
              alignContent:"center",
              height: "240px",
            }} actionButton={()=>{handleKeyButton("enter")}} />
            </td>
          </tr>

          <tr>
            <td>
            <TeclaButton textButton="4" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
            </td>
            <td>
            <TeclaButton textButton="5" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
            </td>
            <td>
            <TeclaButton textButton="6" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
            </td>
          </tr>


          <tr>
            <td>
            <TeclaButton textButton="7" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
            </td>
            <td>
            <TeclaButton textButton="8" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
            </td>
            <td>
            <TeclaButton textButton="9" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
            </td>
          </tr>

          <tr>
            <td colSpan={4}>
            <TeclaButton style={{width: "320px",height: "70px",}} textButton="0" actionButton={handleKeyButton} />
            </td>
          </tr>



        </tbody>
        </table>
      

     
    </div>
  ) : (
    <></>
  )
)
};

export default TecladoCierre;
