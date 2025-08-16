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
// import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const TecladoPeso = ({
  showFlag,
  varValue, 
  varChanger, 
  onEnter,
  onChange = null,
  maxValue = 10000000
}) => {

  


  // const { 
  //   showMessage
  // } = useContext(SelectedOptionsContext);

  const showMessage = (message)=>{
    alert(message)
  }



  const handleKeyButton = (key)=>{
    if(key == "." && varValue.length>0 && varValue.indexOf(".")>-1) return
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

    // const valorAnteriorValido = (parseFloat(varValue)> 0)?varValue:""
    // var nuevoValor = valorAnteriorValido + ""  + key
    var nuevoValor = varValue + key
    if(varValue == "0" && key != ".") nuevoValor = key

    if(parseFloat(nuevoValor)>maxValue){
      showMessage("Valor muy grande");
      return
    }
    if(onChange != null){
      const changeCustom = onChange(nuevoValor)
      if( changeCustom != undefined){
        varChanger(changeCustom)
      }else{
        varChanger(nuevoValor)
      }
     }else{
      // console.log("es null...varchanger:")
      // console.log(varChanger)
      varChanger( nuevoValor )
     }

  }

  return (
    showFlag ? (
    <div style={{

      // width: "370px",
      padding: "10px",
      // background: "transparent",
      // position: "fixed",
      // left: "calc(50% - 111px)",
      // bottom: "50px",
      // zIndex: "10",
      display: "flex",
      alignContent: "center",
      alignItems: "start",
      flexDirection:"column"

    }}>



    <div style={{
      display:"flex",
      flexDirection:"row"
    }}>

      <TeclaButton textButton="LIMPIAR" style={{
        width: "150px",
        height: "70px",
        padding:"10px 0",
        backgroundColor:"#f05a5a",
        color:"white"
        }} actionButton={handleKeyButton} />
      <TeclaBorrarButton style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />


    </div>

    <div style={{
        display:"flex",
        flexDirection:"row"
      }}>

      <TeclaButton textButton="1" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
      <TeclaButton textButton="2" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
      <TeclaButton textButton="3" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />

     

    </div>



      <div style={{
        display:"flex",
        flexDirection:"row"
      }}>


      <TeclaButton textButton="4" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
      <TeclaButton textButton="5" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
      <TeclaButton textButton="6" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />

      </div>


      <div style={{
        display:"flex",
        flexDirection:"row"
      }}>

      <TeclaButton textButton="7" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
      <TeclaButton textButton="8" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
      <TeclaButton textButton="9" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
      
      </div>

      <div style={{
        display:"flex",
        flexDirection:"row"
      }}>
      
      <TeclaButton style={{width: "150px",height: "70px",}} textButton="0" actionButton={handleKeyButton} />
      <TeclaButton style={{
        width: "70px",height: "70px",
        padding:"10px 0"
        }} textButton="." actionButton={()=>{handleKeyButton(".")}}/>


    </div>

   

    </div>
  ) : (
    <></>
  )
)
};

export default TecladoPeso;
