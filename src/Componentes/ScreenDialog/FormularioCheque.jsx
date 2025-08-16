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

const FormularioCheque = ({
  openDialog,
  setOpenDialog,
  onConfirm
}) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);


  //para las transferecias

  const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre
  const [rut, setRut] = useState(""); // Estado para almacenar el rut
  const [nroCheque, setNroCheque] = useState(""); // Estado para almacenar el número de cuenta

  const [nroSerie, setNroSerie] = useState("");
  const [nroDocumento, setNroDocumento] = useState("");
  const [fecha, setFecha] = useState("");
  const [banco, setBanco] = useState("");

  const tiposDeCuenta = System.getInstance().tiposDeCuenta()
  const bancosChile = System.getInstance().bancosChile();

  const handleChangeTipoCuenta = (event) => {
    setTipoCuenta(event.target.value); // Actualizar el estado del tipo de cuenta seleccionado
  };

  const handleBancoChange = (event) => {
    setBanco(event.target.value);
  };


  useEffect(() => {
    if (!openDialog) return


    setFecha(dayjs().format("YYYY-MM-DD"))
  }, [openDialog])

  return (
    <Dialog open={openDialog} onClose={() => { setOpenDialog(false) }}>
      <DialogTitle>Cheque</DialogTitle>
      <DialogContent>

        <Grid container spacing={2}>

          <Grid item xs={12} sm={6}>
            <InputLabel sx={{ marginBottom: "4%" }}>
              Ingresa Nombre
            </InputLabel>
            <TextField
              label="Nombre"
              value={nombre}
              name="nombre"
              onChange={(e) => setNombre(e.target.value)}
              // onKeyDown={(event) => handleKeyDown(event, "nombre")}
              variant="outlined"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel sx={{ marginBottom: "4%" }}>
              Ingresa rut sin puntos y con guión
            </InputLabel>
            <TextField
              name="rut"
              label="ej: 11111111-1"
              variant="outlined"
              fullWidth
              value={rut}
              onChange={(e) => setRut(e.target.value)}
            // onKeyDown={(event) => handleKeyDown(event, "rut")}
            />
          </Grid>


          <Grid item xs={12} sm={6}>
            <InputLabel sx={{ marginBottom: "4%" }}>Ingresa Banco</InputLabel>
            <TextField
              select
              label="Banco"
              value={banco}
              onChange={handleBancoChange}
              fullWidth
            >
              {bancosChile.map((bancoItem) => (
                <MenuItem key={bancoItem.id} value={bancoItem.nombre}>
                  {bancoItem.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>


          <Grid item xs={12} sm={6}>
            <InputLabel sx={{ marginBottom: "4%" }}>
              Ingresa Serie de Cheque
            </InputLabel>
            <TextField
              name="numeroCuenta"
              label="Serie de  Cheque"
              variant="outlined"
              fullWidth
              type="number"
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              value={nroSerie}
              onChange={(e) => setNroSerie(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel sx={{ marginBottom: "4%" }}>
              Ingresa Número de Cuenta{" "}
            </InputLabel>
            <TextField
              name="numeroCuenta"
              label="Número de cuenta"
              variant="outlined"
              fullWidth
              type="number"
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              value={nroCheque}
              onChange={(e) => setNroCheque(e.target.value)}
            // onKeyDown={(event) => handleKeyDown(event, "numeroCuenta")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel sx={{ marginBottom: "4%" }}>Ingresa Fecha</InputLabel>
            <TextField
              type="date"
              onChange={(e) => {
                setFecha(e.target.value)
              }} // Proporciona la función para manejar los cambios de fecha

              value={fecha} // Pasa el estado 'fecha' como valor del DatePicker
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel sx={{ marginBottom: "4%" }}>
              Ingresa Numero Documento
            </InputLabel>
            <TextField
              name="numeroDocumento"
              label="Numero Documento"
              variant="outlined"
              type="number"
              fullWidth
              value={nroDocumento}
              onChange={(e) => setNroDocumento(e.target.value)}
              // onKeyDown={(event) => handleKeyDown(event, "numeroDocumento")}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button
              sx={{ height: "100%" }}
              variant="contained"
              fullWidth
              color="secondary"
              // disabled={!metodoPago}
              onClick={() => {
                onConfirm({
                  idCuentaCorrientePago: 0,
                  rut,
                  banco,
                  nroDocumento,
                  nombre,
                  nroCheque,
                  fecha,
                  nroSerie,
                })
              }}
            >
              Pagar
            </Button>
          </Grid>
        </Grid>

      </DialogContent>

      <DialogActions>
        <Button onClick={() => {
          setOpenDialog(false)
        }}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormularioCheque;
