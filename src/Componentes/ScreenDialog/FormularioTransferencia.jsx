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
  InputLabel

} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import System from "../../Helpers/System";
import dayjs from "dayjs";
import Validator from "../../Helpers/Validator";
import IngresarTexto from "./IngresarTexto";

const FormularioTransferencia = ({
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
  const [nroCuenta, setNroCuenta] = useState(""); // Estado para almacenar el número de cuenta
  const [nroOperacion, setNroOperacion] = useState(""); // Estado para almacenar el número de operación
  const [tipoCuenta, setTipoCuenta] = useState("");
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


  useEffect(()=>{
    if(!openDialog) return

    setFecha(dayjs().format("YYYY-MM-DD"))
  },[openDialog])

  const [campoIngreso, setCampoIngreso] = useState(null)
  const [valorCampoIngreso, setValorCampoIngreso] = useState("")
  const [tituloCampoIngreso, setTituloCampoIngreso] = useState("")
  const [showIngreso, setShowIngreso] = useState(false)
  const abrirIngresoTexto = (campo)=>{

    switch(campo){
      case "nombre":
        setValorCampoIngreso(nombre)
      break;

      case "rut":
        setValorCampoIngreso(rut)
      break;

      case "nroCuenta":
        setValorCampoIngreso(nroCuenta)
      break;
      
      case "nroOperacion":
        setValorCampoIngreso(nroOperacion)
      break;
    }


    setCampoIngreso(campo)
    setTituloCampoIngreso("Ingresar " + System.camelToUnderscore(campo).replace("_"," "))
    setShowIngreso(true)
  }

  const checkCambioIngreso = (valor)=>{
    switch(campoIngreso){
      case "nombre":
        if(Validator.isNombre(valor)){
          setNombre(valor)
          setValorCampoIngreso(valor)
        }
      break;
      
      case "rut":
        if(Validator.isRut(valor)){
          setRut(valor)
          setValorCampoIngreso(valor)

        }
      break;
        
      case "nroCuenta":
        if(Validator.isNumeric(valor)){
          setNroCuenta(valor)
          setValorCampoIngreso(valor)

        }
      break;

      case "nroOperacion":
        if(Validator.isNumeric(valor)){
          setNroOperacion(valor)
          setValorCampoIngreso(valor)

        }
      break;
    }
    
  }



  return (
      <Dialog open={openDialog} onClose={ ()=> { setOpenDialog(false) } }>
        <DialogTitle>Transferencia</DialogTitle>
        <DialogContent>


        <IngresarTexto
          title={tituloCampoIngreso}
          openDialog={showIngreso}
          setOpenDialog={setShowIngreso}
          varChanger={checkCambioIngreso}
          varValue={valorCampoIngreso}
        />



          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Nombre
              </InputLabel>
              <TextField
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onClick={(e) => abrirIngresoTexto("nombre")}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa rut sin puntos y con guión
              </InputLabel>
              <TextField
                label="ej: 11111111-1"
                variant="outlined"
                fullWidth
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                onClick={(e) => abrirIngresoTexto("rut")}
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
                Ingresa Tipo de Cuenta{" "}
              </InputLabel>
              <TextField
                select
                label="Tipo de Cuenta"
                value={tipoCuenta}
                onChange={handleChangeTipoCuenta}
                fullWidth
              >
                {Object.entries(tiposDeCuenta).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Número de Cuenta{" "}
              </InputLabel>
              <TextField
                label="Número de cuenta"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                value={nroCuenta}
                onChange={(e) => setNroCuenta(e.target.value)}
                onClick={(e) => abrirIngresoTexto("nroCuenta")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>Ingresa Fecha</InputLabel>
              <TextField
                type="date"
                onChange={(e)=>{
                  setFecha(e.target.value)
                }} // Proporciona la función para manejar los cambios de fecha

                value={fecha} // Pasa el estado 'fecha' como valor del DatePicker
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Numero Operación
              </InputLabel>
              <TextField
                label="Numero Operación"
                variant="outlined"
                type="number"
                fullWidth
                value={nroOperacion}
                onClick={(e) => abrirIngresoTexto("nroOperacion")}
                onChange={(e) => setNroOperacion(e.target.value)}
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
                // disabled={!metodoPago || montoPagado <= 0 || loading}
                onClick={()=>{
                  if(nombre && rut && nroCuenta && nroOperacion && tipoCuenta && banco){
                    onConfirm({
                      nombre,
                      rut,
                      nroCuenta,
                      idCuentaCorrientePago: 0,
                      nroOperacion,
                      tipoCuenta,
                      fecha: System.getInstance().getDateForServer(fecha),
                      banco,
                    })
                    setOpenDialog(false)
                  }else{
                    showMessage("Completar todos los datos")
                  }

                }}
              >
                Continuar
              </Button>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={()=>{
            setOpenDialog(false)
          }}>Cerrar</Button>
        </DialogActions>
      </Dialog>
  );
};

export default FormularioTransferencia;
