import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  InputLabel,
  Snackbar,
  Alert,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ModelConfig from "../../Models/ModelConfig";
import { AttachMoney, Edit, Percent } from "@mui/icons-material";
import Validator from "../../Helpers/Validator";
import Product from "../../Models/Product";
import System from "../../Helpers/System";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Client from "../../Models/Client";
import InputNumber from "../Elements/Compuestos/InputNumber";
export const defaultTheme = createTheme();

export default ({
  openDialog,
  setOpendialog,
  product,
  client,
  onChange
}) => {

  const {
    showLoading,
    hideLoading,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);
  const [nuevoPrecio, setNuevoPrecio] = useState(0);

  const handleAsignPrice = () => {
    if (!product) return;

    const precioActualizado = {
      ...product,
      precio: nuevoPrecio
    };


    // Guardar en el servidor
    guardarPrecioIndividual(precioActualizado);
    onChange(precioActualizado)
    setOpendialog(false);
  };

  const guardarPrecioIndividual = async (precio) => {
    if (!client) {
      showMessage("Por favor, selecciona un cliente primero.");
      return;
    }

    // Estructura de datos corregida según el endpoint
    const datosParaGuardar = {
      codigoCliente: client.codigoCliente,
      codigoClienteSucursal: client.clienteSucursal ?? 0,
      preciosProductos: [
        {
          idProducto: precio.idProducto,
          precio: parseFloat(precio.precio)
        }
      ]
    };

    showLoading("Guardando precio del cliente...")
    const clientModel = Client.getInstance();
    clientModel.saveClientPrices(
      datosParaGuardar,
      (respuesta) => {
        hideLoading()
        showMessage("¡Precio actualizado con éxito!");
      },
      (error) => {
        hideLoading()
        showMessage(`Error al guardar: ${error.message || JSON.stringify(error)}`);
      }
    );
  };

  useEffect(() => {
    if (!openDialog || !product) return
    console.log("producto", product)
    setNuevoPrecio(product.precio);
  }, [openDialog, product])

  return !product ? null : (
    <Dialog open={openDialog} onClose={() => setOpendialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Edit sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Cambiar Precio</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Producto: <strong>{product.nombre}</strong>
        </Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="body1">Costo:</Typography>
          <Chip
            label={"$" + System.formatMonedaLocal(product.costo, false)}
            color="default"
            size="medium"
            sx={{ ml: 1, fontWeight: 'bold', mr: 10 }}
          />
          <Typography variant="body1">Precio actual:</Typography>
          <Chip
            label={"$" + System.formatMonedaLocal(product.precio, false)}
            color="primary"
            size="medium"
            sx={{ ml: 1, fontWeight: 'bold' }}
          />
        </Box>
        <InputNumber
          fieldName="nuevoPrecio"
          label="Nuevo Precio"
          required={true}
          autoFocus={true}
          inputState={[nuevoPrecio, setNuevoPrecio]}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
          }}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpendialog(false)} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleAsignPrice} variant="contained" color="primary" startIcon={<Edit />}>
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  )
};

