import React, { useState, useEffect, useContext } from "react";

import {
  Grid,
  Paper,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

import SmallButton from "../Elements/SmallButton";
import Shop from "../../Models/Shop";
import System from "../../Helpers/System";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
export const defaultTheme = createTheme();


export default function ({
  openDialog,
  setOpenDialog,
  infoComercio,
  onSelect
}) {
  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [times, setTimes] = useState([])

  const ordenarPorNombre = (zonas) => {
    const zonasCopia = System.clone(zonas)
    return zonasCopia.sort((item1, item2) => {
      const name1 = parseFloat(item1.name.replace(":", "."))
      const name2 = parseFloat(item2.name.replace(":", "."))
      return name1 - name2
    })
  }

  const loadTimes = () => {
    showLoading("Cargando horarios")
    Shop.getAllTimes(infoComercio, (resp) => {
      console.log("resp times", resp)
      hideLoading()
      console.log("normal", resp.times)
      console.log("ordenado", ordenarPorNombre(resp.times))
      setTimes(ordenarPorNombre(resp.times))
    }, (er) => {
      showMessage(er)
      hideLoading()
    })
  }

  useEffect(() => {
    if (!openDialog) return
    loadTimes()
  }, [openDialog]);


  return (<Dialog open={openDialog} maxWidth="lg" onClose={() => {
    setOpenDialog(false)
  }}
  >
    <DialogTitle>
      Agregar horario de entrega
    </DialogTitle>
    <DialogContent>

      <Grid container spacing={2} sx={{ padding: "2%" }}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table sx={{ border: "1px ", borderRadius: "8px" }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {times.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>No hay registros</TableCell>
                </TableRow>
              ) : (
                times.map((time, ix) => (
                  <TableRow key={ix}>
                    <TableCell>{time.id}</TableCell>
                    <TableCell>{time.name}</TableCell>
                    <TableCell>
                      <SmallButton actionButton={() => {
                        onSelect(time)
                        setOpenDialog(false)
                      }} textButton={"Seleccionar"} />
                    </TableCell>
                  </TableRow>))
              )}
            </TableBody>
          </Table>


        </Grid>

      </Grid>


    </DialogContent>
    <DialogActions>
      <Button onClick={() => {
        setOpenDialog(false)
      }}>Atras</Button>
    </DialogActions>
  </Dialog>);
}
