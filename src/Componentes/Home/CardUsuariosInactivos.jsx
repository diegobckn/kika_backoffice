/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardActions, Button, Typography, Box } from '@mui/material';
import { CircularProgress, } from '@mui/material';
import { useNavigate } from "react-router-dom";
import ModelConfig from '../../Models/ModelConfig';
import dayjs from 'dayjs';
import axios from 'axios';
import ReporteVenta from '../../Models/ReporteVenta';
import User from '../../Models/User';
import LongClick from '../../Helpers/LongClick';
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import RefreshInfoControl from '../Elements/RefreshInfoControl';


export default function ({
  setInactivos = () => { },
  usuariosActivos
}) {
  const {
    userData,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const [usuarios, setUsuarios] = useState([])
  const [usuariosInactivos, setUsuariosInactivos] = useState([])

  const esActivo = (usuario) => {
    var res = false
    usuariosActivos.forEach((userActive) => {
      if (userActive.codigoUsuario == usuario.codigoUsuario) {
        res = true
      }
    })
    return res
  }

  const clasificaUsuarios = (usus) => {
    // console.log("clasificando", usus)
    const ususInact = []
    usus.forEach((usu, ix) => {
      if (!esActivo(usu)) {
        ususInact.push(usu)
      }
    })

    setUsuariosInactivos(ususInact)
  }

  const fetchUsuarios = () => {
    User.getInstance().getAll((usuariosx) => {
      setUsuarios(usuariosx)
      clasificaUsuarios(usuariosx)
    }, () => { })
  }

  useEffect(() => {
    // fetchUsuarios()
  }, [])

  useEffect(() => {
    fetchUsuarios()
  }, [usuariosActivos])

  return (usuariosInactivos.length > 0 ? (
    <Box
      sx={{
        bgcolor: "background.paper",
        boxShadow: 2,
        p: 4,
        overflow: "auto", // Added scrollable feature
        padding: "10px",
        position: "relative"
      }}
    >

      {/* <RefreshInfoControl
        variableEnSesion={"dashboardRefreshUsuarios"}
      /> */}


      <Typography variant='h5'>Usuarios inactivos</Typography>
      {usuariosInactivos.map((usu, ix) =>
        <Typography sx={{
          borderRadius: "3px",
          padding: "10px",
          backgroundColor: "#DBE7FF",
          color: "#000000",
          margin: "10px",
          display: "inline-block"
        }} key={ix}>
          <Typography variant='p' sx={{ display: "block" }}>
            {usu.nombres} {usu.apellidos}
          </Typography>
          <Typography variant='p' sx={{ display: "block" }}>
            Cod. {usu.codigoUsuario}
          </Typography>
        </Typography>
      )}
    </Box>
  ) : (
    <Typography></Typography>
  )
  );
}