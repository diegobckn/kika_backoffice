/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  IconButton,
  Grid,
  Select,
  InputLabel,
  Pagination,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ModelConfig from "../../Models/ModelConfig";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Sucursal from "../../Models/Sucursal";
import System from "../../Helpers/System";
import SucursalCaja from "../../Models/SucursalCaja";
import TiposPasarela from "../../definitions/TiposPasarela";
import EditarCajaSucursal from "./EditarCajaSucursal";

const ITEMS_PER_PAGE = 10;

const ListadoCajas = () => {

  const {
    showLoading,
    hideLoading,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [sucursales, setSucursales] = useState([])
  const [cajas, setCajas] = useState([])

  const [cajaSelect, setCajaSelect] = useState(null)
  const [showEdit, setShowEdit] = useState(false)

  
  const cargarListado = ()=>{
    showLoading("Cargando el listado")
    Sucursal.getAll((sucursalesx)=>{
      setSucursales(sucursalesx)
      procesarCajas(sucursalesx)
      hideLoading()
    },(err)=>{
      hideLoading()
      showMessage(err)
    })
  }

  const procesarCajas = (sucursales)=>{
    var cajasx = []
    sucursales.forEach((sucursal,ix)=>{
      console.log(sucursal)
      if(sucursal.puntoVenta && sucursal.puntoVenta.length>0){
        sucursal.puntoVenta.forEach((puntoVentaItem,ix2)=>{
          if(puntoVentaItem && puntoVentaItem.idSucursalPvTipo === TiposPasarela.CAJA){
            puntoVentaItem.sucursal = sucursal.descripcionSucursal
            cajasx.push(puntoVentaItem)
          }
        })
      }
    })
    setCajas(cajasx)
  }

  useEffect(()=>{
    cargarListado()
  },[])

  return (
    <Box sx={{ p: 2, mb: 4 }}>
          {cajas.length === 0 ? (
            <Typography>
              No hay informacion para mostrar
            </Typography>
          ) : (

          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={10}>Cajas</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre de la caja</TableCell>
                <TableCell>Sucursal</TableCell>
                <TableCell>Configuraciones</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cajas.map((caja,key) => (
                <TableRow key={key}>
                  <TableCell>{caja.idCaja}</TableCell>
                  <TableCell>{caja.sPuntoVenta}</TableCell>
                  <TableCell>{caja.sucursal}</TableCell>
                  <TableCell>{caja.puntoVentaConfiguracions.length}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => {
                      setCajaSelect(caja)
                      setShowEdit(true)
                    }}>
                      <EditIcon />
                    </IconButton>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}

      <EditarCajaSucursal
        openDialog={showEdit}
        setOpendialog={setShowEdit}
        onClose={()=>{setShowEdit(false)}}
        data={cajaSelect}
        onUpdate={()=>{
          cargarListado()
          setShowEdit(false)
        }}
      />

    </Box>
  );
};

export default ListadoCajas;
