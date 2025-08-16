import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Typography,
  DialogTitle,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";
import System from "../../Helpers/System";
import BoxSelectList from "../Proveedores/BoxSelectList";

var prods = [];
for (let index = 1; index <= 5; index++) {
  prods.push(index);
}

const ReporteCierreZSelTurno = ({
  openDialog,
  setOpenDialog,
  info,
  turnoSel,
  setTurnoSel
}) => {

  const [turnos, setTurnos] = useState([]);

  const cargarTurnos = ()=>{
    var turnosx = []
    info.cierreCajaDetalles.forEach((infoItem, ix)=>{
      if(!turnosx.includes(infoItem.idTurno)){
          turnosx.push(infoItem.idTurno)
        }
    })

    setTurnos(turnosx)
  }

  useEffect(()=>{
    if(!info) return
    if(!openDialog){
      setTurnoSel(null)
      return
    }
    cargarTurnos()
  },[openDialog])

  return (
    <Dialog
    open={openDialog}
    onClose={()=>{ setOpenDialog(false) }}
    fullWidth
    maxWidth="sm"
  >
  <DialogTitle>Detalles Reporte cierre z</DialogTitle>
  <DialogContent>

    {turnos.length>0 &&(
      <Grid item xs={12} sm={12} md={12} lg={12}>
      <Typography>Seleccionar turno</Typography>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <BoxSelectList
            listValues={turnos}
            selected={turnoSel}
            setSelected={(sel)=>{
              setTurnoSel(sel, turnos[sel])
            }}
            />
        </Grid>
      </Grid>
    )}

  </DialogContent>
  <DialogActions>
    <Button variant="contained" onClick={()=>{
      setOpenDialog(false)
    }}>Aceptar</Button>
  </DialogActions>
  </Dialog>
  )
}
export default ReporteCierreZSelTurno;
