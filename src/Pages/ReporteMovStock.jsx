import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  Button,
  Snackbar,
  FormControl,
  Table,
  TableBody,
  CircularProgress,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SideBar from "../Componentes/NavBar/SideBar";
import axios from "axios";
import ModelConfig from "../Models/ModelConfig";
import dayjs from "dayjs";
import BoxSelectList from "../Componentes/Proveedores/BoxSelectList";
import ReporteVenta from "../Models/ReporteVenta";
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";
import Sale from "../Models/Sale";
import System from "../Helpers/System";
import RankingLibroVentasDetalle from "./RankingLibroVentasDetalle";
import User from "../Models/User";

import { saveAs } from "file-saver";
import * as xlsx from "xlsx/xlsx.mjs";
import SmallButton from "../Componentes/Elements/SmallButton";
import InputName from "../Componentes/Elements/Compuestos/InputName";
import SmallSuccessButton from "../Componentes/Elements/SmallSuccessButton";

export default () => {

  const {
    userData,
    showMessage,
    showConfirm,
    pedirSupervision,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);


  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [movs, setMovs] = useState([]);
  const [movsFiltered, setMovsFiltered] = useState([]);

  const [tipos, setTipos] = useState([]);
  const [tipoSelected, setTipoSelected] = useState(null);

  const [filtroProducto, setFiltroProducto] = useState("");

  const prepareInfo = (list) => {
    var tips = {}
    var movConTipo = []

    list.forEach((mov) => {
      mov.referenciaorig = mov.referencia + ""
      var refArr = mov.referencia.split(".")
      if (refArr.length < 3) {
        refArr[1] = mov.tipoMovimiento
        refArr[2] = mov.referenciaorig
      }
      mov.tipoMovimiento = refArr[1]
      if (mov.folio != 0 && mov.tipoMovimiento.toLowerCase() == "egreso") {
        mov.tipoMovimiento = "VENTA"
      }
      mov.glosa = refArr[2]
      movConTipo.push(mov)
      tips[mov.tipoMovimiento] = 1
    })
    tips["Todos"] = 1
    setTipos(Object.keys(tips))
    setMovs(movConTipo)
    // console.log("tips", tips)
  }

  const aplicarFiltros = () => {
    // console.log("aplicarFiltros")
    // console.log("tipoSelected", tipoSelected)
    const nomSel = tipos[tipoSelected]
    // console.log("nomSel", nomSel)
    var filtreds = []

    const busca = filtroProducto.toLowerCase()

    movs.forEach((mov) => {
      // console.log("mov.tipoMovimiento", mov.tipoMovimiento)
      const desc = mov.descripcionProducto.toLowerCase()
      const usuario = mov.nombresUsuario.toLowerCase()
      const folio = (mov.folio + "").toLowerCase()
      const glosa = mov.glosa.toLowerCase()
      const codBarra = mov.codBarra.toLowerCase()
      if (
        (mov.tipoMovimiento == nomSel || nomSel == "Todos")
        && (
          busca == ""
          || desc.indexOf(busca) > -1
          || usuario.indexOf(busca) > -1
          || folio.indexOf(busca) > -1
          || glosa.indexOf(busca) > -1
          || codBarra.indexOf(busca) > -1
        )
      ) {
        filtreds.push(mov)
      }
    })

    setMovsFiltered(filtreds)
    // console.log("filtreds", filtreds)
  }

  useEffect(() => {
    aplicarFiltros()
  }, [tipoSelected])


  const cargarFlujos = () => {
    showLoading("Cargando movs")
    ReporteVenta.getMovStock({
      fechadesde: startDate ? startDate.format("YYYY-MM-DD") : "",
      fechahasta: endDate ? endDate.format("YYYY-MM-DD") : "",
      rowPage: 1000000
    }, (respData, response) => {
      if (respData.cantidad > 0 && respData.tarjetaExistencias) {
        prepareInfo(respData.tarjetaExistencias);
      }
      hideLoading()
    }, (error) => {
      showMessage(error)
      hideLoading()
    })
  }

  useEffect(() => {
    setStartDate(dayjs())
    setEndDate(dayjs())
  }, [])

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={1} alignItems="center">

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography>
              Reporte Movimiento de stock
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Inicio"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    sx: { mb: 2 },
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Término"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    sx: { mb: 2 },
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Button
              sx={{ p: 2, mb: 3 }}
              variant="contained"
              onClick={() => {
                cargarFlujos()
              }}
              fullWidth
            >
              Buscar
            </Button>
          </Grid>

          {movs.length > 0 && (
            <>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={12} md={2} lg={2}>
                  <Typography>Seleccionar</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={10} lg={10}>
                  <BoxSelectList
                    listValues={tipos}
                    selected={tipoSelected}
                    setSelected={(sel) => {
                      setTipoSelected(sel)
                    }}
                  />
                </Grid>
              </Grid>


              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={12} md={2} lg={2}>
                  <Typography sx={{
                    marginRight: "10px"
                  }}>Filtrar</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                  <InputName
                    inputState={[filtroProducto, setFiltroProducto]}
                    label={"Cod producto, nombre producto, folio, usuario, glosa"}
                    onEnter={aplicarFiltros}
                    withLabel={false}
                  />

                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                  <SmallSuccessButton
                    textButton={"Filtrar"}
                    actionButton={aplicarFiltros}
                    style={{
                      marginTop: "12px",
                      height: "50px"
                    }}
                  />
                </Grid>
              </Grid>
            </>
          )}


          <Grid item xs={12} sm={12} md={12} lg={12}>
            {movsFiltered.length < 1 ? (
              <p>No se encontraron resultados.</p>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "gainsboro" }}>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Cod</TableCell>
                      <TableCell>Producto</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Folio</TableCell>
                      <TableCell>Glosa</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Saldo Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {movsFiltered.map((mov, ix) => (
                      <TableRow key={ix}>
                        <TableCell>
                          {System.formatDateServer(mov.fechaMovimiento)}
                        </TableCell>
                        <TableCell>
                          {mov.nombresUsuario}
                        </TableCell>
                        <TableCell>
                          {mov.codBarra}
                        </TableCell>
                        <TableCell>
                          {mov.descripcionProducto}
                        </TableCell>
                        <TableCell>
                          {mov.tipoMovimiento}
                        </TableCell>
                        <TableCell>
                          {mov.folio}
                        </TableCell>
                        <TableCell>
                          {mov.glosa}
                        </TableCell>
                        <TableCell>
                          {mov.cantidad}
                        </TableCell>
                        <TableCell>
                          {mov.stockActual}
                        </TableCell>
                      </TableRow>
                    ))}

                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>


        </Grid>
      </Grid>

    </div>);
}