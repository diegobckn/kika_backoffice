import React, { useState, useContext, useEffect } from "react";
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

import { SelectedOptionsContext } from "../../../Componentes/Context/SelectedOptionsProvider";
import Proveedor from "../../../Models/Proveedor";
import ItemListado from "./ItemListado";
import System from "../../../Helpers/System";
import ProveedorDocumento from "../../../Models/ProveedorDocumento";

const DocumentosPorPagar = () => {
  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    showMessage,
    showAlert
  } = useContext(SelectedOptionsContext);

  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda


  const cargarComprasProveedores = () => {
    ProveedorDocumento.getCompras((compras) => {
      setProveedores(compras)
    }, showMessage)
  }

  useEffect(() => {
    cargarComprasProveedores()
  }, []);

  const totalGeneral = proveedores.reduce(
    (acc, proveedor) => acc + proveedor.total,
    0
  );



  const [order, setOrder] = useState({
    field: "",
    direction: "asc",
  });

  const handleSort = (field) => {
    const isAsc = order.field === field && order.direction === "asc";
    setOrder({ field, direction: isAsc ? "desc" : "asc" });
  };

  const compareRut = (a, b) => {
    if (!a || !b) return 0;
    return a.localeCompare(b);
  };

  const compareNumerical = (a, b) => {
    return a - b;
  };
  const compareDate = (a, b) => {
    return new Date(a) - new Date(b);
  };


  const sortData = (array, field, direction) => {
    const sortedArray = [...array];
    sortedArray.sort((a, b) => {
      let comparison = 0;
      if (field === "rut") {
        comparison = compareRut(a.rut, b.rut);
      } else if (field === "folio" || field === "total") {
        comparison = compareNumerical(parseInt(a[field]), parseInt(b[field]));
      } else if (field === "fecha") {
        comparison = compareDate(a.fechaIngreso, b.fechaIngreso);
      } else {
        comparison = a[field] > b[field] ? 1 : -1;
      }
      return direction === "asc" ? comparison : -comparison;
    });
    return sortedArray;
  };



  const groupedData = proveedores.reduce((acc, item) => {
    if (!acc[item.rut]) {
      acc[item.rut] = [];
    }
    acc[item.rut].push(item);
    return acc;
  }, {});
  // console.log(" groupedData", groupedData);

  const filteredGroupKeys = Object.keys(groupedData).filter((rut) =>
    rut.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedGroupKeys = sortData(filteredGroupKeys, "rut", order.direction);

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Grid container sx={{ flexGrow: 1, p: 3 }} spacing={1}>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography variant="h5">Documentos por pagar</Typography>
          <br />
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={4}>
          <TextField
            label="Filtrar por RUT"
            variant="outlined"
            margin="normal"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <br />
          <Typography variant="p">Total General:</Typography>
          <Typography variant="p" sx={{
            margin: "0 20px"
          }}>
            <strong>
              ${System.formatMonedaLocal(totalGeneral, false)}
            </strong>
          </Typography>
          <br />
          <br />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>RUT</TableCell>
                  <TableCell>Razon Social</TableCell>
                  <TableCell>Documentos</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedGroupKeys.map((rut) => (
                  <ItemListado

                    dataItem={groupedData[rut]}
                    key={rut}
                    rut={rut}

                    order={order}
                    handleSort={handleSort}
                    sortData={sortData}

                    proveedores={proveedores}

                    onRequireRefresh={() => {
                      cargarComprasProveedores()
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </Grid >
      </Grid >

    </div >
  );
};

export default DocumentosPorPagar;
