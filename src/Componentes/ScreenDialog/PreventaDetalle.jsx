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
  TableCell,
  Paper,
  TableHead
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";
import System from "../../Helpers/System";
import { textAlign, textTransform } from "@mui/system";
import PreVenta from "../../Models/PreVenta";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";


var prods = [];
for (let index = 1; index <= 5; index++) {
  prods.push(index);
}

const PreventaDetalle = ({
  openDialog,
  setOpenDialog,

  info,
}) => {



  const {
    userData,
    showMessage,
    showAlert,
    showConfirm,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [detalles, setDetalles] = useState(null)

  useEffect(() => {
    if (info) {
      PreVenta.findPreVenta({
        "preVentaID": info.preVentaID,
        "idCabecera": 0,
        "folio": 0
      }, (preventaServer) => {
        console.log("info preventaServer", preventaServer)
        setDetalles(preventaServer)
      }, (err) => {
        alert(err)
      })


    }
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


        {detalles && (
          <>
            Datos de Productos
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#2E3030D1" }}>
                    <TableCell sx={{ color: "white" }}>Código Producto</TableCell>
                    <TableCell sx={{ color: "white" }}>Descripción</TableCell>
                    <TableCell sx={{ color: "white" }}>Precio Unidad</TableCell>
                    <TableCell sx={{ color: "white" }}>Cantidad</TableCell>
                    <TableCell sx={{ color: "white" }}>Costo</TableCell>
                    <TableCell sx={{ color: "white" }}>Monto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detalles.map(
                    (detalle, index) => {
                      if (detalle.descripcion.toLowerCase() != "redondeo")
                        return (
                          <TableRow key={index}>
                            <TableCell>{detalle.codProducto}</TableCell>
                            <TableCell>{detalle.descripcion}</TableCell>
                            <TableCell>
                              {detalle.precioUnidad.toLocaleString("es-CL")}
                            </TableCell>
                            <TableCell>
                              {detalle.cantidad.toLocaleString("es-CL")}
                            </TableCell>
                            <TableCell>
                              {detalle.costo.toLocaleString("es-CL")}
                            </TableCell>
                            <TableCell>
                              {(detalle.precioUnidad * detalle.cantidad).toLocaleString("es-CL")}
                            </TableCell>
                          </TableRow>
                        )
                      else
                        return (
                          <TableRow key={index}>
                            <TableCell>{' '}</TableCell>
                            <TableCell>{detalle.descripcion}</TableCell>
                            <TableCell>
                              {' '}
                            </TableCell>
                            <TableCell>
                              {' '}
                            </TableCell>
                            <TableCell>
                              {' '}
                            </TableCell>
                            <TableCell sx={{
                            }}>
                              {(detalle.precioUnidad * detalle.cantidad).toLocaleString("es-CL")}
                            </TableCell>
                          </TableRow>
                        )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

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
