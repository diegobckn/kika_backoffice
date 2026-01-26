import React, { useState, useEffect, useContext } from "react";
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
  Switch,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchListOffers from "./SearchListOfertas";
import Ofertas from "../../Models/Ofertas";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const DialogEditarOferta = ({ open, onClose, ofertaEditar, onOfertaActualizada }) => {
  const { showLoading, hideLoading, showMessage } = useContext(SelectedOptionsContext);

  // Estados del formulario
  const [nombreOferta, setNombreOferta] = useState("");
  const [cantidadOferta, setCantidadOferta] = useState(null);
  const [valorTotalOferta, setValorTotalOferta] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [diasSemana, setDiasSemana] = useState([true, true, true, true, true, true, true]);
  const [ofertaActiva, setOfertaActiva] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [clearSearch, setClearSearch] = useState(false);

  const nombresDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  // Cargar datos de la oferta cuando cambie ofertaEditar o se abra el diálogo
  useEffect(() => {
    if (open && ofertaEditar) {
      cargarDatosOferta();
    }
  }, [open, ofertaEditar]);

  const cargarDatosOferta = () => {
    if (!ofertaEditar) return;

    console.log("========================================");
    console.log("Cargando datos completos de oferta:", ofertaEditar);
    console.log("========================================");

    // Información básica
    setNombreOferta(ofertaEditar.descripcion || "");
    setCantidadOferta(ofertaEditar.oferta_Regla?.cantidad || null);
    setValorTotalOferta(ofertaEditar.oferta_Regla?.valor || null);
    setOfertaActiva(ofertaEditar.activo !== undefined ? ofertaEditar.activo : true);

    // Fechas
    if (ofertaEditar.fechaInicial) {
      const fechaInicio = dayjs(ofertaEditar.fechaInicial);
      setStartDate(fechaInicio);
    }
    if (ofertaEditar.fechaFinal) {
      const fechaFin = dayjs(ofertaEditar.fechaFinal);
      setEndDate(fechaFin);
    }

    // Horas
    if (ofertaEditar.horaInicio && ofertaEditar.horaInicio !== "") {
      const horaInicioParsed = dayjs(ofertaEditar.horaInicio, ["HH:mm:ss", "HH:mm"]);
      setStartTime(horaInicioParsed);
    } else {
      setStartTime(null);
    }
    
    if (ofertaEditar.horaFin && ofertaEditar.horaFin !== "") {
      const horaFinParsed = dayjs(ofertaEditar.horaFin, ["HH:mm:ss", "HH:mm"]);
      setEndTime(horaFinParsed);
    } else {
      setEndTime(null);
    }

    // Días de la semana
    if (ofertaEditar.diasSemana) {
      const diasArray = ofertaEditar.diasSemana.split("").map((dia) => dia === "1");
      setDiasSemana(diasArray);
    }

    // Productos de la canasta
    let productosACargar = [];

    if (ofertaEditar.oferta_ListaCanasta && ofertaEditar.oferta_ListaCanasta.length > 0) {
      console.log("Cargando productos desde oferta_ListaCanasta");
      productosACargar = ofertaEditar.oferta_ListaCanasta.map((item) => ({
        codbarra: item.codbarra,
        descripcionProducto: item.descripcionProducto,
        cantidad: item.cantidad || 0,
        porcDescuento: item.porcDescuento || 0,
        precioVenta: 0,
      }));
    } else if (ofertaEditar.products && ofertaEditar.products.length > 0) {
      console.log("Cargando productos desde products (campo alternativo)");
      productosACargar = ofertaEditar.products.map((item) => ({
        codbarra: item.codbarra,
        descripcionProducto: item.descripcion,
        cantidad: 0,
        porcDescuento: 0,
        precioVenta: 0,
      }));
    }

    console.log("Productos finales cargados:", productosACargar);
    setProductosSeleccionados(productosACargar);
    console.log("========================================");
  };

  const limpiarFormulario = () => {
    setNombreOferta("");
    setCantidadOferta(null);
    setValorTotalOferta(null);
    setStartDate(null);
    setEndDate(null);
    setStartTime(null);
    setEndTime(null);
    setProductosSeleccionados([]);
    setDiasSemana([true, true, true, true, true, true, true]);
    setOfertaActiva(true);
    setClearSearch(prev => !prev);
  };

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
    const yaExiste = productosSeleccionados.some((p) => p.codbarra === producto.codbarra);

    if (yaExiste) {
      showMessage("Este producto ya ha sido agregado");
      return;
    }

    const nuevoProducto = {
      codbarra: producto.codbarra || producto.idProducto?.toString(),
      descripcionProducto: producto.nombre || producto.descripcion,
      cantidad: 0,
      porcDescuento: 0,
      precioVenta: producto.precioVenta || 0,
    };

    setProductosSeleccionados((prev) => [...prev, nuevoProducto]);
    setClearSearch(prev => !prev);
  };

  const handleEliminarProducto = (codbarra) => {
    setProductosSeleccionados((prev) => prev.filter((p) => p.codbarra !== codbarra));
  };

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
    if (!cantidadOferta || cantidadOferta <= 0) {
      showMessage("Debe ingresar una cantidad válida para la oferta");
      return false;
    }
    if (!valorTotalOferta || valorTotalOferta <= 0) {
      showMessage("Debe ingresar un valor total válido para la oferta");
      return false;
    }
    return true;
  };

  const construirObjetoOferta = () => {
    const oferta_ListaCanasta = productosSeleccionados.map((producto) => ({
      codbarra: producto.codbarra,
      descripcionProducto: producto.descripcionProducto,
      cantidad: producto.cantidad || 0,
      porcDescuento: producto.porcDescuento || 0,
    }));

    // Asegurar formato ISO 8601 con zona horaria
    const fechaInicialISO = startDate.toISOString();
    const fechaFinalISO = endDate.toISOString();

    return {
      codigoOferta: ofertaEditar.codigoOferta,
      codigoTipo: ofertaEditar.codigoTipo || 0,
      descripcion: nombreOferta.trim(),
      fechaInicial: fechaInicialISO,
      fechaFinal: fechaFinalISO,
      horaInicio: startTime ? startTime.format("HH:mm") : "",
      horaFin: endTime ? endTime.format("HH:mm") : "",
      diasSemana: convertirDiasAString(diasSemana),
      fAplicaMix: ofertaEditar.fAplicaMix !== undefined ? ofertaEditar.fAplicaMix : true,
      activo: ofertaActiva,
      oferta_Regla: {
        signo: ofertaEditar.oferta_Regla?.signo || "=",
        cantidad: cantidadOferta || 0,
        tipoDescuento: ofertaEditar.oferta_Regla?.tipoDescuento || "$",
        valor: valorTotalOferta || 0,
        aplicacion: ofertaEditar.oferta_Regla?.aplicacion || "",
      },
      oferta_ListaCanasta: oferta_ListaCanasta,
    };
  };

  const handleActualizar = () => {
    if (!validarFormulario()) {
      return;
    }

    const ofertaActualizada = construirObjetoOferta();

    console.log("========================================");
    console.log("Objeto enviado al backend:", JSON.stringify(ofertaActualizada, null, 2));
    console.log("========================================");

    showLoading();

    Ofertas.updateOferta(
      ofertaActualizada,
      (data, response) => {
        console.log("========================================");
        console.log("✅ Respuesta exitosa del backend:", data);
        console.log("Response completo:", response);
        console.log("========================================");
        
        hideLoading();
        showMessage("Oferta actualizada exitosamente");
        
        // Limpiar formulario
        limpiarFormulario();
        
        // Cerrar diálogo
        onClose();
        
        // IMPORTANTE: Ejecutar callback DESPUÉS de cerrar
        // Esto asegura que el componente padre recargue los datos
        if (onOfertaActualizada) {
          console.log("Ejecutando callback onOfertaActualizada...");
          // Usar setTimeout para asegurar que el diálogo se cierre primero
          setTimeout(() => {
            onOfertaActualizada();
          }, 100);
        }
      },
      (error) => {
        console.log("========================================");
        console.error("❌ Error al actualizar oferta:", error);
        console.log("========================================");
        
        hideLoading();
        const mensajeError = error?.message || error?.descripcion || "Error desconocido al actualizar la oferta";
        showMessage(`Error: ${mensajeError}`);
      }
    );
  };

  const handleCerrar = () => {
    limpiarFormulario();
    onClose();
  };

  const handleNumericChange = (setter, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "" || numericValue === "0") {
      setter(null);
    } else {
      setter(parseInt(numericValue));
    }
  };

  return (
    <Dialog open={open} onClose={handleCerrar} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Editar Oferta</Typography>
          {ofertaEditar && (
            <Chip label={`Código: ${ofertaEditar.codigoOferta}`} color="primary" size="small" />
          )}
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Nombre de la oferta */}
          <TextField
            label="Nombre de la Oferta"
            type="text"
            value={nombreOferta}
            onChange={(e) => setNombreOferta(e.target.value)}
            fullWidth
            required
          />

          {/* Buscador de productos */}
          <SearchListOffers
            refresh={refresh}
            setRefresh={setRefresh}
            onProductoSeleccionado={handleProductoSeleccionado}
          />

          {/* Tabla de productos seleccionados */}
          {productosSeleccionados.length > 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Productos Seleccionados ({productosSeleccionados.length})
              </Typography>
              <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                      <TableCell><strong>Código</strong></TableCell>
                      <TableCell><strong>Descripción</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productosSeleccionados.map((producto) => (
                      <TableRow key={producto.codbarra} hover>
                        <TableCell>
                          <Chip label={producto.codbarra} size="small" color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{producto.descripcionProducto}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleEliminarProducto(producto.codbarra)}
                            title="Eliminar producto"
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

          {/* Fechas */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Inicio"
                value={startDate}
                onChange={setStartDate}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Término"
                value={endDate}
                onChange={setEndDate}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </LocalizationProvider>
          </Box>

          {/* Horas */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeField
          label="Hora de Inicio"
          // defaultValue={dayjs('2022-04-17T15:30')}
          format="HH:mm"
          value={startTime}
          onChange={setStartTime}
          slotProps={{ textField: { fullWidth: true } }}
        />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeField
                label="Hora de Término"
                  // defaultValue={dayjs('2022-04-17T15:30')}
          format="HH:mm"
                value={endTime}
                onChange={setEndTime}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>

          {/* Cantidad y Valor */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Ingrese cantidad total de productos para oferta"
              type="text"
              value={cantidadOferta || ""}
              onChange={(e) => handleNumericChange(setCantidadOferta, e.target.value)}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
              fullWidth
              required
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
            <TextField
              label="Valor Total Oferta"
              type="text"
              value={valorTotalOferta || ""}
              onChange={(e) => handleNumericChange(setValorTotalOferta, e.target.value)}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
              fullWidth
              required
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
          </Box>

          {/* Días de la semana */}
          <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, backgroundColor: "#fafafa" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Días de la Semana
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button size="small" variant="outlined" onClick={() => handleTodosLosDias(true)}>
                  Todos
                </Button>
                <Button size="small" variant="outlined" onClick={() => handleTodosLosDias(false)}>
                  Ninguno
                </Button>
              </Box>
            </Box>

            <FormGroup row sx={{ display: "flex", justifyContent: "space-between" }}>
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

          {/* Estado de la oferta (Activo/Inactivo) */}
          <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, backgroundColor: "#fafafa" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Estado de la Oferta
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Define si la oferta estará activa o inactiva
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={ofertaActiva}
                    onChange={(e) => setOfertaActiva(e.target.checked)}
                    color="success"
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {ofertaActiva ? "Activa" : "Inactiva"}
                    </Typography>
                    <Chip
                      label={ofertaActiva ? "ON" : "OFF"}
                      size="small"
                      color={ofertaActiva ? "success" : "default"}
                    />
                  </Box>
                }
                labelPlacement="start"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCerrar} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleActualizar}
          variant="contained"
          color="primary"
          disabled={productosSeleccionados.length === 0}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEditarOferta;