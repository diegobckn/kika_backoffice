import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  Button, 
  TableContainer, 
  Paper, 
  Table, 
  TableBody, 
  TableRow, 
  TableCell, 
  Snackbar 
} from '@mui/material';
import axios from 'axios';

const ProductDialog = ({ openProduct, handleCloseProduct, handleAddProductToEdit }) => {
  const [searchTermProd, setSearchTermProd] = useState('');
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSearchButtonClick = async () => {
    if (searchTermProd.trim() === "") {
      setSearchedProducts([]);
      setSnackbarMessage("El campo de búsqueda está vacío");
      setSnackbarOpen(true);
      return;
    }
    
    const isNumeric = !isNaN(parseFloat(searchTermProd)) && isFinite(searchTermProd);

    try {
      let response;
      if (isNumeric) {
        response = await axios.get(`https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByCodigo?idproducto=${searchTermProd}&codigoCliente=${0}`);
        if (response.data && response.data.cantidadRegistros > 0) {
          handleSearchSuccess(response.data.registros);
        } else {
          response = await axios.get(`https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTermProd}&codigoCliente=${0}`);
          handleSearchSuccess(response.data.productos);
        }
      } else {
        response = await axios.get(`https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTermProd}&codigoCliente=${0}`);
        handleSearchSuccess(response.data.productos);
      }
    } catch (error) {
      console.error("Error al buscar el producto:", error);
      setSnackbarMessage("Error al buscar el producto");
      setSnackbarOpen(true);
    }
  };

  const handleSearchSuccess = (products) => {
    if (products && products.length > 0) {
      setSearchedProducts(products);
    } else {
      setSearchedProducts([]);
      setSnackbarMessage("No se encontraron productos para la búsqueda");
      setSnackbarOpen(true);
    }
  };

  return (
    <Dialog open={openProduct} onClose={handleCloseProduct}>
      <DialogTitle>Selecciona producto</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Buscar producto por descripción"
          value={searchTermProd}
          onChange={(e) => setSearchTermProd(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchButtonClick();
            }
          }}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSearchButtonClick}
          sx={{ mb: 2 }}
        >
          Buscar
        </Button>
        <TableContainer component={Paper} style={{ maxHeight: 200 }}>
          <Table>
            <TableBody>
              {searchedProducts.map((product) => (
                <TableRow key={product.idProducto}>
                  <TableCell>{product.nombre}</TableCell>
                  <TableCell>Plu: {product.idProducto}</TableCell>
                  <TableCell>Precio Costo: {product.precioCosto}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        handleAddProductToEdit(product);
                        handleCloseProduct();
                        setSearchTermProd("")
                        setSearchedProducts([])
                      }}
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
      </DialogContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Dialog>
  );
};

export default ProductDialog;
