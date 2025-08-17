import React, { useState, useContext } from "react";
import { Grid, Paper } from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import InputNumber from "../Elements/Compuestos/InputNumber";
import SendingButton from "../Elements/SendingButton";
import System from "../../Helpers/System";
import SearchProducts from "../Elements/Compuestos/SearchProducts";
import { TextField, Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import User from "../../Models/User";
import Stock from "../../Models/Stock";

const AjusteInventario = ({ onClose }) => {
  const { showLoading, hideLoading, showMessage } = useContext(SelectedOptionsContext);

  var states = {
    stockFisico: useState(""),
  }

  var validatorStates = {
    stockFisico: useState(null),
  }

  const [selectedProduct, setSelectedProduct] = useState(null); // Para almacenar el producto seleccionado

  const handleProductSelect = (product) => {
    // Actualizar el estado del stockSistema y almacenar el producto seleccionado
    setSelectedProduct(product)
    console.log("Producto seleccionado:", product);
    states.stockFisico[1](product.stockActual)
  };

  const handleSubmit = async () => {
    if (states.stockFisico[0] === selectedProduct.stockActual) {
      showMessage("Debe ingresar un valor distinto al del sistema")
      return
    }
    // Validar antes de enviar
    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false
    }

    const data = {
      "observacion": "AJUSTE INVENTARIO",
      "idUsuario": User.getInstance().getFromSesion().codigoUsuario,
      "fechaIngreso": System.getInstance().getDateForServer(),
      "stockMovimientos": [
        {
          "cantidad": parseFloat(states.stockFisico[0]),
          "codProducto": selectedProduct.idProducto + ""
        }
      ]
    }



    console.log("Datos antes de enviar:", data)
    showLoading("Enviando...");
    Stock.ajusteInventario(
      data,
      (res) => {
        hideLoading();
        showMessage("realizado exitosamente");
        setTimeout(() => {
          onClose();
        }, 1000);
      },
      (error) => {
        hideLoading();
        showMessage(error);
      }
    );
  };

  return (
    <Paper elevation={16} square sx={{ padding: "2%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2>Ajuste Inventario</h2>
        </Grid>
        <Grid item xs={12}>
          {/* SearchProducts ahora pasa el producto seleccionado */}
          <SearchProducts onProductSelect={handleProductSelect} />
        </Grid>
        {/* Mostrar detalles del producto seleccionado */}
        {selectedProduct && (
          <Grid item xs={12} sm={12} md={6} lg={6} >
            <Box sx={{
              border: '1px solid #ddd',
              padding: 2,
              borderRadius: 2,
            }}>
              <Typography variant="h6"> Producto Seleccionado:</Typography>
              <Typography>Nombre: {selectedProduct.nombre}</Typography>

              <Typography>Stock en sistema: {selectedProduct.stockActual}</Typography>
            </Box>
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={6} lg={6} >
          {/* Reemplazamos el TextField con el InputNumber para Stock Físico */}
          <InputNumber
            inputState={states.stockFisico}
            validationState={validatorStates.stockFisico}
            withLabel={true}
            isDecimal={true}
            fieldName="stockFisico"
            label="Stock Físico"
            required={true}
          />
        </Grid>
        <Grid item xs={12}>
          <SendingButton
            textButton=" Aplicar Ajuste"
            actionButton={handleSubmit}
            sending={false}
            sendingText="Registrando..."
            style={{
              width: "50%",
              margin: "0 25%",
              backgroundColor: "#950198"
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AjusteInventario;
