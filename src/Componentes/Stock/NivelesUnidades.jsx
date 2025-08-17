import React, { useState, useContext, useEffect } from "react";
import { Button, Grid, InputLabel, Paper } from "@mui/material";
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
import SelectButtonList from "../Elements/Compuestos/SelectButtonList";
import CONSTANTS from "../../definitions/Constants";
import SearchProductsMenorNivelStock from "../Elements/Compuestos/SearchProductsMenorNivelStock";

const NivelesUnidades = ({ onClose }) => {
  const { showLoading, hideLoading, showMessage } = useContext(SelectedOptionsContext);

  const [unidades, setUnidades] = useState([])

  var states = {
    cantidadRelacion: useState(1)
  }

  var validatorStates = {
    cantidadRelacion: useState(null),
  }

  const [selectedProduct, setSelectedProduct] = useState(null); // Para almacenar el producto seleccionado
  const [selectedProduct2, setSelectedProduct2] = useState(null); // Para almacenar el producto seleccionado

  const handleProductSelect = (product) => {
    unidades.forEach((uni, ix) => {
      if (uni.idTipoStock == product.tipoStock) {
        product.stockUnidad = uni.descripcionTipoStock
      }
    })
    setSelectedProduct(product)
  };

  const handleProductSelect2 = (product) => {
    // Actualizar el estado del stockSistema y almacenar el producto seleccionado

    unidades.forEach((uni, ix) => {
      if (uni.idTipoStock == product.tipoStock) {
        product.stockUnidad = uni.descripcionTipoStock
      }
    })
    setSelectedProduct2(product)
  };

  const handleSubmit = async () => {

    // Validar antes de enviar
    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false
    }

    if (!selectedProduct) {
      showMessage("Seleccionar 1er producto")
      return
    }

    if (!selectedProduct2) {
      showMessage("Seleccionar 2do producto")
      return
    }

    const data = {
      "codBarraProducto": selectedProduct2.idProducto + "",
      "codBarraRelacionado": selectedProduct.idProducto + "",
      "cantidad": parseFloat(states.cantidadRelacion[0])
    }

    showLoading("Enviando...");
    Stock.relacionarUnidades(
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

  const cargarUnidades = () => {
    showLoading("Cargando unidades");
    Stock.getUnits(
      (units, res) => {
        hideLoading();
        showMessage("realizado exitosamente");
        setUnidades(units)
      },
      (error) => {
        hideLoading();
        showMessage(error);
      }
    );
  }

  useEffect(() => {
    cargarUnidades()
  }, [])

  return (
    <Paper elevation={16} square sx={{ padding: "2%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2>Niveles de unidades de stock</h2>
        </Grid>

        <Grid item xs={12}>
          {/* SearchProducts ahora pasa el producto seleccionado */}
          {(!selectedProduct) && (
            <SearchProducts onProductSelect={handleProductSelect} />
          )}

          {(selectedProduct && !selectedProduct2) && (
            <SearchProductsMenorNivelStock
              firstProductSelected={selectedProduct}
              onProductSelect={handleProductSelect2} />
          )}

          {(selectedProduct && selectedProduct2) && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setSelectedProduct(null)
                }}
                sx={{
                  height: "40px",
                  margin: "10px"
                }}
              >
                Cambiar 1er producto
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setSelectedProduct2(null)
                }}
                sx={{ height: "40px" }}
              >
                Cambiar 2do producto
              </Button>
            </>


          )}

        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6} >
          <Box sx={{
            border: '1px solid #ddd',
            padding: 2,
            borderRadius: 2,
          }}>
            <Typography variant="h6"> 1er Producto:</Typography>
            {selectedProduct && (
              <>
                <Typography>{selectedProduct.idProducto}</Typography>
                <Typography>Nombre: {selectedProduct.nombre}</Typography>
                <Typography>Valor unit vta: ${selectedProduct.precioVenta}</Typography>
                <Typography>Unidad de Stock: {selectedProduct.stockUnidad}</Typography>
              </>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6} >
          <Box sx={{
            border: '1px solid #ddd',
            padding: 2,
            borderRadius: 2,
          }}>
            <Typography variant="h6"> 2do Producto:</Typography>
            {selectedProduct2 && (
              <>
                <Typography>{selectedProduct2.idProducto}</Typography>
                <Typography>Nombre: {selectedProduct2.nombre}</Typography>
                <Typography>Valor unit vta: ${selectedProduct2.precioVenta}</Typography>
                <Typography>Unidad de Stock: {selectedProduct2.stockUnidad}</Typography>
              </>
            )}
          </Box>
        </Grid>


        <Grid item xs={12} sm={12} md={6} lg={6} >
          <InputNumber
            inputState={states.cantidadRelacion}
            required={true}
            isDecimal={true}
            fieldName="cantidad Relacion"
            validationState={validatorStates.cantidadRelacion}
          />
        </Grid>




        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography sx={{
            marginTop: "70px"
          }}>{""}</Typography>
        </Grid>


        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Button
            onClick={() => {
              onClose()
            }}
            sx={{
              width: "30%",
              height: "50px",
              margin: "0 25%",
              // color:"black",
              // backgroundColor:"#F07373"
            }}
          >Atras</Button>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6}>
          <SendingButton
            textButton="Continuar"
            actionButton={handleSubmit}
            sending={false}
            sendingText="Registrando..."
            style={{
              width: "70%",
              margin: "0 15%",
              backgroundColor: "#950198"
            }}
          />
        </Grid>


      </Grid>
    </Paper>
  );
};

export default NivelesUnidades;
