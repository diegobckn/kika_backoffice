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
import System from '../../Helpers/System';
import RefreshInfoControl from '../Elements/RefreshInfoControl';
import Sucursal from '../../Models/Sucursal';


export default function ({
  setActivos = () => { }
}) {
  const {
    userData,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const [usuariosActivos, setUsuariosActivos] = useState([])

  const [sucursalesInfo, setSucursalesInfo] = useState(null)
  const [sucursales, setSucursales] = useState([])
  const [cajas, setCajas] = useState([])

  const [funFetch, setFunFetch] = useState(null)

  const cargarSucursales = (onFinish = () => { }) => {
    Sucursal.getAll((responseData) => {
      setSucursalesInfo(responseData)

      var sucursalesx = []
      var cajasx = []

      responseData.forEach((sucursalInfo, ix) => {
        sucursalesx.push({
          id: sucursalInfo.idSucursal + "",
          value: sucursalInfo.descripcionSucursal
        })

        sucursalInfo.puntoVenta.forEach((cajaItem, ix2) => {
          cajasx.push({
            id: cajaItem.idCaja + "",
            value: cajaItem.sPuntoVenta,
            tipo: cajaItem.idSucursalPvTipo
          })
        })
      })


      setSucursales(sucursalesx)
      setCajas(cajasx)

      onFinish()

      // console.log("fin carga sucursales", responseData)
    }, (error) => {

    })
  }

  const buscarNombreSucursal = (idSucursal) => {
    var nombre = idSucursal + ""
    sucursalesInfo.forEach((sucItem, ix) => {
      if (sucItem.idSucursal == idSucursal) {
        nombre = sucItem.descripcionSucursal
      }
    })

    return nombre
  }

  const buscarNombreCaja = (idCaja) => {
    // console.log("buscarNombreCaja para idCaja", idCaja)
    var nombre = idCaja + ""
    cajas.forEach((cajaItem, ix) => {
      if (cajaItem.id == idCaja) {
        nombre = cajaItem.value
      }
    })

    return nombre
  }

  const fetchInfoUsuarios = async () => {
    return User.getActivos((usuariosx) => {
      setUsuariosActivos(usuariosx)
      setActivos(usuariosx)
    }, (error) => {
      console.error("Error al buscar datos:", error);

    })
  }

  useEffect(() => {
    cargarSucursales(() => { fetchInfoUsuarios() })
  }, [])



  return (usuariosActivos.length > 0 ? (
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

        <RefreshInfoControl
          variableEnSesion={"dashboardRefreshUsuarios"}
          fetchInfo={fetchInfoUsuarios}
        />

      <Typography variant='h5'>Usuarios Activos</Typography>
      {
        usuariosActivos.map((usu, ix) => {
          // console.log("usuarios activo", usu)
          const longBoleta = new LongClick(1);
          longBoleta.onClick(() => {
            // alert("click normal")
          })
          longBoleta.onLongClick(() => {
            showConfirm("Cerrar la sesion de " + usu.nombre + " " + usu.apellido + "?", () => {
              const user = new User()
              user.fill(usu)
              user.doLogoutInServer(() => {
                showMessage("Realizado correctamente")
                fetchInfoUsuarios()
              }, () => {
                showMessage("no se pudo realizar")
              })
            })
          })
          return (
            <Typography sx={{
              borderRadius: "3px",
              padding: "10px",
              backgroundColor: "#ffde06",
              color: "#000",
              margin: "10px",
              border: "1px solid #000",
              cursor: "pointer",
              userSelect: "none",
              display: "inline-block"
            }} key={ix}
              onTouchStart={() => { longBoleta.onStart() }}
              onMouseDown={() => { longBoleta.onStart() }}
              onTouchEnd={() => { longBoleta.onEnd() }}
              onMouseUp={() => { longBoleta.onEnd() }}
              onMouseLeave={() => { longBoleta.cancel() }}
              onTouchMove={() => { longBoleta.cancel() }}
            >
              <Typography variant='p'>
                {usu.nombre} {usu.apellido}
              </Typography>
              <Typography variant='p' sx={{ display: "block" }}>
                Cod. {usu.codigoUsuario}
              </Typography>
              <Typography variant='p' sx={{ display: "block" }}>
                Sucursal {buscarNombreSucursal(usu.codigoSucursal)}
              </Typography>
              <Typography variant='p' sx={{ display: "block" }}>
                Caja{buscarNombreCaja(usu.puntoVenta)}
              </Typography>
            </Typography>)
        }
        )
      }
    </Box >
  ) : (
    <Typography></Typography>
  )
  );
}