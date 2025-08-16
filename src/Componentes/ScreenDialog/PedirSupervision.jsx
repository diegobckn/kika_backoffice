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
import User from "../../Models/User";
import Model from "../../Models/Model";
import SoporteTicket from "../../Models/SoporteTicket";
import InputPassword from "../Elements/Compuestos/InputPassword";

const PedirSupervision = ({
  openDialog,
  setOpenDialog,
  accion,
  infoEnviar = {},
  onConfirm,
}) => {




  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);


  //para las transferecias
  
  const [codigoAutorizacion, setCodigoAutorizacion] = useState("")
  const [fecha, setFecha] = useState(null)



  useEffect(()=>{
    // console.log("cambio openDialog", openDialog)
    if(!openDialog) return

    // console.log("iniciando PedirSupervision")
    setFecha(dayjs())
  },[openDialog])

  const checkAll = ()=>{
    if(codigoAutorizacion){
      const codigoAutorizacion2 = codigoAutorizacion + ""
      const datos = {
        CodeAutorizacion:codigoAutorizacion,
        fechaIngreso: System.getInstance().getDateForServer(fecha),
        idUsuario : User.getInstance().getFromSesion().codigoUsuario,
        // Accion: "Quitar Producto"
        Accion: accion,
        body: infoEnviar
      }
      SoporteTicket.reportarError = false
      setOpenDialog(false)
      showLoading("Revisando Autorizacion")
      Model.getSupervision(datos,(res)=>{
          hideLoading()
          onConfirm(res)
          setCodigoAutorizacion("")
          SoporteTicket.reportarError = true
        },(err)=>{
          SoporteTicket.reportarError = true
          hideLoading()
        console.log("algo fallo", err)
        setTimeout(() => {
          showMessage(err)
        }, 100);
      })
    }else{
      showMessage("Completar todos los datos")
    }

  }


  return (
      <Dialog open={openDialog} onClose={ ()=> { 
        setOpenDialog(false)
        console.log("on close del dialog")
        } }>
        <DialogTitle>Autorizar accion</DialogTitle>
        <DialogContent>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <InputPassword
              inputState={[codigoAutorizacion,setCodigoAutorizacion]}
              fieldName="codigoAutorizacion"
              validationState={null}
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
                  checkAll()
                }}
              >
                Continuar
              </Button>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={()=>{
            console.log("on close del dialog con boton cerrar")
            setOpenDialog(false)
          }}>Cerrar</Button>
        </DialogActions>
      </Dialog>
  );
};

export default PedirSupervision;
