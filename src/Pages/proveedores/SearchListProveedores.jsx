/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
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
import EditarProveedor from "../../Componentes/Proveedores/EditarProveedor"; // Assuming you have this component
import PaymentsIcon from "@mui/icons-material/Payments";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ModelConfig from "../../Models/ModelConfig";
import FormularioProveedor from "./FormularioProveedor";

const ITEMS_PER_PAGE = 10;

const SearchListProveedores = ({
  doReload
}) => {
  const apiUrl = ModelConfig.get().urlBase;

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermProveedores, setSearchTermProveedores] = useState(""); // Separate state for proveedores search
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editProveedorData, setEditProveedorData] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageProveedores, setPageProveedores] = useState([]);
  const [isEditSuccessful, setIsEditSuccessful] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedProvedoor, setSelectedProvedoor] = useState("");
  const [proveedorCompras, setProveedorCompras] = useState([]);
  const [montoPagado, setMontoPagado] = useState("");
  const [forceUpdate, setForceUpdate] = useState(false);
  const [ventaData, setVentaData] = useState([]);
  const [codigoProveedor, setCodigoProveedor] = useState("");
  const [proveedorData, setProveedorData] = useState(null);
  const [selectedDebts, setSelectedDebts] = useState([]);
  const [deudaData, setDeudaData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [cantidadPagada, setCantidadPagada] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProveedorToDelete, setSelectedProveedorToDelete] =
    useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openPaymentProcess, setOpenPaymentProcess] = useState(false);
  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);
  const [openChequeModal, setOpenChequeModal] = useState(false);
  const [errorTransferenciaError, setTransferenciaError] = useState("");
  const [fecha, setFecha] = useState(dayjs());
  const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre
  const [rut, setRut] = useState(""); // Estado para almacenar el rut
  const [nroCuenta, setNroCuenta] = useState(""); // Estado para almacenar el número de cuenta
  const [nroOperacion, setNroOperacion] = useState(""); // Estado para almacenar el número de operación
  const [selectedBanco, setSelectedBanco] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState("");
  const [nroDocumento, setNroDocumento] = useState("");
  const [serieCheque, setSerieCheque] = useState("");


  const handleCheckboxChange = (index) => {
    const updatedProveedorData = proveedorData.map((compra, i) =>
      i === index ? { ...compra, selected: !compra.selected } : compra
    );
    setProveedorData(updatedProveedorData);

    const selectedIds = updatedProveedorData
      .filter((compra) => compra.selected)
      .map((compra) => compra.id);
    setSelectedItems(selectedIds);

    const totalSelected = getTotalSelected(updatedProveedorData);
    setTotalGeneral(totalSelected);
    setSelectedDebts(updatedProveedorData.filter((compra) => compra.selected));
  };
  const calcularVuelto = () => {
    const cambio = cantidadPagada - totalGeneral;
    return cambio > 0 ? cambio : 0;
  };
  const totalDeuda = ventaData
    ? ventaData.reduce((total, deuda) => total + deuda.total, 0)
    : 0;

  const calculateTotal = () => {
    let total = 0;
    if (proveedorData) {
      proveedorData.forEach((compra) => {
        const monto = parseFloat(compra.total);
        if (!isNaN(monto)) {
          total += monto;
        }
      });
    }
    return total;
  };
  const totalCompleto = calculateTotal();

  const getTotalSelected = (proveedorData) => {
    let total = 0;
    // Check if proveedorData is not null or undefined and is an array
    if (Array.isArray(proveedorData)) {
      proveedorData.forEach((compra) => {
        if (compra.selected) {
          total += parseFloat(compra.total);
        }
      });
    }
    return total;
  };

  useEffect(() => {
    const total = getTotalSelected(proveedorData);
    setTotalGeneral(total);
  }, [proveedorData]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if (proveedores) {
      console.log("proveedores")
      console.log(proveedores)
      const filtered = proveedores.filter((proveedor) =>
        proveedor.nombreResponsable.toLowerCase().includes(searchTermProveedores.toLowerCase()) ||
        proveedor.rut.toLowerCase().includes(searchTermProveedores.toLowerCase())
      );
      setPageProveedores(
        filtered.slice(
          ITEMS_PER_PAGE * (currentPage - 1),
          ITEMS_PER_PAGE * currentPage
        )
      );
    }
  }, [proveedores, searchTermProveedores, currentPage]);

  async function fetchProveedores() {
    try {
      const response = await axios.get(
        `${apiUrl}/Proveedores/GetAllProveedores`
      );
      console.log("API response:", response.data.proveedores);
      setProveedores(response.data.proveedores);
      setFilteredProveedores(response.data.proveedores.slice(0, ITEMS_PER_PAGE));
      setPageCount(Math.ceil(response.data.proveedores.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProveedores();
  }, [doReload]);

  useEffect(() => {
    fetchProveedores();
    // const intervalId = setInterval(() => {
    //   fetchProveedores();
    // }, 3000); // Fetch providers every 3 seconds

    // return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const provedorSeleccionado = proveedorCompras.filter(
      (compra) => compra.codigoProveedor === selectedProvedoor.codigoProveedor
    );
    setProveedorData(provedorSeleccionado);
  }, [proveedorCompras, selectedProvedoor]);

  const fetchComprasProvedeedor = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/Proveedores/GetProveedorCompra`
      );
      const comprasConSeleccion =
        response.data.proveedorCompra.proveedorCompraCabeceras.map(
          (compra) => ({
            ...compra,
            selected: false,
          })
        );
      setProveedorCompras(comprasConSeleccion);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComprasProvedeedor();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses comienzan desde 0
    const year = date.getFullYear();
    return `${day}-${month < 10 ? "0" + month : month}-${year}`;
  };
  const handlePago = () => {
    if (selectedItems.length === 0) {
      alert("No hay elementos seleccionados para pagar.");
      return;
    }

    const compraDeudaIds = selectedItems.map((id) => {
      const compra = proveedorData.find((c) => c.id === id);
      if (!compra) {
        console.error(`Compra con ID ${id} no encontrada en proveedorData.`);
        return null;
      }
      return {
        idProveedorCompraCabecera: compra.id,
        total: compra.total,
      };
    });

    const validCompraDeudaIds = compraDeudaIds.filter(
      (compra) => compra !== null
    );

    if (validCompraDeudaIds.length === 0) {
      alert("No hay solicitudes de pago válidas para procesar.");
      return;
    }

    const pagoData = {
      fechaIngreso: new Date().toISOString(),
      codigoUsuario: 0,
      codigoSucursal: 0,
      puntoVenta: "string",
      compraDeudaIds: validCompraDeudaIds,
      montoPagado: validCompraDeudaIds.reduce(
        (total, compra) => total + compra.total,
        0
      ),
      metodoPago: metodoPago,
    };

    console.log("Datos antes de ser enviados", pagoData)

    axios
      .post(
        `${apiUrl}/Proveedores/AddProveedorCompraPagar `,
        pagoData
      )
      .then((response) => {
        if (
          response.status === 201 &&
          response.data.descripcion === "Compra pagar realizada con exito."
        ) {
          setSnackbarMessage(response.data.descripcion);
          setSnackbarOpen(true);
          console.log("respuesta 201", response.data.descripcion);

          fetchComprasProvedeedor();

          setSelectAll(false);
          setSelectedItems([]);
          setCantidadPagada(0);
          handleClosePaymentDialog();



          setTimeout(() => {
            handleClosePaymentProcess();
          }, 3000);
        } else {
          setSnackbarMessage(
            "Pago realizado, pero con problemas en la respuesta del servidor"
          );
          setSnackbarOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error realizando el pago:", error);
        setSnackbarMessage("Error realizando el pago");
        setSnackbarOpen(true);
      });
  };

  useEffect(() => {
    setProveedores(); // Initial fetch of sub-families
  }, [refresh]);
  ///////Codigo de busqueda
  useEffect(() => {
    if (Array.isArray(proveedores)) {
      const filtered = proveedores.filter((proveedor) =>
        proveedor.razonSocial.toLowerCase().includes(searchTermProveedores.toLowerCase()) ||
        proveedor.rut.toLowerCase().includes(searchTermProveedores.toLowerCase())
      );
      setPageProveedores(filtered.slice(0, ITEMS_PER_PAGE));
      setPageCount(filtered.length);
      setCurrentPage(1);
    }
  }, [searchTermProveedores, proveedores]);
  const handleSearchProveedores = (event) => {
    setSearchTermProveedores(event.target.value);
  };

  const handleEdit = (proveedor) => {
    setEditProveedorData(proveedor);
    setOpenEditModal(true);
    setIsEditSuccessful(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setRefresh((prevRefresh) => !prevRefresh);
  };

  const setPageCount = (proveedoresCount) => {
    setTotalPages(Math.ceil(proveedoresCount / ITEMS_PER_PAGE));
  };
  const updatePageData = () => {
    if (proveedores) {
      setFilteredProveedores(
        proveedores.slice(
          ITEMS_PER_PAGE * (currentPage - 1),
          ITEMS_PER_PAGE * currentPage
        )
      );
    }
  };
  useEffect(() => {
    updatePageData();
  }, [proveedores, searchTerm, currentPage, filteredProveedores]);

  useEffect(() => {
    if (isEditSuccessful) {
      setOpenEditModal(false); // Close the modal on successful edit
      setIsEditSuccessful(false); // Reset success state
    }
  }, [isEditSuccessful]);

  const onEditSuccess = () => {
    setIsEditSuccessful(true);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenPaymentDialog = (provedoor) => {
    setSelectedProvedoor(provedoor);
    setOpenPaymentDialog(true);
    console.log("selectedProveedor:", provedoor);
    // Filtrar los datos de proveedorCompras según el código de proveedor seleccionado
    const provedorSeleccionado = proveedorCompras.filter(
      (compra) => compra.codigoProveedor === provedoor.codigoProveedor
    );
    console.log("Proveedor Compras Filtrados:", provedorSeleccionado);
    setProveedorData(provedorSeleccionado);
    console.log("proveedorData..", proveedorData);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
  };
  const handleDeleteDialogOpen = (proveedor) => {
    setSelectedProveedorToDelete(proveedor);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  // Handle delete action
  const handleDelete = async () => {
    try {
      const codigoProveedor = selectedProveedorToDelete.codigoProveedor;
      await axios.delete(
        `${apiUrl}/Proveedores/DeleteProveedorByCodigo?CodigoProveedor=${codigoProveedor}`
      );
      setRefresh((prevRefresh) => !prevRefresh);
      fetchProveedores();
      setOpenDeleteDialog(false);
      setSnackbarOpen(true);
      setSnackbarMessage("Proveedor eliminado con éxito");
    } catch (error) {
      console.error("Error eliminando el proveedor:", error);
      alert("Error eliminando el proveedor");
    }
  };
  const resetDeudaData = () => {
    const resetData = deudaData.map((deuda) => ({
      ...deuda,
      selected: false,
    }));
    setDeudaData(resetData);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const updatedProveedorData = proveedorData.map((compra) => ({
      ...compra,
      selected: newSelectAll,
    }));
    setProveedorData(updatedProveedorData);

    const totalSelected = getTotalSelected(updatedProveedorData);
    setTotalGeneral(totalSelected);
    setSelectedDebts(newSelectAll ? updatedProveedorData : []);
  };

  const handleOpenPaymentProcess = () => {
    const totalSelected = getTotalSelected(proveedorData);
    setCantidadPagada(totalSelected); // Ensure cantidadPagada is set to the selected total
    setMetodoPago("");
    setOpenPaymentProcess(true);
    setError("");
  };

  const handleClosePaymentProcess = () => {
    setOpenPaymentProcess(false);
  };

  const handleTransferenciaModalOpen = () => {
    setMetodoPago("TRANSFERENCIA"); // Establece el método de pago como "Transferencia"
    setOpenTransferenciaModal(true);
    setCantidadPagada(getTotalSelected());
  };
  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
  };
  const handleChequeModalOpen = () => {
    setMetodoPago("CHEQUE"); // Establece el método de pago como "Transferencia"
    setOpenChequeModal(true);
    setCantidadPagada(getTotalSelected());
  };
  const handleChequeModalClose = () => {

    setOpenChequeModal(false);

  };

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

  const handlePayment = async () => {
    try {
      setLoading(true);

      let endpoint =
        `${apiUrl}/Clientes/PostClientePagarDeudaByIdCliente`

      if (metodoPago === "TRANSFERENCIA") {
        endpoint =
          `${apiUrl}/Clientes/PostClientePagarDeudaTransferenciaByIdCliente`;

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

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <div>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Proovedores" />
          {/* <Tab label="Clientes" /> */}
        </Tabs>
        <div style={{ p: 2, mt: 4 }} role="tabpanel" hidden={selectedTab !== 0}>
          <TextField
            label="Buscar..."
            value={searchTermProveedores}
            onChange={handleSearchProveedores}
            margin="dense"
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Proveedor</TableCell>
                <TableCell>Razón Social</TableCell>

                <TableCell>Responsable</TableCell>
                <TableCell>Sucursal</TableCell>
                <TableCell>Forma de pago</TableCell>
                <TableCell>Página</TableCell>

                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageProveedores?.map((proveedor, index) => (
                <TableRow key={proveedor.codigoProveedor}>
                  <TableCell>{proveedor.codigoProveedor}</TableCell>
                  <TableCell>
                    {proveedor.razonSocial} <br />
                    <span style={{ color: "purple" }}>{proveedor.email}</span>
                    {proveedor.correo}
                    <br />
                    {proveedor.rut}
                  </TableCell>

                  <TableCell>
                    {proveedor.nombreResponsable}
                    <br />
                    {proveedor.correoResponsable}
                    <br />
                    {proveedor.telefonoResponsable}
                    <br />
                  </TableCell>
                  <TableCell>
                    {proveedor.sucursal}
                    <br />
                    {proveedor.direccion}
                    <br />
                    {proveedor.comuna}
                    <br />
                  </TableCell>
                  <TableCell>{proveedor.formaPago}</TableCell>
                  <TableCell>{proveedor.pagina}</TableCell>

                  <TableCell>
                    <IconButton onClick={() => {
                      proveedor.index = index
                      handleEdit(proveedor)
                    }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteDialogOpen(proveedor)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenPaymentDialog(proveedor)}
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
      {/* <EditarProveedor
        open={openEditModal}
        handleClose={handleCloseEditModal}
        proveedor={editProveedorData}
        fetchProveedores={setProveedores}
        onEditSuccess={() => {
          fetchProveedores()

          setIsEditSuccessful(true)
        }
        } // New addition
      /> */}




      {openEditModal && (
        <FormularioProveedor
          openDialog={openEditModal}
          setOpenDialog={setOpenEditModal}
          proveedorToEdit={editProveedorData}
          onClose={handleCloseEditModal}
          onFinish={() => {
            fetchProveedores()
            setIsEditSuccessful(true)
          }} />
      )}


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={openPaymentDialog} onClose={handleClosePaymentDialog}>
        <DialogTitle>Pago Cuenta Proveedores</DialogTitle>
        <DialogContent>
          {selectedProvedoor && (
            <Grid container spacing={2}>
              <Grid item xs={12}></Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Paper>
                  <Box
                    display="flex"
                    p={1.5}
                    gap={2}
                    bgcolor={"#f5f5f5"}
                    borderRadius={1}
                    sx={{ alignItems: "center" }}
                  >
                    <Box>
                      <Avatar sx={{ borderRadius: 3, width: 48, height: 48 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: "#696c6f" }}>
                        ID: {selectedProvedoor.razonSocial}
                        <br />
                        {selectedProvedoor.rut}
                      </Typography>
                    </Box>
                    <Grid item xs={12}></Grid>
                  </Box>
                </Paper>
                {selectedProvedoor && (
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
                          <TableCell>Fecha de ingreso</TableCell>
                          <TableCell>Tipo de documento</TableCell>
                          <TableCell>Folio</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {proveedorData &&
                          proveedorData.map((compra, index) => (
                            <TableRow key={compra.id}>
                              <TableCell>
                                <Checkbox
                                  checked={compra.selected || false}
                                  onChange={() => handleCheckboxChange(index)}
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell>
                                {formatDate(compra.fechaIngreso)}
                              </TableCell>
                              <TableCell>{compra.tipoDocumento}</TableCell>
                              <TableCell>{compra.folio}</TableCell>
                              <TableCell>{compra.total}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                      {/* Mostrar el total de la deuda y el botón de pago */}
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <Typography>
                            Total Deuda : ${totalCompleto}
                          </Typography>
                        </TableCell>
                        <TableCell colSpan={3} align="right">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpenPaymentProcess}
                            disabled={totalGeneral === 0}
                          >
                            Pagar Total Seleccionado (${totalGeneral})
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
                value={totalGeneral}
                // value={getTotalSelected()}
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
                  }}
                >
                  Efectivo
                </Button>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <Button
                  sx={{ height: "100%" }}
                  id="credito-btn"
                  variant={metodoPago === "CHEQUE" ? "contained" : "outlined"}
                  onClick={() => {
                    setMetodoPago("CHEQUE");
                    setCantidadPagada(getTotalSelected());
                    handleChequeModalOpen(selectedDebts);
                  }}
                  fullWidth
                  disabled={loading} // Deshabilitar si hay una carga en progreso
                >
                  CHEQUE
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
                  onClick={handlePago}
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
          <Button onClick={handleClosePaymentProcess} disabled={loading}>
            Cerrar
          </Button>
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

      <Dialog
        open={openChequeModal}
        onClose={handleChequeModalClose}
      >
        <DialogTitle>Cheque</DialogTitle>
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
                Ingresa Serie de Cheque
              </InputLabel>
              <TextField
                name="numeroCuenta"
                label="Serie de  Cheque"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                value={serieCheque}
                onChange={(e) => setSerieCheque(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "numeroCuenta")}
              />
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
                Ingresa Numero Documento
              </InputLabel>
              <TextField
                name="numeroDocumento"
                label="Numero Documento"
                variant="outlined"
                type="number"
                fullWidth
                value={nroDocumento}
                onChange={(e) => setNroDocumento(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "numeroDocumento")}
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
          <Button onClick={handleChequeModalClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchListProveedores;
