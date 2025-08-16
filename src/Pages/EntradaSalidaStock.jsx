import React, { useState, useContext } from "react";
import SideBar from "../Componentes/NavBar/SideBar.jsx";
import { Grid, Paper, Button, Box, Typography, TextField } from "@mui/material";
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider.jsx";
import InputNumber from "../Componentes/Elements/Compuestos/InputName.jsx";
import SendingButton from "../Componentes/Elements/SendingButton.jsx";
import System from "../Helpers/StorageSesion.ts";
import SearchProducts from "../Componentes/Elements/Compuestos/SearchProducts.jsx";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const EntradaSalidaStock = ({ onClose }) => {
  const { showLoadingDialog, hideLoading, showMessage } = useContext(SelectedOptionsContext);

  const [ajusteType, setAjusteType] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockSistema, setStockSistema] = useState("");
  const [validationStockSistema, setValidationStockSistema] = useState({});
  const [stockFisico, setStockFisico] = useState("");
  const [validationStockFisico, setValidationStockFisico] = useState({});
  const [fechaAjuste, setFechaAjuste] = useState(null);
  const [ajusteDescripcion, setAjusteDescripcion] = useState("");

  const handleProductSelect = (product) => {
    console.log("Producto recibido desde SearchProducts:", product);
    setSelectedProduct(product);
    setStockSistema(product.stockActual); // Actualizar stockSistema con el stock actual del producto
  };

  const handleSubmit = async () => {
    // Validar antes de enviar
    if (
      !System.allValidationOk(
        { stockSistema, stockFisico, fechaAjuste },
        showMessage
      )
    ) {
      return;
    }

    const ajusteEntradaSalida = {
     
      stockFisico: stockFisico + "",
      fechaAjuste: fechaAjuste ? fechaAjuste.format("YYYY-MM-DD") : "",
      tipoAjuste: ajusteType, // Agregar el tipo de ajuste
      ajusteDescripcion:ajusteDescripcion
    };

    console.log("Datos antes de enviar:", ajusteEntradaSalida);
    showLoadingDialog("Enviando...");
    System.getInstance().add(
      ajusteEntradaSalida,
      (res) => {
        hideLoading();
        showMessage("Ajuste de Inventario creado exitosamente");
        setTimeout(() => {
          onClose();
        }, 2000);
      },
      (error) => {
        hideLoading();
        showMessage(error);
      }
    );
  };

  return (
    <Box sx={{ display: "flex", height: "100px", margin: 2 }}>
      <SideBar />
      <Grid container spacing={2}>
        {/* Botones para seleccionar tipo de ajuste */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              height: "100px",
            }}
          >
            <Button
              sx={{
                my: 1,
                mx: 2,
                width: "10%",
              }}
              variant={ajusteType === "entrada" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setAjusteType("entrada")}
            >
              Entrada
            </Button>
            <Button
              sx={{
                my: 1,
                mx: 2,
                width: "10%",
              }}
              variant={ajusteType === "salida" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setAjusteType("salida")}
            >
              Salida
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          {/* SearchProducts ahora pasa el producto seleccionado */}
          <SearchProducts onProductSelect={handleProductSelect} />
        </Grid>

        {/* Mostrar detalles del producto seleccionado */}
        {selectedProduct && (
          <Grid item xs={12}>
            <Box
              sx={{
                border: "1px solid #ddd",
                padding: 2,
                borderRadius: 2,
                marginTop: 2,
              }}
            >
              <Typography variant="h6">Producto Seleccionado:</Typography>
              <Typography>Nombre: {selectedProduct.nombre}</Typography>
              <Typography>
                Stock Actual: {selectedProduct.stockActual}
              </Typography>
            </Box>
          </Grid>
        )}

        {ajusteType && (
          <>
            {/* Campos comunes para entrada y salida */}
            <Grid item xs={12} md={6}>
              <InputNumber
                inputState={[stockSistema, setStockSistema]}
                validationState={[
                  validationStockSistema,
                  setValidationStockSistema,
                ]}
                withLabel={true}
                fieldName="stockSistema"
                label="Stock Sistema"
                required={true}
                disabled={true} // Solo lectura
              />
            </Grid>

            {/* Condicionar los campos basados en el tipo de ajuste */}
            {ajusteType === "entrada" && (
              <Grid item xs={12} md={6}>
                <InputNumber
                  inputState={[stockFisico, setStockFisico]}
                  validationState={[
                    validationStockFisico,
                    setValidationStockFisico,
                  ]}
                  withLabel={true}
                  fieldName="stockFisico"
                  label="Cantidad Entrante"
                  required={true}
                />
              </Grid>
            )}

            {ajusteType === "salida" && (
              <Grid item xs={12} md={6}>
                <InputNumber
                  inputState={[stockFisico, setStockFisico]}
                  validationState={[
                    validationStockFisico,
                    setValidationStockFisico,
                  ]}
                  withLabel={true}
                  fieldName="stockFisico"
                  label="Cantidad Saliente"
                  required={true}
                />
              </Grid>
            )}

            {/* Textarea para justificación del ajuste */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={`Glosa para el ajuste de ${ajusteType}`}
                value={ajusteDescripcion}
                onChange={(e) => setAjusteDescripcion(e.target.value)}
                placeholder="Escribe una justificación o descripción del ajuste..."
                sx={{
                  marginTop: 2,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              {/* Botón de Enviar */}
              <SendingButton
                textButton="Guardar Ajustes"
                actionButton={handleSubmit}
                sending={showLoadingDialog}
                sendingText="Registrando..."
                style={{
                  width: "50%",
                  margin: "0 25%",
                  backgroundColor: "#950198",
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default EntradaSalidaStock;
