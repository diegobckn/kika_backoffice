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
import ShopDeliveryTimesSelectToAdd from "./ShopDeliveryTimesSelectToAdd";
import ShopDeliveryTimeForm from "./ShopDeliveryTimeForm";
export const defaultTheme = createTheme();


export default function ({
  openDialog,
  setOpenDialog,
  infoComercio
}) {
  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const [times, setTimes] = useState([])
  const [showSelectTime, setshowSelectTime] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  const ordenarPorNombre = (zonas) => {
    const zonasCopia = System.clone(zonas)
    return zonasCopia.sort((item1, item2) => {
      const name1 = parseFloat(item1.name.replace(":", "."))
      const name2 = parseFloat(item2.name.replace(":", "."))
      return name1 - name2
    })
  }

  const loadTimes = () => {
    showLoading("Cargando zonas")
    Shop.getAllTimesCommerce(infoComercio, (resp) => {
      console.log("resp times", resp)
      setTimes(ordenarPorNombre(resp.times))
      hideLoading()
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
      Horarios de entregas
    </DialogTitle>
    <DialogContent>

      <Grid container spacing={2} sx={{ padding: "2%" }}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table sx={{ border: "1px ", borderRadius: "8px" }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Acciones</TableCell>
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
                      <Button onClick={() => {
                        showConfirm("Eliminar " + time.name, () => {
                          console.log("eliminar time", time)
                          showLoading("Eliminando " + time.name)
                          Shop.removeTimeToCommerce(infoComercio, time, () => {
                            hideLoading()
                            loadTimes()
                          }, (er) => {
                            showMessage(er)
                            hideLoading()
                          })
                        })
                      }}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>))
              )}
            </TableBody>
          </Table>


        </Grid>

      </Grid>

      <ShopDeliveryTimeForm
        isEdit={false}
        openDialog={showCreate}
        setOpenDialog={setShowCreate}
        onSave={() => {
          loadTimes()
        }}
        infoComercio={infoComercio}
      />

      <ShopDeliveryTimesSelectToAdd
        openDialog={showSelectTime}
        setOpenDialog={setshowSelectTime}
        infoComercio={infoComercio}
        onSelect={(timeSel) => {
          console.log("time", timeSel)
          showLoading("Agregando " + timeSel.name)
          Shop.addTimeToCommerce(infoComercio, timeSel, () => {
            hideLoading()
            loadTimes()
          }, (er) => {
            showMessage(er)
            hideLoading()
          })
        }} />

    </DialogContent>
    <DialogActions>
      <SmallButton
        textButton={"Agregar existente"}
        actionButton={() => {
          setshowSelectTime(true)
        }} />

      <SmallButton
        textButton={"Crear nuevo"}
        actionButton={() => {
          setShowCreate(true)
        }} />


      <Button onClick={() => {
        setOpenDialog(false)
      }}>Atras</Button>
    </DialogActions>
  </Dialog>);
}
