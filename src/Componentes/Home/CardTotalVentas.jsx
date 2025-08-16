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
  const apiUrl = ModelConfig.get().urlBase;

  const [ventas, setVentas] = useState([])
  const [totalVentas, setTotalVentas] = useState(0)
  const [cantidadVentas, setCantidadVentas] = useState([])

  const fetchDataVentas = async () => {
    return ReporteVenta.getInstance().searchInServer({
      fechadesde: dayjs().format("YYYY-MM-DD"),
      fechahasta: dayjs().format("YYYY-MM-DD"),
      tipoComprobante: "0,1,2,3,4",
    }, (response) => {
      if (response.data) {
        setCantidadVentas(response.data.cantidad);
        if (response.data.cantidad > 0 && response.data.ventaCabeceraReportes) {
          setVentas(response.data.ventaCabeceraReportes);
          // console.log("Datos recibidos:", response.data.ventaCabeceraReportes);

          const totalValue = response.data.ventaCabeceraReportes.reduce(
            (sum, item) => sum + item.total,
            0
          );
          setTotalVentas(totalValue);
        } else {
          setVentas([]);
          setTotalVentas(0);
        }
      } else {
        console.warn("La respuesta no contiene datos:", response);
        setVentas([]);
        setTotalVentas(0);
      }
    }, (error) => {
      console.error("Error al buscar datos:", error);
      // setError("Error fetching data");
      setTotalVentas(0);
    })
  };

  useEffect(() => {
    fetchDataVentas()
  }, [])

  return (
    <Card >
      <CardContent sx={{
        position: "relative"
      }}>

        <RefreshInfoControl
          variableEnSesion={"dashboardRefreshVentas"}
          fetchInfo={fetchDataVentas}
        />

        <div style={{
          display: "inline-block",
          padding: "15px 30px",
          marginRight: "30px",
          marginBottom: "10px",
          border: "1px solid darkgray",
        }}>



          <Typography variant="p" sx={{ display: "block" }}>Ventas</Typography>
          <Typography variant="p">&nbsp;</Typography>

          <Typography variant="h3">${System.formatMonedaLocal(totalVentas, false)}</Typography>
        </div>
        <div style={{
          display: "inline-block",
          padding: "15px 30px",
          textAlign: "center",
          border: "1px solid darkgray"
        }}>
          <Typography variant="p" sx={{ display: "block" }}>Transacciones</Typography>
          <Typography variant="p">&nbsp;</Typography>
          <Typography variant="h3">{cantidadVentas}</Typography>
        </div>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="small" onClick={() => {
          navigate("/reportes/rankinglibroventas");
        }}>
          Ver detalles ventas
        </Button>

      </CardActions>
    </Card>
  );
}