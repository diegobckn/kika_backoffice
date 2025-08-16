import React, { useState, useEffect, useContext, useRef } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PercentIcon from "@mui/icons-material/Percent";
import IconButton from "@mui/material/IconButton";

import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TablaPrecios from "./TablaPrecios";
import TablaNivel from "./TablaNivel";
import BoxBuscador from "./BoxBuscador";
import ModelConfig from "../../Models/ModelConfig";

export const defaultTheme = createTheme();
const apiUrl = ModelConfig.get().urlBase;


const PreciosGenerales = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [precioCosto, setPrecioCosto] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [valorAgregar, setValorAgregar] = useState("");
  const [precioFinal, setPrecioFinal] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [selectedClient, setSelectedClient] = useState(null);
  

  const codigoCliente = selectedClient ? selectedClient.codigoCliente : null;
  const codigoClienteSucursal = selectedClient ? selectedClient.codigoClienteSucursal : null;
  



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/Clientes/GetClientesProductoPrecioByIdCliente?codigoCliente=${codigoCliente}&codigoClienteSucursal=${codigoClienteSucursal}`
        );
        setProducts(response.data.productos);
        console.log(response.data.productos);
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorMessage("Error al buscar el producto por descripción");
      }
    };
  
    if (codigoCliente && codigoClienteSucursal) {
      fetchProducts();
    }
  }, [codigoCliente, codigoClienteSucursal]);
  
  
  const handleSearchButtonClick = async () => {
    if (searchTerm.trim() === "") {
      setErrorMessage("El campo de búsqueda está vacío");
      setSearchedProducts([]);
      setOpenSnackbar(true);
      return; // Salimos de la función ya que no hay necesidad de realizar la búsqueda si está vacío
    }
    // Determinar si el término de búsqueda es numérico
    const isNumeric = !isNaN(parseFloat(searchTerm)) && isFinite(searchTerm);

    try {
      // Realizar la búsqueda por descripción
      const response = await axios.get(
        `${apiUrl}/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTerm}&codigoCliente=${0}`
      );
      handleSearchSuccess(response, "Descripción");
    } catch (error) {
      console.error("Error al buscar el producto:", error);
      setErrorMessage("Error al buscar el producto");
      setOpenSnackbar(true);

      setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    }
  };

  const handleSearchSuccess = (response, searchType) => {
    if (response.data && response.data.cantidadRegistros > 0) {
      setSearchedProducts(response.data.productos);
      setSearchTerm("");
      setOpenSnackbar(true);
      setErrorMessage(`Productos encontrados (${searchType})`);
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    } else if (response.data && response.data.cantidadRegistros === 0) {
      setErrorMessage(`No se encontraron resultados (${searchType})`);
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    } else {
      setErrorMessage(`Error al buscar el producto (${searchType})`);
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setPrecioCosto(product.precioCosto || 0); // Set price cost to selected product's cost price, if empty set to 0
    setSearchTerm(""); // Clear the search term after selecting a product
    setSearchedProducts([]); // Clear the searched products

  };

  const handleAddPorcentaje = () => {
    const newPrecioFinal =
      parseFloat(precioCosto || 0) +
      (parseFloat(precioCosto || 0) * parseFloat(porcentaje || 0)) / 100;
    setPrecioFinal(Math.floor(newPrecioFinal));
  };

  const handleAddPrecio = () => {
    const newPrecioFinal =
      parseFloat(precioCosto || 0) + parseFloat(valorAgregar || 0);
    setPrecioFinal(Math.floor(newPrecioFinal));
  };

  const handleInputChange = (value, setter) => {
    if (/^\d*\.?\d*$/.test(value)) {
      // Solo números y un punto decimal permitido
      setter(value);
    }
  };

  const handleKeyUp = (e, setter) => {
    const value = e.target.value;
    if (!/^\d*\.?\d*$/.test(value)) {
      // Si no es un número válido, eliminar el último carácter
      setter(value.slice(0, -1));
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Grid container justifyContent="center">
        <Grid item xs={12} md={10} lg={10}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Asociación Precios clientes
            </Typography>
            <BoxBuscador
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
            />{" "}
           
            <TableContainer
              component={Paper}
              style={{ overflowX: "auto", maxHeight: 200 }}
            >
              <Table>
                {/* <TableHead sx={{ background: "#859398", height: "30%" }}>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>PLU</TableCell>
                  <TableCell>Agregar</TableCell>
                </TableRow>
              </TableHead> */}
                <TableBody>
                  {searchedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.nombre}</TableCell>
                      <TableCell sx={{ width: "21%" }}>
                        Plu:{""}
                        {product.idProducto}
                      </TableCell>

                      <TableCell>
                        <Button
                          onClick={() => handleSelectProduct(product)}
                          variant="contained"
                          color="secondary"
                        >
                          Agregar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {selectedProduct && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Producto Seleccionado:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body1">
                    Descripción: {selectedProduct.nombre}
                  </Typography>
                  <Typography variant="body1">
                    PLU: {selectedProduct.idProducto}
                  </Typography>
                </Paper>
              </Box>
            )}
            {/* <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={12}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    Precio de costo
                  </Typography>
                  <TextField
                  
                    id="precioCosto"
                    size="small"  
                   value={precioCosto || 0}
                    readOnly
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={12}>
                <Box display="flex" alignItems="center">
                  <Button
                    variant="contained"
                    onClick={handleAddPorcentaje}
                    sx={{ mr: 1, width: "44%" }}
                    
                  >
                    Agregar <PercentIcon />
                  </Button>
                  <TextField
                    id="porcentaje"
                    size="small"
                    value={porcentaje}
                    onChange={(e) =>
                      handleInputChange(e.target.value, setPorcentaje)
                    }
                    onKeyUp={(e) => handleKeyUp(e, setPorcentaje)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={12}>
                <Box display="flex" alignItems="center">
                  <Button
                    variant="contained"
                    onClick={handleAddPrecio}
                    sx={{ mr: 1, width: "44%" }}
                  >
                    Agregar <AttachMoneyIcon />
                  </Button>
                  <TextField
                    id="valorAgregar"
                    size="small"
                    value={valorAgregar}
                    onChange={(e) =>
                      handleInputChange(e.target.value, setValorAgregar)
                    }
                    onKeyUp={(e) => handleKeyUp(e, setValorAgregar)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    Nuevo precio de costo
                  </Typography>
                  <TextField
                    id="precioCosto"
                    size="small"
                    value={precioFinal || 0}

                    readOnly
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid item xs={12} sm={12} md={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                >
                  Guardar Precio
                </Button>
              </Grid>
            </Grid> */}
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={() => setOpenSnackbar(false)}
            >
              <Alert
                onClose={() => setOpenSnackbar(false)}
                severity="success"
                sx={{ width: "100%" }}
              >
                {errorMessage}
              </Alert>
            </Snackbar>
            {/* <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={12}>
                <Box display="flex" alignItems="center">
                  <TablaPrecios />
                </Box>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Box display="flex" alignItems="center">
                  <TablaNivel />
                </Box>
              </Grid>
            </Grid> */}
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default PreciosGenerales;
