/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { CircularProgress, } from '@mui/material';
import { useNavigate } from "react-router-dom";
import ModelConfig from '../../Models/ModelConfig';
import dayjs from 'dayjs';
import axios from 'axios';
import System from '../../Helpers/System';
import RefreshInfoControl from '../Elements/RefreshInfoControl';
import ReporteCompra from '../../Models/ReporteCompra';

export default function ({

}) {
  const navigate = useNavigate();

  const apiUrl = ModelConfig.get().urlBase;

  const [compras, setCompras] = useState([])
  const [totalCompras, setTotalCompras] = useState(0)
  const [cantidadCompras, setCantidadCompras] = useState([])


  const fetchDataCompras = async () => {
    return ReporteCompra.searchInServer({
      fechadesde: dayjs().format("YYYY-MM-DD"),
      fechahasta: dayjs().format("YYYY-MM-DD"),
      tipoComprobantes: "Ticket,Ingreso Interno,Factura,Boleta",
    }, (compras, response) => {
      setCantidadCompras(response.data.cantidad);

      if (response.data.cantidad > 0) {
        setCompras(compras);
        console.log("Datos recibidos:", compras);

        const totalValue = compras.reduce(
          (sum, item) => sum + item.total,
          0
        );
        setTotalCompras(totalValue);
      } else {
        setCompras([]);
        setTotalCompras(0);
      }
    },
      (error) => {
        console.error("Error al buscar datos:", error);
        // setError("Error fetching data");
        setCompras([]);
        setTotalCompras(0);
      })

    // console.log("Iniciando fetchData con params:", params);

    // try {
    //   const url = `${apiUrl}/Proveedores/ReporteProveedorCompraByFechaGet`;


    //   const response = await axios.get(url, { params });

    //   console.log("Respuesta del servidor:", response);

    //   if (response.data) {
    //     setCantidadCompras(response.data.cantidad);

    //     if (response.data.cantidad > 0 && response.data.proveedorCompraCabeceraReportes) {
    //       setCompras(response.data.proveedorCompraCabeceraReportes);
    //       console.log("Datos recibidos:", response.data.proveedorCompraCabeceraReportes);

    //       const totalValue = response.data.proveedorCompraCabeceraReportes.reduce(
    //         (sum, item) => sum + item.total,
    //         0
    //       );
    //       setTotalCompras(totalValue);
    //     } else {
    //       setCompras([]);
    //       setTotalCompras(0);
    //     }
    //   } else {
    //     console.warn("La respuesta no contiene datos:", response);
    //     setCompras([]);
    //     setTotalCompras(0);
    //   }
    // } catch (error) {
    //   console.error("Error al buscar datos:", error);
    //   setTotalCompras(0);
    // }
  };

  useEffect(() => {
    fetchDataCompras()
  }, [])


  return (
    <Card>
      <CardContent sx={{
        position: "relative"
      }}>

        <RefreshInfoControl
          variableEnSesion={"dashboardRefreshCompras"}
          fetchInfo={fetchDataCompras}
        />
        <div style={{
          display: "inline-block",
          padding: "15px 30px",
          marginRight: "30px",
          marginBottom: "10px",
          border: "1px solid darkgray"
        }}>
          <Typography variant="p" sx={{ display: "block" }}>Compras</Typography>
          <Typography variant="p">&nbsp;</Typography>

          <Typography variant="h3">${System.formatMonedaLocal(totalCompras, false)}</Typography>
        </div>
        <div style={{
          display: "inline-block",
          padding: "15px 30px",
          textAlign: "center",
          border: "1px solid darkgray"
        }}>
          <Typography variant="p" sx={{ display: "block" }}>Facturas</Typography>
          <Typography variant="p">Ingresadas</Typography>
          <Typography variant="h3">{cantidadCompras}</Typography>
        </div>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="small" onClick={() => {
          navigate("/reportes/rankinglibrocompras");
        }}>
          Ver detalles compras
        </Button>
      </CardActions>
    </Card>
  );
}