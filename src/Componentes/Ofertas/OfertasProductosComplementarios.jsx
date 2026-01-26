import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import Ofertas from "../../Models/Ofertas";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { InputAdornment } from "@mui/material";
import SearchListOffers from "./SearchListOfertas";
import DialogEditarOfertaComplementarias from "./DialogEditarOfertaComplementarias";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const OfertaProductosComplementarios = ({ onClose, tipoOferta = 2 }) => {
  const { showLoading, hideLoading, showMessage, showConfirm } = useContext(
    SelectedOptionsContext
  );

  // Estados del formulario de creación
  const [refresh, setRefresh] = useState(false);
  const [nombreOferta, setNombreOferta] = useState("");
  const [cantidadOferta, setCantidadOferta] = useState(null);
  const [valorTotalOferta, setValorTotalOferta] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [diasSemana, setDiasSemana] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  const [ofertaActiva, setOfertaActiva] = useState(true);
  const [clearSearch, setClearSearch] = useState(false);
  const [ofertasFiltradas, setOfertasFiltradas] = useState([]);
  const [guardando, setGuardando] = useState(false); // Nuevo estado para controlar el envío

  // Estados calculados / visuales - NUEVA LÓGICA
  const [totalSinDescuento, setTotalSinDescuento] = useState(0);
  const [descuentoManual, setDescuentoManual] = useState(0); // NUEVO: Descuento ingresado manualmente
  const [totalConDescuento, setTotalConDescuento] = useState(0);

  // Estados para la lista de ofertas
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para el diálogo de edición
  const [dialogEditarOpen, setDialogEditarOpen] = useState(false);
  const [ofertaParaEditar, setOfertaParaEditar] = useState(null);
  const nombresDias = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  // Cargar ofertas al montar el componente y cuando refresh cambie
  useEffect(() => {
    loadOfertas();
  }, [refresh]);

  useEffect(() => {
    if (ofertas.length > 0) {
      const filtradas = ofertas.filter(
        (oferta) => oferta.codigoTipo === tipoOferta
      );
      setOfertasFiltradas(filtradas);
    } else {
      setOfertasFiltradas([]);
    }
  }, [ofertas, tipoOferta]);

  // Efecto de limpieza al desmontar
  useEffect(() => {
    return () => {
      setGuardando(false);
    };
  }, []);

  // CALCULO PRINCIPAL - NUEVA LÓGICA MANUAL
  const calcularTotales = useCallback(() => {
    console.log("=== INICIANDO CÁLCULO MANUAL ===");
    console.log("Productos:", productosSeleccionados);
    console.log("Descuento manual:", descuentoManual);

    if (productosSeleccionados.length === 0) {
      console.log("No hay productos, reseteando valores");
      setTotalSinDescuento(0);
      setTotalConDescuento(0);
      setDescuentoManual(0);
      return;
    }

    // 1) Calcular total sin descuento (SUMA de todos los precios)
    const totalOriginal = productosSeleccionados.reduce(
      (sum, p) => sum + Number(p.precioVenta || 0),
      0
    );
    console.log("Total original calculado:", totalOriginal);
    setTotalSinDescuento(totalOriginal);

    // 2) Calcular total con descuento manual
    const totalConDescuentoCalculado = totalOriginal - descuentoManual;
    console.log("Total con descuento:", totalConDescuentoCalculado);

    setTotalConDescuento(totalConDescuentoCalculado);

    // 3) Actualizar valorTotalOferta (que será el total con descuento)
    setValorTotalOferta(totalConDescuentoCalculado);
  }, [productosSeleccionados, descuentoManual]);

  // Ejecutar cálculo cuando cambien las dependencias
  useEffect(() => {
    calcularTotales();
  }, [calcularTotales]);

  /** * Carga todas las ofertas desde el backend */
  const loadOfertas = () => {
    setLoading(true);
    setError(null);
    console.log("Cargando ofertas...");

    Ofertas.getAllOfertas(
      (data, response) => {
        console.log("Ofertas cargadas:", data.length);
        setOfertas(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error al cargar ofertas:", error);
        setError("Error al cargar las ofertas");
        setLoading(false);
      }
    );
  };

  /** * Convierte array de booleanos a string de días (ej: [true,false,...] -> "1011111") */
  const convertirDiasAString = (diasArray) => {
    return diasArray.map((dia) => (dia ? "1" : "0")).join("");
  };

  /** * Maneja el cambio de selección de un día específico */
  const handleDiaChange = (index) => {
    const nuevosDias = [...diasSemana];
    nuevosDias[index] = !nuevosDias[index];
    setDiasSemana(nuevosDias);
  };

  /** * Selecciona o deselecciona todos los días de la semana */
  const handleTodosLosDias = (seleccionar) => {
    setDiasSemana(new Array(7).fill(seleccionar));
  };

  /** * Agrega un producto a la lista de productos seleccionados */
  const handleProductoSeleccionado = (producto) => {
    const yaExiste = productosSeleccionados.some(
      (p) => p.codbarra === producto.codbarra
    );
    if (yaExiste) {
      showMessage("Este producto ya ha sido agregado");
      return;
    }

    const nuevoProducto = {
      codbarra: producto.codbarra || producto.idProducto?.toString(),
      descripcionProducto: producto.nombre || producto.descripcion,
      cantidad: 1,
      precioVenta: Number(producto.precioVenta || 0),
    };

    console.log("Agregando nuevo producto:", nuevoProducto);
    setProductosSeleccionados((prev) => [...prev, nuevoProducto]);
    setClearSearch((prev) => !prev);
  };

  /** * Elimina un producto de la lista de productos seleccionados */
  const handleEliminarProducto = (codbarra) => {
    console.log("Eliminando producto:", codbarra);
    setProductosSeleccionados((prev) =>
      prev.filter((p) => p.codbarra !== codbarra)
    );
  };

  /** * Maneja el cambio del descuento manual */
  const handleDescuentoManualChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue === "" || numericValue === "0") {
      setDescuentoManual(0);
    } else {
      const descuento = parseInt(numericValue, 10);
      // Validar que el descuento no sea mayor al total
      if (descuento > totalSinDescuento) {
        showMessage(
          "El descuento no puede ser mayor al total de los productos"
        );
        setDescuentoManual(totalSinDescuento);
      } else {
        setDescuentoManual(descuento);
      }
    }
  };

  /** * Valida que todos los campos obligatorios estén completos */
  const validarFormulario = () => {
    if (productosSeleccionados.length === 0) {
      showMessage("Debe seleccionar al menos un producto");
      return false;
    }

    if (!nombreOferta.trim()) {
      showMessage("Debe ingresar un nombre para la oferta");
      return false;
    }

    if (!startDate || !endDate) {
      showMessage("Debe seleccionar las fechas de inicio y término");
      return false;
    }

    if (!startTime || !endTime) {
      showMessage("Debe seleccionar la hora de inicio y término");
      return false;
    }

    // Validar que fecha final no sea anterior a fecha inicial
    if (endDate.isBefore(startDate, "day")) {
      showMessage(
        "La fecha de término no puede ser anterior a la fecha de inicio"
      );
      return false;
    }

    // Validar horas si están en el mismo día
    if (startDate.isSame(endDate, "day")) {
      if (endTime.isBefore(startTime)) {
        showMessage(
          "La hora de término no puede ser anterior a la hora de inicio"
        );
        return false;
      }
    }

    const totalOriginal = productosSeleccionados.reduce(
      (sum, p) => sum + Number(p.precioVenta || 0),
      0
    );

    if (totalOriginal <= 0) {
      showMessage("El total de los productos debe ser mayor que 0");
      return false;
    }

    if (descuentoManual < 0) {
      showMessage("El descuento no puede ser negativo");
      return false;
    }

    if (descuentoManual >= totalOriginal) {
      showMessage("El descuento debe ser menor al total de los productos");
      return false;
    }

    return true;
  };

  /** * Guarda una nueva oferta */
  const handleGuardar = () => {
    if (guardando) return; // Evitar múltiples clics

    if (!validarFormulario()) {
      return;
    }

    setGuardando(true); // Bloquear botón
    showLoading();

    // Calcular valores actualizados
    const totalOriginal = productosSeleccionados.reduce(
      (sum, p) => sum + Number(p.precioVenta || 0),
      0
    );
    const totalConDescuentoCalculado = totalOriginal - descuentoManual;

    // Preparar lista para enviar al backend
    const listaParaEnviar = productosSeleccionados.map((p) => ({
      codbarra: p.codbarra,
      descripcionProducto: p.descripcionProducto,
      cantidad: 1,
      porcDescuento: 0,
    }));

    // Construir el objeto de la oferta - CORREGIDO
    const nuevaOferta = {
      codigoTipo: tipoOferta,
      descripcion: nombreOferta.trim(),
      fechaInicial: startDate ? startDate.toISOString() : null,
      fechaFinal: endDate ? endDate.toISOString() : null,
      horaInicio: startTime ? startTime.format("HH:mm") : null,
      horaFin: endTime ? endTime.format("HH:mm") : null,
      diasSemana: convertirDiasAString(diasSemana),
      fAplicaMix: true,
      activo: ofertaActiva,
      oferta_Regla: {
        signo: "=",
        cantidad: productosSeleccionados.length ,
        tipoDescuento: "$",
        valor: totalConDescuentoCalculado,
        aplicacion: "Total", // Agrega este campo
      },
      oferta_ListaCanasta: listaParaEnviar,
    };

    console.log("Enviando oferta:", nuevaOferta);

    Ofertas.addOferta(
      nuevaOferta,
      (data, response) => {
        hideLoading();
        setGuardando(false);
        showMessage("Oferta creada exitosamente");
        setRefresh(!refresh);
        limpiarFormulario();
      },
      (error) => {
        hideLoading();
        setGuardando(false);
        console.error("Error al guardar oferta:", error);
        const mensajeError =
          error?.message ||
          error?.descripcion ||
          error?.response?.data?.message ||
          "Error desconocido";
        showMessage(`Error al guardar la oferta: ${mensajeError}`);
      }
    );
  };

  /** * Limpia todos los campos del formulario de creación */
  const limpiarFormulario = () => {
    setNombreOferta("");
    setCantidadOferta(null);
    setValorTotalOferta(null);
    setDescuentoManual(0);
    setStartDate(null);
    setEndDate(null);
    setStartTime(null);
    setEndTime(null);
    setProductosSeleccionados([]);
    setTotalSinDescuento(0);
    setTotalConDescuento(0);
    setDiasSemana([true, true, true, true, true, true, true]);
    setOfertaActiva(true);
    setClearSearch((prev) => !prev);
    setGuardando(false); // Resetear estado de guardado
  };

  /** * Maneja cambios en campos numéricos */
  const handleNumericChange = (setter, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue === "" || numericValue === "0") {
      setter(null);
    } else {
      setter(parseInt(numericValue, 10));
    }
  };

  // FUNCIONES FALTANTES - AGREGADAS

  /** * Abre el diálogo de edición con los datos de la oferta seleccionada */
  const handleEdit = (oferta) => {
    setOfertaParaEditar(oferta);
    setDialogEditarOpen(true);
  };

  /** * Cierra el diálogo de edición */
  const handleCloseDialogEditar = () => {
    setDialogEditarOpen(false);
    setOfertaParaEditar(null);
  };

  /** * Callback ejecutado cuando se actualiza una oferta exitosamente */
  const handleOfertaActualizada = () => {
    setRefresh(!refresh);
  };

  /** * Elimina una oferta (baja lógica) */
  const handleDelete = (oferta) => {
    if (!oferta || !oferta.codigoOferta) {
      showMessage("Error: No se pudo identificar la oferta a eliminar");
      console.error("Oferta inválida:", oferta);
      return;
    }
    const mensajeConfirmacion = `¿Está seguro de eliminar la oferta "${oferta.descripcion}"?\nCódigo: ${oferta.codigoOferta}`;
    showConfirm(
      mensajeConfirmacion,
      () => {
        showLoading();
        Ofertas.deleteOferta(
          oferta.codigoOferta,
          (data, response) => {
            hideLoading();
            showMessage("Oferta eliminada exitosamente");
            setRefresh(!refresh);
          },
          (error) => {
            hideLoading();
            console.error("Error al eliminar oferta:", error);
            const mensajeError =
              error?.message || error?.descripcion || "Error desconocido";
            showMessage(`Error al eliminar la oferta: ${mensajeError}`);
          }
        );
      },
      () => {
        console.log("Eliminación cancelada por el usuario");
      }
    );
  };

  // Formateo moneda simple (sin decimales)
  const formatCLP = (n) => {
    if (n == null || isNaN(n)) return "$0";
    return `$${n.toLocaleString("es-CL")}`;
  };

  return (
    <>
      <DialogTitle>Ofertas Producto Complementarios</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {/* Formulario de creación */}
          <TextField
            label="Ingresa nombre Oferta"
            type="text"
            value={nombreOferta}
            onChange={(e) => setNombreOferta(e.target.value)}
            fullWidth
          />

          {/* Componente de búsqueda de productos */}
          <SearchListOffers
            refresh={refresh}
            setRefresh={setRefresh}
            onProductoSeleccionado={handleProductoSeleccionado}
            clearSearch={clearSearch}
          />

             {/* Tabla de productos seleccionados - SIMPLIFICADA */}
             {productosSeleccionados.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Productos Seleccionadoss ({productosSeleccionados.length})
              </Typography>
              <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                      <TableCell>
                        <strong>Código</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Descripción</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Precio Individual</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Acciones</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productosSeleccionados.map((producto) => (
                      <TableRow key={producto.codbarra} hover>
                        <TableCell>
                          <Chip
                            label={producto.codbarra}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {producto.descripcionProducto}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {formatCLP(producto.precioVenta)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleEliminarProducto(producto.codbarra)
                            }
                            title="Eliminar"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* SEGUNDA PARTE: Campos de entrada modificados */}
          {productosSeleccionados.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
              }}
            >
              <Typography variant="h6">Resumen de la Oferta</Typography>

              {/* Campos de entrada para valores */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Valor actual (Total productos)"
                  value={formatCLP(totalSinDescuento)}
                  fullWidth
                  helperText="Suma total de todos los productos"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Descuento aplicado *"
                  type="text"
                  value={descuentoManual || ""}
                  onChange={(e) => handleDescuentoManualChange(e.target.value)}
                  fullWidth
                  helperText="Ingrese el descuento manual en pesos"
                  error={descuentoManual > totalSinDescuento}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Total nuevo"
                  value={formatCLP(totalConDescuento)}
                  fullWidth
                  helperText="Valor final de la oferta"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Box>

              {descuentoManual > 0 && (
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Typography variant="body2" color="primary">
                    Descuento aplicado: {formatCLP(descuentoManual)}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Fechas y Horas */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Inicio"
                value={startDate}
                onChange={setStartDate}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Término"
                value={endDate}
                onChange={setEndDate}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Hora de Inicio"
                format="HH:mm"
                value={startTime}
                onChange={setStartTime}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Hora de Término"
                format="HH:mm"
                value={endTime}
                onChange={setEndTime}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>

          {/* Días de la semana */}
          <Box
            sx={{
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              backgroundColor: "#fafafa",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Días de la Semana
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleTodosLosDias(true)}
                >
                  Todos
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleTodosLosDias(false)}
                >
                  Ninguno
                </Button>
              </Box>
            </Box>
            <FormGroup
              row
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              {nombresDias.map((dia, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={diasSemana[index]}
                      onChange={() => handleDiaChange(index)}
                      color="primary"
                    />
                  }
                  label={dia}
                />
              ))}
            </FormGroup>
          </Box>

       

          {/* Resto del código de la tabla de ofertas existentes... */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Todas las Ofertas
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : ofertasFiltradas.length > 0 ? (
              <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell>
                        <strong>Código oferta</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Descripción</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Productos</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Cantidad</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Valor oferta</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Vigencia</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Estado</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Acciones</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ofertasFiltradas.map((oferta, index) => (
                      <TableRow
                        key={oferta.codigoOferta || index}
                        hover
                        sx={{
                          backgroundColor: oferta.bajaLogica
                            ? "#ffebee"
                            : "inherit",
                          opacity: oferta.bajaLogica ? 0.6 : 1,
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {oferta.codigoOferta}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {oferta.descripcion}
                          </Typography>
                          {oferta.codigoTipo && (
                            <Chip
                              label={`Tipo ${oferta.codigoTipo}`}
                              size="small"
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {oferta.products && oferta.products.length > 0 ? (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                              }}
                            >
                              {oferta.products.map((prod, idx) => (
                                <Typography
                                  key={idx}
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  {prod.descripcion}
                                </Typography>
                              ))}
                            </Box>
                          ) : (
                            <Chip
                              label="Sin productos"
                              size="small"
                              color="default"
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {oferta.oferta_Regla && (
                            <Typography
                              variant="body2"
                              color="secondary"
                              fontWeight="bold"
                            >
                              {oferta.oferta_Regla.cantidad}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {oferta.oferta_Regla && (
                            <Typography
                              variant="body2"
                              color="secondary"
                              fontWeight="bold"
                            >
                              ${oferta.oferta_Regla.valor}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="caption" display="block">
                            {new Date(oferta.fechaInicial).toLocaleDateString(
                              "es-CL"
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            display="block"
                            color="textSecondary"
                          >
                            hasta
                          </Typography>
                          <Typography variant="caption" display="block">
                            {new Date(oferta.fechaFinal).toLocaleDateString(
                              "es-CL"
                            )}
                          </Typography>
                          {oferta.diasSemana &&
                            oferta.diasSemana !== "1111111" && (
                              <Chip
                                label="Días específicos"
                                size="small"
                                sx={{ mt: 0.5, fontSize: "0.7rem" }}
                              />
                            )}
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                              alignItems: "center",
                            }}
                          >
                            <Chip
                              label={oferta.activo ? "Activa" : "Inactiva"}
                              size="small"
                              color={oferta.activo ? "success" : "default"}
                            />
                            {oferta.bajaLogica && (
                              <Chip
                                label="Eliminada"
                                size="small"
                                color="error"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              justifyContent: "center",
                            }}
                          >
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(oferta)}
                              title="Editar"
                              disabled={oferta.bajaLogica}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            {!oferta.bajaLogica && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(oferta)}
                                title="Eliminar"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="textSecondary">
                  No hay ofertas registradas para el tipo {tipoOferta}
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={guardando}>
          Cancelar
        </Button>
        <Button
          onClick={handleGuardar}
          variant="contained"
          disabled={productosSeleccionados.length === 0 || guardando}
        >
          {guardando ? "Guardando..." : "Crear Oferta"}
        </Button>
      </DialogActions>

      {/* Diálogo de edición */}
      <DialogEditarOfertaComplementarias
        open={dialogEditarOpen}
        onClose={handleCloseDialogEditar}
        ofertaEditar={ofertaParaEditar}
        onOfertaActualizada={handleOfertaActualizada}
        clearSearch={clearSearch}
      />
    </>
  );
};

export default OfertaProductosComplementarios;
