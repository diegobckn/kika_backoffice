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
  Typography,
  Grid,
} from "@mui/material";

import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";
import Product from "../Models/Product";
import System from "../Helpers/System";
import ProductoCriticoItem from "../Componentes/Productos/ProductoCriticoItem";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SelectList from "../Componentes/Elements/Compuestos/SelectList";
import ReporteVenta from "../Models/ReporteVenta";
import CostoGananciaItem from "../Componentes/Productos/CostoGananciaItem";


const ITEMS_PER_PAGE = 10;
const ReporteCostoGananciaListado = ({
  refresh,
  setRefresh
}) => {

  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1000);
  const [pageProduct, setPageProduct] = useState([]);
  const [hasResult, setHasResult] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(1);


  const setPageCount = (productCount) => {
    // console.log("calculando total")
    const totalPages = Math.ceil(productCount / ITEMS_PER_PAGE);
    // console.log("totalPages", totalPages)
    if (!isNaN(totalPages)) {
      // console.log("asigna", totalPages)
      setTotalPages(totalPages);
    } else {
      console.error("Invalid product count:", productCount);
    }
  };

  const handleBuscarClick = async () => {
    if(!startDate || !endDate) return
    showLoading("Cargando informacion...")
    ReporteVenta.searchCostoMargen({
      fechadesde: startDate ? startDate.format("YYYY-MM-DD") : "",
      fechahasta: endDate ? endDate.format("YYYY-MM-DD") : "",
      tipo: selectedTipo,

      categoria: -1,
      subcategoria: -1,
      familia: -1,
      subfamilia: -1,

      pageNumber: currentPage,
      rowPage: ITEMS_PER_PAGE
    }, (prods, response) => {
      setPageCount(response.data.cantidad);
      setPageProduct(response.data.reporteVentaCostoMargens);
      setHasResult(response.data.reporteVentaCostoMargens.length > 0)
      hideLoading()
    }, (error) => {
      console.error("Error fetching product:", error);
      setHasResult(false)
      hideLoading()
    })
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const updateList = () => {
    handleBuscarClick()
  }

  useEffect(() => {
    setStartDate(dayjs())
    setEndDate(dayjs())
  }, [])


  useEffect(() => {
    updateList()
    // console.log("cambio de pagina")
  }, [currentPage]);


  // Dentro de useEffect, después de eliminar el producto, actualiza la lista de productos
  useEffect(() => {
    updateList()
  }, [refresh]);

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <div>
        <Grid container spacing={1} alignItems="center">

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <br />
            <Typography variant="h5">
              Reporte de Costos Y Ganancias
            </Typography>
            <br />
          </Grid>

          <Grid item xs={12} sm={12} md={3} lg={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Inicio"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    sx: { mb: 2 },
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Término"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    sx: { mb: 2 },
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>


          <Grid item xs={12} sm={12} md={3} lg={3}>
            <SelectList
              inputState={[selectedTipo, setSelectedTipo]}
              withLabel={false}
              selectItems={[
                "CATEGORIA",
                "SUB CATEGORIA",
                "FAMILIA",
                "SUB FAMILIA",
              ]}
              styles={{
                marginTop: "-17px"
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <Button
              sx={{ p: 2, mb: 3 }}
              variant="contained"
              onClick={handleBuscarClick}
              fullWidth
            >
              Buscar
            </Button>
          </Grid>

        </Grid>


        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Codigo Producto </TableCell>
              <TableCell>Descripcion</TableCell>
              <TableCell>Precio costo </TableCell>
              <TableCell>Precio venta </TableCell>
              <TableCell>Utilidad</TableCell>
              <TableCell>Ranking</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!hasResult ? (
              <TableRow>
                <TableCell colSpan={2}>No se encontraron productos</TableCell>
              </TableRow>
            ) : (
              pageProduct.map((product, index) => (
                <CostoGananciaItem
                  info={product}
                  key={index}
                  index={index}
                  currentPage={currentPage}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />

    </Box>
  );
};

export default ReporteCostoGananciaListado;
