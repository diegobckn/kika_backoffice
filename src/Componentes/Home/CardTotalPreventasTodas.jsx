/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { CircularProgress, } from '@mui/material';
import { useNavigate } from "react-router-dom";
import ModelConfig from '../../Models/ModelConfig';
import dayjs from 'dayjs';
import axios from 'axios';
import ReporteVenta from '../../Models/ReporteVenta';
import System from '../../Helpers/System';
import RefreshInfoControl from '../Elements/RefreshInfoControl';

export default function ({
}) {
  const navigate = useNavigate();

  const [total, setTotal] = useState(0)
  const [cantidad, setCantidad] = useState([])

  const fetchDataPreventas = async () => {
    return ReporteVenta.getInstance().searchPreventasInServer({
      // fechadesde: "2025-01-01",
      fechadesde: dayjs().format("YYYY-MM-DD"),
      fechahasta: dayjs().format("YYYY-MM-DD"),
    }, (responseData, response) => {
      // console.log("preventas... respuesta", responseData)
      if (response.data.cantidad > 0 && response.data.preventaReportes) {
        // console.log("preventas....Datos recibidos:", response.data.preventaReportes);
        
        const totalx = response.data.preventaReportes.reduce(
          (sum, item) => sum + item.total,
          0
        );
        setTotal(totalx);
      } else {
        setTotal(0);
      }
      setCantidad(response.data.cantidad);
    }, (error) => {
      console.error("Error al buscar datos:", error);
      // setError("Error fetching data");
      setTotal(0);
    })
  };

  useEffect(() => {
    fetchDataPreventas()
  }, [])

  return (
    <Card sx={{
      backgroundColor: "#EEF4F9",
    }}>
      <CardContent sx={{
        position: "relative"
      }}>

        <RefreshInfoControl
          variableEnSesion={"dashboardRefreshTodasPreventas"}
          fetchInfo={fetchDataPreventas}
        />

        <div style={{
          display: "inline-block",
          padding: "15px 30px",
          marginRight: "30px",
          marginBottom: "10px",
          border: "1px solid darkgray"
        }}>
          <Typography variant="p" sx={{ display: "block" }}>Todas</Typography>
          <Typography variant="p">&nbsp;</Typography>

          <Typography variant="h3">${System.formatMonedaLocal(total, false)}</Typography>
        </div>
        <div style={{
          display: "inline-block",
          padding: "15px 30px",
          textAlign: "center",
          border: "1px solid darkgray"
        }}>
          <Typography variant="p" sx={{ display: "block" }}>Transacciones</Typography>
          <Typography variant="p">&nbsp;</Typography>
          <Typography variant="h3">{cantidad}</Typography>
        </div>
      </CardContent>
      <CardActions>
        {/* <Button variant="contained" size="small" onClick={() => {
          navigate("/reportes/rankinglibroventas");
        }}>
          Ver detalles ventas
        </Button> */}

      </CardActions>
    </Card>
  );
}