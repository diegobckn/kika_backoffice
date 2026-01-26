import React, { useEffect, useState } from "react";
import {
  Paper,
  Grid,
  Table,
  TableBody,
  Typography,
  TableCell,
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
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Close as CloseIcon,
} from "@mui/icons-material";
import SideBar from "../Componentes/NavBar/SideBar";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Client from "../Models/Client";
import System from "../Helpers/System";

const ReportesCtaCorriente = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openRows, setOpenRows] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedPagos, setSelectedPagos] = useState([]);


  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hideZeroSaldo, setHideZeroSaldo] = useState(false);

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

    Client.getInstance().getDeudasByFecha(startDate ? startDate.format("YYYY-MM-DD") : "",
      endDate ? endDate.format("YYYY-MM-DD") : "", (respData, resp) => {
        setData(respData.clienteDeudaByFechas);
      }, (err) => {
        setError(err);
        setSnackbarMessage("Error al buscar los datos");
        setSnackbarOpen(true);
      }
    )
    setLoading(false);
  };

  const groupDataByClient = (data) => {
    const groupedData = data.reduce((acc, curr) => {
      const clientIndex = acc.findIndex((item) => item.rut === curr.rut);
      if (clientIndex !== -1) {
        acc[clientIndex].transactions.push(curr);
      } else {
        acc.push({
          rut: curr.rut,
          razonSocial: curr.razonSocial,
          transactions: [curr],
        });
      }
      return acc;
    }, []);

    return groupedData;
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
    setSelectedProducts(document.productos);  // Set the products for the selected document
    setSelectedPagos(document.clienteDeudasPagadas);  // Set the products for the selected document
    setSelectedDocument(document);  // Set the entire document details
    setDialogOpen(true);
  };


  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const groupedData = groupDataByClient(data);

  const filteredData = groupedData.filter((client) => {
    const lowercasedFilter = searchTerm.toLowerCase();

    return (
      client.rut.toLowerCase().includes(lowercasedFilter) ||
      client.razonSocial.toLowerCase().includes(lowercasedFilter)
    );
  });

  const sortedData = filteredData.sort((a, b) => a.rut.localeCompare(b.rut));

  const calculateSaldo = (transaction) => {
    console.log("calculateSaldo.. transaction", transaction)
    const totalPagos = transaction.clienteDeudasPagadas.reduce((sum, pago) => sum + pago.montoPagado, 0);
    console.log("calculateSaldo.. totalPagos", totalPagos)
    var saldo = transaction.total - totalPagos
    if (saldo < 0) {
      saldo = 0
    }
    return saldo
  };

  const toggleHideZeroSaldo = () => {
    setHideZeroSaldo((prev) => !prev);
  };

  useEffect(() => {
    setStartDate(dayjs())
    setEndDate(dayjs())

  }, [])

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={1} alignItems="center">
          Reportes Cuenta Corrientes Clientes
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha Inicio"
                  value={startDate}
                  format="DD/MM/YYYY"
                  onChange={(newValue) => setStartDate(newValue)}
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
          onClick={toggleHideZeroSaldo}
          variant="contained"
          color="secondary"
          sx={{ p: 2, mt: 4 }}
        >
          {hideZeroSaldo ? "Mostrar Saldos en Cero" : "Ocultar Saldos en Cero"}
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
                  <TableCell>Razon Social</TableCell>
                  <TableCell>Nombre Cliente</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((client) => {
                  return (
                    <React.Fragment key={client.rut}>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => toggleRow(client.rut)}
                          >
                            {openRows[client.rut] ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>{client.rut}</TableCell>
                        <TableCell>{client.razonSocial}</TableCell>
                        <TableCell>
                          {client.transactions[0].nombreApellidoCliente}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={10}
                        >
                          <Collapse
                            in={openRows[client.rut]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box margin={1}>
                              <Table size="small" aria-label="transactions">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>Tipo Documento</TableCell>
                                    <TableCell>Folio</TableCell>
                                    <TableCell>Cargo</TableCell>
                                    <TableCell>Abono</TableCell>
                                    <TableCell>Saldo</TableCell>
                                    <TableCell></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {client.transactions
                                    .filter(
                                      (transaction) =>
                                        !hideZeroSaldo ||
                                        calculateSaldo(transaction) !== 0
                                    )
                                    .map((transaction) => {
                                      return (
                                        <TableRow key={transaction.id}>
                                          <TableCell>
                                            {dayjs(transaction.fechaIngreso).format(
                                              "DD/MM/YYYY"
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {transaction.descripcionComprobante}
                                          </TableCell>
                                          <TableCell>{transaction.nroComprobante}</TableCell>
                                          <TableCell>{transaction.total.toLocaleString("es-CL")}</TableCell>


                                          <TableCell>
                                            {transaction.clienteDeudasPagadas.length > 0 &&
                                              transaction.clienteDeudasPagadas.map((payment, ix) => (
                                                <div key={ix + 1}>
                                                  {payment.montoPagado.toLocaleString("es-CL")} <br />
                                                </div>
                                              ))}
                                          </TableCell>
                                          <TableCell>

                                            {calculateSaldo(transaction)}
                                          </TableCell>
                                          <TableCell>
                                            <Button
                                              onClick={() =>
                                                handleOpenDialog(transaction)
                                              }
                                              variant="contained"
                                              color="secondary"
                                            >
                                              Detalles
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      )
                                    })}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  )
                }
                )}
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
                  <TableCell><strong>Descripción:</strong></TableCell>
                  <TableCell>{selectedDocument?.descripcionComprobante}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Número de Comprobante:</strong></TableCell>
                  <TableCell>{selectedDocument?.nroComprobante}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Total:</strong></TableCell>
                  <TableCell>{selectedDocument?.total.toLocaleString("es-CL")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Pagado:</strong></TableCell>
                  <TableCell>{selectedDocument?.pagado ? 'Sí' : 'No'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Parcial:</strong></TableCell>
                  <TableCell>{selectedDocument?.parcial ? 'Sí' : 'No'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Total Pagado Parcial:</strong></TableCell>
                  <TableCell>{selectedDocument?.totalPagadoParcial.toLocaleString("es-CL")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Nombre Cliente:</strong></TableCell>
                  <TableCell>{selectedDocument?.nombreApellidoCliente}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>RUT:</strong></TableCell>
                  <TableCell>{selectedDocument?.rut}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Display the product details */}
            <Typography variant="h6">Detalles de Productos</Typography>
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
                  <TableRow key={product.codProducto}>
                    <TableCell>{product.descripcionProducto}</TableCell>
                    <TableCell>{product.cantidad}</TableCell>
                    <TableCell>{product.precioUnidad.toLocaleString("es-CL")}</TableCell>
                    <TableCell>{product.costo.toLocaleString("es-CL")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Typography variant="h6">Detalles de Pagos</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Metodo de pago</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedPagos.map((pago, ix) => {
                  return (
                    <TableRow key={ix + selectedPagos.length}>
                      <TableCell>{System.formatDateServer(pago.fechaIngreso)}</TableCell>
                      <TableCell>{System.formatMonedaLocal(pago.montoPagado, false)}</TableCell>
                      <TableCell>{pago.metodoPago}</TableCell>
                    </TableRow>)
                }
                )}
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

export default ReportesCtaCorriente;