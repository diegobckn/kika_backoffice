
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // Importar el ícono de agregar
import SearchIcon from "@mui/icons-material/Search"; // Importar el ícono de búsqueda
import ModelConfig from "../../../Models/ModelConfig";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import Product from "../../../Models/Product";
import Model from "../../../Models/Model";

const SearchProducts = ({
  onProductSelect,
  labelInput = "Buscar producto...",
  textButton = "Buscar",
  focus = true
}) => {
  const { showLoading, hideLoading } = useContext(SelectedOptionsContext);
  const apiUrl = ModelConfig.get().urlBase;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [productToAdd, setProductToAdd] = useState(null);
  const [searched, setSearched] = useState(false); // Nuevo estado para verificar si se ha buscado


  useEffect(() => {
  }, []);

  const doSearch = (replaceSearch = "") => {
    if (searchTerm === "" && replaceSearch === "") return;

    var txtSearch = searchTerm;
    if (txtSearch === "") {
      txtSearch = replaceSearch;
      setSearchTerm(replaceSearch);
    }

    showLoading("haciendo busqueda por descripcion");

    Product.getInstance().findByDescriptionPaginado(
      {
        description: txtSearch,
        canPorPagina: 10,
        pagina: 1, // Pagina 1 para la busqueda
      },
      (prods) => {
        setFilteredProducts(prods); // Actualiza los productos filtrados
        hideLoading();
        setSearched(true); // Marca que se ha realizado una búsqueda
      },
      () => {
        hideLoading();
        setSearched(true); // Marca que se ha realizado una búsqueda
      }
    );
  };

  const handleAddProduct = (product) => {
    setProductToAdd(product);
    setOpenDialog(true);
    setFilteredProducts([])
    onProductSelect(product);
    setSearchTerm("")
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProductToAdd(null);
  };

  const handleConfirmAdd = () => {
    if (productToAdd) {
      setSnackbarMessage(`Producto ${productToAdd.nombre} agregado correctamente`);
      setOpenSnackbar(true);
      handleCloseDialog();
    }
  };

  useEffect(() => {
    if (openSnackbar) {
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    }
  }, [openSnackbar]);

  const checkEnterSearch = (e) => {
    if (e.keyCode === 13) {
      doSearch();
    }
  };

  const cargaAnteriorDeSesion = async (funSet, propiedad) => {
    const anterior = await Model.getInstance().cargarDeSesion1(propiedad)
    funSet(anterior)
  }

  useEffect(() => {
    if (window.location.href.indexOf("stockmobile") > -1) {
      cargaAnteriorDeSesion(setSearchTerm, "ultimaBusquedaStockMobile")
    }
    console.log("cambio focus", focus)
  }, [focus])


  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="dense"
            label={labelInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={checkEnterSearch}
            sx={{
              bgcolor: "white",
              "& .MuiInputBase-root": {
                height: "50px", // Ajusta la altura según el estilo deseado
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => doSearch()}
                    startIcon={<SearchIcon />}
                    sx={{ height: "40px" }}
                  >
                    {textButton}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Mostrar resultados filtrados solo si se ha buscado y hay resultados */}
      {searched && filteredProducts.length > 0 && (
        <Box sx={{ marginTop: "20px" }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => (
              <Box
                key={prod.idProducto}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  bgcolor: "background.paper",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            align="center"
                            sx={{ backgroundColor: "gainsboro", padding: "8px" }}
                          >
                            Nombre
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            align="center"
                            sx={{ padding: "6px", fontSize: "14px" }}
                          >
                            <strong>{prod.nombre}</strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>

                  <Grid item xs={6} sm={6} md={3} lg={3}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            align="center"
                            sx={{ backgroundColor: "gainsboro", padding: "8px" }}
                          >
                            Stock Actual
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            align="center"
                            sx={{ padding: "6px", fontSize: "14px" }}
                          >
                            <strong>{prod.stockActual}</strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>

                  <Grid item xs={6} sm={6} md={3} lg={3}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            align="center"
                            sx={{ backgroundColor: "gainsboro", padding: "8px" }}
                          >
                            Stock Crítico
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            align="center"
                            sx={{ padding: "6px", fontSize: "14px" }}
                          >
                            <strong>{prod.stockCritico}</strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>

                  <Grid item xs={12} sm={12} md={3} lg={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleAddProduct(prod)}
                      sx={{ height: "40px", width: "100%" }}
                    >
                      Seleccionar
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))
          ) : (
            <p>No hay productos que coincidan con la búsqueda.</p>
          )}
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        message={snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      />

      {/* Confirmación de agregar producto */}
      {/* <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Agregar Producto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas agregar este producto?
          </DialogContentText>
          <DialogContentText>Producto: {productToAdd?.nombre}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleConfirmAdd} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );

};

export default SearchProducts;

