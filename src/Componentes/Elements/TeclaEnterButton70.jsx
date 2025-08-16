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


const TeclaEnterButton70 = ({
  textButton, 
  actionButton,
  style = {},
}) => {
  const [disabled, setDisabled] = useState(false);

  return (
    <TeclaButton70 actionButton={()=>{
      actionButton("enter")
    }}
    textButton={<KeyboardReturn color="primary" sx={{
      color :"#fff"
    }} />}

    style={{ ...{
      backgroundColor:"#51d044",
    }, ...style}}
    />
  );
};

export default TeclaEnterButton70;
