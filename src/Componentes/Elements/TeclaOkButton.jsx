import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";
import { KeyboardReturn } from "@mui/icons-material";
import TeclaButton from "./TeclaButton";


const TeclaOkButton = ({actionButton, style={}}) => {
  const [disabled, setDisabled] = useState(false);

  return (
        <TeclaButton actionButton={()=>{
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

export default TeclaOkButton;
