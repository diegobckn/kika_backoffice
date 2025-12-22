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
  const [flujos, setFlujos] = useState([]);

  const [flujosFiltered, setFlujosFiltered] = useState([]);

  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelected, setUsuarioSelected] = useState(null);

  const [tipos, setTipos] = useState([]);
  const [tipoSelected, setTipoSelected] = useState(null);

  const [subtipos, setSubtipos] = useState([]);
  const [subtipoSelected, setSubtipoSelected] = useState(null);


  const prepareInfo = (list) => {
    var usuarios = {}
    var tipos = {}
    var subtipos = {}

    list.forEach((flujo) => {
      usuarios[flujo.nombreApellidoUsuario] = 1
      tipos[flujo.tipoFlujo] = 1
      subtipos[flujo.detalleTipoFlujo] = 1
    })
    usuarios["Todos"] = 1
    tipos["Todos"] = 1
    subtipos["Todos"] = 1
    setUsuarios(Object.keys(usuarios))
    setTipos(Object.keys(tipos))
    setSubtipos(Object.keys(subtipos))
    console.log("usuarios", usuarios)
  }

  const aplicarFiltros = () => {
    console.log("aplicarFiltros")
    console.log("usuarioSelected", usuarioSelected)
    const nomSel = usuarios[usuarioSelected]
    const tipoSel = tipos[tipoSelected]
    const subtipoSel = subtipos[subtipoSelected]
    console.log("nomSel", nomSel)
    console.log("tipoSel", tipoSel)
    console.log("subtipoSel", subtipoSel)
    var filtreds = []

    flujos.forEach((flujo) => {
      console.log("flujo.nombreApellidoUsuario", flujo.nombreApellidoUsuario)
      if (
        (flujo.nombreApellidoUsuario == nomSel || nomSel == "Todos")
        && (flujo.tipoFlujo == tipoSel || tipoSel == "Todos")
        && (flujo.detalleTipoFlujo == subtipoSel || subtipoSel == "Todos")
      ) {
        filtreds.push(flujo)
      }
    })

    setFlujosFiltered(filtreds)
    console.log("filtreds", filtreds)
  }

  useEffect(() => {
    aplicarFiltros()
  }, [usuarioSelected, tipoSelected, subtipoSelected])




  const cargarFlujos = () => {
    showLoading("Cargando flujos")
    ReporteVenta.getFlujos({
      fechadesde: startDate ? startDate.format("YYYY-MM-DD") : "",
      fechahasta: endDate ? endDate.format("YYYY-MM-DD") : ""
    }, (respData, response) => {
      console.log("response", response)
      if (respData.cantidad > 0 && respData.reporteFlujoCajas) {
        setFlujos(respData.reporteFlujoCajas);
        prepareInfo(respData.reporteFlujoCajas)
        // console.log("Datos recibidos:", respData.reporteFlujoCajas);
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
              Flujos
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



          {flujos.length > 0 && (
            <>
              <Grid item xs={12} sm={12} md={2} lg={2}>
                <Typography>Seleccionar usuario</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={10} lg={10}>
                <BoxSelectList
                  listValues={usuarios}
                  selected={usuarioSelected}
                  setSelected={(sel) => {
                    setUsuarioSelected(sel)
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={2} lg={2}>
                <Typography>Seleccionar tipo</Typography>
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

              <Grid item xs={12} sm={12} md={2} lg={2}>
                <Typography>Seleccionar subtipo</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={10} lg={10}>
                <BoxSelectList
                  listValues={subtipos}
                  selected={subtipoSelected}
                  setSelected={(sel) => {
                    setSubtipoSelected(sel)
                  }}
                />
              </Grid>
            </>
          )}


          <Grid item xs={12} sm={12} md={12} lg={12}>
            {flujosFiltered.length < 1 ? (
              <p>No se encontraron resultados.</p>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "gainsboro" }}>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Sub Tipo</TableCell>
                      <TableCell>Observación</TableCell>
                      <TableCell>Turno</TableCell>
                      <TableCell>Monto</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {flujosFiltered.map((flujo, ix) => (
                      <TableRow key={ix}>
                        <TableCell>
                          {System.formatDateServer(flujo.fecha)}
                        </TableCell>
                        <TableCell>
                          {flujo.nombreApellidoUsuario}
                        </TableCell>
                        <TableCell>
                          {flujo.tipoFlujo}
                        </TableCell>
                        <TableCell>
                          {flujo.detalleTipoFlujo}
                        </TableCell>
                        <TableCell>
                          {flujo.observacion}
                        </TableCell>
                        <TableCell>
                          {flujo.idTurno}
                        </TableCell>
                        <TableCell>
                          ${System.formatMonedaLocal(flujo.monto, false)}
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

    </div >
  );
};
