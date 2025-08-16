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
  IconButton,
  Pagination,
  Tabs,
  Tab,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditarProducto from "./EditarProducto";
import ModelConfig from "../../Models/ModelConfig";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Product from "../../Models/Product";

const SearchListProductItem = ({
  product,
  index,
  onEditClick,
  onDeleteClick
}) => {

  const apiUrl = ModelConfig.get().urlBase;
  
  useEffect(()=>{
    // console.log("mostrando item de producto")
    // console.log(product)

  },[])
  return (
    <TableRow key={index}>
      <TableCell>{product.idProducto}</TableCell>
      <TableCell>
        {product.nombre}
        <br />
        <span style={{ color: "purple" }}>Marca: </span>
        {product.marca} <br />
      </TableCell>
      <TableCell>
        <span style={{ color: "purple" }}>Categoría: </span>
        {product.categoria} <br />
        <span style={{ color: "purple" }}>SubCategoría: </span>
        {product.subCategoria} <br />
        <span style={{ color: "purple" }}>Familia: </span>
        {product.familia} <br />
        <span style={{ color: "purple" }}>SubFamilia: </span>
        {product.subFamilia} <br />
      </TableCell>
      <TableCell>
        <span style={{ color: "purple" }}>Precio Costo: </span>
        {product.precioCosto} <br />
        <span style={{ color: "purple" }}>Precio Venta: </span>
        {product.precioVenta} <br />
      </TableCell>
      <TableCell>
      <span style={{ color: "purple" }}>Stock Inicial: </span>
      {product.stockInicial} <br />
      <span style={{ color: "purple" }}>Stock Actual: </span>
      {product.stockActual} <br />
        <span style={{ color: "purple" }}>Stock Crítico: </span>
        {product.stockCritico} <br />
      </TableCell>
      <TableCell>{product.impuesto}</TableCell>
      <TableCell>{product.bodega}</TableCell>
      <TableCell>{product.proveedor}</TableCell>
      <TableCell>
        <IconButton onClick={() => onEditClick(product)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDeleteClick(product)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default SearchListProductItem;
