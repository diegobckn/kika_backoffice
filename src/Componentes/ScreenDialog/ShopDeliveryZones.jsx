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
import ShopDeliveryZonesSelectToAdd from "./ShopDeliveryZonesSelectToAdd";
import ShopDeliveryZoneForm from "./ShopDeliveryZoneForm";
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

  const [zones, setZones] = useState([])
  const [showSelectZone, setshowSelectZone] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  const ordenarPorDistancia = (zonas) => {
    const zonasCopia = System.clone(zonas)
    return zonasCopia.sort((item1, item2) => {
      return item1.distance_gps - item2.distance_gps
    })
  }

  const loadZones = () => {
    showLoading("Cargando zonas")
    Shop.getAllZonesCommerce(infoComercio, (resp) => {
      // console.log("resp zones", resp)
      setZones(ordenarPorDistancia(resp.zones))
      hideLoading()
    }, (er) => {
      showMessage(er)
      hideLoading()
    })
  }

  useEffect(() => {
    if (!openDialog) return
    loadZones()
  }, [openDialog]);


  return (<Dialog open={openDialog} maxWidth="lg" onClose={() => {
    setOpenDialog(false)
  }}
  >
    <DialogTitle>
      Zonas de entregas
    </DialogTitle>
    <DialogContent>

      <Grid container spacing={2} sx={{ padding: "2%" }}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography>Asignado</Typography>
          <Table sx={{ border: "1px ", borderRadius: "8px" }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Distancia(en Km)</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>No hay registros</TableCell>
                </TableRow>
              ) : (
                zones.map((zone, ix) => (
                  <TableRow key={ix}>
                    <TableCell>{zone.id}</TableCell>
                    <TableCell>{zone.name}</TableCell>
                    <TableCell>{zone.distance_gps}</TableCell>
                    <TableCell>${
                      (zone.pivot && zone.pivot.price != 0) ?
                        System.formatMonedaLocal(zone.pivot.price) :
                        System.formatMonedaLocal(zone.price)
                    }</TableCell>
                    <TableCell>
                      <Button onClick={() => {
                        showConfirm("Eliminar " + zone.name, () => {
                          // console.log("eliminar zone", zone)
                          showLoading("Eliminando " + zone.name)
                          Shop.removeZoneToCommerce(infoComercio, zone, () => {
                            hideLoading()
                            loadZones()
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

      <ShopDeliveryZoneForm
        openDialog={showCreate}
        setOpenDialog={setShowCreate}
        onSave={() => {
          loadZones()
        }}
        infoComercio={infoComercio}
      />

      <ShopDeliveryZonesSelectToAdd
        openDialog={showSelectZone}
        setOpenDialog={setshowSelectZone}
        infoComercio={infoComercio}
        onSelect={(zoneSel) => {
          // console.log("zone", zoneSel)
          showLoading("Agregando " + zoneSel.name)
          Shop.addZoneToCommerce(infoComercio, zoneSel, () => {
            hideLoading()
            loadZones()
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
          setshowSelectZone(true)
        }} />

      <SmallButton
        textButton={"Crear nueva"}
        actionButton={() => {
          setShowCreate(true)
        }} />


      <Button onClick={() => {
        setOpenDialog(false)
      }}>Atras</Button>
    </DialogActions>
  </Dialog>);
}
