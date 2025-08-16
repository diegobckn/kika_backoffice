import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";
import { Backspace } from "@mui/icons-material";


const TeclaBorrarButton = ({actionButton, style={}}) => {
  const [disabled, setDisabled] = useState(false);

  return (
        <div
        style={{ ...{
          width: "40px",
          height: "40px",
          textAlign: "center",
          padding: "10px",
          cursor: "pointer",
          fontSize: "32px",
          color: "#4f4e4e",
          backgroundColor: "#e1e1e5",
          border: "2px solid #6b6767",
          margin: "5px",
          borderRadius: "10px",
          boxShadow: "0 0 1px 1px #c1c1c1",
          fontFamily: "'Victor Mono'",
          }, ...style
        }}
        onClick={()=>{
          actionButton("borrar")
        }}
        >
          <p style={{
            margin: 0,
            padding: 0,
            userSelect: "none"
          }}>
            <Backspace sx={{
              color :"#4f4e4e"
            }} />
          </p>
        </div>
  );
};

export default TeclaBorrarButton;
