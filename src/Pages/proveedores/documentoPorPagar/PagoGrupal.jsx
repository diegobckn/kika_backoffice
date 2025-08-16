import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Avatar,
  TextField,
  CircularProgress,
  Snackbar,
  Checkbox,
  IconButton,
  Collapse,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SideBar from "../../../Componentes/NavBar/SideBar";
import axios from "axios";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ModelConfig from "../../../Models/ModelConfig";
import User from "../../../Models/User";
import PagoTransferencia from "../../../Componentes/ScreenDialog/PagoTransferencia";
import PagoCheque from "../../../Componentes/ScreenDialog/PagoCheque";
import PagoParcial from "../../../Componentes/ScreenDialog/PagoParcial";


const PagoGrupal = ({
  openPaymentProcess,
  montoAPagar,
  cantidadPagada,
  metodoPago,
  calcularVuelto,
  loading,
  setMetodoPago,
  setCantidadPagada,
  selectedProveedor,
  groupedProveedores,
  handleTransferenciaModalOpen2,
  handleGroupedPayment,
  handleClosePaymentProcess,
  error
}) => {

  return (
    <Dialog open={openPaymentProcess} onClose={handleClosePaymentProcess}>
      <DialogTitle>Procesamiento de Pago Grupales</DialogTitle>
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
                  handleTransferenciaModalOpen2();
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
        <Button onClick={handleClosePaymentProcess} disabled={loading}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PagoGrupal;
