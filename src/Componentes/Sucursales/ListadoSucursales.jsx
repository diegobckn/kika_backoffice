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

const ITEMS_PER_PAGE = 10;

const ListadoSucursales = ({
  changeToRefresh
}) => {

  const {
    showLoading,
    hideLoading,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [sucursales, setSucursales] = useState([])
  
  
  const cargarListado = ()=>{
    console.log("Cargando el listado")
    showLoading("Cargando el listado")
    Sucursal.getAll((sucursalesx)=>{
      setSucursales(sucursalesx)
      hideLoading()
    },(err)=>{
      hideLoading()
      showMessage(err)
    })
  }

  useEffect(()=>{
    cargarListado()
  },[])

  useEffect(()=>{
    cargarListado()
    console.log("cambiando para refresh")
  },[changeToRefresh])

  return (
    <Box sx={{ p: 2, mb: 4 }}>
          {sucursales.length === 0 ? (
            <Typography>
              No hay informacion para mostrar
            </Typography>
          ) : (

          <Table>
            <TableHead>
            <TableRow>
                <TableCell colSpan={10}>Sucursales</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Descripción</TableCell>
                {/* <TableCell>Acciones</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {sucursales.map((sucursal,key) => (
                <TableRow key={key}>
                  <TableCell>{sucursal.idSucursal}</TableCell>
                  <TableCell>{sucursal.descripcionSucursal}</TableCell>
                  {/* <TableCell>
                    
                    <IconButton onClick={() => {
                      setSucursalSelect(sucursal)
                      setShowEdit(true)
                    }}>
                      <EditIcon />
                    </IconButton>
  
                    </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
    </Box>
  );
};

export default ListadoSucursales;
