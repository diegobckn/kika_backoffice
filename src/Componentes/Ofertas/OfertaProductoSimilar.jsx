
import React, { useState, useEffect, useContext } from "react";
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
  Switch,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { TimeField } from '@mui/x-date-pickers/TimeField';


import dayjs from "dayjs";
import Ofertas from "../../Models/Ofertas";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchListOffers from "./SearchListOfertas";
import DialogEditarOferta from "./DialogEditarOferta";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

/**
 * Componente principal para gestión de ofertas tipo producto similar
 * Permite crear nuevas ofertas y visualizar/editar/eliminar ofertas existentes
 */
const OfertasProductoSimilar = ({ onClose ,tipoOferta = 1  }) => {
  const { showLoading, hideLoading, showMessage, showConfirm } = useContext(SelectedOptionsContext);

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
  const [diasSemana, setDiasSemana] = useState([true, true, true, true, true, true, true]);
  const [ofertaActiva, setOfertaActiva] = useState(true);
  const [clearSearch, setClearSearch] = useState(false);


  const [ofertasFiltradas, setOfertasFiltradas] = useState([]);


  // Estados para la lista de ofertas
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para el diálogo de edición
  const [dialogEditarOpen, setDialogEditarOpen] = useState(false);
  const [ofertaParaEditar, setOfertaParaEditar] = useState(null);

  const nombresDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  // Cargar ofertas al montar el componente y cuando refresh cambie
  useEffect(() => {
    loadOfertas();
  }, [refresh]);

  useEffect(() => {
    if (ofertas.length > 0) {
      const filtradas = ofertas.filter(oferta => oferta.codigoTipo === tipoOferta);
      setOfertasFiltradas(filtradas);
    } else {
      setOfertasFiltradas([]);
    }
  }, [ofertas, tipoOferta]);
  /**
   * Carga todas las ofertas desde el backend
   */
  const loadOfertas = () => {
    setLoading(true);
    setError(null);

    Ofertas.getAllOfertas(
      (data, response) => {
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

  /**
   * Convierte array de booleanos a string de días (ej: [true,false,...] -> "1011111")
   */
  const convertirDiasAString = (diasArray) => {
    return diasArray.map((dia) => (dia ? "1" : "0")).join("");
  };

  /**
   * Maneja el cambio de selección de un día específico
   */
  const handleDiaChange = (index) => {
    const nuevosDias = [...diasSemana];
    nuevosDias[index] = !nuevosDias[index];
    setDiasSemana(nuevosDias);
  };

  /**
   * Selecciona o deselecciona todos los días de la semana
   */
  const handleTodosLosDias = (seleccionar) => {
    setDiasSemana(new Array(7).fill(seleccionar));
  };

  /**
   * Agrega un producto a la lista de productos seleccionados
   */
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

  /**
   * Elimina un producto de la lista de productos seleccionados
   */
  const handleEliminarProducto = (codbarra) => {
    setProductosSeleccionados((prev) => prev.filter((p) => p.codbarra !== codbarra));
  };

  /**
   * Valida que todos los campos obligatorios estén completos
   */
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
      showMessage("Debe ingresar una cantidad válida");
      return false;
    }
    if (!valorTotalOferta || valorTotalOferta <= 0) {
      showMessage("Debe ingresar un valor total válido");
      return false;
    }
    return true;
  };

  /**
   * Guarda una nueva oferta
   */
  const handleGuardar = () => {
    if (!validarFormulario()) {
      return;
    }

    // Preparar la lista de productos sin el campo precioVenta
    const oferta_ListaCanasta = productosSeleccionados.map((producto) => ({
      codbarra: producto.codbarra,
      descripcionProducto: producto.descripcionProducto,
      cantidad: producto.cantidad,
      porcDescuento: producto.porcDescuento,
    }));

    // Construir el objeto de la oferta
    const nuevaOferta = {
      // codigoTipo: 1,
      codigoTipo: tipoOferta,
      descripcion: nombreOferta,
      fechaInicial: startDate.toISOString(),
      fechaFinal: endDate.toISOString(),
      horaInicio: startTime ? startTime.format("HH:mm") : "",
      horaFin: endTime ? endTime.format("HH:mm") : "",
      diasSemana: convertirDiasAString(diasSemana),
      fAplicaMix: true,
      activo: ofertaActiva,
      oferta_Regla: {
        signo: "=",
        cantidad: cantidadOferta,
        tipoDescuento: "$",
        valor: valorTotalOferta,
        aplicacion: "",
      },
      oferta_ListaCanasta: oferta_ListaCanasta,
    };

    console.log("Guardando oferta:", nuevaOferta);
    showLoading();

    Ofertas.addOferta(
      nuevaOferta,
      (data, response) => {
        hideLoading();
        showMessage("Oferta creada exitosamente");
        setRefresh(!refresh);
        limpiarFormulario();
      },
      (error) => {
        hideLoading();
        console.error("Error al guardar oferta:", error);
        const mensajeError = error?.message || error?.descripcion || "Error desconocido";
        showMessage(`Error al guardar la oferta: ${mensajeError}`);
      }
    );
  };

  /**
   * Limpia todos los campos del formulario de creación
   */
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

  /**
   * Abre el diálogo de edición con los datos de la oferta seleccionada
   */
  const handleEdit = (oferta) => {
    setOfertaParaEditar(oferta);
    setDialogEditarOpen(true);
  };

  /**
   * Cierra el diálogo de edición
   */
  const handleCloseDialogEditar = () => {
    setDialogEditarOpen(false);
    setOfertaParaEditar(null);
  };

  /**
   * Callback ejecutado cuando se actualiza una oferta exitosamente
   */
  const handleOfertaActualizada = () => {
    setRefresh(!refresh); // Recargar la lista de ofertas
  };

  /**
   * Elimina una oferta (baja lógica)
   */
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
            const mensajeError = error?.message || error?.descripcion || "Error desconocido";
            showMessage(`Error al eliminar la oferta: ${mensajeError}`);
          }
        );
      },
      () => {
        console.log("Eliminación cancelada por el usuario");
      }
    );
  };

  /**
   * Maneja cambios en campos numéricos
   */
  const handleNumericChange = (setter, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "" || numericValue === "0") {
      setter(null);
    } else {
      setter(parseInt(numericValue));
    }
  };

  return (
    <>
      <DialogTitle>Ofertas Producto Similar</DialogTitle>
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

          {/* Tabla de productos seleccionados */}
          {productosSeleccionados.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Productos Seleccionados ({productosSeleccionados.length})
              </Typography>
              <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                      <TableCell><strong>Código</strong></TableCell>
                      <TableCell><strong>Descripción</strong></TableCell>
                      <TableCell align="center"><strong>Precio de Venta</strong></TableCell>
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
                          <Typography variant="body2">${producto.precioVenta}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleEliminarProducto(producto.codbarra)}
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

          {/* Fechas */}
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

          {/* Horas */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <TimePicker
                label="Hora de Inicio"
                value={startTime}
                onChange={setStartTime}
                slotProps={{ textField: { fullWidth: true } }}
              /> */}
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
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
            <TextField
              label="Valor total oferta"
              type="text"
              value={valorTotalOferta || ""}
              onChange={(e) => handleNumericChange(setValorTotalOferta, e.target.value)}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
              fullWidth
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


          {/* Tabla de ofertas existentes */}
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
                      <TableCell><strong>Código oferta</strong></TableCell>
                      <TableCell><strong>Descripción</strong></TableCell>
                      <TableCell><strong>Productos</strong></TableCell>
                      <TableCell align="center"><strong>Cantidad</strong></TableCell>
                      <TableCell align="center"><strong>Valor oferta</strong></TableCell>
                      <TableCell align="center"><strong>Vigencia</strong></TableCell>
                      <TableCell align="center"><strong>Estado</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* CORREGIDO: Cambiar ofertas por ofertasFiltradas */}
                    {ofertasFiltradas.map((oferta, index) => (
                      <TableRow
                        key={oferta.codigoOferta || index}
                        hover
                        sx={{
                          backgroundColor: oferta.bajaLogica ? "#ffebee" : "inherit",
                          opacity: oferta.bajaLogica ? 0.6 : 1,
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {oferta.codigoOferta}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">{oferta.descripcion}</Typography>
                          {oferta.codigoTipo && (
                            <Chip label={`Tipo ${oferta.codigoTipo}`} size="small" variant="outlined" sx={{ mt: 0.5 }} />
                          )}
                        </TableCell>

                        <TableCell>
                          {oferta.products && oferta.products.length > 0 ? (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                              {oferta.products.map((prod, idx) => (
                                <Typography key={idx} variant="caption" color="textSecondary">
                                  {prod.descripcion}
                                </Typography>
                              ))}
                            </Box>
                          ) : (
                            <Chip label="Sin productos" size="small" color="default" />
                          )}
                        </TableCell>

                        <TableCell align="center">
                          {oferta.oferta_Regla && (
                            <Typography variant="body2" color="secondary" fontWeight="bold">
                              {oferta.oferta_Regla.cantidad}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell align="center">
                          {oferta.oferta_Regla && (
                            <Typography variant="body2" color="secondary" fontWeight="bold">
                              ${oferta.oferta_Regla.valor}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell align="center">
                          <Typography variant="caption" display="block">
                            {new Date(oferta.fechaInicial).toLocaleDateString("es-CL")}
                          </Typography>
                          <Typography variant="caption" display="block" color="textSecondary">
                            hasta
                          </Typography>
                          <Typography variant="caption" display="block">
                            {new Date(oferta.fechaFinal).toLocaleDateString("es-CL")}
                          </Typography>
                          {oferta.diasSemana && oferta.diasSemana !== "1111111" && (
                            <Chip label="Días específicos" size="small" sx={{ mt: 0.5, fontSize: "0.7rem" }} />
                          )}
                        </TableCell>

                        <TableCell align="center">
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, alignItems: "center" }}>
                            <Chip
                              label={oferta.activo ? "Activa" : "Inactiva"}
                              size="small"
                              color={oferta.activo ? "success" : "default"}
                            />
                            {oferta.bajaLogica && (
                              <Chip label="Eliminada" size="small" color="error" variant="outlined" />
                            )}
                          </Box>
                        </TableCell>

                        <TableCell align="center">
                          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
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
            
{/* 
            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" color="textSecondary">
                Total: {ofertas.length} oferta{ofertas.length !== 1 ? "s" : ""}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Activas: {ofertas.filter((o) => !o.bajaLogica && o.activo).length} | Inactivas:{" "}
                {ofertas.filter((o) => !o.bajaLogica && !o.activo).length} | Eliminadas:{" "}
                {ofertas.filter((o) => o.bajaLogica).length}
              </Typography>
            </Box> */}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleGuardar} variant="contained" disabled={productosSeleccionados.length === 0}>
          Crear Oferta
        </Button>
      </DialogActions>

      {/* Diálogo de edición */}
      <DialogEditarOferta
        open={dialogEditarOpen}
        onClose={handleCloseDialogEditar}
        ofertaEditar={ofertaParaEditar}
        onOfertaActualizada={handleOfertaActualizada}
        clearSearch={clearSearch}
      />
    </>
  );
};

export default OfertasProductoSimilar;