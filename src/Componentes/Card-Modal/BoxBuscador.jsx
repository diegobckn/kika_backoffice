import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Button,
  TextField,
  ListItem,
  Chip,
  Typography,
  Snackbar,
  InputLabel,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

const BoxBuscador = ({ onClosePreciosClientes }) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editedPrices, setEditedPrices] = useState("");
  const [productSearchText, setProductSearchText] = useState(""); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [page, setPage] = useState(0); 
  const rowsPerPage = 5; // Mostrar solo 5 filas por página
  const [preciosModificados, setPreciosModificados] = useState({});
  const [loadingProduct, setLoadingProduct] = useState(null); 
  const [selectedItem, setSelectedItem] = useState(null);
  const apiUrl = ModelConfig.get().urlBase;
  const codigoCliente = selectedClient ? selectedClient.codigoCliente : null;
  const codigoClienteSucursal = selectedClient
    ? selectedClient.codigoClienteSucursal
    : null;

  const handleChipClick = async (result) => {
    setSelectedResult(result);
    setSelectedClient(result);
    setSearchResults([]);

    try {
      const response = await axios.get(
        `${apiUrl}/Clientes/GetClientesProductoPrecioByIdCliente?codigoCliente=${result.codigoCliente}&codigoClienteSucursal=${result.codigoClienteSucursal}`
      );
      setProducts(response.data.clientesProductoPrecioMostrar);
    } catch (error) {
      console.error("Error fetching products by client:", error);
    }
  };

  const handleSearch = async () => {
    setSelectedClient("");
    if (searchText.trim() === "") {
      setSnackbarMessage("El campo de búsqueda está vacío");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.get(
        `${apiUrl}/Clientes/GetClientesByNombreApellido?nombreApellido=${searchText}`
      );
      if (
        Array.isArray(response.data.clienteSucursal) &&
        response.data.clienteSucursal.length > 0
      ) {
        setSearchResults(response.data.clienteSucursal);
        setSnackbarMessage("Resultados encontrados");
      } else {
        setSearchResults([]);
        setSnackbarMessage("No se encontraron resultados");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSearchResults([]);
      setSnackbarMessage("Error al buscar");
    }
    setSnackbarOpen(true);
  };

  const handleProductSearchChange = (e) => {
    setProductSearchText(e.target.value);
  };

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.nombre.toLowerCase().includes(productSearchText.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [productSearchText, products]);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value.trim() === "") {
      setSearchResults([]);
    }
  };

  const handleKeyDown = (event, field) => {
    if (field === "marca") {
      const regex = /^[a-zA-Z]*$/;
      if (!regex.test(event.key) && event.key !== "Backspace") {
        event.preventDefault();
      }
    }
    if (field === "nombre") {
      const regex = /^[a-zA-Z]*$/;
      if (!regex.test(event.key) && event.key !== "Backspace") {
        event.preventDefault();
      }
    }
    if (field === "precio") {
      if (!/^\d+$/.test(event.key) && event.key !== "Backspace") {
        event.preventDefault();
      }
    }
  };

  const handlePrecioChange = (e, itemId) => {
    const updatedPrices = {
      ...preciosModificados,
      [itemId]: e.target.value.trim() !== "" ? parseFloat(e.target.value) : "",
    };
    setPreciosModificados(updatedPrices);
  };

  const handleSaveChanges = async (
    idProducto,
    codigoCliente,
    codigoClienteSucursal
  ) => {
    try {
      setLoadingProduct(idProducto);

      const requestBody = {
        codigoCliente: codigoCliente,
        codigoClienteSucursal: codigoClienteSucursal,
        preciosProductos: [
          {
            idProducto: parseInt(idProducto),
            precio: preciosModificados[idProducto],
          },
        ],
      };

      const response = await axios.put(
        `${apiUrl}/Clientes/PutClientesProductoActualizarPrecioByIdCliente`,
        requestBody
      );

      if (response.status === 200) {
        setTimeout(() => {
          setLoadingProduct(null);
        }, 3000);

        const updatePrecios = await axios.get(
          `${apiUrl}/Clientes/GetClientesProductoPrecioByIdCliente?codigoCliente=${codigoCliente}&codigoClienteSucursal=${codigoClienteSucursal}`
        );

        setSnackbarMessage(response.data.descripcion);
        setSnackbarOpen(true);

        const deudasResponse = await axios.get(
          `${apiUrl}/Clientes/GetClientesDeudasByIdCliente?codigoCliente=${codigoCliente}&codigoClienteSucursal=${codigoClienteSucursal}`
        );
      }
    } catch (error) {
      console.error("Error al actualizar los precios:", error);
      setTimeout(() => {
        setLoadingProduct(null);
      }, 3000);
    }
  };

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedResults = filteredProducts.slice(startIndex, endIndex);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Grid container item xs={12} md={12} lg={12}>
      <Grid
        container
        sx={{
          minWidth: 200,
          width: "100%",
          display: "flex",
        }}
        alignItems="center"
      >
        <InputLabel
          sx={{
            display: "flex",
            alignItems: "center",
            margin: 1,
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Buscador de clientes
        </InputLabel>
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              margin: 1,
            }}
          >
            <TextField
              fullWidth
              name="precio"
              placeholder="Ingrese Nombre Apellido"
              value={searchText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
                margin: "1px",
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                width: "40%",
                margin: "1px",
                height: "3.4rem",
                backgroundColor: "#283048",
                color: "white",
                "&:hover": { backgroundColor: "#1c1b17" },
                marginLeft: "8px",
              }}
            >
              Buscar
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        md={12}
        lg={12}
        sx={{ overflowX: "auto", paddingX: 2 }}
      >
        <div style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto" }}>
          {searchResults.map((result, index) => (
            <ListItem key={result.codigoCliente} sx={{ display: "inline" }}>
              <Chip
                label={`${result.nombreResponsable} ${result.apellidoResponsable}`}
                onClick={() => handleChipClick(result)}
                sx={{
                  backgroundColor: "#2196f3",
                  margin: "5px",
                }}
              />
            </ListItem>
          ))}
        </div>
        {selectedClient && (
          <ListItem key={selectedClient.codigoCliente}>
            <Chip
              label={`${selectedClient.nombreResponsable} ${selectedClient.apellidoResponsable}`}
              icon={<CheckCircleIcon />}
              sx={{
                backgroundColor: "#A8EB12",
                margin: "5px",
              }}
            />
          </ListItem>
        )}
      </Grid>

      {selectedClient && (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Precio Venta</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={3}>
                  <TextField
                    fullWidth
                    placeholder="Buscar producto por nombre"
                    value={productSearchText}
                    onChange={handleProductSearchChange}
                  />
                </TableCell>
              </TableRow>
              {paginatedResults.map((product) => (
                <TableRow key={product.idProducto}>
                  <TableCell>
                    {product.nombre} <br />
                    PLU: {product.idProducto}{" "}
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="precio"
                      onKeyDown={(event) => handleKeyDown(event, "precio")}
                      variant="outlined"
                      fullWidth
                      value={
                        preciosModificados[product.idProducto] !== undefined
                          ? preciosModificados[product.idProducto]
                          : product.precio
                      }
                      onChange={(e) =>
                        handlePrecioChange(e, product.idProducto)
                      }
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        maxLength: 7,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() =>
                        handleSaveChanges(
                          product.idProducto,
                          codigoCliente,
                          codigoClienteSucursal
                        )
                      }
                      sx={{
                        backgroundColor: "#2196f3",
                        color: "white",
                        opacity:
                          loadingProduct === product.idProducto ? 0.5 : 1,
                      }}
                      disabled={loadingProduct === product.idProducto}
                    >
                      {loadingProduct === product.idProducto
                        ? "Guardando..."
                        : "Guardar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[]}
            labelRowsPerPage="Por página"
          />
        </TableContainer>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default BoxBuscador;
