import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Avatar,
  TextField,
  CircularProgress,
  Snackbar,
  Checkbox,
  IconButton,
  Collapse,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SideBar from "../Componentes/NavBar/SideBar";
import axios from "axios";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ModelConfig from "../Models/ModelConfig";

const ReportesClientes = () => {
  const apiUrl = ModelConfig.get().urlBase; 
  const [proveedores, setProveedores] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState([]);
  const [openPagar, setOpenPagar] = useState(false);
  const [groupedProveedores, setGroupedProveedores] = useState([]);
  
  const [openPaymentProcess, setOpenPaymentProcess] = useState(false);
  const [openPaymentGroupProcess, setOpenPaymentGroupProcess] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [paymentOrigin, setPaymentOrigin] = useState(null);
  const [montoAPagar, setMontoAPagar] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  const [openGroups, setOpenGroups] = useState({});

  const [selectedItem, setSelectedItem] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const handleDetailOpen = (item) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedItem(null);
  };

  const [order, setOrder] = useState({
    field: "",
    direction: "asc",
  });

  const [sortedProveedores, setSortedProveedores] = useState([]);
  // const [documentCountsByRut, setDocumentCountsByRut] = useState({});

  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);
  const [openTransferenciaModal2, setOpenTransferenciaModal2] = useState(false);

  const [openChequeModal, setOpenChequeModal] = useState(false);
  const [errorTransferenciaError, setTransferenciaError] = useState("");
  const [errorTransferenciaError2, setTransferenciaError2] = useState("");
  const [fecha, setFecha] = useState(dayjs());
  const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre
  const [rut, setRut] = useState(""); // Estado para almacenar el rut
  const [nroCuenta, setNroCuenta] = useState(""); // Estado para almacenar el número de cuenta
  const [nroOperacion, setNroOperacion] = useState(""); // Estado para almacenar el número de operación
  const [selectedBanco, setSelectedBanco] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState("");
  const [nroDocumento, setNroDocumento] = useState("");
  const [serieCheque, setSerieCheque] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/ReporteClientes/GetAllClientesDeudas`
      );
      // "https://www.easyposdev.somee.com/api/ReporteClientes/GetAllClientesDeudas"
      setProveedores(response.data.clienteDeudaAlls);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchClientes();
    }, 3000); // Fetch users every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     fetchProveedores();
  //   }, 3000); // Fetch users every 3 seconds

  //   return () => clearInterval(intervalId); // Cleanup interval on component unmount
  // }, []);

  const handleClickOpen = (proveedor) => {
    setSelectedProveedor(proveedor);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProveedor(null);
  };

  const handlePagarOpen = (rut) => {
    const filteredProveedores = proveedores.filter(
      (proveedor) => proveedor.rut === rut
    );
    setGroupedProveedores(filteredProveedores);
    setOpenPagar(true);
  };

  const handlePagarClose = () => {
    setOpenPagar(false);
    setGroupedProveedores([]);
  };

  const handleOpenPaymentProcess = () => {
    setError("");

    setMontoAPagar(selectedItem.total);
    setCantidadPagada(selectedItem.total);

    console.log(montoAPagar);

    // Resetear la cantidad pagada al abrir el diálogo
    setMetodoPago("");
    setOpenPaymentProcess(true);
  };
  const handleClosePaymentProcess = () => {
    setOpenPaymentProcess(false);
  };
  const handleOpenGroupPaymentProcess = () => {
    setError("");

    setMontoAPagar(selectedTotal);
    setCantidadPagada(selectedTotal);

    console.log(montoAPagar);

    // Resetear la cantidad pagada al abrir el diálogo
    setMetodoPago("");
    setOpenPaymentGroupProcess(true);
  };
  const handleClosePaymentGroupProcess = () => {
    setOpenPaymentGroupProcess(false);
  };

  

  const getTotalSelected = () => {
    if (paymentOrigin === "detalleProveedor" && selectedProveedor) {
      return selectedProveedor.total;
    } else {
      return groupedProveedores.reduce(
        (acc, proveedor) => acc + proveedor.total,
        0
      );
    }
  };
  const calcularVuelto = () => {
    return metodoPago === "EFECTIVO" && cantidadPagada > montoAPagar
      ? cantidadPagada - montoAPagar
      : 0;
  };

  const handleIndividualPayment = async () => {
    try {
      setLoading(true);

      let endpoint = "";
      let requestBody = {};

      switch (metodoPago) {
        case "TRANSFERENCIA":
          endpoint =
          `${apiUrl}/Clientes/PostClientePagarDeudaTransferenciaByIdCliente`;

          // if (
          //   nombre === "" ||
          //   rut === "" ||
          //   selectedBanco === "" ||
          //   tipoCuenta === "" ||
          //   nroCuenta === "" ||
          //   nroOperacion === ""
          // ) {
          //   setTransferenciaError(
          //     "Por favor, completa todos los campos necesarios para la transferencia."
          //   );
          //   setLoading(false);
          //   return;
          // }
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

          requestBody = {
            deudaIds: [
              {
                idCuentaCorriente: selectedItem.id.toString(),
                idCabecera: selectedItem.idCabecera.toString(),
                total: selectedItem.total.toString(),
              },
            ],
            montoPagado: montoAPagar,
            metodoPago: metodoPago,
            idUsuario: 0,
            transferencias: {
              idCuentaCorrientePago: selectedItem.id.toString(),
              nombre: nombre,
              rut: rut,
              banco: selectedBanco,
              tipoCuenta: tipoCuenta,
              nroCuenta: nroCuenta,
              fecha: fecha,
              nroOperacion: nroOperacion,
            },
          };
          break;

        case "CHEQUE":
          endpoint =
            `${apiUrl}Clientes/PostClientePagarDeudaChequeByIdCliente`;

          requestBody = {
            deudaIds: [
              {
                idCuentaCorriente: selectedItem.id.toString(),
                idCabecera: selectedItem.idCabecera.toString(),
                total: selectedItem.total.toString(),
              },
            ],
            montoPagado: montoAPagar,
            metodoPago: metodoPago,
            idUsuario: 0,
            // Add cheque-specific fields here if needed
          };
          break;

        case "EFECTIVO":
          endpoint =
          `${apiUrl}/Clientes/PostClientePagarDeudaByIdCliente`;

          requestBody = {
            deudaIds: [
              {
                idCuentaCorriente: selectedItem.id.toString(),
                idCabecera: selectedItem.idCabecera.toString(),
                total: selectedItem.total.toString(),
              },
            ],
            montoPagado: montoAPagar,
            metodoPago: metodoPago,
            idUsuario: 0,
            // Add cash-specific fields here if needed
          };
          break;
      }

      console.log("Request BodyDETALLE:", requestBody);

      const response = await axios.post(endpoint, requestBody);

      console.log("Response:", response.data);
      console.log("ResponseStatus:", response.data.statusCode);

      if (response.data.statusCode === 200) {
        setSnackbarOpen(true);
        setSnackbarMessage(response.data.descripcion);
        handleClosePaymentProcess();
        setCantidadPagada(0);
        fetchClientes();
        handleDetailClose();
        handleTransferenciaModalClose();

        setNombre("")
        setRut("")
        setSelectedBanco("")
        setTipoCuenta("")
        setNroCuenta("")
       
        setNroOperacion("")

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


 

  const totalGeneral = proveedores.reduce(
    (acc, proveedor) => acc + proveedor.total,
    0
  );

  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = groupedProveedores.map((proveedor) => proveedor.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (event, id) => {
    if (event.target.checked) {
      setSelectedIds((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedIds((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
    }
  };

  const selectedTotal = groupedProveedores
    .filter((proveedor) => selectedIds.includes(proveedor.id))
    .reduce((total, proveedor) => total + proveedor.total, 0);

  const [cantidadPagada, setCantidadPagada] = useState(selectedTotal || 0);

  const allSelected = selectedIds.length === groupedProveedores.length;

  // Función ORDENAMIENTO DE DATOS //////

  //////Transferencias//////
  const handleTransferenciaModalOpen = () => {
    setMetodoPago("TRANSFERENCIA");
    setError("");
    setTransferenciaError("");

    setOpenTransferenciaModal(true);
  };
  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
  };
  const handleTransferenciaModalOpen2 = () => {
    setMetodoPago("TRANSFERENCIA");
    setError("");
    setTransferenciaError2("");

    setOpenTransferenciaModal2(true);
  };
  const handleTransferenciaModalClose2 = () => {
    setOpenTransferenciaModal2(false);
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
  const validarRutChileno = (rut) => {
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) {
      return false;
    }

    const partesRut = rut.split("-");
    const digitoVerificador = partesRut[1].toUpperCase();
    const numeroRut = partesRut[0];

    if (numeroRut.length < 7) {
      return false;
    }

    const calcularDigitoVerificador = (T) => {
      let M = 0;
      let S = 1;
      for (; T; T = Math.floor(T / 10)) {
        S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
      }
      return S ? String(S - 1) : "K";
    };

    return calcularDigitoVerificador(numeroRut) === digitoVerificador;
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      let endpoint =
        "https://www.easypos.somee.com/api/Clientes/PostClientePagarDeudaByIdCliente";

      let requestBody = {};

      if (metodoPago === "TRANSFERENCIA") {
        endpoint =
          "https://www.easypos.somee.com/api/Clientes/PostClientePagarDeudaTransferenciaByIdCliente";

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

        if (!validarRutChileno(rut)) {
          setTransferenciaError("El RUT ingresado NO es válido.");
          setLoading(false);
          return;
        }

        requestBody = {
          montoPagado: montoAPagar,
          metodoPago: metodoPago,
          idUsuario: 0,
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
      } else if (metodoPago === "CHEQUE") {
        endpoint =
          "https://www.easyposdev.somee.com/api/Clientes/PostClientePagarDeudaChequeByIdCliente";
        requestBody = {
          montoPagado: montoAPagar,
          metodoPago: metodoPago,
          idUsuario: 0,
          cheque: {
            idCuentaCorrientePago: 0,
            nombre: nombre,
            numeroCheque: nroOperacion, // Assuming this is where the cheque number goes
            fecha: fecha,
          },
        };
      } else if (metodoPago === "EFECTIVO") {
        endpoint =
        `${apiUrl}/Clientes/PostClientePagarDeudaEfectivoByIdCliente`;
        requestBody = {
          montoPagado: montoAPagar,
          metodoPago: metodoPago,
          idUsuario: 0,
          efectivo: {
            idCuentaCorrientePago: 0,
            fecha: fecha,
          },
        };
      } else {
        if (!metodoPago) {
          setError("Por favor, selecciona un método de pago.");
          setLoading(false);
          return;
        } else setError("");
        requestBody = {
          montoPagado: montoAPagar,
          metodoPago: metodoPago,
          idUsuario: 0,
        };
      }

      let deudaIds = [];
      let idCuentaCorrientePago = 0;

      if (paymentOrigin === "detalle" && selectedItem) {
        // Pago individual
        deudaIds = [
          {
            idCuentaCorriente: selectedItem.id,
            idCabecera: selectedItem.idCabecera,
            total: selectedItem.total,
          },
        ];
        idCuentaCorrientePago = selectedItem.id;
      } else {
        // Pago agrupado
        const selectedDeudas = proveedores.filter((deuda) => deuda.selected);
        if (selectedDeudas.length === 0) {
          setError("Por favor, selecciona al menos una deuda para pagar.");
          setLoading(false);
          return;
        }
        deudaIds = selectedDeudas.map((deuda) => ({
          idCuentaCorriente: deuda.id,
          idCabecera: deuda.idCabecera,
          total: deuda.total,
        }));
        idCuentaCorrientePago =
          deudaIds.length > 0 ? deudaIds[0].idCuentaCorriente : 0;
      }

      // Añadir deudaIds al cuerpo de la solicitud para todos los métodos de pago
      requestBody.deudaIds = deudaIds;

      console.log("Request Body antes de enviar:", requestBody);

      const response = await axios.post(endpoint, requestBody);

      console.log("Response:", response.data);
      console.log("ResponseStatus:", response.data.statusCode);
      ///acciones post pago////
      if (response.data.statusCode === 200) {
        setSnackbarOpen(true);
        setSnackbarMessage(response.data.descripcion);
        handleClosePaymentProcess();
        handleClosePaymentGroupProcess();
        setCantidadPagada(0);
        fetchClientes();
        handleDetailClose();
    


        setTimeout(() => {
          handleClosePaymentGroupProcess();
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


  const handleGroupedPayment = async () => {
    try {
      setLoading(true);
  
      let endpoint =
      `${apiUrl}/Clientes/PostClientePagarDeudaByIdCliente`;
  
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
  
        if (!validarRutChileno(rut)) {
          setTransferenciaError("El RUT ingresado NO es válido.");
          setLoading(false);
          return;
        }
      }
  
      if (!metodoPago) {
        setError("Por favor, selecciona un método de pago.");
        setLoading(false);
        return;
      } else setError("");
  
      const selectedDeudas = groupedProveedores.filter((deuda) => selectedIds.includes(deuda.id));
      if (selectedDeudas.length === 0) {
        setError("Por favor, selecciona al menos una deuda para pagar.");
        setLoading(false);
        return;
      }
  
      const deudaIds = selectedDeudas.map((deuda) => ({
        idCuentaCorriente: deuda.id,
        idCabecera: deuda.idCabecera,
        total: deuda.total,
      }));
  
      const requestBody = {
        deudaIds: deudaIds,
        montoPagado: montoAPagar,
        metodoPago: metodoPago,
        idUsuario: 0,
        transferencias: metodoPago === "TRANSFERENCIA" ? {
          idCuentaCorrientePago: deudaIds.length > 0 ? deudaIds[0].idCuentaCorriente : 0,
          nombre: nombre,
          rut: rut,
          banco: selectedBanco,
          tipoCuenta: tipoCuenta,
          nroCuenta: nroCuenta,
          fecha: fecha,
          nroOperacion: nroOperacion,
        } : null,
      };
  
      console.log("Request Body:", requestBody);
  
      const response = await axios.post(endpoint, requestBody);
  
      console.log("Response:", response.data);
      console.log("ResponseStatus:", response.data.statusCode);
  
      if (response.data.statusCode === 200) {
        setSnackbarOpen(true);
        setSnackbarMessage(response.data.descripcion);
        handleClosePaymentProcess();
        setCantidadPagada(0);
        fetchClientes();
        handleDetailClose();
        handleTransferenciaModalClose2();
        handleClosePaymentGroupProcess();
        handlePagarClose();
  
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
  
  

  const compareRut = (a, b) => {
    if (!a || !b) return 0;
    return a.localeCompare(b);
  };

  const compareNumerical = (a, b) => {
    return a - b;
  };
  const compareDate = (a, b) => {
    return new Date(a) - new Date(b);
  };

  const handleSort = (field) => {
    const isAsc = order.field === field && order.direction === "asc";
    setOrder({ field, direction: isAsc ? "desc" : "asc" });
  };

  const sortData = (array, field, direction) => {
    const sortedArray = [...array];
    sortedArray.sort((a, b) => {
      let comparison = 0;
      if (field === "rut") {
        comparison = compareRut(a.rut, b.rut);
      } else if (field === "folio" || field === "total") {
        comparison = compareNumerical(parseInt(a[field]), parseInt(b[field]));
      } else if (field === "fecha") {
        comparison = compareDate(a.fechaIngreso, b.fechaIngreso);
      } else {
        comparison = a[field] > b[field] ? 1 : -1;
      }
      return direction === "asc" ? comparison : -comparison;
    });
    return sortedArray;
  };

  const handleToggle = (rut) => {
    setOpenGroups((prev) => ({
      ...prev,
      [rut]: !prev[rut],
    }));
  };

  const groupedData = proveedores.reduce((acc, item) => {
    if (!acc[item.rut]) {
      acc[item.rut] = [];
    }
    acc[item.rut].push(item);
    return acc;
  }, {});

  const filteredGroupKeys = Object.keys(groupedData).filter((rut) =>
    rut.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedGroupKeys = sortData(filteredGroupKeys, "rut", order.direction);
  // const sortedGroupKeys = sortData(
  //   Object.keys(groupedData),
  //   "rut",
  //   order.direction
  // );

  const handleNumericKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Verifica si el carácter es un número, backspace o delete
    if (
      !/\d/.test(key) && // números
      key !== "Backspace" && // backspace
      key !== "Delete" // delete
    ) {
      event.preventDefault();
    }

    // Previene espacios iniciales y al final de la cadena
    if (key === " " && (input.length === 0 || input.endsWith(" "))) {
      event.preventDefault();
    }
  };

  const handleTextKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Verifica si el carácter es alfanumérico o uno de los caracteres permitidos
    if (
      !/^[a-zA-Z0-9]$/.test(key) && // letras y números
      key !== " " && // espacio
      key !== "Backspace" && // backspace
      key !== "Delete" // delete
    ) {
      event.preventDefault();
    }

    // Previene espacios iniciales y al final de la cadena
    if (key === " " && (input.length === 0 || input.endsWith(" "))) {
      event.preventDefault();
    }
  };
  const handleEmailKeyDown = (event) => {
    const charCode = event.which ? event.which : event.keyCode;

    // Prevenir espacios en cualquier parte del correo
    if (charCode === 32) {
      // 32 es el código de la tecla espacio
      event.preventDefault();
    }
  };
  const handleRUTKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Permitir números (0-9), guion (-), backspace y delete
    if (
      !isNaN(key) || // números
      key === "Backspace" || // backspace
      key === "Delete" || // delete
      (key === "-" && !input.includes("-")) // guion y no hay guion previamente
    ) {
      // Permitir la tecla
    } else {
      // Prevenir cualquier otra tecla
      event.preventDefault();
    }

    // Prevenir espacios iniciales y asegurar que el cursor no esté en la posición inicial
    if (
      key === " " &&
      (input.length === 0 || event.target.selectionStart === 0)
    ) {
      event.preventDefault();
    }
  };

  const handleTextOnlyKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Verifica si el carácter es una letra (mayúscula o minúscula), espacio, backspace o delete
    if (
      !/[a-zA-Z]/.test(key) && // letras mayúsculas y minúsculas
      key !== " " && // espacio
      key !== "Backspace" && // backspace
      key !== "Delete" // delete
    ) {
      event.preventDefault();
    }

    // Previene espacios iniciales y al final de la cadena
    if (key === " " && (input.length === 0 || input.endsWith(" "))) {
      event.preventDefault();
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Grid component="main" sx={{ flexGrow: 1, p: 3 }}>
        <TextField
          label="Buscar por RUT"
          variant="outlined"
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>RUT</TableCell>

                <TableCell>Razon Social</TableCell>
                <TableCell>Documentos</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableCell>
              <strong>Total General:</strong>
              <strong>${totalGeneral.toLocaleString("es-ES")}</strong>
            </TableCell>

            <TableCell></TableCell>
            <TableBody>
              {sortedGroupKeys.map((rut) => (
                <React.Fragment key={rut}>
                  <TableRow>
                    <TableCell>
                      <IconButton onClick={() => handleToggle(rut)}>
                        {openGroups[rut] ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{rut}</TableCell>
                    <TableCell>
                      <strong>{groupedData[rut][0].razonSocial}</strong>
                    </TableCell>
                    <TableCell>
                      Facturas:{" "}
                      {
                        groupedData[rut].filter(
                          (item) => item.descripcionComprobante === "Factura"
                        ).length
                      }
                      <br />
                      Boletas:{" "}
                      {
                        groupedData[rut].filter(
                          (item) => item.descripcionComprobante === "Boleta"
                        ).length
                      }
                      <br />
                      Tickets:{" "}
                      {
                        groupedData[rut].filter(
                          (item) => item.descripcionComprobante === "Ticket"
                        ).length
                      }
                    </TableCell>
                    <TableCell>
                      $
                      {groupedData[rut]
                        .reduce((sum, item) => sum + item.total, 0)
                        .toLocaleString("es-ES")}
                    </TableCell>
                    <TableCell>
                      <Button
                        sx={{ width: "80%" }}
                        variant="contained"
                        color="secondary"
                        onClick={() => handlePagarOpen(rut)}
                      >
                        Pagar
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                    >
                      <Collapse
                        in={openGroups[rut]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Razon Social</TableCell>
                                <TableCell>Tipo Documento</TableCell>
                                <TableCell
                                  onClick={() => handleSort("nroComprobante")}
                                >
                                  Folio
                                  <ArrowUpwardIcon
                                    fontSize="small"
                                    style={{
                                      color:
                                        order.field === "nroComprobante" &&
                                        order.direction === "asc"
                                          ? "black"
                                          : "dimgrey",
                                    }}
                                  />
                                  <ArrowDownwardIcon
                                    fontSize="small"
                                    style={{
                                      color:
                                        order.field === "nroComprobante" &&
                                        order.direction === "desc"
                                          ? "black"
                                          : "dimgrey",
                                    }}
                                  />
                                </TableCell>
                                <TableCell onClick={() => handleSort("fecha")}>
                                  Fecha
                                  <ArrowUpwardIcon
                                    fontSize="small"
                                    style={{
                                      color:
                                        order.field === "fecha" &&
                                        order.direction === "asc"
                                          ? "black"
                                          : "dimgrey",
                                    }}
                                  />
                                  <ArrowDownwardIcon
                                    fontSize="small"
                                    style={{
                                      color:
                                        order.field === "fecha" &&
                                        order.direction === "desc"
                                          ? "black"
                                          : "dimgrey",
                                    }}
                                  />
                                </TableCell>
                                <TableCell onClick={() => handleSort("total")}>
                                  Total
                                  <ArrowUpwardIcon
                                    fontSize="small"
                                    style={{
                                      color:
                                        order.field === "total" &&
                                        order.direction === "asc"
                                          ? "black"
                                          : "dimgrey",
                                    }}
                                  />
                                  <ArrowDownwardIcon
                                    fontSize="small"
                                    style={{
                                      color:
                                        order.field === "total" &&
                                        order.direction === "desc"
                                          ? "black"
                                          : "dimgrey",
                                    }}
                                  />
                                </TableCell>

                                <TableCell>Acciones</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {sortData(
                                groupedData[rut],
                                order.field,
                                order.direction
                              ).map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.razonSocial}</TableCell>
                                  <TableCell>
                                    {item.descripcionComprobante}
                                  </TableCell>
                                  <TableCell>{item.nroComprobante}</TableCell>
                                  <TableCell>
                                    {new Date(item.fecha).toLocaleDateString(
                                      "es-CL"
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    ${item.total.toLocaleString("es-CL")}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="contained"
                                      onClick={() => handleDetailOpen(item)}
                                    >
                                      Detalle
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Dialog
        open={detailOpen}
        onClose={handleDetailClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalles del Cliente</DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <div>
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
                      ID: {selectedItem.razonSocial}
                      <br />
                      {selectedItem.rut}
                    </Typography>
                  </Box>
                  <Grid item xs={12}></Grid>
                </Box>
              </Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha de ingreso</TableCell>
                      <TableCell>Tipo de documento</TableCell>
                      <TableCell>Folio</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {dayjs(selectedItem.fecha).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell>
                        {selectedItem.descripcionComprobante}
                      </TableCell>
                      <TableCell>{selectedItem.nroComprobante}</TableCell>
                      <TableCell>${selectedItem.total}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="h6" style={{ marginTop: "16px" }}>
                Detalles de Compra:
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Precio Unidad</TableCell>
                      <TableCell>Costo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedItem.clienteVentaDetalles &&
                      selectedItem.clienteVentaDetalles.map((detalle) => (
                        <TableRow key={detalle.codProducto}>
                          <TableCell>{detalle.descripcionProducto}</TableCell>
                          <TableCell>{detalle.cantidad}</TableCell>
                          <TableCell>{detalle.precioUnidad}</TableCell>
                          <TableCell>${detalle.costo}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography variant="h6">
                  Total Deuda : ${selectedItem.total}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  // onClick={handleOpenPaymentProcess}
                  onClick={() => handleOpenPaymentProcess()}
                >
                  Pagar Total $ ({selectedItem.total})
                </Button>
              </Box>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPagar}
        onClose={handlePagarClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Pagos del Cliente</DialogTitle>
        <DialogContent dividers>
          {groupedProveedores.length > 0 && (
            <div>
              <Typography variant="h6">
                Proveedor: {groupedProveedores[0].razonSocial}
              </Typography>
              <Typography variant="subtitle1">
                RUT: {groupedProveedores[0].rut}
              </Typography>
              <Typography variant="h6" style={{ marginTop: "16px" }}>
                Compras:
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            selectedIds.length > 0 &&
                            selectedIds.length < groupedProveedores.length
                          }
                          checked={allSelected}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>Tipo Documento</TableCell>
                      <TableCell>Folio</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedProveedores.map((proveedor) => (
                      <TableRow key={proveedor.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedIds.includes(proveedor.id)}
                            onChange={(event) =>
                              handleSelectOne(event, proveedor.id)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {proveedor.descripcionComprobante}
                        </TableCell>
                        <TableCell>{proveedor.nroComprobante}</TableCell>
                        <TableCell>
                          {dayjs(proveedor.fecha).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell> ${proveedor.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography variant="h6">
                  Total Deuda : {selectedTotal}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={
                    handleOpenGroupPaymentProcess
                  }
                >
                  Pagar Total ${selectedTotal}
                </Button>
              </Box>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePagarClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPaymentGroupProcess} onClose={handleClosePaymentProcess}>
        <DialogTitle>Procesamiento de Pagos Grupales</DialogTitle>
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
                // value={getTotalSelected()}
                value={montoAPagar.toLocaleString("es-CL")}
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
                value={cantidadPagada.toLocaleString("es-CL")}
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
                value={Math.max(0, montoAPagar - cantidadPagada).toLocaleString(
                  "es-CL"
                )}
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
                    setCantidadPagada(
                      paymentOrigin === "detalleProveedor"
                        ? selectedProveedor.total
                        : groupedProveedores.reduce(
                            (acc, proveedor) => acc + proveedor.total,
                            0
                          )
                    );
                    handleChequeModalOpen();
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
                    handleTransferenciaModalOpen2();
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
                  disabled={!metodoPago || loading}
                  // onClick={handlePayment}
                  onClick={handleGroupedPayment}
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
          <Button onClick={handleClosePaymentGroupProcess} disabled={loading}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openPaymentProcess} onClose={handleClosePaymentProcess}>
        <DialogTitle>Procesamiento de Pago Detalle</DialogTitle>
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
                // value={getTotalSelected()}
                value={montoAPagar.toLocaleString("es-CL")}
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
                value={cantidadPagada.toLocaleString("es-CL")}
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
                value={Math.max(0, montoAPagar - cantidadPagada).toLocaleString(
                  "es-CL"
                )}
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
                    setCantidadPagada(
                      paymentOrigin === "detalleProveedor"
                        ? selectedProveedor.total
                        : groupedProveedores.reduce(
                            (acc, proveedor) => acc + proveedor.total,
                            0
                          )
                    );
                    handleChequeModalOpen();
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
                    handleTransferenciaModalOpen();
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
                  disabled={!metodoPago || loading}
                  // onClick={handlePayment}
                  onClick={handleIndividualPayment}
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
                onKeyDown={handleTextOnlyKeyDown}
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
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: "12",
                }}
                value={nroCuenta}
                onChange={(e) => setNroCuenta(e.target.value)}
                onKeyDown={handleNumericKeyDown}
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
                fullWidth
                value={nroOperacion}
                onKeyDown={handleNumericKeyDown}
                onChange={(e) => setNroOperacion(e.target.value)}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: "12",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                sx={{ height: "100%" }}
                variant="contained"
                fullWidth
                color="secondary"
                disabled={!metodoPago || loading}
                onClick={handleIndividualPayment}
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
        open={openTransferenciaModal2}
        onClose={handleTransferenciaModalClose2}
      >
        <DialogTitle>Transferencia 2</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              {errorTransferenciaError && (
                <p style={{ color: "red" }}> {errorTransferenciaError2}</p>
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
                onKeyDown={handleTextOnlyKeyDown}
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
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: "12",
                }}
                value={nroCuenta}
                onChange={(e) => setNroCuenta(e.target.value)}
                onKeyDown={handleNumericKeyDown}
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
                fullWidth
                value={nroOperacion}
                onKeyDown={handleNumericKeyDown}
                onChange={(e) => setNroOperacion(e.target.value)}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: "12",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                sx={{ height: "100%" }}
                variant="contained"
                fullWidth
                color="secondary"
                disabled={!metodoPago || loading}
                onClick={handleGroupedPayment}
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
          <Button onClick={handleTransferenciaModalClose2}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openChequeModal} onClose={handleChequeModalClose}>
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
                Ingresa Número de Cuentaa{" "}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default ReportesClientes;
