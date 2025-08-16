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


const TeclaEnterButton = ({
  textButton, 
  actionButton
}) => {
  const [disabled, setDisabled] = useState(false);

  return (
        <TeclaButton actionButton={()=>{
          actionButton("enter")
        }}
        textButton={<KeyboardReturn color="primary" sx={{
          color :"#fff"
        }} />}

        style={{
          backgroundColor:"#51d044",
        }}
        />
  );
};

export default TeclaEnterButton;
