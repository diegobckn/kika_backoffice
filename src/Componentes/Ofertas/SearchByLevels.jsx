
import React, { useState, useEffect,useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  CircularProgress,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  TextField,
  IconButton,
  Collapse,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const SearchByLevels = ({ onProductoSeleccionado, clearSearch, refresh }) => {
  // Estados de búsqueda
  const { showLoading, hideLoading, showMessage, showConfirm } = useContext(
    SelectedOptionsContext
  );

  const [tipo, setTipo] = useState("Familia");
  const [data, setData] = useState([]);
  const [dataResult, setDataResult] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados de paginación y filtros
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filtrarTexto, setFiltrarTexto] = useState("");

  // Estado de expansión del panel
  const [expanded, setExpanded] = useState(true);

  // Limpiar búsqueda cuando clearSearch cambie
  useEffect(() => {
    if (clearSearch) {
      limpiarBusqueda();
    }
  }, [clearSearch]);

  const fetchData = async () => {
    setLoading(true);

    try {
      let url;
      let response;

      // Determinar qué endpoint usar según el tipo seleccionado
      if (tipo === "Familia") {
        url =
          "https://www.easyposqas.somee.com/api/NivelMercadoLogicos/GetAllFamilias";
        response = await axios.get(url);

        // Procesar datos de familias
        if (
          response.data &&
          response.data.familias &&
          Array.isArray(response.data.familias)
        ) {
          const familiasFormateadas = response.data.familias.map(
            (familia, index) => ({
              codigoProducto: familia.idFamilia,
              descripcion: familia.descripcion,
              precioVenta: 0,
              precioCosto: 0,
              stockActual: 0,
              cantidad: 0,
              sumaTotal: 0,
              ranking: index + 1,
              // Información adicional
              idCategoria: familia.idCategoria,
              idSubcategoria: familia.idSubcategoria,
              bajaLogica: familia.bajaLogica,
            })
          );

          setData(familiasFormateadas);
          setDataResult(familiasFormateadas);
          setPage(0);
        } else {
          console.warn(
            "Estructura de datos inesperada para familias:",
            response.data
          );
          setData([]);
          setDataResult([]);
        }
      } else if (tipo === "SubFamilia") {
        url =
          "https://www.easyposqas.somee.com/api/NivelMercadoLogicos/GetAllSubFamilias";
        response = await axios.get(url);
        console.log("Respuesta subfamilias:", response.data);

        // Procesar datos de subfamilias - AJUSTADO según la nueva estructura
        if (
          response.data &&
          response.data.subFamilias &&
          Array.isArray(response.data.subFamilias)
        ) {
          const subfamiliasFormateadas = response.data.subFamilias.map(
            (subfamilia, index) => ({
              codigoProducto: subfamilia.idSubFamilia,
              descripcion: subfamilia.descripcion,
              precioVenta: 0,
              precioCosto: 0,
              stockActual: 0,
              cantidad: 0,
              sumaTotal: 0,
              ranking: index + 1,
              // Información adicional
              idCategoria: subfamilia.idCategoria,
              idSubcategoria: subfamilia.idSubcategoria,
              idFamilia: subfamilia.idFamilia,
              bajaLogica: subfamilia.bajaLogica,
            })
          );

          setData(subfamiliasFormateadas);
          setDataResult(subfamiliasFormateadas);
          setPage(0);
        } else {
          // Fallback: si la estructura no tiene propiedad subFamilias
          console.warn(
            "Estructura de datos inesperada para subfamilias:",
            response.data
          );
          // Intentar usar response.data directamente si es un array
          if (response.data && Array.isArray(response.data)) {
            const subfamiliasFormateadas = response.data.map(
              (subfamilia, index) => ({
                codigoProducto: subfamilia.idSubFamilia || subfamilia.id,
                descripcion: subfamilia.descripcion || subfamilia.nombre,
                precioVenta: 0,
                precioCosto: 0,
                stockActual: 0,
                cantidad: 0,
                sumaTotal: 0,
                ranking: index + 1,
              })
            );

            setData(subfamiliasFormateadas);
            setDataResult(subfamiliasFormateadas);
            setPage(0);
          } else {
            setData([]);
            setDataResult([]);
          }
        }
      }
    } catch (error) {
      console.error("Error al buscar datos:", error);
      setData([]);
      setDataResult([]);
      showMessage("Error al cargar los datos. Por favor, intente nuevamente.");
    }

    setLoading(false);
  };

  const filtrar = () => {
    if (!filtrarTexto.trim()) {
      setData(dataResult);
      return;
    }

    const dataFiltrada = dataResult.filter((item) =>
      item.descripcion.toLowerCase().includes(filtrarTexto.toLowerCase())
    );
    setData(dataFiltrada);
    setPage(0);
  };

  const quitarFiltro = () => {
    setFiltrarTexto("");
    setData(dataResult);
    setPage(0);
  };

  const limpiarBusqueda = () => {
    setData([]);
    setDataResult([]);
    setFiltrarTexto("");
    setPage(0);
    setTipo("Familia");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSeleccionarProducto = (item) => {
    const itemFormateado = {
      idProducto: item.codigoProducto,
      codbarra: item.codigoProducto,
      nombre: item.descripcion,
      descripcion: item.descripcion,
      precioVenta: 0,
      precioCosto: 0,
      stockActual: 0,
      tipo: tipo,
      esNivel: true,
      ...(tipo === "Familia" && {
        idFamilia: item.codigoProducto,
        idCategoria: item.idCategoria,
        idSubcategoria: item.idSubcategoria,
      }),
      ...(tipo === "SubFamilia" && {
        idSubfamilia: item.codigoProducto,
        idFamilia: item.idFamilia,
        idCategoria: item.idCategoria,
        idSubcategoria: item.idSubcategoria,
      }),
    };

    onProductoSeleccionado(itemFormateado);
    setData([]);
    setDataResult([]);
    setFiltrarTexto("");

  };

  // Manejar búsqueda cuando cambia el tipo
  useEffect(() => {
    if (refresh) {
      fetchData();
    }
  }, [refresh]);

  // Búsqueda automática al cambiar el tipo
  useEffect(() => {
    if (data.length === 0) {
      fetchData();
    }
  }, [tipo]);

  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" component="div">
            Búsqueda por Niveles
          </Typography>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Filtros de búsqueda */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={tipo}
                  label="Tipo"
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <MenuItem value="Familia">Familia</MenuItem>
                  <MenuItem value="SubFamilia">Sub Familia</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={fetchData}
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </Box>

            {/* Filtro de texto */}
            {data.length > 0 && (
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  size="small"
                  fullWidth
                  label="Filtrar por descripción"
                  value={filtrarTexto}
                  onChange={(e) => setFiltrarTexto(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && filtrar()}
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={filtrar}
                  size="small"
                  sx={{ minWidth: 100 }}
                >
                  Filtrar
                </Button>
                {filtrarTexto && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={quitarFiltro}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    Quitar Filtro
                  </Button>
                )}
              </Box>
            )}

            {/* Tabla de resultados */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : data.length === 0 ? (
              <Box
                sx={{
                  p: 2,
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                }}
              >
                <Typography color="textSecondary">
                  {dataResult.length === 0
                    ? "Realice una búsqueda para ver resultados"
                    : "No se encontraron resultados con ese filtro"}
                </Typography>
              </Box>
            ) : (
              <>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Mostrando {data.length} {tipo.toLowerCase()}(s)
                </Typography>
                <TableContainer component={Paper} elevation={1}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                        <TableCell>
                          <strong>Código</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Descripción</strong>
                        </TableCell>
                        {tipo === "Familia" && (
                          <>
                            <TableCell>
                              <strong>Categoría</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Subcategoría</strong>
                            </TableCell>
                          </>
                        )}
                        {tipo === "SubFamilia" && (
                          <>
                            <TableCell>
                              <strong>Categoría</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Subcategoría</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Familia</strong>
                            </TableCell>
                          </>
                        )}
                        <TableCell align="center">
                          <strong>Acción</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((item, index) => (
                          <TableRow
                            key={`${item.codigoProducto}-${index}`}
                            hover
                          >
                            <TableCell>
                              <Typography variant="body2" color="primary">
                                {item.codigoProducto}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {item.descripcion}
                              </Typography>
                            </TableCell>
                            {tipo === "Familia" && (
                              <>
                                <TableCell>
                                  <Typography variant="body2">
                                    {item.idCategoria}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {item.idSubcategoria}
                                  </Typography>
                                </TableCell>
                              </>
                            )}
                            {tipo === "SubFamilia" && (
                              <>
                                <TableCell>
                                  <Typography variant="body2">
                                    {item.idCategoria || "N/A"}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {item.idSubcategoria || "N/A"}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {item.idFamilia || "N/A"}
                                  </Typography>
                                </TableCell>
                              </>
                            )}
                            <TableCell align="center">
                              <Button
                                variant="outlined"
                                onClick={() => handleSeleccionarProducto(item)}
                              >
                                Seleccionar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={data.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                  labelRowsPerPage="Filas por página"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} de ${count}`
                  }
                />
              </>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default SearchByLevels;
