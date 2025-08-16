/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Grid,
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditarProducto from "../Productos/EditarProducto";
import ModelConfig from "../../Models/ModelConfig";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Product from "../../Models/Product";
import SearchListProductItem from "./SearchListProductItem";
import System from "../../Helpers/System";
import ProductoCriticoItem from "./ProductoCriticoItem";
import ProductoValorizadoItem from "./ProductoValorizadoItem";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import SelectList from "../Elements/Compuestos/SelectList";

const ITEMS_PER_PAGE = 10;
const ProductosValorizados = ({
  refresh,
  setRefresh
}) => {

  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tipoPrecio, setTipoPrecio] = useState(-1);

  const [totalCosto, setTotalCosto] = useState(0);
  const [totalVenta, setTotalVenta] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1000);
  const [pageProduct, setPageProduct] = useState([]);
  // const [refresh, setRefresh] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [hasResult, setHasResult] = useState(false);
  const [product, setProduct] = useState([]);

  const handleTabChange = (event, newValue) => {
    // setSelectedTab(newValue);
  };

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

  const listarProductos = async () => {
    if (!startDate || !endDate) return
    showLoading("Cargando productos...")
    Product.getStockValorizadoPaginado({
      fechadesde: startDate ? startDate.format("YYYY-MM-DD") : "",
      fechahasta: endDate ? endDate.format("YYYY-MM-DD") : "",
      tipo: tipoPrecio === 0 ? "PrecioCosto" : "PrecioVenta",
      pageNumber: currentPage,
      rowPage: ITEMS_PER_PAGE
    }, (prods, response) => {
      if (Array.isArray(response.data.productos)) {
        setProduct(response.data.productos);
        // setFilteredProducts(response.data.productos);
        setPageCount(response.data.cantidadRegistros);
        setPageProduct(response.data.productos);
        setHasResult(response.data.productos.length > 0)

        var totalCostox = 0
        var totalVentax = 0
        response.data.productos.forEach((prod)=>{
          const subtotalCosto = prod.precioCosto * prod.stockActual
          const subtotalVenta = prod.precioVenta * prod.stockActual
          totalCostox += subtotalCosto
          totalVentax += subtotalVenta
        })

        setTotalCosto(totalCostox)
        setTotalVenta(totalVentax)
      }
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
    listarProductos()
  }

  useEffect(() => {
    console.log("cambio pageProduct")
  }, [pageProduct,]);



  useEffect(() => {
    console.log("cambio hasResult")
  }, [
    hasResult
  ]);

  useEffect(() => {
    updateList()
    console.log("cambio de pagina")
  }, [currentPage]);


  // Dentro de useEffect, después de eliminar el producto, actualiza la lista de productos
  useEffect(() => {
    updateList()
  }, [refresh]);


  useEffect(() => {
    setStartDate(dayjs())
    setEndDate(dayjs())
    setTipoPrecio(0)
  }, [])

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <div>
        {/* <Tabs value={selectedTab} onChange={handleTabChange}> */}
        <Tabs value={0}>
          <Tab label="Stock valorizado" />
          {/* <Tab label="Productos con codigos" /> */}
        </Tabs>
        {/* <div style={{ p: 2, mt: 4 }} role="tabpanel" hidden={selectedTab !== 0}> */}
        <div style={{ p: 2, mt: 4 }} role="tabpanel">



          <Grid container spacing={2} sx={{ mt: 2 }}>

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
              <SelectList selectItems={[
                "Precio Costo",
                "Precio Venta"
              ]}
                withLabel={false}
                styles={{
                  position: 'relative',
                  top: "-16px"
                }}
                required={true}
                inputState={[tipoPrecio, setTipoPrecio]}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <Button
                sx={{ p: 2, mb: 3 }}
                variant="contained"
                onClick={listarProductos}
                fullWidth
              >
                Buscar
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              {tipoPrecio === 0 ? (
                <Typography variant="p">Total costos: ${System.formatMonedaLocal(totalCosto,false)}</Typography>
              ) : (
                <Typography variant="p">Total ventas: ${System.formatMonedaLocal(totalVenta,false)}</Typography>
              )}
            </Grid>
          </Grid>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Codigo Producto </TableCell>
                <TableCell>Descripcion</TableCell>

                {tipoPrecio === 0 && (
                  <TableCell>Precio costo </TableCell>
                )}
                {/* {tipoPrecio === 0 && (
                  <TableCell>Subtotal costo </TableCell>
                )} */}

                {tipoPrecio === 1 && (
                  <TableCell>Precio venta </TableCell>
                )}
                {/* {tipoPrecio === 1 && (
                  <TableCell>Subtotal venta </TableCell>
                )} */}

                <TableCell>Stock actual</TableCell>
                <TableCell>total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!hasResult ? (
                <TableRow>
                  <TableCell colSpan={2}>No se encontraron productos</TableCell>
                </TableRow>
              ) : (
                pageProduct.map((product, index) => (
                  <ProductoValorizadoItem
                    tipoPrecio={tipoPrecio}
                    product={product}
                    key={index}
                    index={index}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
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

export default ProductosValorizados;
