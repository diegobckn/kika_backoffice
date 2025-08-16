import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button,
  CircularProgress
} from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";


const SendingButton = ({
  textButton,
  actionButton,
  sending,
  sendingText = "Procesando...",
  style = {},
}) => {
  const [disabled, setDisabled] = useState(false);
  
  return (
        <Button
        sx={{ ...{
        color: "white",
        height:50,
        padding:"5px 30px",
        backgroundColor: "#283048",
        "&:hover": {
          color: "white",
          backgroundColor: "#1c1b17 ",
        },
        margin: "5px",
      }, ...style} }

        onClick={()=>{
          if(disabled) {
            return
          }
          actionButton()
          setDisabled(sending);
          setTimeout(function(){
            setDisabled(false);
          },ModelConfig.getInstance().getFirst().buttonDelayClick);
        }}

        startIcon={sending 
          ?<CircularProgress size={20} />
          :<></>
        }

        disabled={sending}
        >
          {sending ? (
              <Typography variant="h7" style={{color:"white"}} >{sendingText}</Typography>
          ) : (
            <Typography variant="h7" style={{color:"white"}}>{textButton}</Typography>
          )}
          </Button>
  );
};

export default SendingButton;
