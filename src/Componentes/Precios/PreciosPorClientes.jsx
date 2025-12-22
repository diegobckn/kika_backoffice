
import React, { useState, useEffect, useContext } from 'react';
import Client from '../../Models/Client';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Box,
  Avatar,
  InputAdornment,
  Container,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import { AttachMoney, Person, Search, Edit, Refresh, Add, AddCircle } from '@mui/icons-material';
import InputNumber from "../Elements/Compuestos/InputNumber"
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SearchClient from '../Elements/SearchClient';
import SmallButton from '../Elements/SmallButton';
import { width } from '@mui/system';
import System from '../../Helpers/System';
import PreciosCambiar from './PreciosCambiar';


const PreciosPorClientes = () => {

  const {
    showLoading,
    hideLoading,
    showAlert,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [preciosCliente, setPreciosCliente] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [openAsignarPrecio, setOpenAsignarPrecio] = useState(false);

  // Obtener todos los clientes al montar

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    showLoading("Cargando productos del cliente...")
    const clientModel = Client.getInstance();

    const codigoSucursal = cliente.clienteSucursal ?? 0;

    clientModel.getClientPrices(
      codigoSucursal,
      cliente.codigoCliente,
      (precios) => {
        setPreciosCliente(precios);
        hideLoading()
      },
      (error) => {
        console.error("Error al obtener precios:", error);
        hideLoading()
        showMessage(`Error al cargar precios: ${error}`);
      },
      1,
      10000000
    );
  };

  const handleSelect = (price) => {
    setSelectedPrice(price);
    setOpenAsignarPrecio(true);
  };

  const onUpdatePrice = (prod) => {
    setPreciosCliente(prev =>
      prev.map(p => p.idProducto === prod.idProducto ? prod : p)
    );
  }

  const filteredPrices = searchTerm
    ? preciosCliente.filter(price =>
      price.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    : preciosCliente;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardHeader
          title="Editor de Precios por Cliente"
          titleTypographyProps={{ variant: 'h4', fontWeight: 'bold' }}
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SearchClient onSelect={seleccionarCliente} onSetNull={() => { setClienteSeleccionado(null) }} />
            </Grid>

            {clienteSeleccionado && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    {preciosCliente.length === 0 ? (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" color="textSecondary">
                          Este cliente no tiene precios asignados
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12} sm={12} md={6} lg={6}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Filtrar productos"
                              placeholder="Nombre del producto..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Search />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>

                        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                          <Table stickyHeader size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Precio Actual</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Acciones</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filteredPrices.length > 0 ? (
                                filteredPrices.map((product, index) => (
                                  <TableRow
                                    key={product.idProducto + index}
                                    hover
                                    sx={{
                                      backgroundColor: selectedPrice?.idProducto === product.idProducto
                                        ? 'action.selected'
                                        : 'inherit',
                                    }}
                                  >
                                    <TableCell>{product.idProducto}</TableCell>
                                    <TableCell>{product.nombre}</TableCell>
                                    <TableCell>
                                      <Chip
                                        label={System.formatMonedaLocal(product.precio, false)}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                      />
                                    </TableCell>
                                    <TableCell align="right">
                                      <Button
                                        onClick={() => handleSelect(product)}
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<Edit />}
                                        size="small"
                                      >
                                        Cambiar
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={3} align="center">
                                    <Typography variant="body2" color="textSecondary">
                                      No se encontraron productos con ese nombre
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <PreciosCambiar
        openDialog={openAsignarPrecio}
        setOpendialog={setOpenAsignarPrecio}
        product={selectedPrice}
        client={clienteSeleccionado}
        onChange={onUpdatePrice}
      />
    </Container>
  );
};

export default PreciosPorClientes;