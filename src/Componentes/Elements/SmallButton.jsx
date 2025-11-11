import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";


const SmallButton = ({
  textButton,
  actionButton = () => { },
  style = {},
  isDisabled = false,
  withDelay = true,

  onTouchStart = () => { },
  onMouseDown = () => { },
  onTouchEnd = () => { },
  onMouseUp = () => { },
  onMouseLeave = () => { },
  onTouchMove = () => { },

  animateBackgroundColor = false

}) => {
  const [clickeable, setClickeable] = useState(true);
  const [colorFondo, setColorFondo] = useState("#283048")

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(isDisabled)
  }, [isDisabled])



  const changeBackgroundColor = () => {
    setColorFondo("#0dee8e")
    setTimeout(() => {
      setColorFondo("#283048")
    }, 1000);
  }

  return (
    <Button
      disabled={disabled}
      sx={{
        ...{
          width: "130px",
          backgroundColor: (isDisabled ? "#ECEAEA" : colorFondo),
          color: "white",
          "&:hover": {
            backgroundColor: "#1c1b17 ",
            color: "white",
          },
          margin: "5px",
        }, ...style
      }}

      onClick={() => {
        if (!clickeable) {
          return
        }
        actionButton()
        if (withDelay) {
          setClickeable(false);
          setTimeout(function () {
            setClickeable(true);
          }, ModelConfig.getInstance().getFirst().buttonDelayClick);
        }

        if (animateBackgroundColor) {
          changeBackgroundColor()
        }
      }}

      onTouchStart={() => { onTouchStart() }}
      onMouseDown={() => { onMouseDown() }}
      onTouchEnd={() => { onTouchEnd() }}
      onMouseUp={() => { onMouseUp() }}
      onMouseLeave={() => { onMouseLeave() }}
      onTouchMove={() => { onTouchMove() }}


    >
      <Typography variant="h7">{textButton}</Typography>
    </Button>
  );
};

export default SmallButton;
