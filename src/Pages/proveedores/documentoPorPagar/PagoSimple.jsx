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

import ModelConfig from "../../../Models/ModelConfig";
import User from "../../../Models/User";
import FormularioCheque from "../../../Componentes/ScreenDialog/FormularioCheque";
import { transferenciaDefault } from "../../../definitions/Transferencia";
import { chequeDefault } from "../../../definitions/Cheque";
import FormularioTransferencia from "../../../Componentes/ScreenDialog/FormularioTransferencia";
import System from "../../../Helpers/System";


const PagoSimple = ({
  openDialog,
  setOpenDialog,

  montoAPagar,

  onChangeMetod = () => { },
  onConfirm,
  puedePagarParcial = true
}) => {

  const [metodoPago, setMetodoPago] = useState("");
  const [cantidadPagada, setCantidadPagada] = useState("");

  const [showFormTransferencia, setShowFormTransferencia] = useState(false)
  const [datosTransferencia, setDatosTransferencia] = useState(transferenciaDefault)

  const [showFormularioCheque, setShowFormCheque] = useState(false)
  const [dataCheque, setDataCheque] = useState(chequeDefault)
  
  const [faltaPagar, setFaltaPagar] = useState(0)


  const calcularVuelto = () => {
    if(metodoPago == "EFECTIVO"){
      var falta = montoAPagar - cantidadPagada
      if(falta> 0) return falta
      return 0
    }

    return 0
    
  };

  const datosTransferenciaOk = () => {
    if (
      datosTransferencia.nombre === "" ||
      datosTransferencia.rut === "" ||
      datosTransferencia.selectedBanco === "" ||
      datosTransferencia.tipoCuenta === "" ||
      datosTransferencia.nroCuenta === "" ||
      datosTransferencia.fecha === "" ||
      datosTransferencia.nroOperacion === ""
    ) {
      return false
    }
    return true
  }

  

  useEffect(()=>{
    setCantidadPagada(montoAPagar)
  },[metodoPago])

  useEffect(()=>{
    setFaltaPagar(calcularVuelto())
  },[cantidadPagada])

  return (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle>Hacer el pago</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} item xs={12} md={6} lg={12}>
          <Grid item xs={12} md={12} lg={12}>
            <TextField
              sx={{ marginBottom: "5%" }}
              margin="dense"
              label="Monto a Pagar"
              variant="outlined"
              disabled={true}
              // value={getTotalSelected()}
              value={System.formatMonedaLocal(montoAPagar)}
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
                if(!puedePagarParcial)return
                const value = e.target.value;
                if (!value.trim()) {
                  setCantidadPagada(0);
                } else {
                  setCantidadPagada(parseFloat(value));
                }
              }}
              disabled={metodoPago !== "EFECTIVO" || !puedePagarParcial} // Deshabilitar la edición excepto para el método "EFECTIVO"
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 10,
              }}
            />
            <TextField
              margin="dense"
              fullWidth
              type="number"
              label="Faltara pagar"
              disabled={true}
              value={faltaPagar}
              InputProps={{ readOnly: true }}
            />
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
                variant={metodoPago === "EFECTIVO" ? "contained" : "outlined"}
                onClick={() => {
                  setMetodoPago("EFECTIVO");
                  onChangeMetod("EFECTIVO")
                }}
              >
                Efectivo
              </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Button
                sx={{ height: "100%" }}
                id="credito-btn"
                variant={metodoPago === "DEBITO" ? "contained" : "outlined"}
                onClick={() => {
                  setMetodoPago("DEBITO");
                  onChangeMetod("DEBITO")
                }}
                fullWidth
              >
                DEBITO
              </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Button
                sx={{ height: "100%" }}
                id="credito-btn"
                variant={metodoPago === "CREDITO" ? "contained" : "outlined"}
                onClick={() => {
                  setMetodoPago("CREDITO");
                  onChangeMetod("CREDITO")
                }}
                fullWidth
              >
                CREDITO
              </Button>
            </Grid>

            {/* <Grid item xs={12} sm={12} md={12}>
              <Button
                sx={{ height: "100%" }}
                id="credito-btn"
                variant={metodoPago === "CHEQUE" ? "contained" : "outlined"}
                onClick={() => {
                  setMetodoPago("CHEQUE");

                  onChangeMetod("CHEQUE")

                  setShowFormCheque(true)
                }}
                fullWidth
              >
                CHEQUE
              </Button>
            </Grid> */}

            {/* <Grid item xs={12} sm={12} md={12}>
              <Button
                id="transferencia-btn"
                fullWidth
                sx={{ height: "100%" }}
                variant={
                  metodoPago === "TRANSFERENCIA" ? "contained" : "outlined"
                }
                onClick={() => {
                  setShowFormTransferencia(true)
                  onChangeMetod("TRANSFERENCIA")
                }}
              // Deshabilitar si hay una carga en progreso
              >
                Transferencia
              </Button>
            </Grid> */}
            <Grid item xs={12} sm={12}>
              <Button
                sx={{ height: "100%" }}
                variant="contained"
                fullWidth
                color="secondary"
                disabled={!metodoPago}
                // onClick={handlePayment}
                onClick={() => {
                  onConfirm({
                    metodoPago,
                    datosTransferencia,
                    datosTransferenciaOk:datosTransferenciaOk(),
                    dataCheque,
                    cantidadPagada,
                  })
                }}
              >
                Pagar
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <FormularioCheque
          openDialog={showFormularioCheque}
          setOpenDialog={setShowFormCheque}

          onConfirm={(data) => {
            // setNombre(data.nombre)
            // setFecha(data.fecha)

            // setRut(data.rut)
            // setSelectedBanco(data.banco)
            // setNroCuenta(data.nroCuenta)
            // setNroDocumento(data.nroDocumento)
            // setSerieCheque(data.serieCheque)
            setDataCheque(data)
          }}
        />

        <FormularioTransferencia
          openDialog={showFormTransferencia}
          setOpenDialog={setShowFormTransferencia}
          onConfirm={(data) => {
            setDatosTransferencia(data)
          }}
        />


      </DialogContent>
      <DialogActions>
        <Button onClick={ ()=>setOpenDialog(false) }>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PagoSimple;
