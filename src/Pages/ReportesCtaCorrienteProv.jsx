import React, { useEffect, useState } from "react";
import {
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Collapse,
  IconButton,
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

const ReportesCtaCorrienteProv = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openRows, setOpenRows] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hideZeroBalance, setHideZeroBalance] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const apiUrl = ModelConfig.get().urlBase;
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
        `${apiUrl}/Proveedores/GetProveedorCompraByFecha`,
        {
          params: {
            fechaDesde: startDate ? startDate.format("YYYY-MM-DD") : "",
            fechaHasta: endDate ? endDate.format("YYYY-MM-DD") : "",
          },
        }
      );
      setData(response.data.proveedorCompraCabeceraReportes);
      console.log("resultado prov",response.data.proveedorCompraCabeceraReportes);
    } catch (error) {
      setError("Error fetching data");
      setSnackbarMessage("Error al buscar los datos");
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const groupDataByProvider = (data) => {
    return data.reduce((acc, curr) => {
      const providerIndex = acc.findIndex((item) => item.rut === curr.rut);
      if (providerIndex !== -1) {
        acc[providerIndex].transactions.push(curr);
      } else {
        acc.push({
          rut: curr.rut,
          razonSocial: curr.razonSocial,
          transactions: [curr],
        });
      }
      return acc;
    }, []);
  };

  const toggleRow = (rowId) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [rowId]: !prevOpenRows[rowId],
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleOpenDialog = (document) => {
    setSelectedProducts(document.detalles);
    setSelectedDocument(document);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProducts([]);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleHideZeroBalance = () => {
    setHideZeroBalance(!hideZeroBalance);
  };

  const groupedData = groupDataByProvider(data);
  const filteredData = groupedData.filter((provider) =>
    provider.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.razonSocial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = filteredData.sort((a, b) => a.rut.localeCompare(b.rut));

  const calculateSaldo = (total, pagos) => {
    const totalPagos = pagos.reduce((sum, pago) => sum + pago.montoPagado, 0);
    return total - totalPagos;
  };

  useEffect(()=>{
    setStartDate(dayjs())
    setEndDate(dayjs())
    
  },[])

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={1} alignItems="center">
          Reportes Cuenta Corrientes Proveedores
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha Inicio"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { sx: { mb: 2 }, fullWidth: true } }}
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
                  slotProps={{ textField: { sx: { mb: 2 }, fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                sx={{ p: 2, mb: 4 }}
                variant="contained"
                onClick={handleBuscarClick}
                fullWidth
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              label="Buscar por RUT o Razón Social"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={handleHideZeroBalance}
          color="secondary"
          sx={{ p: 2, mt: 4 }}
        >
          {hideZeroBalance ? "Mostrar Saldo Cero" : "Ocultar Saldo Cero"}
        </Button>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={snackbarMessage}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSnackbar}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        ) : (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Rut</TableCell>
                  <TableCell>Razón Social</TableCell>
                  <TableCell>Nombre Responsable</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((provider) => (
                  <React.Fragment key={provider.rut}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(provider.rut)}
                        >
                          {openRows[provider.rut] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>{provider.rut}</TableCell>
                      <TableCell>{provider.razonSocial}</TableCell>
                      <TableCell>{provider.nombreResponsable}</TableCell>
                    </TableRow>
                    {openRows[provider.rut] && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Collapse in={openRows[provider.rut]}>
                            <Box sx={{ margin: 1 }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                                                     <TableCell>Fecha</TableCell>
                                  <TableCell>Tipo Documento</TableCell>
                                  <TableCell>Folio</TableCell>
                                  <TableCell>Cargo</TableCell>
                                  <TableCell>Abono</TableCell>
                                  <TableCell>Saldo</TableCell>
                                  <TableCell>Detalles</TableCell>

                                  </TableRow>
                                </TableHead>
                                <TableBody>



 {provider.transactions
                                  .filter(
                                    (transaction) =>
                                      !hideZeroBalance ||
                                      calculateSaldo(
                                        transaction.total,
                                        transaction.pagos
                                      ) !== 0
                                  )
                                  .map((transaction) => (
                                    <TableRow
                                      key={transaction.idCabeceraCompra}
                                    >
                                      <TableCell>

                                    
                                        {" "}
                                        {new Date(
                                          transaction.fechaIngreso
                                        ).toLocaleDateString("es-ES", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })}
                                      </TableCell>
                                      <TableCell>
                                        {transaction.tipoDocumento}
                                      </TableCell>
                                      <TableCell>{transaction.folio}</TableCell>
                                      <TableCell> {transaction.pagos.length > 0 &&
                                          transaction.pagos.map((payment) => (
                                            <div key={payment.id}>
                                              {payment.montoPagado.toLocaleString("es-CL")} <br />
                                              {payment.metodoPago}
                                              <br />
                                              {new Date(payment.fechaPago).toLocaleDateString(
                                                "es-ES",
                                                {
                                                  day: "2-digit",
                                                  month: "2-digit",
                                                  year: "numeric",
                                                }
                                              )}
                                            </div>
                                          ))}</TableCell>
                                      <TableCell>{transaction.total.toLocaleString("es-CL")}</TableCell>
              
                                      <TableCell>
                                        
                                        {calculateSaldo(
                                          transaction.total,
                                          transaction.pagos
                                        ).toLocaleString("es-CL")}
                                      </TableCell>
                                      <TableCell>
                                        <Button
                                          variant="contained"
                                          onClick={() =>
                                            handleOpenDialog(
                                              transaction
                                            )
                                          }
                                        >
                                          Ver Detalles
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}



                                  {/* {provider.transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                      <TableCell>{dayjs(transaction.fecha).format("DD/MM/YYYY")}</TableCell>
                                      <TableCell>{transaction.tipoDocumento}</TableCell>
                                      <TableCell>{transaction.monto}</TableCell>
                                      <TableCell>{calculateSaldo(transaction.total, transaction.pagos)}</TableCell>
                                      <TableCell>
                                        <Button
                                          variant="outlined"
                                          onClick={() => handleOpenDialog(transaction)}
                                        >
                                          Ver Detalles
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))} */}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
  <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
       <Dialog open={dialogOpen} onClose={handleCloseDialog}>
  <DialogTitle>Detalles del Documento</DialogTitle>
  <DialogContent>
    {/* Display the main details of the document */}
    <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell><strong>Fecha:</strong></TableCell>
          <TableCell>{dayjs(selectedDocument?.fechaIngreso).format('DD/MM/YYYY')}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><strong>Tipo Documento:</strong></TableCell>
          <TableCell>{selectedDocument?.tipoDocumento}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><strong>Folio:</strong></TableCell>
          <TableCell>{selectedDocument?.folio}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><strong>Total:</strong></TableCell>
          <TableCell>{selectedDocument?.total.toLocaleString("es-CL")}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><strong>RUT:</strong></TableCell>
          <TableCell>{selectedDocument?.rut}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><strong>Razón Social:</strong></TableCell>
          <TableCell>{selectedDocument?.razonSocial}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><strong>Nombre Responsable:</strong></TableCell>
          <TableCell>{selectedDocument?.nombreResponsable}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><strong>Código Proveedor:</strong></TableCell>
          <TableCell>{selectedDocument?.codigoProveedor}</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    {/* Display the product details */}
    <Typography variant="h6" sx={{ mt: 2 }}>Detalles de Productos</Typography>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Descripción</TableCell>
          <TableCell>Cantidad</TableCell>
          <TableCell>Precio Unidad</TableCell>
          <TableCell>Costo</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {selectedProducts.map((product) => (
          <TableRow key={product.idDetalle}>
            <TableCell>{product.descripcionProducto}</TableCell>
            <TableCell>{product.cantidad}</TableCell>
            <TableCell>{product.precioUnidad.toLocaleString("es-CL")}</TableCell>
            <TableCell>{product.costo.toLocaleString("es-CL")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    {/* Display payment details */}
    <Typography variant="h6" sx={{ mt: 2 }}>Detalles de Pagos</Typography>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Monto Pagado</TableCell>
          <TableCell>Metodo Pago</TableCell>
          <TableCell>Fecha Pago</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {selectedDocument?.pagos.map((pago) => (
          <TableRow key={pago.idPago}>
            <TableCell>{pago.montoPagado.toLocaleString("es-CL")}</TableCell>
            <TableCell>{pago.metodoPago}</TableCell>
            <TableCell>{new Date(pago.fechaPago).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog} color="primary">
      Cerrar
    </Button>
  </DialogActions>
</Dialog>

      </Grid>
    </div>
  );
};

export default ReportesCtaCorrienteProv;
