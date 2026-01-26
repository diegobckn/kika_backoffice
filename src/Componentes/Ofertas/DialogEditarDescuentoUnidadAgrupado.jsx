import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Dialog,
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
  Checkbox,
  FormControlLabel,
  FormGroup,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import Ofertas from "../../Models/Ofertas";
import Product from "../../Models/Product";
import SearchListOffers from "./SearchListOfertas";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import PercentIcon from "@mui/icons-material/Percent";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DeleteIcon from "@mui/icons-material/Delete";

const DialogEditarDescuentoUnidad = ({
  open,
  onClose,
  ofertaEditar,
  onOfertaActualizada,
  clearSearch,
}) => {
  const { showLoading, hideLoading, showMessage, showConfirm } = useContext(
    SelectedOptionsContext
  );

  // Estados del formulario de edición
  const [nombreOferta, setNombreOferta] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
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
  const [guardando, setGuardando] = useState(false);
  const [cargandoProducto, setCargandoProducto] = useState(false);
  const [datosCargados, setDatosCargados] = useState(false);

  // Estados para el tipo de descuento
  const [tipoDescuento, setTipoDescuento] = useState("$");
  const [descuentoManual, setDescuentoManual] = useState(0);
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);

  // Estados calculados
  const [totalSinDescuento, setTotalSinDescuento] = useState(0);
  const [totalConDescuento, setTotalConDescuento] = useState(0);
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);

  const nombresDias = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  // Cargar datos de la oferta a editar
  useEffect(() => {
    if (ofertaEditar && open && !datosCargados) {
      console.log("Cargando oferta para editar:", ofertaEditar);
      cargarDatosOferta();
      setDatosCargados(true);
    }
  }, [ofertaEditar, open, datosCargados]);

  // Resetear datos cuando se cierra el diálogo
  useEffect(() => {
    if (!open) {
      setDatosCargados(false);
      setProductoSeleccionado(null);
      setCargandoProducto(false);
    }
  }, [open]);

  // Función para cargar los datos de la oferta
  const cargarDatosOferta = async () => {
    if (!ofertaEditar) return;

    try {
      setCargandoProducto(true);
      showLoading("Cargando datos de la oferta...");
      
      // 1. Cargar datos básicos de la oferta
      setNombreOferta(ofertaEditar.descripcion || "");
      
      // 2. Fechas y horas
      if (ofertaEditar.fechaInicial) {
        setStartDate(dayjs(ofertaEditar.fechaInicial));
      }
      if (ofertaEditar.fechaFinal) {
        setEndDate(dayjs(ofertaEditar.fechaFinal));
      }
      if (ofertaEditar.horaInicio) {
        setStartTime(dayjs(`2000-01-01T${ofertaEditar.horaInicio}`));
      }
      if (ofertaEditar.horaFin) {
        setEndTime(dayjs(`2000-01-01T${ofertaEditar.horaFin}`));
      }

      // 3. Días de la semana
      if (ofertaEditar.diasSemana) {
        const diasArray = ofertaEditar.diasSemana.split("").map((d) => d === "1");
        setDiasSemana(diasArray);
      }

      // 4. Estado activo
      setOfertaActiva(ofertaEditar.activo || true);

      // 5. Cargar producto de la oferta
      await cargarProductoOferta();

    } catch (error) {
      console.error("Error al cargar datos de la oferta:", error);
      showMessage("Error al cargar los datos de la oferta");
    } finally {
      hideLoading();
      setCargandoProducto(false);
    }
  };

  // Función para cargar el producto de la oferta usando el modelo Product
  const cargarProductoOferta = () => {
    return new Promise((resolve) => {
      if (!ofertaEditar) {
        resolve();
        return;
      }

      // Obtener producto de la oferta
      const productoOferta = ofertaEditar.products?.[0] || ofertaEditar.oferta_ListaCanasta?.[0];
      
      if (!productoOferta || !productoOferta.codbarra) {
        showMessage("No se encontró información del producto en la oferta");
        resolve();
        return;
      }

      console.log("Buscando producto con código de barras:", productoOferta.codbarra);

      // Crear instancia del modelo Product
      const productModel = Product.getInstance();
      
      // Usar findByCodigoBarras para obtener el producto
      productModel.findByCodigoBarras(
        { 
          codigoProducto: productoOferta.codbarra, 
          codigoCliente: null 
        },
        (productos, response) => {
          console.log("Productos encontrados:", productos);
          
          let precioProducto = 0;
          let productoData = {};

          if (productos && productos.length > 0) {
            const productoActualizado = productos[0];
            
            // Obtener precio del producto
            precioProducto = Number(productoActualizado.precioVenta || 0);
            
            // Construir objeto del producto con la estructura esperada
            productoData = {
              codbarra: productoActualizado.codbarra || productoOferta.codbarra,
              descripcionProducto: productoActualizado.nombre || 
                                 productoActualizado.descripcion || 
                                 productoOferta.descripcion,
              precioVenta: precioProducto,
              idProducto: productoActualizado.idProducto,
              nombre: productoActualizado.nombre,
              descripcion: productoActualizado.descripcion,
            };
            
            console.log("Producto cargado exitosamente:", productoData);
          } else {
            // Si no se encontró el producto, usar datos de la oferta
            console.warn("No se encontró el producto en el sistema, usando datos de la oferta");
            productoData = {
              codbarra: productoOferta.codbarra,
              descripcionProducto: productoOferta.descripcionProducto || productoOferta.descripcion,
              precioVenta: 0, // No tenemos precio actual
              idProducto: productoOferta.idProducto,
            };
          }
          
          setProductoSeleccionado(productoData);
          
          // Calcular descuentos desde la regla de la oferta
          calcularDescuentosDesdeRegla(precioProducto);
          
          resolve();
        },
        (error) => {
          console.warn("Error al buscar producto:", error);
          // Usar datos de la oferta como fallback
          const productoFallback = {
            codbarra: productoOferta.codbarra,
            descripcionProducto: productoOferta.descripcionProducto || productoOferta.descripcion,
            precioVenta: 0,
            idProducto: productoOferta.idProducto,
          };
          
          setProductoSeleccionado(productoFallback);
          calcularDescuentosDesdeRegla(0);
          resolve();
        }
      );
    });
  };

  // Función para calcular descuentos desde la regla de la oferta
  const calcularDescuentosDesdeRegla = (precioProducto) => {
    const regla = ofertaEditar?.oferta_Regla;
    
    if (!regla) {
      console.log("No hay regla en la oferta");
      setTotalSinDescuento(0);
      setTotalConDescuento(0);
      setDescuentoAplicado(0);
      return;
    }

    console.log("Regla de la oferta:", regla);
    console.log("Precio del producto obtenido:", precioProducto);
    
    // 1. Establecer tipo de descuento desde la regla
    const tipoDescuentoRegla = regla.tipoDescuento || "$";
    console.log("Tipo descuento desde regla:", tipoDescuentoRegla);
    setTipoDescuento(tipoDescuentoRegla);
    
    const valorOferta = regla.valor || 0;
    console.log("Valor de la oferta desde regla:", valorOferta);
    
    if (tipoDescuentoRegla === "$") {
      // Descuento en monto fijo
      if (precioProducto > 0) {
        const descuento = precioProducto - valorOferta;
        console.log("Descuento en pesos calculado:", descuento);
        
        setTotalSinDescuento(precioProducto);
        setTotalConDescuento(valorOferta);
        setDescuentoManual(Math.round(descuento));
        setDescuentoAplicado(Math.round(descuento));
      } else {
        // Si no tenemos precio, intentar obtener de la lista canasta
        const listaCanasta = ofertaEditar.oferta_ListaCanasta?.[0];
        const descuento = listaCanasta?.descuentoMonto || 0;
        
        setTotalSinDescuento(valorOferta + descuento);
        setTotalConDescuento(valorOferta);
        setDescuentoManual(descuento);
        setDescuentoAplicado(descuento);
      }
    } else {
      // Descuento en porcentaje
      console.log("Calculando descuento en porcentaje...");
      
      if (precioProducto > 0 && valorOferta > 0) {
        // Calcular porcentaje basado en precio y valor de oferta
        const porcentajeDescuento = Math.round(100 - ((valorOferta * 100) / precioProducto));
        const descuento = precioProducto - valorOferta;
        
        console.log("Porcentaje calculado:", porcentajeDescuento);
        console.log("Descuento en pesos:", descuento);
        
        setTotalSinDescuento(precioProducto);
        setTotalConDescuento(valorOferta);
        setDescuentoPorcentaje(porcentajeDescuento);
        setDescuentoAplicado(Math.round(descuento));
      } else {
        // Si no tenemos precio, intentar obtener porcentaje de oferta_ListaCanasta
        const listaCanasta = ofertaEditar.oferta_ListaCanasta?.[0];
        const porcentaje = listaCanasta?.porcDescuento || 0;
        
        console.log("Usando porcentaje de lista canasta:", porcentaje);
        
        // Intentar calcular precio original desde el porcentaje y valor
        if (porcentaje > 0 && valorOferta > 0) {
          const precioOriginal = valorOferta / (1 - (porcentaje / 100));
          setTotalSinDescuento(Math.round(precioOriginal));
          setTotalConDescuento(valorOferta);
          setDescuentoPorcentaje(porcentaje);
          setDescuentoAplicado(Math.round(precioOriginal - valorOferta));
        } else {
          setTotalSinDescuento(0);
          setTotalConDescuento(valorOferta);
          setDescuentoPorcentaje(porcentaje);
          setDescuentoAplicado(0);
        }
      }
    }
  };

  // CALCULO PRINCIPAL - Similar al componente de creación
  const calcularTotales = useCallback(() => {
    if (!productoSeleccionado) {
      setTotalSinDescuento(0);
      setTotalConDescuento(0);
      setDescuentoAplicado(0);
      return;
    }

    const totalOriginal = Number(productoSeleccionado.precioVenta || 0);
    setTotalSinDescuento(totalOriginal);

    let descuentoEnPesos = 0;
    
    if (tipoDescuento === "$") {
      descuentoEnPesos = descuentoManual || 0;
    } else {
      descuentoEnPesos = totalOriginal * ((descuentoPorcentaje || 0) / 100);
    }
    
    descuentoEnPesos = Math.round(descuentoEnPesos);
    setDescuentoAplicado(descuentoEnPesos);

    const totalConDescuentoCalculado = totalOriginal - descuentoEnPesos;
    const totalFinal = Math.max(0, totalConDescuentoCalculado);
    setTotalConDescuento(totalFinal);
  }, [productoSeleccionado, descuentoManual, descuentoPorcentaje, tipoDescuento]);

  // Ejecutar cálculo cuando cambien las dependencias
  useEffect(() => {
    calcularTotales();
  }, [calcularTotales]);

  // Funciones auxiliares
  const convertirDiasAString = (diasArray) => {
    return diasArray.map((dia) => (dia ? "1" : "0")).join("");
  };

  const handleDiaChange = (index) => {
    const nuevosDias = [...diasSemana];
    nuevosDias[index] = !nuevosDias[index];
    setDiasSemana(nuevosDias);
  };

  const handleTodosLosDias = (seleccionar) => {
    setDiasSemana(new Array(7).fill(seleccionar));
  };

  const handleProductoSeleccionado = (producto) => {
    const nuevoProducto = {
      codbarra: producto.codbarra || producto.idProducto?.toString(),
      descripcionProducto: producto.nombre || producto.descripcion,
      precioVenta: Number(producto.precioVenta || 0),
      idProducto: producto.idProducto,
    };

    console.log("Nuevo producto seleccionado:", nuevoProducto);
    setProductoSeleccionado(nuevoProducto);
    // Resetear descuentos al cambiar producto
    if (tipoDescuento === "$") {
      setDescuentoManual(0);
    } else {
      setDescuentoPorcentaje(0);
    }
  };

  const handleEliminarProducto = () => {
    setProductoSeleccionado(null);
    setDescuentoManual(0);
    setDescuentoPorcentaje(0);
  };

  const handleTipoDescuentoChange = (event, newTipo) => {
    if (newTipo !== null) {
      setTipoDescuento(newTipo);
      // Resetear valores al cambiar tipo
      if (newTipo === "$") {
        setDescuentoPorcentaje(0);
      } else {
        setDescuentoManual(0);
      }
    }
  };

  const handleDescuentoManualChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue === "" || numericValue === "0") {
      setDescuentoManual(0);
    } else {
      const descuento = parseInt(numericValue, 10);
      if (descuento > totalSinDescuento) {
        showMessage("El descuento no puede ser mayor al total del producto");
        setDescuentoManual(totalSinDescuento);
      } else {
        setDescuentoManual(descuento);
      }
    }
  };

  const handleDescuentoPorcentajeChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue === "" || numericValue === "0") {
      setDescuentoPorcentaje(0);
    } else {
      let porcentaje = parseInt(numericValue, 10);
      if (porcentaje > 100) {
        showMessage("El porcentaje no puede ser mayor a 100%");
        porcentaje = 100;
      }
      setDescuentoPorcentaje(porcentaje);
    }
  };

  const validarFormulario = () => {
    if (!productoSeleccionado) {
      showMessage("Debe seleccionar un producto");
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
    
    if (endDate.isBefore(startDate, 'day')) {
      showMessage("La fecha de término no puede ser anterior a la fecha de inicio");
      return false;
    }
    
    if (startDate.isSame(endDate, 'day')) {
      if (endTime.isBefore(startTime)) {
        showMessage("La hora de término no puede ser anterior a la hora de inicio");
        return false;
      }
    }

    const totalOriginal = Number(productoSeleccionado.precioVenta || 0);

    if (totalOriginal <= 0) {
      showMessage("El total del producto debe ser mayor que 0");
      return false;
    }

    if (tipoDescuento === "$") {
      if (descuentoManual < 0) {
        showMessage("El descuento no puede ser negativo");
        return false;
      }

      if (descuentoManual >= totalOriginal) {
        showMessage("El descuento debe ser menor al total del producto");
        return false;
      }
    } else {
      if (descuentoPorcentaje < 0) {
        showMessage("El porcentaje no puede ser negativo");
        return false;
      }

      if (descuentoPorcentaje > 100) {
        showMessage("El porcentaje no puede ser mayor a 100%");
        return false;
      }
    }

    return true;
  };

  const handleGuardar = () => {
    if (guardando) return;
    
    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);
    showLoading("Actualizando oferta...");

    // Preparar lista para enviar al backend
    const listaParaEnviar = [{
      codbarra: productoSeleccionado.codbarra,
      descripcionProducto: productoSeleccionado.descripcionProducto,
      cantidad: 1,
      porcDescuento: tipoDescuento === "%" ? descuentoPorcentaje : 0,
      descuentoMonto: tipoDescuento === "$" ? descuentoManual : 0,
      idProducto: productoSeleccionado.idProducto,
    }];

    // Construir el objeto de la oferta actualizada
    const ofertaActualizada = {
      codigoOferta: ofertaEditar.codigoOferta,
      codigoTipo: 4,
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
        cantidad: 1,
        tipoDescuento: tipoDescuento,
        valor: totalConDescuento,
        aplicacion: "Total",
      },
      oferta_ListaCanasta: listaParaEnviar,
    };

    console.log("Enviando oferta actualizada:", ofertaActualizada);

    Ofertas.updateOferta(
      ofertaActualizada,
      (data, response) => {
        hideLoading();
        setGuardando(false);
        showMessage("Oferta actualizada exitosamente");
        if (onOfertaActualizada) {
          onOfertaActualizada();
        }
        handleClose();
      },
      (error) => {
        hideLoading();
        setGuardando(false);
        console.error("Error al actualizar oferta:", error);
        const mensajeError =
          error?.message || 
          error?.descripcion || 
          error?.response?.data?.message || 
          "Error desconocido";
        showMessage(`Error al actualizar la oferta: ${mensajeError}`);
      }
    );
  };

  const handleClose = () => {
    // Limpiar estados al cerrar
    setGuardando(false);
    setCargandoProducto(false);
    setDatosCargados(false);
    setProductoSeleccionado(null);
    onClose();
  };

  const formatCLP = (n) => {
    if (n == null || isNaN(n)) return "$0";
    return `$${n.toLocaleString("es-CL")}`;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Editar Descuento Producto Unidad
        {ofertaEditar && (
          <Typography variant="caption" display="block" color="textSecondary">
            Código: {ofertaEditar.codigoOferta}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {cargandoProducto ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
              <CircularProgress size={30} sx={{ mr: 2 }} />
              <Typography variant="body1">
                Cargando datos de la oferta...
              </Typography>
            </Box>
          ) : (
            <>
              <TextField
                label="Nombre de la Oferta"
                type="text"
                value={nombreOferta}
                onChange={(e) => setNombreOferta(e.target.value)}
                fullWidth
                required
              />

              {/* Componente de búsqueda de productos */}
              <SearchListOffers
                refresh={clearSearch}
                setRefresh={() => {}}
                onProductoSeleccionado={handleProductoSeleccionado}
                clearSearch={clearSearch}
                productoActual={productoSeleccionado}
              />

              {/* Mostrar producto seleccionado */}
              {productoSeleccionado ? (
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
                  <Typography variant="h6">Producto Seleccionado</Typography>

                  {/* Tabla de producto único */}
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
                        <TableRow hover>
                          <TableCell>
                            <Chip
                              label={productoSeleccionado.codbarra}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {productoSeleccionado.descripcionProducto}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {formatCLP(productoSeleccionado.precioVenta)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={handleEliminarProducto}
                              title="Eliminar"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Campos de entrada para valores con selector de tipo de descuento */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                    {/* Selector de tipo de descuento */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="body1" fontWeight="medium">
                        Tipo de descuento:
                      </Typography>
                      <ToggleButtonGroup
                        value={tipoDescuento}
                        exclusive
                        onChange={handleTipoDescuentoChange}
                        aria-label="tipo de descuento"
                        size="small"
                        color="primary"
                      >
                        <ToggleButton value="$" aria-label="pesos" color="secondary">
                          <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
                          Pesos
                        </ToggleButton>
                        <ToggleButton value="%" aria-label="porcentaje" color="secondary">
                          <PercentIcon fontSize="small" sx={{ mr: 1 }} />
                          Porcentaje
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>

                    {/* Campos de valores */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        label="Valor actual (Precio producto)"
                        value={formatCLP(totalSinDescuento)}
                        fullWidth
                        helperText="Precio del producto"
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                      
                      {/* Campo de descuento dinámico según tipo seleccionado */}
                      {tipoDescuento === "$" ? (
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
                      ) : (
                        <TextField
                          label="Descuento aplicado *"
                          type="text"
                          value={descuentoPorcentaje || ""}
                          onChange={(e) => handleDescuentoPorcentajeChange(e.target.value)}
                          fullWidth
                          helperText="Ingrese el descuento en porcentaje"
                          error={descuentoPorcentaje > 100}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">%</InputAdornment>
                            ),
                          }}
                        />
                      )}
                      
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

                    {/* Información del descuento aplicado */}
                    {descuentoAplicado > 0 && (
                      <Box sx={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: 1,
                        p: 1.5,
                        backgroundColor: tipoDescuento === "$" ? "#e8f5e9" : "#e3f2fd",
                        borderRadius: 1,
                        border: `1px solid ${tipoDescuento === "$" ? "#c8e6c9" : "#bbdefb"}`,
                      }}>
                        <Typography variant="body2" fontWeight="medium">
                          Resumen del descuento:
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                          <Typography variant="body2">
                            {tipoDescuento === "$" 
                              ? `Descuento fijo: ${formatCLP(descuentoManual)}`
                              : `Porcentaje aplicado: ${descuentoPorcentaje}%`
                            }
                          </Typography>
                          <Typography variant="body2" color="primary" fontWeight="bold">
                            Descuento total: {formatCLP(descuentoAplicado)}
                          </Typography>
                          {tipoDescuento === "%" && (
                            <Typography variant="caption" color="text.secondary">
                              ({formatCLP(descuentoAplicado)} de {formatCLP(totalSinDescuento)})
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No hay producto seleccionado. Use el buscador para seleccionar un producto.
                </Alert>
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

              {/* Estado de la oferta */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={ofertaActiva}
                    onChange={(e) => setOfertaActiva(e.target.checked)}
                    color="primary"
                  />
                }
                label="Oferta activa"
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={guardando}>
          Cancelar
        </Button>
        <Button
          onClick={handleGuardar}
          variant="contained"
          color="primary"
          disabled={!productoSeleccionado || guardando || cargandoProducto}
        >
          {guardando ? "Actualizando..." : "Actualizar Oferta"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEditarDescuentoUnidad;