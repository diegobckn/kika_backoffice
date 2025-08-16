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
import SucursalCaja from '../../Models/SucursalCaja';
import System from '../../Helpers/System';
import RefreshInfoControl from '../Elements/RefreshInfoControl';


export default function ({
}) {
  const {
    userData,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const [estadoCajas, setEstadoCajas] = useState([])

  const solicitarEstadosCajas = () => {
    return SucursalCaja.getInstance().getEstados((data) => {
      // console.log("estados de la caja", data.cajaTurnoEstados)
      setEstadoCajas(data.cajaTurnoEstados)
    }, () => { })
  }

  useEffect(() => {
    solicitarEstadosCajas()
  }, [])

  return estadoCajas.length > 0 ? (
    <Box
      sx={{
        bgcolor: "background.paper",
        boxShadow: 2,
        p: 4,
        overflow: "auto", // Added scrollable feature
        padding: "10px",
        position:"relative"
      }}
    >


      <RefreshInfoControl
        variableEnSesion={"dashboardRefreshEstadoCajas"}
        fetchInfo={solicitarEstadosCajas}
      />

      <Typography variant='h5'>Estados Cajas</Typography>
      {estadoCajas.map((estadoCaja, ix) => (
        <div key={ix} style={{
          padding: "10px",
          margin: "3px",
          display: "inline-block",
          backgroundColor: (estadoCaja.cierreCaja ? "#56D005" : "#E30202"),
          color: "#fff"
        }}>
          <Typography variant='p' sx={{ display: "block" }}>
            Sucursal {estadoCaja.codigoSucursal}
          </Typography>

          <Typography variant='p' sx={{ display: "block" }}>
            Caja {estadoCaja.puntoVenta}
          </Typography>

          <Typography variant='p' sx={{ display: "block" }}>
            Turno {estadoCaja.idTurno}
          </Typography>

          <Typography variant='p' sx={{ display: "block" }}>
            {estadoCaja.usuarioNombre} {estadoCaja.usuarioApellido}
          </Typography>

          <Typography variant='p' sx={{ display: "block" }}>
            {estadoCaja.cierreCaja ? "Con cierre" : "Sin cerrar"}
          </Typography>

          <Typography variant='p' sx={{ display: "block" }}>
            Fecha Ingreso {System.formatDateServer(estadoCaja.fechaIngreso)}
          </Typography>

          <Typography variant='p' sx={{ display: "block" }}>
            Fecha Termino {estadoCaja.fechaTermino === "1990-01-01T00:00:00" ? "-" : System.formatDateServer(estadoCaja.fechaTermino)}
          </Typography>
        </div>
      ))}

    </Box>
  ) : (
    <Typography></Typography>
  )
}