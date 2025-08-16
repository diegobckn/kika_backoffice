import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Tabs,
  Tab,
  Pagination,
  IconButton,
  Avatar,
  Box,
  Grid,
  Typography,
  Snackbar,
  InputLabel,
  Button,
  Table,
  TableBody,
  CircularProgress,
  TableCell,
  TableContainer,
  MenuItem,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditarCliente from "../Proveedores/EditarClientes";
import PaymentsIcon from "@mui/icons-material/Payments";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ModelConfig from "../../Models/ModelConfig";

const ITEMS_PER_PAGE = 10;

const SearchListClientes = () => {
  const apiUrl = ModelConfig.get().urlBase;

  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editClienteData, setEditClienteData] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditSuccessful, setIsEditSuccessful] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [searchResults, setSearchResults] = useState("");

  const [ventaData, setVentaData] = useState([]);

  const [grandTotal, setGrandTotal] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para controlar la apertura del Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cantidadPagada, setCantidadPagada] = useState("");

  const [metodoPago, setMetodoPago] = useState("");
  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);
  const [errorTransferenciaError, setTransferenciaError] = useState("");
  const [fecha, setFecha] = useState(dayjs());
  const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre
  const [rut, setRut] = useState(""); // Estado para almacenar el rut
  const [nroCuenta, setNroCuenta] = useState(""); // Estado para almacenar el número de cuenta
  const [nroOperacion, setNroOperacion] = useState(""); // Estado para almacenar el número de operación
  const [selectedDebts, setSelectedDebts] = useState([]);
  const [tipoCuenta, setTipoCuenta] = useState("");
  const [selectedBanco, setSelectedBanco] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [deudaData, setDeudaData] = useState([]);
  const [openPaymentProcess, setOpenPaymentProcess] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedClient) {
        try {
          const response = await axios.get(
            `${apiUrl}/Clientes/GetClientesDeudasByIdCliente?codigoClienteSucursal=${selectedClient.clienteSucursal}&codigoCliente=${selectedClient.codigoCliente}`
          );
          setDeudaData(response.data.clienteDeuda); // Actualiza el estado de deudaData
        } catch (error) {
          console.error("Error al obtener las nuevas deudas:", error);
          // Puedes manejar el error aquí si es necesario
        }
      }
    };
    console.log(selectedClient);
    fetchData(); // Llama a la función fetchData cuando selectedClient cambie
  }, [selectedClient]);

  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-CL");
  };
  // Estado para almacenar el tipo de cuenta seleccionado
  const tiposDeCuenta = {
    "Cuenta Corriente": "Cuenta Corriente",
    "Cuenta de Ahorro": "Cuenta de Ahorro",
    "Cuenta Vista": "Cuenta Vista",
    "Cuenta Rut": "Cuenta Rut",
    "Cuenta de Depósito a Plazo (CDP)": "Cuenta de Depósito a Plazo (CDP)",
    "Cuenta de Inversión": "Cuenta de Inversión",
  };
  const handleChangeTipoCuenta = (event) => {
    setTipoCuenta(event.target.value); // Actualizar el estado del tipo de cuenta seleccionado
  };
  const bancosChile = [
    { id: 1, nombre: "Banco de Chile" },
    { id: 2, nombre: "Banco Santander Chile" },
    { id: 3, nombre: "Banco Estado" },
    { id: 4, nombre: "Scotiabank Chile" },
    { id: 5, nombre: "Banco BCI" },
    { id: 6, nombre: "Banco Itaú Chile" },
    { id: 7, nombre: "Banco Security" },
    { id: 8, nombre: "Banco Falabella" },
    { id: 9, nombre: "Banco Ripley" },
    { id: 10, nombre: "Banco Consorcio" },
    { id: 11, nombre: "Banco Internacional" },
    { id: 12, nombre: "Banco Edwards Citi" },
    { id: 13, nombre: "Banco de Crédito e Inversiones" },
    { id: 14, nombre: "Banco Paris" },
    { id: 15, nombre: "Banco Corpbanca" },
    { id: 16, nombre: "Banco BICE" },

    // Agrega más bancos según sea necesario
  ];

  const handleBancoChange = (event) => {
    setSelectedBanco(event.target.value);
  };
  const hoy = dayjs();
  const inicioRango = dayjs().subtract(1, "week"); // Resta 1 semanas

  useEffect(() => {
    async function fetchClientes() {
      try {
        const response = await axios.get(
         `${apiUrl}/Clientes/GetAllClientes`
        );
        console.log("API response GetAllClientes:", response.data);
        setClientes(response.data.cliente);
        setFilteredClientes(response.data.cliente.slice(0, ITEMS_PER_PAGE));
        setPageCount(response.data.cliente.length);
      } catch (error) {
        console.log(error);
      }
    }

    fetchClientes();
  }, [refresh]);

  const handleOpenPaymentProcess = () => {
    setOpenPaymentProcess(true);
    setCantidadPagada(getTotalSelected());
    setMetodoPago("")
  };

  // Función para cerrar el diálogo de procesamiento de pago
  const handleClosePaymentProcess = () => {
    
    setOpenPaymentProcess(false);
    
  };

  const setPageCount = (clientesCount) => {
    setTotalPages(Math.ceil(clientesCount / ITEMS_PER_PAGE));
  };

  useEffect(() => {
    if (isEditSuccessful) {
      setOpenEditModal(false); // Close the modal on successful edit
      setIsEditSuccessful(false); // Reset success state
      setRefresh(!refresh); // Trigger data refresh
    }
  }, [isEditSuccessful]);

  const handleEdit = (cliente) => {
    setEditClienteData(cliente);
    setOpenEditModal(true);
    setIsEditSuccessful(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleOpenPaymentDialog = async (cliente) => {
    setSelectedClient(cliente);
    setOpenPaymentDialog(true);
    console.log("selectedClienteclicked:", selectedClient);
    const deudaData = await fetchDeudaData(cliente); // Llamado a fetchDeudaData con el cliente seleccionado
    console.log("Deuda Data:", deudaData);
    const resetDeudaData = deudaData.map(deuda => ({
      ...deuda,
      selected: false
    }));
    setDeudaData(resetDeudaData);
    
    console.log("Deuda Data:", deudaData);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
  };

  useEffect(() => {
    const filtered = clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClientes(
      filtered.slice(
        ITEMS_PER_PAGE * (currentPage - 1),
        ITEMS_PER_PAGE * currentPage
      )
    );
  }, [clientes, searchTerm, currentPage]);

  const onEditSuccess = () => {
    setIsEditSuccessful(true);
  };

 
  // const handleCheckboxChange = (index) => {
  //   const updatedDeudaData = [...deudaData];
  //   updatedDeudaData[index].selected = !updatedDeudaData[index].selected;
  //   setDeudaData(updatedDeudaData);
  //   console.log("deudaData",deudaData)
  
  //   const selectedDebts = updatedDeudaData.filter((deuda) => deuda.selected);
  //   setSelectedDebts(selectedDebts);
  // };
  const handleCheckboxChange = (index) => {
    const updatedDeudaData = deudaData.map((deuda, i) =>
      i === index ? { ...deuda, selected: !deuda.selected } : deuda
    );
    setDeudaData(updatedDeudaData);
  
    const selectedDebts = updatedDeudaData.filter((deuda) => deuda.selected);
    setSelectedDebts(selectedDebts);
    setCantidadPagada(getTotalSelected(updatedDeudaData));
  };
  
  const resetDeudaData = () => {
    const resetData = deudaData.map(deuda => ({
      ...deuda,
      selected: false
    }));
    setDeudaData(resetData);
  };
  
  
 
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
  
    const updatedDeudaData = deudaData.map((deuda) => ({
      ...deuda,
      selected: newSelectAll,
    }));
  
    setDeudaData(updatedDeudaData);
  
    const selectedDebts = updatedDeudaData.filter((deuda) => deuda.selected);
    setSelectedDebts(selectedDebts);
  };

  const getTotalSelected = () => {
    let totalSelected = 0;
    deudaData.forEach((deuda) => {
      if (deuda.selected) {
        totalSelected += deuda.total;
      }
    });
    return totalSelected;
  };

  const calcularVuelto = () => {
    const cambio = cantidadPagada - getTotalSelected();
    return cambio > 0 ? cambio : 0;
  };
  const totalDeuda = ventaData
    ? ventaData.reduce((total, deuda) => total + deuda.total, 0)
    : 0;

  useEffect(() => {
    if (selectedClient) {
      handlePayment();
    }
  }, [selectedClient]);

  console.log("selectedclient", selectedClient);

  const handlePayment = async () => {
    try {
      setLoading(true);
  
      let endpoint =
        `${apiUrl}/Clientes/PostClientePagarDeudaByIdCliente`;
  
      if (metodoPago === "TRANSFERENCIA") {
        endpoint =
          `${apiUrl}/Clientes/PostClientePagarDeudaTransferenciaByIdCliente `;
  
        if (
          nombre === "" ||
          rut === "" ||
          selectedBanco === "" ||
          tipoCuenta === "" ||
          nroCuenta === "" ||
          fecha === "" ||
          nroOperacion === ""
        ) {
          setTransferenciaError(
            "Por favor, completa todos los campos necesarios para la transferencia."
          );
          setLoading(false);
          return;
        }
  
        if (nombre === "") {
          setTransferenciaError("Por favor, ingresa el nombre.");
          setLoading(false);
          return;
        }
        if (rut === "") {
          setTransferenciaError("Por favor, ingresa el RUT.");
          setLoading(false);
          return;
        }
        if (!validarRutChileno(rut)) {
          setTransferenciaError("El RUT ingresado NO es válido.");
          setLoading(false);
          return;
        }
  
        if (selectedBanco === "") {
          setTransferenciaError("Por favor, selecciona el banco.");
          setLoading(false);
          return;
        }
  
        if (tipoCuenta === "") {
          setTransferenciaError("Por favor, selecciona el tipo de cuenta.");
          setLoading(false);
          return;
        }
  
        if (nroCuenta === "") {
          setTransferenciaError("Por favor, ingresa el número de cuenta.");
          setLoading(false);
          return;
        }
  
        if (fecha === "") {
          setTransferenciaError("Por favor, selecciona la fecha.");
          setLoading(false);
          return;
        }
  
        if (nroOperacion === "") {
          setTransferenciaError("Por favor, ingresa el número de operación.");
          setLoading(false);
          return;
        }
      }
  
      if (!metodoPago) {
        setError("Por favor, selecciona un método de pago.");
        setLoading(false);
        return;
      } else setError("");
  
      const selectedDeudas = deudaData.filter((deuda) => deuda.selected);
  
      const deudaIds = selectedDebts.map((deuda) => ({
        idCuentaCorriente: deuda.id,
        idCabecera: deuda.idCabecera,
        total: deuda.total,
      }));
  
      const requestBody = {
        deudaIds: deudaIds,
        montoPagado: getTotalSelected(),
        metodoPago: metodoPago,
        idUsuario: selectedClient.codigoCliente,
        transferencias: {
          idCuentaCorrientePago: 0,
          nombre: nombre,
          rut: rut,
          banco: selectedBanco,
          tipoCuenta: tipoCuenta,
          nroCuenta: nroCuenta,
          fecha: fecha,
          nroOperacion: nroOperacion,
        },
      };
  
      console.log("Request Body:", requestBody);
  
      const response = await axios.post(endpoint, requestBody);
  
      console.log("Response:", response.data);
      console.log("ResponseStatus:", response.data.statusCode);
      ///acciones post pago////
      if (response.data.statusCode === 200) {
        setSnackbarOpen(true);
        setSnackbarMessage(response.data.descripcion);
        handleClosePaymentDialog();
        setCantidadPagada(0);
        resetDeudaData();
  
        setTimeout(() => {
          handleClosePaymentProcess();
        }, 2000);
      } else {
        console.error("Error al realizar el pago");
      }
    } catch (error) {
      console.error("Error al realizar el pago:", error);
    } finally {
      setLoading(false);
    }
  };

  // const codigoCliente= selectedClient.codigoCliente
  // const codigoClienteSucursal= selectedClient.clienteSucursal
  const fetchDeudaData = async (selectedClient) => {
    try {
      if (selectedClient) {
        const response = await axios.get(
          
          `${apiUrl}/Clientes/GetClientesDeudasByIdCliente?codigoClienteSucursal=${selectedClient.clienteSucursal}&codigoCliente=${selectedClient.codigoCliente}`
        );
        console.log("DeudaCLiente:", response.data.clienteDeuda);

        setDeudaData(response.data.clienteDeuda);
      } else {
        // Si no hay un cliente seleccionado, devolver un array vacío
        return [];
      }
    } catch (error) {
      console.error("Error al obtener las nuevas deudas:", error);
      // Si hay un error, devolver un array vacío
      return [];
    }
  };
  const handleTransferenciaModalOpen = () => {
    setMetodoPago("TRANSFERENCIA"); // Establece el método de pago como "Transferencia"
    setOpenTransferenciaModal(true);
    setCantidadPagada(getTotalSelected());
  };
  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
  };


  const handleDeleteDialogOpen = (cliente) => {
    setSelectedClient(cliente);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  // Handle delete action
  const handleDelete = async () => {
    try {
      const codigoCliente = selectedCliente.codigoCliente;
      await axios.delete(
        `${apiUrl}/Proveedores/DeleteProveedorByCodigo?CodigoProveedor=${codigoCliente}`
      );
      setRefresh((prevRefresh) => !prevRefresh);
      setOpenDeleteDialog(false);
      setSnackbarOpen(true);
      setSnackbarMessage("Cliente eliminado con éxito");
    } catch (error) {
      console.error("Error eliminando el Cliente :", error);
      alert("Error eliminando el Cliente ");
    }
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <div>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
        >
          <Tab label="Clientes" />
        </Tabs>
        <div style={{ p: 2, mt: 4 }} role="tabpanel" hidden={selectedTab !== 0}>
          <TextField
            label="Buscar..."
            value={searchTerm}
            onChange={handleSearch}
            margin="dense"
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID </TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Giro</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.codigoCliente}>
                  <TableCell>{cliente.codigoCliente}</TableCell>
                  <TableCell>
                    {cliente.nombre}
                    <br />
                    {cliente.rut}
                    <br />{" "}
                    <span style={{ color: "purple" }}>
                      Tel:{cliente.telefono}
                    </span>{" "}
                  </TableCell>
                  <TableCell>{cliente.giro}</TableCell>
                  <TableCell>
                    {cliente.direccion}
                    <br />
                    {cliente.comuna}
                    <br /> {cliente.region}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(cliente)}>
                      <EditIcon />
                    </IconButton>
                    {/* <IconButton>
                      <DeleteIcon onClick={() => handleDeleteDialogOpen(cliente)}/>
                    </IconButton> */}
                    <IconButton
                      onClick={() => handleOpenPaymentDialog(cliente)}
                    >
                      <PaymentsIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Box sx={{ mt: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          showFirstButton
          showLastButton
        />
      </Box>
      <EditarCliente
        open={openEditModal}
        handleClose={handleCloseEditModal}
        cliente={editClienteData}
        onEditSuccess={onEditSuccess}
      />

      <Dialog open={openPaymentDialog} onClose={handleClosePaymentDialog}>
        <DialogTitle>Pago Cuenta Corriente</DialogTitle>
        <DialogContent>
          {selectedClient && (
            <Grid container spacing={2}>
              <Grid item xs={12}></Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Paper>
                  <Box
                    display="flex"
                    p={1.5}
                    gap={2}
                    bgcolor={"#f5f5f5"}
                    borderRadius={4}
                    sx={{ alignItems: "center" }}
                  >
                    <Box>
                      <Avatar sx={{ borderRadius: 3, width: 48, height: 48 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: "#696c6f" }}>
                        ID: {selectedClient.nombre}
                        <br />
                        {selectedClient.rutResponsable}
                      </Typography>
                    </Box>
                    <Grid item xs={12}></Grid>
                  </Box>
                </Paper>
                {selectedClient && (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Checkbox
                              checked={selectAll}
                              onChange={handleSelectAll}
                              color="primary"
                            />
                          </TableCell>
                          <TableCell>Descripción</TableCell>
                          <TableCell>Folio</TableCell>
                          <TableCell>Pago Parcial</TableCell>
                          <TableCell>Fecha</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Renderizar las filas de la tabla */}
                        {deudaData
                          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                          .map((deuda, index) => (
                            <TableRow key={deuda.id}>
                              <TableCell>
                                <Checkbox
                                  checked={deuda.selected || false}
                                  onChange={() => handleCheckboxChange(index)}
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell>
                                {deuda.descripcionComprobante}
                              </TableCell>
                              <TableCell>{deuda.nroComprobante}</TableCell>
                              <TableCell>${deuda.totalPagadoParcial}</TableCell>
                              <TableCell>{formatFecha(deuda.fecha)}</TableCell>
                              <TableCell>${deuda.total}</TableCell>
                              <TableCell sx={{ display: "none" }}>
                                ${deuda.idCabecera}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                      {/* Mostrar el total de la deuda y el botón de pago */}
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <Typography>Total Deuda : ${totalDeuda}</Typography>
                        </TableCell>
                        <TableCell colSpan={3} align="right">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpenPaymentProcess}
                            disabled={getTotalSelected() === 0}
                          >
                            Pagar Total Seleccionado (${getTotalSelected()})
                          </Button>
                        </TableCell>
                      </TableRow>
                    </Table>
                  </TableContainer>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar al proveedor seleccionado?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancelar</Button>
          <Button onClick={handleDelete} color="primary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPaymentProcess} onClose={handleClosePaymentProcess}>
  <DialogTitle>Procesamiento de Pago</DialogTitle>
  <DialogContent>
    <Grid container spacing={2} item xs={12} md={6} lg={12}>
      <Grid item xs={12} md={12} lg={12}>
        {error && (
          <Grid item xs={12}>
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Grid>
        )}
        <TextField
          sx={{ marginBottom: "5%" }}
          margin="dense"
          label="Monto a Pagar"
          variant="outlined"
          value={getTotalSelected()}
          onChange={(e) => setCantidadPagada(e.target.value)}
          fullWidth
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          InputProps={{ readOnly: true }}
        />
        <TextField
          margin="dense"
          fullWidth
          label="Cantidad pagada"
          value={cantidadPagada}
          onChange={(e) => {
            const value = e.target.value;
            if (!value.trim()) {
              setCantidadPagada(0);
            } else {
              setCantidadPagada(parseFloat(value));
            }
          }}
          disabled={metodoPago !== "EFECTIVO"} // Deshabilitar la edición excepto para el método "EFECTIVO"
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
            maxLength: 9,
          }}
        />
        <TextField
          margin="dense"
          fullWidth
          type="number"
          label="Por pagar"
          value={Math.max(0, getTotalSelected() - cantidadPagada)}
          InputProps={{ readOnly: true }}
        />
        {calcularVuelto() > 0 && (
          <TextField
            margin="dense"
            fullWidth
            type="number"
            label="Vuelto"
            value={calcularVuelto()}
            InputProps={{ readOnly: true }}
          />
        )}
      </Grid>

      <Grid
        container
        spacing={2}
        item
        sm={12}
        md={12}
        lg={12}
        sx={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Typography sx={{ marginTop: "7%" }} variant="h6">
          Selecciona Método de Pago:
        </Typography>
        <Grid item xs={12} sm={12} md={12}>
          <Button
            sx={{ height: "100%" }}
            id="efectivo-btn"
            fullWidth
            disabled={loading} // Deshabilitar si hay una carga en progreso
            variant={metodoPago === "EFECTIVO" ? "contained" : "outlined"}
            onClick={() => {
              setMetodoPago("EFECTIVO");
              setCantidadPagada(getTotalSelected());
            }}
          >
            Efectivo
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Button
            id="debito-btn"
            sx={{ height: "100%" }}
            variant={metodoPago === "DEBITO" ? "contained" : "outlined"}
            onClick={() => {
              setMetodoPago("DEBITO");
              setCantidadPagada(getTotalSelected()); // Establecer el valor de cantidad pagada como grandTotal
            }}
            fullWidth
            disabled={loading} // Deshabilitar si hay una carga en progreso
          >
            Débito
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Button
            sx={{ height: "100%" }}
            id="credito-btn"
            variant={metodoPago === "CREDITO" ? "contained" : "outlined"}
            onClick={() => {
              setMetodoPago("CREDITO");
              setCantidadPagada(getTotalSelected()); // Establecer el valor de cantidad pagada como grandTotal
            }}
            fullWidth
            disabled={loading} // Deshabilitar si hay una carga en progreso
          >
            Crédito
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Button
            id="transferencia-btn"
            fullWidth
            sx={{ height: "100%" }}
            variant={
              metodoPago === "TRANSFERENCIA" ? "contained" : "outlined"
            }
            onClick={() => {
              setMetodoPago("TRANSFERENCIA");
              setCantidadPagada(getTotalSelected()); // Establecer el valor de cantidad pagada como grandTotal
              handleTransferenciaModalOpen(selectedDebts);
            }}
            disabled={loading} // Deshabilitar si hay una carga en progreso
          >
            Transferencia
          </Button>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Button
            sx={{ height: "100%" }}
            variant="contained"
            fullWidth
            color="secondary"
            disabled={!metodoPago || cantidadPagada <= 0 || loading}
            onClick={handlePayment}
          >
            {loading ? (
              <>
                <CircularProgress size={20} /> Procesando...
              </>
            ) : (
              "Pagar"
            )}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClosePaymentProcess} disabled={loading}>Cerrar</Button>
  </DialogActions>
</Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={openTransferenciaModal}
        onClose={handleTransferenciaModalClose}
      >
        <DialogTitle>Transferencia</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              {errorTransferenciaError && (
                <p style={{ color: "red" }}> {errorTransferenciaError}</p>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Nombre
              </InputLabel>
              <TextField
                label="Nombre"
                value={nombre}
                name="nombre"
                onChange={(e) => setNombre(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "nombre")}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa rut sin puntos y con guión
              </InputLabel>
              <TextField
                name="rut"
                label="ej: 11111111-1"
                variant="outlined"
                fullWidth
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "rut")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>Ingresa Banco</InputLabel>
              <TextField
                select
                label="Banco"
                value={selectedBanco}
                onChange={handleBancoChange}
                fullWidth
              >
                {bancosChile.map((banco) => (
                  <MenuItem key={banco.id} value={banco.nombre}>
                    {banco.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Tipo de Cuenta{" "}
              </InputLabel>
              <TextField
                select
                label="Tipo de Cuenta"
                value={tipoCuenta}
                onChange={handleChangeTipoCuenta}
                fullWidth
              >
                {Object.entries(tiposDeCuenta).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Número de Cuenta{" "}
              </InputLabel>
              <TextField
                name="numeroCuenta"
                label="Número de cuenta"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                value={nroCuenta}
                onChange={(e) => setNroCuenta(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "numeroCuenta")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <InputLabel sx={{ marginBottom: "4%" }}>
                  Selecciona Fecha{" "}
                </InputLabel>
                <DatePicker
                  format="DD-MM-YYYY"
                  value={fecha}
                  onChange={(newValue) => {
                    setFecha(newValue);
                  }}
                  minDate={inicioRango}
                  maxDate={hoy}
                  textField={(params) => (
                    <TextField
                      {...params}
                      label="Ingresa Fecha"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {formatFecha(fecha)}
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Numero Operación
              </InputLabel>
              <TextField
                name="numeroCuenta"
                label="Numero Operación"
                variant="outlined"
                type="number"
                fullWidth
                value={nroOperacion}
                onChange={(e) => setNroOperacion(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "numeroCuenta")}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                sx={{ height: "100%" }}
                variant="contained"
                fullWidth
                color="secondary"
                disabled={!metodoPago || cantidadPagada <= 0}
                onClick={handlePayment}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} /> Procesando...
                  </>
                ) : (
                  "Pagar"
                )}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTransferenciaModalClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchListClientes;
