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


const ItemTablaItemDetalle = ({
  item
}) => {

  const [detailOpen, setDetailOpen] = useState(false);

  

  return (
    <TableRow>
      <TableCell>{item.razonSocial}</TableCell>
      <TableCell>{item.tipoDocumento}</TableCell>
      <TableCell>{item.folio}</TableCell>
      <TableCell>
        {new Date(
          item.fechaIngreso
        ).toLocaleDateString("es-CL")}
      </TableCell>
      <TableCell>
        ${System.formatMonedaLocal(item.total, false)}
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          onClick={() => { setDetailOpen(true) }}
        >
          Detalle
        </Button>

        <ItemTablaModalDetalle
          detailOpen={detailOpen}
          handleDetailClose={() => { setDetailOpen(false) }}

          selectedItem={item}
          // handleOpenPaymentProcess={handleOpenPaymentProcess}
        />




      </TableCell>
    </TableRow>
  );
};

export default ItemTablaItemDetalle;
