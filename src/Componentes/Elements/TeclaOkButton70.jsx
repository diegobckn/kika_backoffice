import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";
import { KeyboardReturn } from "@mui/icons-material";
import TeclaButton70 from "./TeclaButton70";


const TeclaOkButton70 = ({actionButton, style={}}) => {
  const [disabled, setDisabled] = useState(false);

  return (
        <TeclaButton70 actionButton={()=>{
          actionButton("enter")
        }}
        textButton="OK"
        style={{...{
          backgroundColor:"#51d044",
          color:"#fff"
        }, ...style}}
        />
  );
};

export default TeclaOkButton70;
