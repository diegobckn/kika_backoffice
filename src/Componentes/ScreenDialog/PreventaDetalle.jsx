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
import { textAlign, textTransform } from "@mui/system";
import PreVenta from "../../Models/PreVenta";

var prods = [];
for (let index = 1; index <= 5; index++) {
  prods.push(index);
}

const PreventaDetalle = ({
  openDialog,
  setOpenDialog,

  info,
}) => {


  useEffect(() => {
    // if (info) {
    //   PreVenta.findPreVenta({
    //     "preVentaID": info.preVentaID,
    //     "idCabecera": 0,
    //     "folio": 0
    //   }, (preventaServer) => {
    //     console.log("info preventaServer", preventaServer)
    //   }, (err) => {
    //     alert(err)
    //   })


    // }
  }, [openDialog])

  return openDialog && info && (
    <Dialog
      open={openDialog}
      onClose={() => { setOpenDialog(false) }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Detalles</DialogTitle>
      <DialogContent>

        <Typography>Detalles de preventa</Typography>


      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => {
          setOpenDialog(false)
        }}>Aceptar</Button>
      </DialogActions>
    </Dialog>
  )
}
export default PreventaDetalle;
