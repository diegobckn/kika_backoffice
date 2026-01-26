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
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  Grid,
  Alert,
  MenuItem,
  CircularProgress,
  Switch
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import Ofertas from "../../Models/Ofertas";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import PercentIcon from "@mui/icons-material/Percent";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Product from "../../Models/Product";

const DialogEditarDescuentoProductosAgrupados = ({
  open,
  onClose,
  ofertaEditar,
  onOfertaActualizada,
  clearSearch,
}) => {
  const { showLoading, hideLoading, showMessage, showConfirm } = useContext(
    SelectedOptionsContext
  );

  // Estados del formulario
  const [nombreOferta, setNombreOferta] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
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
  const [actualizando, setActualizando] = useState(false);

  // Estados para el tipo de descuento
  const [tipoDescuento, setTipoDescuento] = useState("$");
  const [descuentoManual, setDescuentoManual] = useState(0);
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);

  // Estados para la selección jerárquica (NML)
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [subfamilias, setSubfamilias] = useState([]);
  const [cargandoNiveles, setCargandoNiveles] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  // IDs seleccionados
  const [categoriaSeleccionadaId, setCategoriaSeleccionadaId] = useState(-1);
  const [subcategoriaSeleccionadaId, setSubcategoriaSeleccionadaId] = useState(-1);
  const [familiaSeleccionadaId, setFamiliaSeleccionadaId] = useState(-1);
  const [subfamiliaSeleccionadaId, setSubfamiliaSeleccionadaId] = useState(-1);

  // Estado para controlar hasta qué nivel se aplica el descuento
  const [nivelAplicacion, setNivelAplicacion] = useState("familia");

  const nombresDias = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  // Cargar categorías al montar
  useEffect(() => {
    if (open) {
      cargarCategorias();
    }
  }, [open]);

  // Cargar datos de la oferta cuando cambia ofertaEditar
  useEffect(() => {
    if (open && ofertaEditar) {
      cargarDatosOferta();
    }
  }, [open, ofertaEditar, clearSearch]);

  // Cargar subcategorías cuando se selecciona una categoría
  useEffect(() => {
    if (categoriaSeleccionadaId !== -1) {
      cargarSubcategorias(categoriaSeleccionadaId);
    } else {
      setSubcategorias([]);
      setSubcategoriaSeleccionadaId(-1);
    }
  }, [categoriaSeleccionadaId]);

  // Cargar familias cuando se selecciona una subcategoría
  useEffect(() => {
    if (categoriaSeleccionadaId !== -1 && subcategoriaSeleccionadaId !== -1) {
      cargarFamilias(categoriaSeleccionadaId, subcategoriaSeleccionadaId);
    } else {
      setFamilias([]);
      setFamiliaSeleccionadaId(-1);
    }
  }, [categoriaSeleccionadaId, subcategoriaSeleccionadaId]);

  // Cargar subfamilias cuando se selecciona una familia
  useEffect(() => {
    if (categoriaSeleccionadaId !== -1 && subcategoriaSeleccionadaId !== -1 && familiaSeleccionadaId !== -1) {
      cargarSubfamilias(categoriaSeleccionadaId, subcategoriaSeleccionadaId, familiaSeleccionadaId);
    } else {
      setSubfamilias([]);
      setSubfamiliaSeleccionadaId(-1);
    }
  }, [categoriaSeleccionadaId, subcategoriaSeleccionadaId, familiaSeleccionadaId]);

  /**
   * Carga las categorías disponibles
   */
  const cargarCategorias = () => {
    setCargandoNiveles(true);
    Product.getInstance().getCategories(
      (data) => {
        setCategorias(data);
        setCargandoNiveles(false);
      },
      (error) => {
        console.error("Error al cargar categorías:", error);
        setCargandoNiveles(false);
        showMessage("Error al cargar las categorías");
      }
    );
  };

  /**
   * Carga las subcategorías de una categoría específica
   */
  const cargarSubcategorias = (categoriaId) => {
    setCargandoNiveles(true);
    Product.getInstance().getSubCategories(
      categoriaId,
      (data) => {
        setSubcategorias(data);
        setCargandoNiveles(false);
      },
      (error) => {
        console.error("Error al cargar subcategorías:", error);
        setCargandoNiveles(false);
        showMessage("Error al cargar las subcategorías");
      }
    );
  };

  /**
   * Carga las familias de una subcategoría específica
   */
  const cargarFamilias = (categoriaId, subcategoriaId) => {
    setCargandoNiveles(true);
    Product.getInstance().getFamiliaBySubCat(
      { categoryId: categoriaId, subcategoryId: subcategoriaId },
      (data) => {
        setFamilias(data);
        setCargandoNiveles(false);
      },
      (error) => {
        console.error("Error al cargar familias:", error);
        setCargandoNiveles(false);
        showMessage("Error al cargar las familias");
      }
    );
  };

  /**
   * Carga las subfamilias de una familia específica
   */
  const cargarSubfamilias = (categoriaId, subcategoriaId, familiaId) => {
    setCargandoNiveles(true);
    Product.getInstance().getSubFamilia(
      { categoryId: categoriaId, subcategoryId: subcategoriaId, familyId: familiaId },
      (data) => {
        const subFamiliasArray = data.subFamilias || data;
        setSubfamilias(subFamiliasArray);
        setCargandoNiveles(false);
      },
      (error) => {
        console.error("Error al cargar subfamilias:", error);
        setCargandoNiveles(false);
        showMessage("Error al cargar las subfamilias");
      }
    );
  };

  /**
   * Carga los datos de la oferta en el formulario
   */
  const cargarDatosOferta = () => {
    if (!ofertaEditar) return;

    setCargandoDatos(true);

    try {
      // Cargar datos básicos
      setNombreOferta(ofertaEditar.descripcion || "");
      setOfertaActiva(ofertaEditar.activo || true);

      // Cargar fechas
      if (ofertaEditar.fechaInicial) {
        setStartDate(dayjs(ofertaEditar.fechaInicial));
      }
      if (ofertaEditar.fechaFinal) {
        setEndDate(dayjs(ofertaEditar.fechaFinal));
      }

      // Cargar horas
      if (ofertaEditar.horaInicio) {
        setStartTime(dayjs(ofertaEditar.horaInicio, "HH:mm"));
      }
      if (ofertaEditar.horaFin) {
        setEndTime(dayjs(ofertaEditar.horaFin, "HH:mm"));
      }

      // Cargar días de la semana
      if (ofertaEditar.diasSemana) {
        const diasArray = ofertaEditar.diasSemana.split("").map((dia) => dia === "1");
        setDiasSemana(diasArray);
      }

      // Cargar datos de descuento
      if (ofertaEditar.oferta_Regla) {
        const regla = ofertaEditar.oferta_Regla;
        setTipoDescuento(regla.tipoDescuento || "$");
        if (regla.tipoDescuento === "$") {
          setDescuentoManual(regla.valor || 0);
        } else {
          setDescuentoPorcentaje(regla.valor || 0);
        }
      }

      // Cargar datos NML
      if (ofertaEditar.oferta_ListaNMLs && ofertaEditar.oferta_ListaNMLs.length > 0) {
        const nml = ofertaEditar.oferta_ListaNMLs[0];
        
        // Determinar nivel de aplicación
        let nivel = "familia";
        if (nml.subFamiliaID > 0) {
          nivel = "subfamilia";
        } else if (nml.familiaID > 0) {
          nivel = "familia";
        } else if (nml.subCategoriaID > 0) {
          nivel = "subcategoria";
        } else if (nml.categoriaID > 0) {
          nivel = "categoria";
        }
        setNivelAplicacion(nivel);

        // Establecer IDs seleccionados
        if (nml.categoriaID > 0) {
          setCategoriaSeleccionadaId(nml.categoriaID);
        }
        if (nml.subCategoriaID > 0) {
          setSubcategoriaSeleccionadaId(nml.subCategoriaID);
        }
        if (nml.familiaID > 0) {
          setFamiliaSeleccionadaId(nml.familiaID);
        }
        if (nml.subFamiliaID > 0) {
          setSubfamiliaSeleccionadaId(nml.subFamiliaID);
        }
      }
    } catch (error) {
      console.error("Error al cargar datos de la oferta:", error);
      showMessage("Error al cargar los datos de la oferta");
    } finally {
      setCargandoDatos(false);
    }
  };

  /**
   * Convierte array de booleanos a string de días
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
   * Maneja el cambio del tipo de descuento
   */
  const handleTipoDescuentoChange = (event, newTipo) => {
    if (newTipo !== null) {
      setTipoDescuento(newTipo);
    }
  };

  /**
   * Maneja el cambio del descuento manual (monto fijo)
   */
  const handleDescuentoManualChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue === "" || numericValue === "0") {
      setDescuentoManual(0);
    } else {
      const descuento = parseInt(numericValue, 10);
      if (descuento < 0) {
        showMessage("El descuento no puede ser negativo");
        setDescuentoManual(0);
      } else {
        setDescuentoManual(descuento);
      }
    }
  };

  /**
   * Maneja el cambio del descuento en porcentaje
   */
  const handleDescuentoPorcentajeChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue === "" || numericValue === "0") {
      setDescuentoPorcentaje(0);
    } else {
      let porcentaje = parseInt(numericValue, 10);
      if (porcentaje > 100) {
        showMessage("El porcentaje no puede ser mayor a 100%");
        porcentaje = 100;
      } else if (porcentaje < 0) {
        showMessage("El porcentaje no puede ser negativo");
        porcentaje = 0;
      }
      setDescuentoPorcentaje(porcentaje);
    }
  };

  /**
   * Obtiene el nombre de un nivel por su ID
   */
  const obtenerNombreNivel = (id, lista, campoDescripcion = "descripcion") => {
    if (id === -1 || id === 0) return "No seleccionado";
    const item = lista.find(item => 
      item.id === id || 
      item.idCategoria === id || 
      item.idSubcategoria === id || 
      item.idFamilia === id || 
      item.idSubFamilia === id ||
      item.idSubfamilia === id
    );
    return item ? item[campoDescripcion] : `ID ${id}`;
  };

  /**
   * Construye el objeto NML según el nivel de aplicación seleccionado
   */
  const construirObjetoNML = () => {
    const objetoBase = {
      categoriaID: 0,
      subCategoriaID: 0,
      familiaID: 0,
      subFamiliaID: 0,
    };

    switch (nivelAplicacion) {
      case "categoria":
        if (categoriaSeleccionadaId !== -1) {
          objetoBase.categoriaID = categoriaSeleccionadaId;
        }
        break;
      
      case "subcategoria":
        if (categoriaSeleccionadaId !== -1 && subcategoriaSeleccionadaId !== -1) {
          objetoBase.categoriaID = categoriaSeleccionadaId;
          objetoBase.subCategoriaID = subcategoriaSeleccionadaId;
        }
        break;
      
      case "familia":
        if (categoriaSeleccionadaId !== -1 && subcategoriaSeleccionadaId !== -1 && familiaSeleccionadaId !== -1) {
          objetoBase.categoriaID = categoriaSeleccionadaId;
          objetoBase.subCategoriaID = subcategoriaSeleccionadaId;
          objetoBase.familiaID = familiaSeleccionadaId;
        }
        break;
      
      case "subfamilia":
        if (categoriaSeleccionadaId !== -1 && subcategoriaSeleccionadaId !== -1 && 
            familiaSeleccionadaId !== -1 && subfamiliaSeleccionadaId !== -1) {
          objetoBase.categoriaID = categoriaSeleccionadaId;
          objetoBase.subCategoriaID = subcategoriaSeleccionadaId;
          objetoBase.familiaID = familiaSeleccionadaId;
          objetoBase.subFamiliaID = subfamiliaSeleccionadaId;
        }
        break;
    }

    return objetoBase;
  };

  /**
   * Valida que todos los campos obligatorios estén completos
   */
  const validarFormulario = () => {
    if (!nombreOferta.trim()) {
      showMessage("Debe ingresar un nombre para la oferta");
      return false;
    }
    
    // Validar selección según nivel de aplicación
    switch (nivelAplicacion) {
      case "categoria":
        if (categoriaSeleccionadaId === -1) {
          showMessage("Debe seleccionar una categoría");
          return false;
        }
        break;
      
      case "subcategoria":
        if (categoriaSeleccionadaId === -1 || subcategoriaSeleccionadaId === -1) {
          showMessage("Debe seleccionar una categoría y subcategoría");
          return false;
        }
        break;
      
      case "familia":
        if (categoriaSeleccionadaId === -1 || subcategoriaSeleccionadaId === -1 || familiaSeleccionadaId === -1) {
          showMessage("Debe seleccionar categoría, subcategoría y familia");
          return false;
        }
        break;
      
      case "subfamilia":
        if (categoriaSeleccionadaId === -1 || subcategoriaSeleccionadaId === -1 || 
            familiaSeleccionadaId === -1 || subfamiliaSeleccionadaId === -1) {
          showMessage("Debe seleccionar categoría, subcategoría, familia y subfamilia");
          return false;
        }
        break;
      
      default:
        showMessage("Debe seleccionar un nivel de aplicación");
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

    if (tipoDescuento === "$") {
      if (descuentoManual <= 0) {
        showMessage("El descuento debe ser mayor que 0");
        return false;
      }
    } else {
      if (descuentoPorcentaje <= 0 || descuentoPorcentaje > 100) {
        showMessage("El porcentaje debe estar entre 1 y 100");
        return false;
      }
    }

    return true;
  };

  /**
   * Actualiza la oferta
   */
  const handleActualizar = () => {
    if (actualizando || !ofertaEditar) return;
    
    if (!validarFormulario()) {
      return;
    }

    setActualizando(true);
    showLoading();

    // Construir el objeto NML
    const objetoNML = construirObjetoNML();
    const listaNMLs = [objetoNML];

    // Construir el objeto de la oferta
    const ofertaActualizada = {
      codigoOferta: ofertaEditar.codigoOferta,
      codigoTipo: ofertaEditar.codigoTipo || 1,
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
        valor: tipoDescuento === "$" ? descuentoManual : descuentoPorcentaje,
        aplicacion: "Total",
      },
      oferta_ListaNMLs: listaNMLs,
    };

    console.log("Actualizando oferta NML:", ofertaActualizada);

    // Usar el endpoint PUT para actualizar oferta NML
    Ofertas.updateOfertaNML(
      ofertaActualizada,
      (data, response) => {
        hideLoading();
        setActualizando(false);
        showMessage("Oferta actualizada exitosamente");
        if (onOfertaActualizada) {
          onOfertaActualizada();
        }
        onClose();
      },
      (error) => {
        hideLoading();
        setActualizando(false);
        console.error("Error al actualizar oferta NML:", error);
        const mensajeError =
          error?.message || 
          error?.descripcion || 
          error?.response?.data?.message || 
          "Error desconocido";
        showMessage(`Error al actualizar la oferta: ${mensajeError}`);
      }
    );
  };

  /**
   * Maneja el cambio manual del nivel de aplicación
   */
  const handleNivelAplicacionChange = (nuevoNivel) => {
    setNivelAplicacion(nuevoNivel);
  };

  /**
   * Limpia el formulario al cerrar
   */
  const handleClose = () => {
    // Resetear estados
    setNombreOferta("");
    setCategoriaSeleccionadaId(-1);
    setSubcategoriaSeleccionadaId(-1);
    setFamiliaSeleccionadaId(-1);
    setSubfamiliaSeleccionadaId(-1);
    setDescuentoManual(0);
    setDescuentoPorcentaje(0);
    setTipoDescuento("$");
    setNivelAplicacion("familia");
    setStartDate(null);
    setEndDate(null);
    setStartTime(null);
    setEndTime(null);
    setDiasSemana([true, true, true, true, true, true, true]);
    setOfertaActiva(true);
    setActualizando(false);
    
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar Oferta Agrupada por NML</DialogTitle>
      <DialogContent>
        {cargandoDatos ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            {/* Nombre de la oferta */}
            <TextField
              label="Nombre de la Oferta"
              type="text"
              value={nombreOferta}
              onChange={(e) => setNombreOferta(e.target.value)}
              fullWidth
            />

            {/* Selectores jerárquicos NML */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="h6">Selección Jerárquica (NML)</Typography>
              
              <Grid container spacing={2}>
                {/* Selector de Categoría */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    label="Categoría *"
                    value={categoriaSeleccionadaId}
                    onChange={(e) => setCategoriaSeleccionadaId(Number(e.target.value))}
                    fullWidth
                    disabled={cargandoNiveles}
                  >
                    <MenuItem value={-1}>
                      <em>Seleccione categoría</em>
                    </MenuItem>
                    {categorias.map((categoria) => (
                      <MenuItem key={categoria.idCategoria} value={categoria.idCategoria}>
                        {categoria.descripcion}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Selector de Subcategoría */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    label="Subcategoría"
                    value={subcategoriaSeleccionadaId}
                    onChange={(e) => setSubcategoriaSeleccionadaId(Number(e.target.value))}
                    fullWidth
                    disabled={!categoriaSeleccionadaId || categoriaSeleccionadaId === -1 || cargandoNiveles}
                  >
                    <MenuItem value={-1}>
                      <em>Seleccione subcategoría</em>
                    </MenuItem>
                    {subcategorias.map((subcategoria) => (
                      <MenuItem key={subcategoria.idSubcategoria} value={subcategoria.idSubcategoria}>
                        {subcategoria.descripcion}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Selector de Familia */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    label="Familia"
                    value={familiaSeleccionadaId}
                    onChange={(e) => setFamiliaSeleccionadaId(Number(e.target.value))}
                    fullWidth
                    disabled={!subcategoriaSeleccionadaId || subcategoriaSeleccionadaId === -1 || cargandoNiveles}
                  >
                    <MenuItem value={-1}>
                      <em>Seleccione familia</em>
                    </MenuItem>
                    {familias.map((familia) => (
                      <MenuItem key={familia.idFamilia} value={familia.idFamilia}>
                        {familia.descripcion}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Selector de Subfamilia */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    label="Subfamilia"
                    value={subfamiliaSeleccionadaId}
                    onChange={(e) => setSubfamiliaSeleccionadaId(Number(e.target.value))}
                    fullWidth
                    disabled={!familiaSeleccionadaId || familiaSeleccionadaId === -1 || cargandoNiveles}
                  >
                    <MenuItem value={-1}>
                      <em>Seleccione subfamilia</em>
                    </MenuItem>
                    {subfamilias.map((subfamilia) => (
                      <MenuItem 
                        key={subfamilia.idSubFamilia || subfamilia.idSubfamilia} 
                        value={subfamilia.idSubFamilia || subfamilia.idSubfamilia}
                      >
                        {subfamilia.descripcion}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              {/* Selector de nivel de aplicación */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Nivel de aplicación del descuento:
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: 'wrap' }}>
                  {["categoria", "subcategoria", "familia", "subfamilia"].map((nivel) => (
                    <Chip
                      key={nivel}
                      label={nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                      color={nivelAplicacion === nivel ? "primary" : "default"}
                      onClick={() => handleNivelAplicacionChange(nivel)}
                      variant={nivelAplicacion === nivel ? "filled" : "outlined"}
                      disabled={
                        (nivel === "subfamilia" && subfamiliaSeleccionadaId === -1) ||
                        (nivel === "familia" && familiaSeleccionadaId === -1) ||
                        (nivel === "subcategoria" && subcategoriaSeleccionadaId === -1) ||
                        (nivel === "categoria" && categoriaSeleccionadaId === -1)
                      }
                    />
                  ))}
                </Box>
              </Box>

            
            </Box>

            {/* Campos de descuento */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2, backgroundColor: "#f0f7ff", borderRadius: 1 }}>
              <Typography variant="h6">Configuración del Descuento</Typography>
              
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
                >
                  <ToggleButton value="$" aria-label="pesos">
                    <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
                    Monto Fijo ($)
                  </ToggleButton>
                  <ToggleButton value="%" aria-label="porcentaje">
                    <PercentIcon fontSize="small" sx={{ mr: 1 }} />
                    Porcentaje (%)
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Campo de descuento dinámico según tipo seleccionado */}
              <Box sx={{ display: "flex", gap: 2 }}>
                {tipoDescuento === "$" ? (
                  <TextField
                    label="Descuento aplicado *"
                    type="text"
                    value={descuentoManual || ""}
                    onChange={(e) => handleDescuentoManualChange(e.target.value)}
                    fullWidth
                    helperText="Ingrese el descuento manual en pesos"
                    error={descuentoManual < 0}
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
                    helperText="Ingrese el descuento en porcentaje (0-100)"
                    error={descuentoPorcentaje < 0 || descuentoPorcentaje > 100}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">%</InputAdornment>
                      ),
                    }}
                  />
                )}
              </Box>
            </Box>

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

            {/* Estado activo/inactivo */}
                
          {/* Estado de la oferta */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              backgroundColor: "#fafafa",
            }}
          >
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={actualizando}>
          Cancelar
        </Button>
        <Button
          onClick={handleActualizar}
          variant="contained"
          disabled={actualizando || cargandoDatos}
        >
          {actualizando ? "Actualizando..." : "Actualizar Oferta"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEditarDescuentoProductosAgrupados;