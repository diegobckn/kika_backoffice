import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Avatar,
  TextField,
  CircularProgress,
  Snackbar,
  Checkbox,
  IconButton,
  Collapse,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SideBar from "../../../Componentes/NavBar/SideBar";
import axios from "axios";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ModelConfig from "../../../Models/ModelConfig";
import User from "../../../Models/User";
import PagoTransferencia from "../../../Componentes/ScreenDialog/FormularioTransferencia";
import PagoCheque from "../../../Componentes/ScreenDialog/FormularioCheque";
import PagoParcial from "../../../Componentes/ScreenDialog/PagoParcial";
import System from "../../../Helpers/System";
import ItemTablaModalDetalle from "./ItemTablaModalDetalle";
import ItemTablaItemDetalle from "./ItemTablaItemDetalle";


const ItemTablaDetalles = ({
  dataItem,

  handleSort,
  order,
  sortData,
}) => {

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Razon Social</TableCell>
          <TableCell>Tipo Documento</TableCell>
          <TableCell onClick={() => handleSort("folio")}>
            Folio
            <ArrowUpwardIcon
              fontSize="small"
              style={{
                color:
                  order.field === "folio" &&
                    order.direction === "asc"
                    ? "black"
                    : "dimgrey",
              }}
            />
            <ArrowDownwardIcon
              fontSize="small"
              style={{
                color:
                  order.field === "folio" &&
                    order.direction === "desc"
                    ? "black"
                    : "dimgrey",
              }}
            />
          </TableCell>
          <TableCell onClick={() => handleSort("fecha")}>
            Fecha
            <ArrowUpwardIcon
              fontSize="small"
              style={{
                color:
                  order.field === "fechaIngreso" &&
                    order.direction === "asc"
                    ? "black"
                    : "dimgrey",
              }}
            />
            <ArrowDownwardIcon
              fontSize="small"
              style={{
                color:
                  order.field === "fechaIngreso" &&
                    order.direction === "desc"
                    ? "black"
                    : "dimgrey",
              }}
            />
          </TableCell>
          <TableCell onClick={() => handleSort("total")}>
            Total
            <ArrowUpwardIcon
              fontSize="small"
              style={{
                color:
                  order.field === "total" &&
                    order.direction === "asc"
                    ? "black"
                    : "dimgrey",
              }}
            />
            <ArrowDownwardIcon
              fontSize="small"
              style={{
                color:
                  order.field === "total" &&
                    order.direction === "desc"
                    ? "black"
                    : "dimgrey",
              }}
            />
          </TableCell>

          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortData(
          dataItem,
          order.field,
          order.direction
        ).map((item) => (
          <ItemTablaItemDetalle
            key={item.id}
            item={item}
          />
        ))}
        <TableRow>

        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ItemTablaDetalles;
