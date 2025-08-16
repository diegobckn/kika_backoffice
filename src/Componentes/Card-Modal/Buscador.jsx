import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paper, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";

const Buscador = ({ onSelectProduct }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const apiUrl = ModelConfig.get().urlBase;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTerm}`
        );
        setProducts(response.data.productos);
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorMessage("Error al buscar el producto por descripción");
      }
    };

    if (searchTerm.trim() !== "") {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [searchTerm]);

  const handleSelectProduct = (product) => {
    onSelectProduct(product);
    setSearchTerm(""); // Limpiar el término de búsqueda después de seleccionar un producto
  };

  return (
    <Paper elevation={1} style={{ background: "#859398", display: "flex", flexDirection: "column", alignItems: "center", margin: "5px" }}>
      <TextField
        style={{ backgroundColor: "white", borderRadius: "5px", marginBottom: "10px" }}
        fullWidth
        placeholder="Buscar por descripción"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {errorMessage && <Typography variant="body4" color="error">{errorMessage}</Typography>}
      <TableContainer component={Paper} style={{ overflowX: "auto", maxHeight: "200px" }}>
        <Table>
          <TableHead style={{ background: "white", height: "30%" }}>
            <TableRow>
              <TableCell>Descripción</TableCell>
              <TableCell>Plu</TableCell>
              <TableCell>Agregar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>{product.idProducto}</TableCell>
                <TableCell>{product.precioCosto}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleSelectProduct(product)}>
                    Agregar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Buscador;
