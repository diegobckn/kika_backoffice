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
import Validator from "../../Helpers/Validator";


const TecladoUsuario = ({
  showFlag,varValue,
  varChanger,
  onEnter
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
      varChanger( varValue.slice(0, -1) )
       return
     }

    //  if(key == "k" && varValue.indexOf("k")>-1){
    //   showMessage("Ya no puede agregar la letra k");
    //   return;
    //  }

    //  if(key == "-" && varValue.indexOf("-")>-1){
    //   showMessage("Ya no puede agregar el guion(-)");
    //   return;
    //  }

    if(Validator.isRut(varValue + key)){
      varChanger( varValue + key )
    }
  }

  return (
    showFlag ? (
    <div style={{
      width: "300px",
      height: "300px",
      // position: "fixed",
      zIndex: "10",
      // background: "#efefef",
      display: "flex",
      alignContent: "center",
      alignItems: "start",
      flex: "1",
      left: "calc(50% - 150px)",
      bottom: "50px",
      flexDirection:"column"

    }}>
      <div style={{
        display:"flex",
        flexDirection:"row"
      }}>

      <TeclaButton textButton={1} actionButton={handleKeyButton} />
      <TeclaButton textButton={2} actionButton={handleKeyButton} />

      <TeclaButton textButton={3} actionButton={handleKeyButton} />

      <TeclaButton textButton="-" actionButton={handleKeyButton} />
    </div>



      <div style={{
        display:"flex",
        flexDirection:"row"
      }}>


      <TeclaButton textButton={4} actionButton={handleKeyButton} />

      <TeclaButton textButton={5} actionButton={handleKeyButton} />

      <TeclaButton textButton={6} actionButton={handleKeyButton} />

      <TeclaButton textButton="k" actionButton={handleKeyButton} />

      </div>


      <div style={{
        display:"flex",
        flexDirection:"row"
      }}>
      <TeclaButton textButton={7} actionButton={handleKeyButton} />

      <TeclaButton textButton={8} actionButton={handleKeyButton} />

      <TeclaButton textButton={9} actionButton={handleKeyButton} />

      </div>

      <div style={{
        display:"flex",
        flexDirection:"row"
      }}>
      <TeclaBorrarButton actionButton={handleKeyButton} />

      <TeclaButton textButton={0} actionButton={handleKeyButton} />

      <TeclaOkButton actionButton={handleKeyButton} />

    </div>
    </div>
  ) : (
    <></>
  )
)
};

export default TecladoUsuario;
