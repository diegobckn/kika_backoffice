import React, { useState, useContext, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";
import { useNavigate } from "react-router-dom";
import User from "../../Models/User";

const SessionOptions = ({
  openDialog,
  setOpenDialog
}) => {
  const navigate = useNavigate();
  
  var prods = [];
  for (let index = 1; index <= 5; index++) {
    prods.push(index);
  }

  const {
    clearSessionData 
  } = useContext(SelectedOptionsContext);


  const handleLogout = () => {
    // setUserData(null);
    // sessionStorage.clear(); // Limpiar sessionStorage
    clearSessionData()
    navigate('/login');
  };


  useEffect(()=>{
    // console.log("check login")
    if(!User.getInstance().sesion.hasOne()){
      // console.log("no tiene sesion")
      // console.log(User.getInstance())
      // console.log(User.getInstance().getFromSesion())
      navigate('/login');
    }
    // console.log("fin check login")
  },[])

  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
    >
      <DialogTitle>Cerrar Sesión</DialogTitle>
      <DialogContent>
        <DialogContentText>
        Deseas cerrar sesión?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleLogout} color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionOptions;
