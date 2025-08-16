import React, { useState, useContext, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Paper,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  TableContainer,
  Grid,
  Container,
  useTheme,
  useMediaQuery,

  IconButton,
  Menu,
  TextField,
  Chip,
  Box,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  InputLabel,
  CircularProgress

} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import System from "../../Helpers/System";
import dayjs from "dayjs";
import Validator from "../../Helpers/Validator";
import IngresarTexto from "./IngresarTexto";

const PagoParcial = ({
  openPaymentGroupProcess,
  error,
  montoAPagar,
  cantidadPagada,
  setCantidadPagada,
  metodoPago,
  setMetodoPago,
  selectedProveedor,
  groupedProveedores,
  handleChequeModalOpen,
  loading,
  paymentOrigin,
  handleTransferenciaModalOpen,
  handleGroupedPayment,
  handleClosePaymentGroupProcess
}) => {

  const calcularVuelto = () => {
    return metodoPago === "EFECTIVO" && cantidadPagada > montoAPagar
      ? cantidadPagada - montoAPagar
      : 0;
  };

  return (
    <Dialog open={openPaymentGroupProcess} onClose={handleClosePaymentGroupProcess}>
      <DialogTitle>Hacer Pago</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} item xs={12} md={6} lg={12}>
          <Grid item xs={12} md={12} lg={12}>
            {error && (
              <Grid item xs={12}>
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              </Grid>
            )}
            <TextField
              sx={{ marginBottom: "5%" }}
              margin="dense"
              label="Monto a Pagar"
              variant="outlined"
              // value={getTotalSelected()}
              value={montoAPagar.toLocaleString("es-CL")}
              fullWidth
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              InputProps={{ readOnly: true }}
            />
            <TextField
              margin="dense"
              fullWidth
              label="Cantidad pagada"
              // value={cantidadPagada.toLocaleString("es-CL")}
              value={cantidadPagada}
              onChange={(e) => {
                const value = e.target.value;
                if (!value.trim()) {
                  setCantidadPagada(0);
                } else {
                  setCantidadPagada(parseFloat(value));
                }
              }}
              disabled={metodoPago !== "EFECTIVO"} // Deshabilitar la edición excepto para el método "EFECTIVO"
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 9,
              }}
            />
            <TextField
              margin="dense"
              fullWidth
              type="number"
              label="Faltara pagar"
              disabled={true}
              value={Math.max(0, montoAPagar - cantidadPagada).toLocaleString(
                "es-CL"
              )}
              InputProps={{ readOnly: true }}
            />
            {calcularVuelto() > 0 && (
              <TextField
                margin="dense"
                fullWidth
                type="number"
                label="Vuelto"
                value={calcularVuelto()}
                InputProps={{ readOnly: true }}
              />
            )}
          </Grid>

          <Grid
            container
            spacing={2}
            item
            sm={12}
            md={12}
            lg={12}
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Typography sx={{ marginTop: "7%" }} variant="h6">
              Selecciona Método de Pago:
            </Typography>
            <Grid item xs={12} sm={12} md={12}>
              <Button
                sx={{ height: "100%" }}
                id="efectivo-btn"
                fullWidth
                disabled={loading} // Deshabilitar si hay una carga en progreso
                variant={metodoPago === "EFECTIVO" ? "contained" : "outlined"}
                onClick={() => {
                  setMetodoPago("EFECTIVO");
                }}
              >
                Efectivo
              </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Button
                sx={{ height: "100%" }}
                id="credito-btn"
                variant={metodoPago === "CHEQUE" ? "contained" : "outlined"}
                onClick={() => {
                  setMetodoPago("CHEQUE");
                  setCantidadPagada(
                    paymentOrigin === "detalleProveedor"
                      ? selectedProveedor.total
                      : groupedProveedores.reduce(
                        (acc, proveedor) => acc + proveedor.total,
                        0
                      )
                  );
                  handleChequeModalOpen();
                }}
                fullWidth
                disabled={loading} // Deshabilitar si hay una carga en progreso
              >
                CHEQUE
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Button
                id="transferencia-btn"
                fullWidth
                sx={{ height: "100%" }}
                variant={
                  metodoPago === "TRANSFERENCIA" ? "contained" : "outlined"
                }
                onClick={() => {
                  handleTransferenciaModalOpen();
                }}
                disabled={loading} // Deshabilitar si hay una carga en progreso
              >
                Transferencia
              </Button>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                sx={{ height: "100%" }}
                variant="contained"
                fullWidth
                color="secondary"
                disabled={!metodoPago || loading}
                // onClick={handlePayment}
                onClick={handleGroupedPayment}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} /> Procesando...
                  </>
                ) : (
                  "Pagar"
                )}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClosePaymentGroupProcess} disabled={loading}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PagoParcial;
