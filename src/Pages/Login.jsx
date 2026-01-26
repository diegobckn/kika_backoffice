import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Grid,
} from "@mui/material";
import { Settings, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ModelConfig from "../Models/ModelConfig";
import dayjs from "dayjs";
import ScreenDialogConfig from "../Componentes/ScreenDialog/AdminConfig";
import System from "../Helpers/System";
import User from "../Models/User";
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";
import CardSemaforo from "../Componentes/Home/CardSemaforo";
import ModalLogin from "../Componentes/ScreenDialog/ModalLogin";

const Login = () => {
  const { setUserData } = useContext(SelectedOptionsContext);

  const navigate = useNavigate();
  return (
    <ModalLogin
      onSuccess={(userOk) => {
        setUserData(userOk);
        User.getInstance().saveInSesion(userOk)
        ModelConfig.change("idEmpresa", userOk.idEmpresa)
        navigate("/home");
      }}
      openDialog={true}
      setOpenDialog={() => { }}
      showBackButton={false}
    />
  );
};

export default Login;
