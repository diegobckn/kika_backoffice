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
import SmallDangerButton from "../Componentes/Elements/SmallDangerButton";

export default () => {
  const {
    userData,
    showMessage,
    showConfirm,
    pedirSupervision,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);


  const apiUrl = ModelConfig.get().urlBase;

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [tipo, setTipo] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [totalValues, setTotalValues] = useState(0);
  const [totalIVA, setTotalIVA] = useState(0);
  const [cantidad, setCantidad] = useState(0);

  const [totalValuesCaja, setTotalValuesCaja] = useState(0);
  const [totalIVACaja, setTotalIVACaja] = useState(0);
  const [cantidadCaja, setCantidadCaja] = useState(0);

  const [productos, setProductos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [productoSel, setProductoSel] = useState(null);
  const [filtrarTexto, setFiltrarTexto] = useState("");


  const fetchData = async () => {
    setLoading(true);
    setError(null);

    // console.log("Iniciando fetchData con params:", params);

    ReporteVenta.getInstance().searchInServer({
      fechadesde: startDate ? startDate.format("YYYY-MM-DD") : "",
      fechahasta: endDate ? endDate.format("YYYY-MM-DD") : "",
      tipoComprobante: tipo.join(","),
    }, (response) => {
      setCantidad(response.data.cantidad);

      if (response.data.cantidad > 0 && response.data.ventaCabeceraReportes) {
        setData(response.data.ventaCabeceraReportes);
        setFiltered(response.data.ventaCabeceraReportes);
        // console.log("Datos recibidos:", response.data.ventaCabeceraReportes);

        const totalValue = response.data.ventaCabeceraReportes.reduce(
          (sum, item) => sum + item.total,
          0
        );
        const totalIVA = response.data.ventaCabeceraReportes
          // .filter((item) => item.tipoComprobante !== 0)
          .reduce((sum, item) => sum + item.montoIVA, 0);

        setSnackbarMessage(
          `Se encontraron ${response.data.cantidad} resultados.`
        );
        setTotalValues(totalValue);
        setTotalIVA(totalIVA);
      } else {
        setData([]);
        setSnackbarMessage("No se encontraron resultados.");
        setTotalValues(0);
        setTotalIVA(0);
      }

      setProductos([])
      setProductoSel(null)

      setLoading(false);
    }, (error) => {

      console.error("Error al buscar datos:", error);
      setError("Error fetching data");
      setSnackbarMessage("Error al buscar los datos");
      setTotalValues(0);
      setTotalIVA(0);

      setSnackbarOpen(true);
      setLoading(false);
    })

  };

  const handleBuscarClick = () => {
    if (!startDate) {
      setSnackbarMessage("Por favor, seleccione la fecha de inicio.");
      setSnackbarOpen(true);
      return;
    }

    if (!endDate) {
      setSnackbarMessage("Por favor, seleccione la fecha de término.");
      setSnackbarOpen(true);
      return;
    }

    if (tipo.length === 0) {
      setSnackbarMessage(
        "Por favor, seleccione al menos un tipo de comprobante."
      );
      setSnackbarOpen(true);
      return;
    }

    fetchData();
  };

  const handleCheckboxChange = (event) => {
    const value = parseInt(event.target.value);
    setTipo((prev) =>
      event.target.checked
        ? [...prev, value]
        : prev.filter((item) => item !== value)
    );
  };


  const filtrar = () => {
    console.log("aplicarFiltros")
    var filtreds = []

    const busca = filtrarTexto.toLowerCase()
    console.log("busca", busca)

    data.forEach((reporteItem) => {
      var yaEsta = false
      reporteItem.ventaDetalleReportes.forEach((prod) => {
        const desc = prod.descripcion.toLowerCase()
        console.log("prod", prod)
        console.log("desc", desc)
        if (
          !yaEsta && (
            desc.indexOf(busca) > -1
            || prod.codProducto.indexOf(busca) > -1
            || busca.indexOf(desc) > -1
          )
        ) {
          filtreds.push(reporteItem)
          yaEsta = true
        }
      })
    })

    setFiltered(filtreds)
    console.log("filtreds", filtreds)
  }


  useEffect(() => {
    setStartDate(dayjs())
    setEndDate(dayjs())
    setTipo([
      0, 1, 2, 4
    ])

    // User.getAll((usersServer) => {
    //   setAllUsers(usersServer)
    // }, (error) => {
    //   console.log("no se pudo cargar los usuarios")
    // })
  }, [])

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={1} alignItems="center">
          Libro de Ventas de productos
          <Grid container spacing={2} sx={{ mt: 2 }}>

            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormControl fullWidth>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tipo.includes(1)}
                        onChange={handleCheckboxChange}
                        value={1}
                      />
                    }
                    label="Boleta"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tipo.includes(0)}
                        onChange={handleCheckboxChange}
                        value={0}
                      />
                    }
                    label="Ticket"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tipo.includes(2)}
                        onChange={handleCheckboxChange}
                        value={2}
                      />
                    }
                    label="Factura"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tipo.includes(4)}
                        onChange={handleCheckboxChange}
                        value={4}
                      />
                    }
                    label="Comprobante MP"
                  />
                </FormControl>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                sx={{ p: 2, mb: 3 }}
                variant="contained"
                onClick={handleBuscarClick}
                fullWidth
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{
            margin: "10px 0",
            padding: "10px 0",
            textAlign: "left",
            // backgroundColor:"red"
          }}>

            <Grid item xs={12} sm={12} md={4} lg={4}>
              <p>Total Valores: ${totalValues.toLocaleString("es-CL")}</p>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <p>Total IVA: ${totalIVA.toLocaleString("es-CL")}</p>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <p>Cantidad Encontrados: {cantidad.toLocaleString("es-CL")}</p>
            </Grid>





            {data.length > 0 && (
              <>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <br />
                  <br />
                  <br />
                  <Typography>Filtrar</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <InputName
                    style={{
                      marginTop: "0"
                    }}
                    inputState={[filtrarTexto, setFiltrarTexto]}
                    label={"Descripcion, Codigo de barras"}
                    onEnter={filtrar}
                    withLabel={false}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <SmallSuccessButton
                    textButton={"Filtrar"}
                    actionButton={filtrar}
                    style={{
                      marginTop: "15px",
                      height: "50px"
                    }}
                  />
                  {filtrarTexto != "" && (
                    <SmallDangerButton
                      textButton={"Quitar Filtro"}
                      actionButton={() => {
                        setFiltrarTexto("")
                      }}
                      style={{
                        marginTop: "15px",
                        height: "50px"
                      }}
                    />
                  )}
                </Grid>
              </>
            )}



          </Grid>


        </Grid>
        {loading ? (
          <CircularProgress />
        ) : cantidad === 0 ? (
          <p>No se encontraron resultados.</p>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "gainsboro" }}>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Folio Documento</TableCell>
                  <TableCell>Valor Neto</TableCell>
                  <TableCell>IVA DF</TableCell>
                  <TableCell>Productos</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((reporteItem, ix) => {
                  var susProds = ""

                  reporteItem.ventaDetalleReportes.forEach((prod, ix) => {
                    if (susProds != "") susProds += ", "
                    susProds += prod.descripcion
                  })
                  return (<TableRow key={ix}>
                    <TableCell>
                      {System.formatDateServer(reporteItem.fechaIngreso)}
                    </TableCell>
                    <TableCell>{reporteItem.descripcionComprobante}</TableCell>
                    <TableCell>
                      {reporteItem.nroComprobante.toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell>
                      {reporteItem.montoNeto.toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell>
                      {reporteItem.montoIVA.toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell>
                      {susProds}
                    </TableCell>
                    <TableCell>
                      {reporteItem.total.toLocaleString("es-CL")}
                    </TableCell>
                  </TableRow>)
                }
                )}

              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />


    </div>
  );
};
