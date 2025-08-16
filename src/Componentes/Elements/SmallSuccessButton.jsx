import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";


const SmallSuccessButton = ({ 
  textButton,
  actionButton,
  style = {}
}) => {
  const [disabled, setDisabled] = useState(false);

  return (
    <Button

      sx={{
        ...{
          width: "130px",
          backgroundColor: "#259825",
          color: "white",
          "&:hover": {
            backgroundColor: "#52E138 ",
            color: "white",
          },
          margin: "5px",
        },
        ...style
      }}


      onClick={() => {
        if (disabled) {
          return
        }
        actionButton()
        setDisabled(true);
        setTimeout(function () {
          setDisabled(false);
        }, ModelConfig.getInstance().getFirst().buttonDelayClick);
      }}
    >
      <Typography variant="h7">{textButton}</Typography>
    </Button>
  );
};

export default SmallSuccessButton;
