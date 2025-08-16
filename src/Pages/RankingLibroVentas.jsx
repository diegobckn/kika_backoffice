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

const RankingLibroVentas = () => {

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

  const [cajas, setCajas] = useState([]);
  const [cajaSel, setCajaSel] = useState(null);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userSel, setUserSel] = useState(null);
  const [ventasPorCaja, setVentaPorCaja] = useState([]);




  const exportExcel = () => {

    showLoading("Preparando excel...")

    const cabeceraArray = [];
    const detallesArray = [];
    const pagosArray = [];
    ventasPorCaja.forEach((venta) => {

      cabeceraArray.push({
        Fecha: dayjs(venta.fechaIngreso).format("DD/MM/YYYY HH:mm:ss"),
        Descripcion: venta.descripcionComprobante,
        FolioDocumento: venta.nroComprobante,
        ValorNeto: venta.montoNeto,
        IVADF: venta.montoIVA,
        Total: venta.total,
      })

      venta.ventaDetalleReportes.forEach((detalle) => {
        detallesArray.push({
          FolioDocumento: venta.nroComprobante,
          CodigoProducto: detalle.codProducto,
          Descripcion: detalle.descripcion,
          PrecioUnidad: detalle.precioUnidad,
          Cantidad: detalle.cantidad,
          Costo: detalle.costo,
          Monto: (detalle.precioUnidad * detalle.cantidad)
        })
      })

      venta.medioDePagos.forEach((pago) => {
        pagosArray.push({
          FolioDocumento: venta.nroComprobante,
          Metodo: pago.metodoPago,
          Monto: pago.montoMedioPago
        })
      })

    })

    const worksheet = xlsx.utils.json_to_sheet(cabeceraArray);
    const worksheet2 = xlsx.utils.json_to_sheet(detallesArray);
    const worksheet3 = xlsx.utils.json_to_sheet(pagosArray);

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Cabeceras Ventas");
    xlsx.utils.book_append_sheet(workbook, worksheet2, "Detalles Ventas");
    xlsx.utils.book_append_sheet(workbook, worksheet3, "Metodos de Pagos");

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    hideLoading()
    setTimeout(() => {
      saveAs(excelBlob, "reporte-ventas-" + dayjs().format("DD_MM_YYYY-HH_mm_ss") + ".xlsx");
    }, 300);
  };




  useEffect(() => {
    // exportExcel()
  }, [])

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

      setVentaPorCaja([])
      setCajaSel(null)
      setUserSel(null)

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

  const handleDialogOpen = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleBorradoLogico = (venta) => {
    showConfirm("Cancelar la venta?", () => {
      pedirSupervision("borrar una venta", () => {
        Sale.borradoLogico(selectedProduct, (resul) => {
          showMessage(resul.descripcion)
          setSelectedProduct(null)
          setOpenDialog(false)
          fetchData()
        }, (error) => {
          showMessage(error)
        })
      }, selectedProduct)
    }, () => { })
  };

  const handleCheckboxChange = (event) => {
    const value = parseInt(event.target.value);
    setTipo((prev) =>
      event.target.checked
        ? [...prev, value]
        : prev.filter((item) => item !== value)
    );
  };

  const getUserInfo = (fieldValue, nameField = "codigoUsuario") => {
    // console.log("getUserInfo")
    var info = null
    allUsers.forEach((user) => {
      if (user[nameField] === fieldValue) {
        info = user
      }
    })
    // console.log("devuelve ", info)
    return info
  }


  const agruparPorCaja = () => {
    console.log("agruparPorCaja")
    var usersx = []
    var prodCaja = []
    data.forEach((prod) => {
      if (!prodCaja.includes(prod.puntoVenta)) {
        prodCaja.push(prod.puntoVenta)
      }

      const info = getUserInfo(prod.idUsuario)
      const userName = info ? info.nombres + " " + info.apellidos : ""
      // console.log("info", info)
      // console.log("userName", userName)

      if (userName && !usersx.includes(userName)) {
        usersx.push(userName)
      }
    })

    prodCaja.push("Todas")
    usersx.push("Todos")

    setCajas(prodCaja)
    setUsers(usersx)
    console.log("usersx", usersx)
    // console.log("cajas", prodCaja)
  }

  const cargarVentasPorCaja = (caja) => {
    var ventas = []
    var cantCaja = 0
    var totCaja = 0
    var totIvaCaja = 0

    data.forEach((venta) => {
      if (venta.puntoVenta == caja || caja == "Todas") {
        ventas.push(venta)

        cantCaja++
        totCaja += venta.total
        totIvaCaja += venta.montoIVA
      }
    })
    setVentaPorCaja(ventas)
    setCantidadCaja(cantCaja)
    setTotalValuesCaja(totCaja)
    setTotalIVACaja(totIvaCaja)
  }



  const cargarVentasPorUsuarioYCaja = () => {
    var ventas = []
    var cantCaja = 0
    var totCaja = 0
    var totIvaCaja = 0

    var ventasIds = []
    System.clone(data).forEach((venta, keyIdUnico) => {
      if (
        (venta.puntoVenta == cajas[cajaSel] || cajas[cajaSel] == "Todas")
      ) {
        const infoUser = getUserInfo(venta.idUsuario)
        const userName = infoUser ? infoUser.nombres + " " + infoUser.apellidos : ""

        if (userSel === null || users[userSel] == "Todos" || userName == users[userSel]) {
          const nroComprobante = venta.nroComprobante
          if (!ventasIds.includes(venta.nroComprobante)) {
            ventasIds.push(venta.nroComprobante)

            venta.pagos = []
            venta.pagos.push({
              nroComprobante: venta.nroComprobante,
              metodoPago: venta.metodoPago,
              fechaIngreso: venta.fechaIngreso,
              rdcTransactionId: venta.rdcTransactionId,
              montoIVA: venta.montoIVA,
              montoNeto: venta.montoNeto,
              total: venta.total,
              descripcionComprobante: venta.descripcionComprobante
            })
            ventas.push(venta)
            cantCaja++
            totCaja += venta.total
            totIvaCaja += venta.montoIVA
          } else {
            var index = -1
            ventas.forEach((venta2, ix) => {
              if (ix != keyIdUnico && nroComprobante == venta2.nroComprobante) {
                index = ix
              }
            })
            if (index > -1) {
              ventas[index].total = ventas[index].total + venta.total
              ventas[index].pagos.push({
                nroComprobante: venta.nroComprobante,
                metodoPago: venta.metodoPago,
                fechaIngreso: venta.fechaIngreso,
                rdcTransactionId: venta.rdcTransactionId,
                montoIVA: venta.montoIVA,
                montoNeto: venta.montoNeto,
                total: venta.total,
                descripcionComprobante: venta.descripcionComprobante
              })
            }
          }
        }
      }
    })
    setVentaPorCaja(ventas)
    console.log("las ventas quedaron asi", ventas)
    setCantidadCaja(cantCaja)
    setTotalValuesCaja(totCaja)
    setTotalIVACaja(totIvaCaja)
  }

  useEffect(() => {
    setStartDate(dayjs())
    setEndDate(dayjs())
    setTipo([
      0, 1, 2, 4
    ])

    User.getAll((usersServer) => {
      setAllUsers(usersServer)
    }, (error) => {
      console.log("no se pudo cargar los usuarios")
    })
  }, [])

  useEffect(() => {
    agruparPorCaja()
  }, [data])

  useEffect(() => {
    cargarVentasPorUsuarioYCaja()
  }, [userSel, cajaSel])

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={1} alignItems="center">
          Libro de Ventas
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


            <Grid item xs={12} sm={12} md={2} lg={2}>
              <Typography>Seleccionar caja</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={10} lg={10}>
              <BoxSelectList
                listValues={cajas}
                selected={cajaSel}
                setSelected={(sel) => {
                  setCajaSel(sel)
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2}>
              <Typography>Seleccionar usuario</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={10} lg={10}>
              <BoxSelectList
                listValues={users}
                selected={userSel}
                setSelected={(sel) => {
                  setUserSel(sel)
                }}
              />
            </Grid>


            <Grid item xs={12} sm={12} md={4} lg={4}>
              <p>Total en caja: ${totalValuesCaja.toLocaleString("es-CL")}</p>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <p>Total IVA en caja: ${totalIVACaja.toLocaleString("es-CL")}</p>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <p>Cantidad de la caja: {cantidadCaja.toLocaleString("es-CL")}</p>
            </Grid>


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
                  <TableCell>Total</TableCell>
                  <TableCell>Acciones

                    {ventasPorCaja.length > 0 && (
                      <SmallButton
                        style={{
                          backgroundColor: "#005D25CC"
                        }}
                        textButton={"Exportar a Excel"}
                        actionButton={() => {
                          exportExcel()
                        }}
                      />
                    )}

                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ventasPorCaja.map((producto, ix) => (
                  <TableRow key={ix}>
                    <TableCell>
                      {new Date(producto.fechaIngreso).toLocaleDateString(
                        "es-CL"
                      )}
                    </TableCell>
                    <TableCell>{producto.descripcionComprobante}</TableCell>
                    <TableCell>
                      {producto.nroComprobante.toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell>
                      {producto.montoNeto.toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell>
                      {producto.montoIVA.toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell>
                      {producto.total.toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          console.log("detalles del producto", producto)
                          handleDialogOpen(producto)
                        }}
                      >
                        Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

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

      <RankingLibroVentasDetalle
        openDialog={openDialog}
        onClose={handleDialogClose}
        handleBorradoLogico={handleBorradoLogico}
        selectedProduct={selectedProduct}
      />
    </div>
  );
};

export default RankingLibroVentas;
