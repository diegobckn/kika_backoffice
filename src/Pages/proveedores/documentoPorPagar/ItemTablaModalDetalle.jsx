import React, { useState, useContext, useEffect } from "react";
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
import PagoTransferencia from "../../../Componentes/ScreenDialog/FormularioTransferencia";
import PagoCheque from "../../../Componentes/ScreenDialog/FormularioCheque";
import PagoParcial from "../../../Componentes/ScreenDialog/PagoParcial";
import System from "../../../Helpers/System";
import PagoSimple from "./PagoSimple";
import { transferenciaDefault } from "../../../definitions/Transferencia";
import { chequeDefault } from "../../../definitions/Cheque";

import { SelectedOptionsContext } from "./../../../Componentes/Context/SelectedOptionsProvider";
import Proveedor from "../../../Models/Proveedor";
import ProveedorDocumento from "../../../Models/ProveedorDocumento";

const ItemTablaModalDetalle = ({
  detailOpen,
  handleDetailClose,
  selectedItem,
}) => {

  const {
      showMessage,
      showAlert,
      showLoading,
      hideLoading
    } = useContext(SelectedOptionsContext);

  const [showModalPago, setShowModalPago] = useState(false);
  const [montoAPagar, setMontoAPagar] = useState("");
  const [cantidadPagada, setCantidadPagada] = useState(0);

  const prepararPago = () => {
    setMontoAPagar(selectedItem.total);
    setCantidadPagada(selectedItem.total);

    // console.log(montoAPagar);

    // Resetear la cantidad pagada al abrir el diálogo
    setShowModalPago(true);
  };



  //cuando pago un solo item del listado del detalle
  const procesarPago = async ({metodoPago, dataTransferencia, dataCheque}) => {
    showLoading()

    var itemsPagos = []
      itemsPagos.push({
        "idProveedorCompraCabecera": selectedItem.id,
        "total": selectedItem.total
      })

    var requestBody = {
      "fechaIngreso": System.getInstance().getDateForServer(),
      "codigoUsuario": User.getInstance().getFromSesion().codigoUsuario,
      "codigoSucursal": "0",
      "puntoVenta": "0",
      "compraDeudaIds": itemsPagos,
      "montoPagado": cantidadPagada,
      "metodoPago": metodoPago
    }

    // console.log("Request Body antes de enviar:", requestBody);
    ProveedorDocumento.AddProveedorCompraPagar(requestBody, (responseData, response) => {
      hideLoading()
      showMessage("Realizado correctamente")
    }, (err) => {
      hideLoading()
      showAlert(err)
    })

  };



  return (
    <Dialog
      open={detailOpen}
      onClose={handleDetailClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Detalles del Proveedor</DialogTitle>
      <DialogContent dividers>
        {selectedItem && (
          <div>
            <Paper>
              <Box
                display="flex"
                p={1.5}
                gap={2}
                bgcolor={"#f5f5f5"}
                borderRadius={1}
                sx={{ alignItems: "center" }}
              >
                <Box>
                  <Avatar sx={{ borderRadius: 3, width: 48, height: 48 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: "#696c6f" }}>
                    ID: {selectedItem.razonSocial}
                    <br />
                    {selectedItem.rut}
                  </Typography>
                </Box>
              </Box>
            </Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha de ingreso</TableCell>
                    <TableCell>Tipo de documento</TableCell>
                    <TableCell>Folio</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {dayjs(selectedItem.fechaIngreso).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell>{selectedItem.tipoDocumento}</TableCell>
                    <TableCell>{selectedItem.folio}</TableCell>
                    <TableCell>${System.formatMonedaLocal(selectedItem.total)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" style={{ marginTop: "16px" }}>
              Detalles de Compra:
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio Unidad</TableCell>
                    <TableCell>Costo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedItem.proveedorCompraDetalles &&
                    selectedItem.proveedorCompraDetalles.map((detalle) => (
                      <TableRow key={detalle.codProducto}>
                        <TableCell>{detalle.descripcionProducto}</TableCell>
                        <TableCell>{detalle.cantidad}</TableCell>
                        <TableCell>${System.formatMonedaLocal(detalle.precioUnidad)}</TableCell>
                        <TableCell>${System.formatMonedaLocal(detalle.costo)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="h6">
                Total Deuda : ${System.formatMonedaLocal(selectedItem.total)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={prepararPago}
              >
                Pagar Total $ ({System.formatMonedaLocal(selectedItem.total)})
              </Button>
            </Box>
          </div>
        )}

        <PagoSimple
          openDialog={showModalPago}
          setOpenDialog={setShowModalPago}

          montoAPagar={montoAPagar}
          cantidadPagada={cantidadPagada}
          setCantidadPagada={setCantidadPagada}

          onChangeMetod={(metodoPago) => {
          }}

          onConfirm={procesarPago}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDetailClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemTablaModalDetalle;
