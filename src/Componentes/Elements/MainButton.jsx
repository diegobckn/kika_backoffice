import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";


const MainButton = ({
    textButton, 
    actionButton,
    xs=12,
    sm=12,
    md=2,
    lg=2,
    isDisabled = false,
    style = {},
  }) => {
  const [disabled, setDisabled] = useState(false);

  useEffect(()=>{
    setDisabled(isDisabled)
  },[])

  return (
      <Grid item xs={xs} sm={sm} md={md} lg={lg}>
          <Button
          sx={{ ...{
            width: "98%",
            height: "80px",
            backgroundColor: "#283048",
            color: "white",
            "&:hover": {
              backgroundColor: "#1c1b17 ",
              color: "white",
            },
            margin: "5px",
          }, ...style} }
          onClick={()=>{
            if(disabled) {
              return
            }
            actionButton()
            setDisabled(true);
            setTimeout(function(){
              setDisabled(false);
            },ModelConfig.getInstance().getFirst().buttonDelayClick);
          }}
          disabled={disabled}
          >
          <Typography variant="h7">{textButton}</Typography>
        </Button>
      </Grid>
  );
};

export default MainButton;
