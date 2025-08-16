import React, { useContext, useEffect, useState } from "react";
import {
  Paper,
  Grid,
  Table,
  TableBody,
  Typography,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Collapse,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Close as CloseIcon,
} from "@mui/icons-material";
import axios from "axios";
import SideBar from "../Componentes/NavBar/SideBar";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ModelConfig from "../Models/ModelConfig";
import SmallButton from "../Componentes/Elements/SmallButton";
import Product from "../Models/Product";
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";

import { saveAs } from "file-saver";
import * as xlsx from "xlsx/xlsx.mjs";

const ReporteMaestroProductos = ({
}) => {

  const {
    showLoading,
    hideLoading,
    userData,
    showMessage,
    showConfirm,
    showAlert
  } = useContext(SelectedOptionsContext);

  const [listado, setListado] = useState([])


  const generarReporte = () => {
    showLoading("Buscando productos...")
    console.log("inicia la busqueda..", dayjs().format("HH:mm:ss"))
    Product.getInstance().getAll((prods) => {
      hideLoading()
      setListado(prods)
      console.log("finaliza la busqueda..", dayjs().format("HH:mm:ss"))
    }, (err) => {
      showAlert(err)
      hideLoading()
      console.log("finaliza la busqueda..", dayjs().format("HH:mm:ss"))
    })
  }


  const exportExcel = () => {
    showLoading("Preparando excel...")
    const cabeceraArray = [];
    const detallesArray = [];
    const pagosArray = [];
    listado.forEach((prod) => {

      cabeceraArray.push({
        Codigo: prod.idProducto,
        Descripcion: prod.nombre,
        PrecioCosto: prod.precioCosto,
        PrecioVenta: prod.precioVenta,
        Stock: prod.stockActual,
        StockCritico: prod.stockCritico,
        Categoria: prod.categoria,
        SubCategoria: prod.subCategoria,
        Familia: prod.familia,
        SubFamilia: prod.subFamilia,
      })

    })

    const worksheet = xlsx.utils.json_to_sheet(cabeceraArray);

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Cabeceras Ventas");

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    hideLoading()
    setTimeout(() => {
      saveAs(excelBlob, "reporte-maestro-productos-" + dayjs().format("DD_MM_YYYY-HH_mm_ss") + ".xlsx");
    }, 300);

  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={12} md={12} lg={12}>
            {/* <br /><br /> */}
            <Typography variant="h5">
              Reporte maestro productos
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <SmallButton textButton={"Generar reporte"} actionButton={generarReporte} />
            {listado.length > 0 && (
              <SmallButton
                style={{
                  backgroundColor: "#005D25CC"
                }}
                textButton={"Exportar reporte a Excel"}
                actionButton={() => {
                  exportExcel()
                }}
              />
            )}
          </Grid>
        </Grid>
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Codigo</TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell>Precio Costo</TableCell>
                <TableCell>Precio Venta</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Stock critico</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Subcategoria</TableCell>
                <TableCell>Familia</TableCell>
                <TableCell>Subfamilia</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listado.map((prod, ix) => (
                <TableRow key={ix}>
                  <TableCell>{prod.idProducto}</TableCell>
                  <TableCell>{prod.nombre}</TableCell>
                  <TableCell>{prod.precioCosto}</TableCell>
                  <TableCell>{prod.precioVenta}</TableCell>
                  <TableCell>{prod.stockActual}</TableCell>
                  <TableCell>{prod.stockCritico}</TableCell>
                  <TableCell>{prod.categoria}</TableCell>
                  <TableCell>{prod.subCategoria}</TableCell>
                  <TableCell>{prod.familia}</TableCell>
                  <TableCell>{prod.subFamilia}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
};

export default ReporteMaestroProductos;