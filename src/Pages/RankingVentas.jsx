import React, { useEffect, useState } from "react";
import {
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Snackbar,
  IconButton,
  Collapse,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Close as CloseIcon,
} from "@mui/icons-material";
import axios from "axios";
import SideBar from "../Componentes/NavBar/SideBar";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ModelConfig from "../Models/ModelConfig";

const RankingVentas = () => {
  const apiUrl = ModelConfig.get().urlBase;

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openRows, setOpenRows] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

    

    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${apiUrl}/ReporteVentas/ReporteVentasPorTipoComprobanteYMetodoPagoGET`,
        {
          params: {
            fechaDesde: startDate ? startDate.format("YYYY-MM-DD") : "",
            fechaHasta: endDate ? endDate.format("YYYY-MM-DD") : "",
          },
        }
      );
      const groupedData = groupBy(
        response.data.reporteVentasPorTipoComprobanteYMetodoPagos || []
      );
      console.log("response pro", response.data.reporteVentasPorTipoComprobanteYMetodoPagos)
      setData(groupedData);
      console.log("respuesta ranking data", groupedData);
    } catch (error) {
      setError("Error fetching data");
      setSnackbarMessage("Error al buscar los datos");
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const groupBy = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.metodoPago]) {
        acc[item.metodoPago] = {
          transactions: [],
          totalCantidad: 0,
          totalSuma: 0,
        };
      }
      acc[item.metodoPago].transactions.push(item);
      acc[item.metodoPago].totalCantidad += item.cantidad;
      acc[item.metodoPago].totalSuma += item.sumaTotal;
      return acc;
    }, {});
  };

  const toggleRow = (metodoPago) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [metodoPago]: !prevOpenRows[metodoPago],
    }));
  };

  const calculateTotalSuma = () => {
    return Object.values(data).reduce((acc, item) => acc + item.totalSuma, 0);
  };

  const calculatePercentage = (totalSuma, grandTotal) => {
    return (totalSuma / grandTotal) * 100;
  };
  const handleOpenDialog = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const grandTotalSuma = calculateTotalSuma();

  useEffect(()=>{
    setStartDate(dayjs())
    setEndDate(dayjs())
    
  },[])

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={1} alignItems="center">
          Ranking de Ventas 
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
        </Grid>
  
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {!loading && (
            <Grid item xs={12}>
              <Paper sx={{ mb: 2 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                     
                      <TableRow>
                        <TableCell colSpan={4}></TableCell>
                        <TableCell align="center">
                          <strong>Total periodo :</strong>{" "}
                          {grandTotalSuma.toLocaleString("es-CL")}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          )}
  
          {loading ? (
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <CircularProgress />
            </Grid>
          ) : (
            Object.keys(data).map((metodoPago) => (
              <Grid item xs={12} key={metodoPago}>
                <Paper sx={{ mb: 2 }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                       
                        <TableRow>
  <TableCell align="center" sx={{ width: 120 }}>
    <IconButton
      size="small"
      onClick={() => toggleRow(metodoPago)}
    >
      {openRows[metodoPago] ? (
        <KeyboardArrowUp />
      ) : (
        <KeyboardArrowDown />
      )}
    </IconButton>
  </TableCell>
  <TableCell align="center" >
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center" sx={{backgroundColor:"gainsboro"}}>Método de Pago</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell align="center"><strong>{metodoPago}</strong></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableCell>
  <TableCell align="center" >
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center" sx={{backgroundColor:"gainsboro"}}>Total Cantidad</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell align="center">{data[metodoPago].totalCantidad}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableCell>
  <TableCell align="center" >
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center" sx={{backgroundColor:"gainsboro"}}>Valor</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell align="center">
            {data[metodoPago].totalSuma.toLocaleString("es-CL")}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableCell>
  <TableCell align="center" >
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center" sx={{backgroundColor:"gainsboro"}}>
            <strong> % del total</strong>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell align="center">
            {Math.round(
              calculatePercentage(
                data[metodoPago].totalSuma,
                grandTotalSuma
              ) * 100
            ) / 100}
            %
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableCell>
  <TableCell></TableCell>
</TableRow>

                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                          >
                            <Collapse
                              in={openRows[metodoPago]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box margin={1}>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow
                                      sx={{ backgroundColor: "gainsboro" }}
                                    >
                                      <TableCell align="center">Fecha</TableCell>
                                      <TableCell align="center">
                                        Tipo Comprobante
                                      </TableCell>
                                      <TableCell align="center">
                                        Folio
                                      </TableCell>
                                      <TableCell align="center">Cantidad</TableCell>
                                      <TableCell align="center">Valor</TableCell>
                                      <TableCell align="center">
                                        Porcentaje Participación
                                      </TableCell>
                                      <TableCell align="center">
                                       Acciones
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {data[metodoPago].transactions &&
                                      data[metodoPago].transactions.map(
                                        (row, index) => (
                                          <TableRow key={index}>
                                            <TableCell align="center">
                                              {row.fecha}
                                            </TableCell>
                                            <TableCell align="center">
                                              {row.tipoComprobante}
                                            </TableCell>
                                            <TableCell align="center">
                                        Folio
                                      </TableCell>
                                            <TableCell align="center">
                                              {row.cantidad}
                                            </TableCell>
                                            <TableCell align="center">
                                              {row.sumaTotal.toLocaleString(
                                                "es-CL"
                                              )}
                                            </TableCell>
                                            <TableCell align="center">
                                              {Math.round(
                                                (row.sumaTotal / grandTotalSuma) *
                                                  10000
                                              ) / 100}
                                              %
                                            </TableCell>
                                            <TableCell align="center">
                                            <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleOpenDialog(row)}
                                            >Ver Detalles</Button>
                                            
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
  
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setSnackbarOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
         <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Detalles</DialogTitle>
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo Comprobante</TableCell>
                  <TableCell>Método de Pago</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Porcentaje Participación</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedItem && (
                  <TableRow>
                    <TableCell>{selectedItem.fecha}</TableCell>
                    <TableCell>{selectedItem.tipoComprobante}</TableCell>
                    <TableCell>{selectedItem.metodoPago}</TableCell>
                    <TableCell>{selectedItem.cantidad}</TableCell>
                    <TableCell>{selectedItem.sumaTotal.toLocaleString("es-CL")}</TableCell>
                    <TableCell>{(selectedItem.porcentajeParticipacion).toFixed(2)}%</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </div>
  );
  
};

export default RankingVentas;
