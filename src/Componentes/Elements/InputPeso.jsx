import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button,
  TextField
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";


const InputPeso = ({
    inputValue,
    funChanger,
    textInput = "Ingrese el peso", 
    onClick = ()=>{},
    showGrInfo = true,
    style = {},
  }) => {
    
  const [enGr, setEngr] = useState("")


  const checkGr = (valor)=>{
    // if(parseFloat(valor)>0 && parseFloat(valor)<1){
    //   setEngr(Math.round(parseFloat(valor) * 100) / 100  * 1000 + "")
    // }else{
    //   setEngr("")
    // }
    var kilos = Math.trunc(valor);
    var gramos = valor - kilos
    gramos = Math.round(parseFloat(gramos) * 100) / 100  * 1000 + ""

    var tx = ""
    if(kilos>0){
      if(kilos>1)
      tx = kilos + " KILOS"
      else
      tx = kilos + " KILO"
    }

    if(gramos>0){
      if(tx.length>0){
        tx += " y " + gramos + " GRAMOS"
      }else{
        tx += gramos + " GRAMOS"
      }
    }

    setEngr( tx )
  }

  useEffect(()=>{
    checkGr(inputValue)
  },[inputValue])
  
    

  return (
      <>

      <TextField
        margin="normal"
        fullWidth
        label={textInput}
        type="text"
        value={inputValue}
        onClick={onClick}

        onChange={(e) => funChanger(e.target.value)}
      />

      <div style={{
        display:"flex",
        flexDirection:"row"
      }}>
        {
          showGrInfo && enGr!="" &&(
            <div style={{
              width:"100%",
              margin:"0 auto",
              marginLeft:"5px",
              height: "30px",
              textAlign:"center",
              fontSize:20,
              // backgroundColor:"#6df0ff"
            }}>{enGr}</div>
          )
        }

      </div>


      </>
  );
};

export default InputPeso;
