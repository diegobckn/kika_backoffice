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
import InputGeneric from "../Elements/Compuestos/InputGeneric";
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

  const [zones, setZones] = useState([])

  const [filtered, setFiltered] = useState([])

  const inputs = {
    search: useState("")
  }

  const validations = {
    search: useState(null)
  }


  const loadZones = () => {
    showLoading("Cargando zonas")
    Shop.getAllZones(infoComercio, (resp) => {
      // console.log("resp zones", resp)
      hideLoading()
      setZones(resp.zones)
      setFiltered(resp.zones)
    }, (er) => {
      showMessage(er)
      hideLoading()
    })
  }

  const filtrar = () => {
    const searchTxt = inputs.search[0].toLowerCase()
    setFiltered(zones.filter((item, ix) => {
      const nom = item.name.toLowerCase()
      const pri = (item.price + "").toLowerCase()
      const dis = item.distance_gps.toLowerCase()
      return (
        nom.indexOf(searchTxt) > -1
        || pri.indexOf(searchTxt) > -1
        || dis.indexOf(searchTxt) > -1
      )
    }))
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
      Agregar zona de entrega
    </DialogTitle>
    <DialogContent>

      <Grid container spacing={2} sx={{ padding: "2%" }}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <InputGeneric
            inputState={inputs.search}
            validationState={validations.search}
            withLabel={false}
            label={"Buscar nombre, distancia, precio"}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6}>
          <SmallButton
            style={{
              marginTop: "18px",
              height: "52px"
            }}
            actionButton={filtrar}
            textButton={"Filtrar"}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table sx={{ border: "1px ", borderRadius: "8px" }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Distancia(en Km)</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>No hay registros</TableCell>
                </TableRow>
              ) : (
                filtered.map((zone, ix) => (
                  <TableRow key={ix}>
                    <TableCell>{zone.id}</TableCell>
                    <TableCell>{zone.name}</TableCell>
                    <TableCell>{zone.distance_gps}</TableCell>
                    <TableCell>{System.formatMonedaLocal(zone.price)}</TableCell>
                    <TableCell>
                      <SmallButton actionButton={() => {
                        onSelect(zone)
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
