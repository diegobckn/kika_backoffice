import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";


const SmallSecondaryButton = ({
  textButton,
  actionButton = ()=>{},
  style = {},
  isDisabled = false,
  withDelay = true,

  onTouchStart = ()=>{},
  onMouseDown = ()=>{},
  onTouchEnd = ()=>{},
  onMouseUp = ()=>{},
  onMouseLeave = ()=>{},
  onTouchMove = ()=>{},

  animateBackgroundColor = false

}) => {
  const [clickeable, setClickeable] = useState(true);
  const [colorFondo, setColorFondo] = useState("#C603B0")

  const changeBackgroundColor = ()=>{
    setColorFondo("#0dee8e")
    setTimeout(() => {
      setColorFondo("#C603B0")
    }, 1000);
  }

  return (
        <Button
        disabled={isDisabled}
        sx={{ ...{
        width: "130px",
        backgroundColor: colorFondo,
        color: "white",
        "&:hover": {
          backgroundColor: "#1c1b17 ",
          color: "white",
        },
        margin: "5px",
      }, ...style} }

        onClick={()=>{
          if(!clickeable) {
            return
          }
          actionButton()
          if(withDelay){
            setClickeable(false);
            setTimeout(function(){
              setClickeable(true);
            },ModelConfig.getInstance().getFirst().buttonDelayClick);
          }

          if(animateBackgroundColor){
            changeBackgroundColor()
          }
        }}

        onTouchStart={()=>{onTouchStart()}}
        onMouseDown={()=>{onMouseDown()}}
        onTouchEnd={()=>{onTouchEnd()}}
        onMouseUp={()=>{onMouseUp()}}
        onMouseLeave={()=>{onMouseLeave()}}
        onTouchMove={()=>{onTouchMove()}}


        >
          <Typography variant="h7">{textButton}</Typography>
        </Button>
  );
};

export default SmallSecondaryButton;
