// import React, { useState, useEffect, useContext } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Chip,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   Switch,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { TimeField } from "@mui/x-date-pickers/TimeField";
// import dayjs from "dayjs";
// import DeleteIcon from "@mui/icons-material/Delete";
// import SearchListOsffers from "./SearchListOfertas";
// import Ofertas from "../../Models/Ofertas";
// import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

// const DialogEditarOfertaNxM = ({ open, onClose, ofertaEditar, onOfertaActualizada }) => {
//   const { showLoading, hideLoading, showMessage } = useContext(SelectedOptionsContext);

//   // Estados del formulario para N x M
//   const [nombreOferta, setNombreOferta] = useState("");
//   const [lleva, setLleva] = useState(null);
//   const [paga, setPaga] = useState(null);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);
//   const [productosSeleccionados, setProductosSeleccionados] = useState([]);
//   const [diasSemana, setDiasSemana] = useState([true, true, true, true, true, true, true]);
//   const [ofertaActiva, setOfertaActiva] = useState(true);
//   const [refresh, setRefresh] = useState(false);
//   const [clearSearch, setClearSearch] = useState(false);

//   const nombresDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

//   // Cargar datos de la oferta cuando cambie ofertaEditar o se abra el diálogo
//   useEffect(() => {
//     if (open && ofertaEditar) {
//       cargarDatosOferta();
//     }
//   }, [open, ofertaEditar]);

//   const cargarDatosOferta = () => {
//     if (!ofertaEditar) return;

//     console.log("========================================");
//     console.log("Cargando datos completos de oferta N x M:", ofertaEditar);
//     console.log("========================================");

//     // Información básica
//     setNombreOferta(ofertaEditar.descripcion || "");
//     setOfertaActiva(ofertaEditar.activo !== undefined ? ofertaEditar.activo : true);

//     // Calcular lleva y paga basado en la lista de canasta
//     if (ofertaEditar.oferta_ListaCanasta && ofertaEditar.oferta_ListaCanasta.length > 0) {
//       const totalUnidades = ofertaEditar.oferta_ListaCanasta.length;
//       const unidadesConDescuento = ofertaEditar.oferta_ListaCanasta.filter(
//         item => item.porcDescuento === 100
//       ).length;
      
//       setLleva(totalUnidades);
//       setPaga(totalUnidades - unidadesConDescuento);
      
//       console.log(`Calculado Lleva: ${totalUnidades}, Paga: ${totalUnidades - unidadesConDescuento}`);
//     }

//     // Fechas
//     if (ofertaEditar.fechaInicial) {
//       const fechaInicio = dayjs(ofertaEditar.fechaInicial);
//       setStartDate(fechaInicio);
//     }
//     if (ofertaEditar.fechaFinal) {
//       const fechaFin = dayjs(ofertaEditar.fechaFinal);
//       setEndDate(fechaFin);
//     }

//     // Horas
//     if (ofertaEditar.horaInicio && ofertaEditar.horaInicio !== "") {
//       const horaInicioParsed = dayjs(ofertaEditar.horaInicio, ["HH:mm:ss", "HH:mm"]);
//       setStartTime(horaInicioParsed);
//     } else {
//       setStartTime(null);
//     }
    
//     if (ofertaEditar.horaFin && ofertaEditar.horaFin !== "") {
//       const horaFinParsed = dayjs(ofertaEditar.horaFin, ["HH:mm:ss", "HH:mm"]);
//       setEndTime(horaFinParsed);
//     } else {
//       setEndTime(null);
//     }

//     // Días de la semana
//     if (ofertaEditar.diasSemana) {
//       const diasArray = ofertaEditar.diasSemana.split("").map((dia) => dia === "1");
//       setDiasSemana(diasArray);
//     }

//     // Productos de la canasta - obtener productos únicos
//     let productosACargar = [];

//     if (ofertaEditar.oferta_ListaCanasta && ofertaEditar.oferta_ListaCanasta.length > 0) {
//       console.log("Cargando productos desde oferta_ListaCanasta");
      
//       // Obtener productos únicos (sin duplicados por codbarra)
//       const productosUnicos = {};
//       ofertaEditar.oferta_ListaCanasta.forEach((item) => {
//         if (!productosUnicos[item.codbarra]) {
//           productosUnicos[item.codbarra] = {
//             codbarra: item.codbarra,
//             descripcionProducto: item.descripcionProducto,
//             cantidad: 0,
//             porcDescuento: 0,
//             precioVenta: 0,
//           };
//         }
//       });
      
//       productosACargar = Object.values(productosUnicos);
//     } else if (ofertaEditar.products && ofertaEditar.products.length > 0) {
//       console.log("Cargando productos desde products (campo alternativo)");
//       productosACargar = ofertaEditar.products.map((item) => ({
//         codbarra: item.codbarra,
//         descripcionProducto: item.descripcion,
//         cantidad: 0,
//         porcDescuento: 0,
//         precioVenta: 0,
//       }));
//     }

//     console.log("Productos finales cargados:", productosACargar);
//     setProductosSeleccionados(productosACargar);
//     console.log("========================================");
//   };

//   const limpiarFormulario = () => {
//     setNombreOferta("");
//     setLleva(null);
//     setPaga(null);
//     setStartDate(null);
//     setEndDate(null);
//     setStartTime(null);
//     setEndTime(null);
//     setProductosSeleccionados([]);
//     setDiasSemana([true, true, true, true, true, true, true]);
//     setOfertaActiva(true);
//     setClearSearch(prev => !prev);
//   };

//   const convertirDiasAString = (diasArray) => {
//     return diasArray.map((dia) => (dia ? "1" : "0")).join("");
//   };

//   const handleDiaChange = (index) => {
//     const nuevosDias = [...diasSemana];
//     nuevosDias[index] = !nuevosDias[index];
//     setDiasSemana(nuevosDias);
//   };

//   const handleTodosLosDias = (seleccionar) => {
//     setDiasSemana(new Array(7).fill(seleccionar));
//   };

//   const handleProductoSeleccionado = (producto) => {
//     const yaExiste = productosSeleccionados.some((p) => p.codbarra === producto.codbarra);

//     if (yaExiste) {
//       showMessage("Este producto ya ha sido agregado");
//       return;
//     }

//     const nuevoProducto = {
//       codbarra: producto.codbarra || producto.idProducto?.toString(),
//       descripcionProducto: producto.nombre || producto.descripcion,
//       cantidad: 0,
//       porcDescuento: 0,
//       precioVenta: producto.precioVenta || 0,
//     };

//     setProductosSeleccionados((prev) => [...prev, nuevoProducto]);
//     setClearSearch(prev => !prev);
//   };

//   const handleEliminarProducto = (codbarra) => {
//     setProductosSeleccionados((prev) => prev.filter((p) => p.codbarra !== codbarra));
//   };

//   /**
//    * Calcula el valor de descuento para la oferta N x M
//    */
//   const calcularValorDescuento = () => {
//     if (productosSeleccionados.length === 0 || !lleva || !paga) return 0;

//     // CASO 1: Un solo producto repetido
//     if (productosSeleccionados.length === 1) {
//       const producto = productosSeleccionados[0];
//       const precioUnitario = producto.precioVenta || 0;
//       return precioUnitario;
//     }
    
//     // CASO 2: Múltiples productos diferentes
//     const precioMenor = Math.min(...productosSeleccionados.map(p => p.precioVenta || 0));
//     return precioMenor;
//   };

//   /**
//    * Obtiene el detalle del cálculo para mostrar en el resumen
//    */
//   const obtenerDetalleCalculo = () => {
//     if (productosSeleccionados.length === 0 || !lleva || !paga) return null;

//     // CASO 1: Un solo producto
//     if (productosSeleccionados.length === 1) {
//       const producto = productosSeleccionados[0];
//       const precioUnitario = producto.precioVenta || 0;
//       const unidadesGratis = lleva - paga;
//       const totalSinDescuento = precioUnitario * lleva;
//       const descuentoPorUnidad = precioUnitario;
//       const descuentoTotal = descuentoPorUnidad * unidadesGratis;
//       const totalConDescuento = precioUnitario * paga;

//       return {
//         tipo: 'producto_unico',
//         producto: producto.descripcionProducto,
//         codbarra: producto.codbarra,
//         precioUnitario,
//         lleva,
//         paga,
//         unidadesGratis,
//         totalSinDescuento,
//         totalConDescuento,
//         descuentoPorUnidad,
//         descuentoTotal
//       };
//     }

//     // CASO 2: Múltiples productos
//     const precios = productosSeleccionados.map(p => p.precioVenta || 0);
//     const totalSinDescuento = precios.reduce((sum, precio) => sum + precio, 0);
//     const precioMenor = Math.min(...precios);
//     const productoMenor = productosSeleccionados.find(p => p.precioVenta === precioMenor);
//     const descuentoPorUnidad = precioMenor;
//     const descuentoTotal = descuentoPorUnidad * 1;
//     const totalConDescuento = totalSinDescuento - descuentoTotal;

//     return {
//       tipo: 'productos_multiples',
//       productos: productosSeleccionados.map(p => ({
//         codbarra: p.codbarra,
//         descripcion: p.descripcionProducto,
//         precio: p.precioVenta,
//         esMenor: p.precioVenta === precioMenor
//       })),
//       totalSinDescuento,
//       precioMenor,
//       productoMenor: productoMenor?.descripcionProducto,
//       codbarraMenor: productoMenor?.codbarra,
//       totalConDescuento,
//       descuentoPorUnidad,
//       descuentoTotal,
//       lleva,
//       paga
//     };
//   };

//   const validarFormulario = () => {
//     if (productosSeleccionados.length === 0) {
//       showMessage("Debe seleccionar al menos un producto");
//       return false;
//     }
//     if (!nombreOferta.trim()) {
//       showMessage("Debe ingresar un nombre para la oferta");
//       return false;
//     }
//     if (!startDate || !endDate) {
//       showMessage("Debe seleccionar las fechas de inicio y término");
//       return false;
//     }
//     if (!startTime || !endTime) {
//       showMessage("Debe seleccionar la hora de inicio y término");
//       return false;
//     }
//     if (!lleva || lleva <= 0) {
//       showMessage("Debe ingresar una cantidad válida de productos a llevar");
//       return false;
//     }
//     if (!paga || paga <= 0) {
//       showMessage("Debe ingresar una cantidad válida de productos a pagar");
//       return false;
//     }
//     if (paga >= lleva) {
//       showMessage("La cantidad a pagar debe ser menor que la cantidad a llevar");
//       return false;
//     }
//     return true;
//   };

//   const construirObjetoOferta = () => {
//     // Calcular el valor de descuento según el caso
//     const valorDescuentoUnitario = calcularValorDescuento();
//     let oferta_ListaCanasta = [];

//     // CASO 1: Producto único - se repite en la lista
//     if (productosSeleccionados.length === 1) {
//       const producto = productosSeleccionados[0];
//       const unidadesGratis = lleva - paga;
      
//       // Crear entrada por cada unidad que se lleva
//       for (let i = 0; i < lleva; i++) {
//         // Las últimas unidades (las gratis) tienen 100% descuento
//         const esUnidadGratis = i >= paga;
        
//         oferta_ListaCanasta.push({
//           codbarra: producto.codbarra,
//           descripcionProducto: producto.descripcionProducto,
//           cantidad: 1,
//           porcDescuento: esUnidadGratis ? 100 : 0,
//         });
//       }
//     } 
//     // CASO 2: Múltiples productos diferentes
//     else {
//       const precioMenor = Math.min(...productosSeleccionados.map(p => p.precioVenta || 0));
      
//       // Agregar cada producto una vez
//       productosSeleccionados.forEach((producto) => {
//         const esProductoMenor = producto.precioVenta === precioMenor;
        
//         oferta_ListaCanasta.push({
//           codbarra: producto.codbarra,
//           descripcionProducto: producto.descripcionProducto,
//           cantidad: 1,
//           porcDescuento: esProductoMenor ? 100 : 0,
//         });
//       });
//     }

//     // Asegurar formato ISO 8601 con zona horaria
//     const fechaInicialISO = startDate.toISOString();
//     const fechaFinalISO = endDate.toISOString();

//     return {
//       codigoOferta: ofertaEditar.codigoOferta,
//       codigoTipo: 3, // Tipo fijo para ofertas N x M
//       descripcion: nombreOferta.trim(),
//       fechaInicial: fechaInicialISO,
//       fechaFinal: fechaFinalISO,
//       horaInicio: startTime ? startTime.format("HH:mm") : "",
//       horaFin: endTime ? endTime.format("HH:mm") : "",
//       diasSemana: convertirDiasAString(diasSemana),
//       fAplicaMix: productosSeleccionados.length > 1,
//       activo: ofertaActiva,
//       oferta_Regla: {
//         signo: "=",
//         cantidad: 1, // Siempre 1 porque se aplica por unidad
//         tipoDescuento: "$", // Descuento en pesos
//         valor: valorDescuentoUnitario, // Valor del descuento por unidad
//         aplicacion: "Unidad", // Se aplica por unidad
//       },
//       oferta_ListaCanasta: oferta_ListaCanasta,
//     };
//   };

//   const handleActualizar = () => {
//     if (!validarFormulario()) {
//       return;
//     }

//     const ofertaActualizada = construirObjetoOferta();

//     console.log("========================================");
//     console.log("Objeto N x M enviado al backend:", JSON.stringify(ofertaActualizada, null, 2));
//     console.log("========================================");

//     showLoading();

//     Ofertas.updateOferta(
//       ofertaActualizada,
//       (data, response) => {
//         console.log("========================================");
//         console.log("✅ Oferta N x M actualizada exitosamente:", data);
//         console.log("========================================");
        
//         hideLoading();
//         showMessage("Oferta N x M actualizada exitosamente");
        
//         // Limpiar formulario
//         limpiarFormulario();
        
//         // Cerrar diálogo
//         onClose();
        
//         // Ejecutar callback para actualizar lista
//         if (onOfertaActualizada) {
//           setTimeout(() => {
//             onOfertaActualizada();
//           }, 100);
//         }
//       },
//       (error) => {
//         console.log("========================================");
//         console.error("❌ Error al actualizar oferta N x M:", error);
//         console.log("========================================");
        
//         hideLoading();
//         const mensajeError = error?.message || error?.descripcion || "Error desconocido al actualizar la oferta";
//         showMessage(`Error: ${mensajeError}`);
//       }
//     );
//   };

//   const handleCerrar = () => {
//     limpiarFormulario();
//     onClose();
//   };

//   const handleNumericChange = (setter, value) => {
//     const numericValue = value.replace(/[^0-9]/g, "");
//     if (numericValue === "" || numericValue === "0") {
//       setter(null);
//     } else {
//       setter(parseInt(numericValue));
//     }
//   };

//   const descuentoCalculado = calcularValorDescuento();
//   const detalleCalculo = obtenerDetalleCalculo();

//   /**
//    * Componente JSX para mostrar el resumen del cálculo
//    */
//   const ResumenCalculo = () => {
//     if (!lleva || !paga || !detalleCalculo) return null;

//     // CASO 1: Producto único
//     if (detalleCalculo.tipo === 'producto_unico') {
//       return (
//         <Box sx={{ mt: 2, p: 2, backgroundColor: "#f0f7ff", borderRadius: 1, border: "1px solid #2196f3" }}>
//           <Typography variant="subtitle2" color="primary" gutterBottom>
//             <strong>📊 Resumen del Cálculo - Producto Único</strong>
//           </Typography>
          
//           <Typography variant="body2" gutterBottom>
//             • Producto: <strong>{detalleCalculo.producto}</strong>
//           </Typography>
          
//           <Typography variant="body2" gutterBottom>
//             • Código: <strong>{detalleCalculo.codbarra}</strong>
//           </Typography>
          
//           <Typography variant="body2" gutterBottom>
//             • Precio unitario: <strong>${detalleCalculo.precioUnitario}</strong>
//           </Typography>
          
//           <Typography variant="body2" gutterBottom>
//             • El cliente lleva: <strong>{detalleCalculo.lleva}</strong> unidades
//           </Typography>
          
//           <Typography variant="body2" gutterBottom>
//             • El cliente paga: <strong>{detalleCalculo.paga}</strong> unidades
//           </Typography>
          
//           <Typography variant="body2" gutterBottom>
//             • Unidades gratis (100% descuento): <strong>{detalleCalculo.unidadesGratis}</strong>
//           </Typography>
          
//           <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #2196f3' }}>
//             <Typography variant="body2">
//               • Descuento por unidad: <strong>${detalleCalculo.descuentoPorUnidad}</strong>
//             </Typography>
//             <Typography variant="body2">
//               • Total sin descuento: <strong>${detalleCalculo.totalSinDescuento}</strong>
//             </Typography>
//             <Typography variant="body2">
//               • Total a pagar: <strong>${detalleCalculo.totalConDescuento}</strong>
//             </Typography>
//             <Typography variant="body2" color="success.main" fontWeight="bold" sx={{ mt: 1 }}>
//               💰 Descuento total: ${detalleCalculo.descuentoTotal}
//             </Typography>
//           </Box>
//         </Box>
//       );
//     }

//     // CASO 2: Múltiples productos
//     if (detalleCalculo.tipo === 'productos_multiples') {
//       return (
//         <Box sx={{ mt: 2, p: 2, backgroundColor: "#fff8e1", borderRadius: 1, border: "1px solid #ffa726" }}>
//           <Typography variant="subtitle2" color="warning.dark" gutterBottom>
//             <strong>📊 Resumen del Cálculo - Productos Múltiples</strong>
//           </Typography>
          
//           <Typography variant="body2" gutterBottom>
//             • Productos en la oferta: <strong>{detalleCalculo.productos.length}</strong>
//           </Typography>
          
//           <Box sx={{ ml: 2, my: 1 }}>
//             {detalleCalculo.productos.map((prod, idx) => (
//               <Typography 
//                 key={idx} 
//                 variant="caption" 
//                 display="block" 
//                 color={prod.esMenor ? "success.main" : "textSecondary"}
//                 fontWeight={prod.esMenor ? "bold" : "normal"}
//               >
//                 {prod.esMenor ? "✓ " : "- "}{prod.descripcion}: ${prod.precio}
//                 {prod.esMenor && " (100% descuento)"}
//               </Typography>
//             ))}
//           </Box>
          
//           <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #ffa726' }}>
//             <Typography variant="body2">
//               • Producto con menor valor: <strong>{detalleCalculo.productoMenor}</strong>
//             </Typography>
//             <Typography variant="body2">
//               • Descuento por unidad: <strong>${detalleCalculo.descuentoPorUnidad}</strong>
//             </Typography>
//             <Typography variant="body2">
//               • Total sin descuento: <strong>${detalleCalculo.totalSinDescuento}</strong>
//             </Typography>
//             <Typography variant="body2">
//               • Total a pagar: <strong>${detalleCalculo.totalConDescuento}</strong>
//             </Typography>
//             <Typography variant="body2" color="success.main" fontWeight="bold" sx={{ mt: 1 }}>
//               💰 Descuento total: ${detalleCalculo.descuentoTotal}
//             </Typography>
//           </Box>
//         </Box>
//       );
//     }

//     return null;
//   };

//   return (
//     <Dialog open={open} onClose={handleCerrar} maxWidth="md" fullWidth>
//       <DialogTitle>
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <Typography variant="h6">Editar Oferta N x M</Typography>
     
//         </Box>
//       </DialogTitle>

//       <DialogContent dividers>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//           {/* Nombre de la oferta */}
//           <TextField
//             label="Nombre de la Oferta"
//             type="text"
//             value={nombreOferta}
//             onChange={(e) => setNombreOferta(e.target.value)}
//             fullWidth
//             required
//             placeholder="Ej: 3x2 en productos seleccionados"
//           />

//           {/* Buscador de productos */}
//           <SearchListOffers
//             refresh={refresh}
//             setRefresh={setRefresh}
//             onProductoSeleccionado={handleProductoSeleccionado}
//           />

//           {/* Tabla de productos seleccionados */}
//           {productosSeleccionados.length > 0 && (
//             <Box>
//               <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//                 Productos Seleccionados ({productosSeleccionados.length})
//               </Typography>
//               <TableContainer component={Paper} elevation={2}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
//                       <TableCell><strong>Código</strong></TableCell>
//                       <TableCell><strong>Descripción</strong></TableCell>
//                       <TableCell align="center"><strong>Acciones</strong></TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {productosSeleccionados.map((producto) => (
//                       <TableRow key={producto.codbarra} hover>
//                         <TableCell>
//                           <Chip label={producto.codbarra} size="small" color="primary" variant="outlined" />
//                         </TableCell>
//                         <TableCell>
//                           <Typography variant="body2">{producto.descripcionProducto}</Typography>
//                         </TableCell>
                      
//                         <TableCell align="center">
//                           <IconButton
//                             size="small"
//                             color="error"
//                             onClick={() => handleEliminarProducto(producto.codbarra)}
//                             title="Eliminar producto"
//                           >
//                             <DeleteIcon fontSize="small" />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               {/* Resumen de cálculo */}
//               <ResumenCalculo />
//             </Box>
//           )}

//           {/* Fechas */}
//           <Box sx={{ display: "flex", gap: 2 }}>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DatePicker
//                 label="Fecha Inicio"
//                 value={startDate}
//                 onChange={setStartDate}
//                 format="DD/MM/YYYY"
//                 slotProps={{ textField: { fullWidth: true, required: true } }}
//               />
//             </LocalizationProvider>

//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DatePicker
//                 label="Fecha Término"
//                 value={endDate}
//                 onChange={setEndDate}
//                 format="DD/MM/YYYY"
//                 slotProps={{ textField: { fullWidth: true, required: true } }}
//               />
//             </LocalizationProvider>
//           </Box>

//           {/* Horas */}
//           <Box sx={{ display: "flex", gap: 2 }}>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <TimeField
//                 label="Hora de Inicio"
//                 format="HH:mm"
//                 value={startTime}
//                 onChange={setStartTime}
//                 slotProps={{ textField: { fullWidth: true } }}
//               />
//             </LocalizationProvider>

//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <TimeField
//                 label="Hora de Término"
//                 format="HH:mm"
//                 value={endTime}
//                 onChange={setEndTime}
//                 slotProps={{ textField: { fullWidth: true } }}
//               />
//             </LocalizationProvider>
//           </Box>

//           {/* Cantidad Lleva y Paga */}
//           <Box sx={{ display: "flex", gap: 2 }}>
//             <TextField
//               label="Lleva (N)"
//               type="text"
//               value={lleva || ""}
//               onChange={(e) => handleNumericChange(setLleva, e.target.value)}
//               onKeyPress={(e) => {
//                 if (!/[0-9]/.test(e.key)) e.preventDefault();
//               }}
//               fullWidth
//               required
//               inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
//               helperText="Cantidad que se lleva el cliente"
//             />
//             <TextField
//               label="Paga (M)"
//               type="text"
//               value={paga || ""}
//               onChange={(e) => handleNumericChange(setPaga, e.target.value)}
//               onKeyPress={(e) => {
//                 if (!/[0-9]/.test(e.key)) e.preventDefault();
//               }}
//               fullWidth
//               required
//               inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
//               helperText="Cantidad que paga el cliente"
//             />
//           </Box>

//           {/* Días de la semana */}
//           <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, backgroundColor: "#fafafa" }}>
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//               <Typography variant="subtitle1" fontWeight="bold">
//                 Días de la Semana
//               </Typography>
//               <Box sx={{ display: "flex", gap: 1 }}>
//                 <Button size="small" variant="outlined" onClick={() => handleTodosLosDias(true)}>
//                   Todos
//                 </Button>
//                 <Button size="small" variant="outlined" onClick={() => handleTodosLosDias(false)}>
//                   Ninguno
//                 </Button>
//               </Box>
//             </Box>

//             <FormGroup row sx={{ display: "flex", justifyContent: "space-between" }}>
//               {nombresDias.map((dia, index) => (
//                 <FormControlLabel
//                   key={index}
//                   control={
//                     <Checkbox
//                       checked={diasSemana[index]}
//                       onChange={() => handleDiaChange(index)}
//                       color="primary"
//                     />
//                   }
//                   label={dia}
//                 />
//               ))}
//             </FormGroup>
//           </Box>

//           {/* Estado de la oferta (Activo/Inactivo) */}
//           <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, backgroundColor: "#fafafa" }}>
//             <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <Box>
//                 <Typography variant="subtitle1" fontWeight="bold">
//                   Estado de la Oferta
//                 </Typography>
//                 <Typography variant="caption" color="textSecondary">
//                   Define si la oferta estará activa o inactiva
//                 </Typography>
//               </Box>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={ofertaActiva}
//                     onChange={(e) => setOfertaActiva(e.target.checked)}
//                     color="success"
//                   />
//                 }
//                 label={
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <Typography variant="body2" fontWeight="bold">
//                       {ofertaActiva ? "Activa" : "Inactiva"}
//                     </Typography>
//                     <Chip
//                       label={ofertaActiva ? "ON" : "OFF"}
//                       size="small"
//                       color={ofertaActiva ? "success" : "default"}
//                     />
//                   </Box>
//                 }
//                 labelPlacement="start"
//               />
//             </Box>
//           </Box>
//         </Box>
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={handleCerrar} color="inherit">
//           Cancelar
//         </Button>
//         <Button
//           onClick={handleActualizar}
//           variant="contained"
//           color="primary"
//           disabled={productosSeleccionados.length === 0}
//         >
//           Guardar Cambios
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default DialogEditarOfertaNxM;
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
  CircularProgress,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SearchListOffers from "./SearchListOfertas";
import Ofertas from "../../Models/Ofertas";
import Product from "../../Models/Product";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const DialogEditarOfertaNxM = ({ open, onClose, ofertaEditar, onOfertaActualizada }) => {
  const { showLoading, hideLoading, showMessage } = useContext(SelectedOptionsContext);

  // Estados del formulario
  const [nombreOferta, setNombreOferta] = useState("");
  const [lleva, setLleva] = useState(null);
  const [paga, setPaga] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [diasSemana, setDiasSemana] = useState([true, true, true, true, true, true, true]);
  const [ofertaActiva, setOfertaActiva] = useState(true);
  const [refresh, setRefresh] = useState(false);
  
  // Estados para manejo de carga
  const [cargandoProductos, setCargandoProductos] = useState(false);
  const [errorCargaProductos, setErrorCargaProductos] = useState(null);

  const nombresDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  useEffect(() => {
    if (open && ofertaEditar) {
      cargarDatosOferta();
    }
  }, [open, ofertaEditar]);

  /**
   * 🔍 Obtiene el precio real de un producto por código de barras
   */
  const obtenerPrecioProducto = async (codbarra) => {
    return new Promise((resolve, reject) => {
      const productModel = new Product();
      
      productModel.findByCodigoBarras(
        { codigoProducto: codbarra },
        (productos, response) => {
          if (productos && productos.length > 0) {
            const producto = productos[0];
            const precio = producto.precioVenta || 0;
            console.log(`✅ Precio obtenido para ${codbarra}: $${precio}`);
            resolve(precio);
          } else {
            console.warn(`⚠️ Producto ${codbarra} no encontrado`);
            resolve(0);
          }
        },
        (error) => {
          console.error(`❌ Error al obtener precio de ${codbarra}:`, error);
          resolve(0);
        }
      );
    });
  };

  /**
   * 📥 Carga los datos de la oferta y obtiene precios reales
   */
  const cargarDatosOferta = async () => {
    if (!ofertaEditar) return;

    console.log("========================================");
    console.log("📋 Cargando oferta N x M para edición");
    console.log("Oferta:", ofertaEditar);
    console.log("========================================");

    setCargandoProductos(true);
    setErrorCargaProductos(null);

    try {
      // 1️⃣ Información básica
      setNombreOferta(ofertaEditar.descripcion || "");
      setOfertaActiva(ofertaEditar.activo !== undefined ? ofertaEditar.activo : true);

      // 2️⃣ Calcular lleva y paga desde oferta_ListaCanasta
      if (ofertaEditar.oferta_ListaCanasta && ofertaEditar.oferta_ListaCanasta.length > 0) {
        const totalUnidades = ofertaEditar.oferta_ListaCanasta.length;
        const unidadesConDescuento = ofertaEditar.oferta_ListaCanasta.filter(
          item => item.porcDescuento === 100
        ).length;
        
        setLleva(totalUnidades);
        setPaga(totalUnidades - unidadesConDescuento);
        
        console.log(`✅ Lleva: ${totalUnidades}, Paga: ${totalUnidades - unidadesConDescuento}`);
      }

      // 3️⃣ Fechas y horas
      if (ofertaEditar.fechaInicial) {
        setStartDate(dayjs(ofertaEditar.fechaInicial));
      }
      if (ofertaEditar.fechaFinal) {
        setEndDate(dayjs(ofertaEditar.fechaFinal));
      }
      if (ofertaEditar.horaInicio) {
        setStartTime(dayjs(ofertaEditar.horaInicio, ["HH:mm:ss", "HH:mm"]));
      }
      if (ofertaEditar.horaFin) {
        setEndTime(dayjs(ofertaEditar.horaFin, ["HH:mm:ss", "HH:mm"]));
      }

      // 4️⃣ Días de la semana
      if (ofertaEditar.diasSemana) {
        const diasArray = ofertaEditar.diasSemana.split("").map(d => d === "1");
        setDiasSemana(diasArray);
      }

      // 5️⃣ 🔥 CARGAR PRODUCTOS CON PRECIOS REALES
      let productosBase = [];

      if (ofertaEditar.oferta_ListaCanasta && ofertaEditar.oferta_ListaCanasta.length > 0) {
        console.log("📦 Procesando productos desde oferta_ListaCanasta");
        
        const productosUnicos = {};
        ofertaEditar.oferta_ListaCanasta.forEach(item => {
          if (!productosUnicos[item.codbarra]) {
            productosUnicos[item.codbarra] = {
              codbarra: item.codbarra,
              descripcionProducto: item.descripcionProducto,
              cantidad: 0,
              porcDescuento: 0,
              precioVenta: 0,
            };
          }
        });
        
        productosBase = Object.values(productosUnicos);
      } 
      else if (ofertaEditar.products && ofertaEditar.products.length > 0) {
        console.log("📦 Procesando productos desde products");
        productosBase = ofertaEditar.products.map(item => ({
          codbarra: item.codbarra,
          descripcionProducto: item.descripcion,
          cantidad: 0,
          porcDescuento: 0,
          precioVenta: 0,
        }));
      }

      // 6️⃣ 🔍 OBTENER PRECIOS REALES
      if (productosBase.length > 0) {
        console.log(`🔍 Obteniendo precios para ${productosBase.length} productos...`);
        
        const promesasPrecios = productosBase.map(async (producto) => {
          try {
            const precio = await obtenerPrecioProducto(producto.codbarra);
            console.log(`  - ${producto.codbarra}: $${precio}`);
            return { ...producto, precioVenta: precio };
          } catch (error) {
            console.error(`  ❌ Error con ${producto.codbarra}:`, error);
            return producto;
          }
        });

        const productosConPrecios = await Promise.all(promesasPrecios);
        
        console.log("✅ Productos cargados con precios:");
        productosConPrecios.forEach(p => {
          console.log(`  - ${p.codbarra}: $${p.precioVenta} - ${p.descripcionProducto}`);
        });
        
        setProductosSeleccionados(productosConPrecios);
      } else {
        setProductosSeleccionados([]);
      }

      setCargandoProductos(false);
      console.log("========================================");
      
    } catch (error) {
      console.error("❌ Error al cargar oferta:", error);
      setErrorCargaProductos("Error al cargar los datos de la oferta");
      setCargandoProductos(false);
    }
  };

  const limpiarFormulario = () => {
    setNombreOferta("");
    setLleva(null);
    setPaga(null);
    setStartDate(null);
    setEndDate(null);
    setStartTime(null);
    setEndTime(null);
    setProductosSeleccionados([]);
    setDiasSemana([true, true, true, true, true, true, true]);
    setOfertaActiva(true);
    setErrorCargaProductos(null);
  };

  const convertirDiasAString = (diasArray) => {
    return diasArray.map(dia => (dia ? "1" : "0")).join("");
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
    const yaExiste = productosSeleccionados.some(p => p.codbarra === producto.codbarra);

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

    setProductosSeleccionados(prev => [...prev, nuevoProducto]);
  };

  const handleEliminarProducto = (codbarra) => {
    setProductosSeleccionados(prev => prev.filter(p => p.codbarra !== codbarra));
  };

  /**
   * 💰 Calcula el valor TOTAL A PAGAR
   */
  const calcularValorTotal = () => {
    if (productosSeleccionados.length === 0 || !lleva || !paga) return 0;

    if (productosSeleccionados.length === 1) {
      const producto = productosSeleccionados[0];
      const precioUnitario = producto.precioVenta || 0;
      return precioUnitario * paga;
    }

    const precios = productosSeleccionados.map(p => p.precioVenta || 0);
    const sumaTotal = precios.reduce((sum, precio) => sum + precio, 0);
    const precioMenor = Math.min(...precios);
    return sumaTotal - precioMenor;
  };

  /**
   * 📊 Obtiene el detalle completo del cálculo
   */
  const obtenerDetalleCalculo = () => {
    if (productosSeleccionados.length === 0 || !lleva || !paga) return null;

    if (productosSeleccionados.length === 1) {
      const producto = productosSeleccionados[0];
      const precioUnitario = producto.precioVenta || 0;
      const unidadesGratis = lleva - paga;
      const totalSinDescuento = precioUnitario * lleva;
      const totalConDescuento = precioUnitario * paga;

      return {
        tipo: 'producto_unico',
        producto: producto.descripcionProducto,
        codbarra: producto.codbarra,
        precioUnitario,
        lleva,
        paga,
        unidadesGratis,
        totalSinDescuento,
        totalConDescuento,
        descuentoTotal: totalSinDescuento - totalConDescuento
      };
    }

    const precios = productosSeleccionados.map(p => p.precioVenta || 0);
    const totalSinDescuento = precios.reduce((sum, precio) => sum + precio, 0);
    const precioMenor = Math.min(...precios);
    const productoMenor = productosSeleccionados.find(p => p.precioVenta === precioMenor);
    const totalConDescuento = totalSinDescuento - precioMenor;

    return {
      tipo: 'productos_multiples',
      productos: productosSeleccionados.map(p => ({
        codbarra: p.codbarra,
        descripcion: p.descripcionProducto,
        precio: p.precioVenta,
        esMenor: p.precioVenta === precioMenor
      })),
      totalSinDescuento,
      precioMenor,
      productoMenor: productoMenor?.descripcionProducto,
      codbarraMenor: productoMenor?.codbarra,
      totalConDescuento,
      descuentoTotal: precioMenor,
      lleva,
      paga
    };
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
    if (!lleva || lleva <= 0) {
      showMessage("Debe ingresar una cantidad válida de productos a llevar");
      return false;
    }
    if (!paga || paga <= 0) {
      showMessage("Debe ingresar una cantidad válida de productos a pagar");
      return false;
    }
    if (paga >= lleva) {
      showMessage("La cantidad a pagar debe ser menor que la cantidad a llevar");
      return false;
    }
    
    const productosSinPrecio = productosSeleccionados.filter(p => !p.precioVenta || p.precioVenta === 0);
    if (productosSinPrecio.length > 0) {
      showMessage(`⚠️ ${productosSinPrecio.length} producto(s) no tienen precio configurado`);
      return false;
    }
    
    return true;
  };

  /**
   * 🏗️ Construye el objeto de oferta
   */
  const construirObjetoOferta = () => {
    const valorTotal = calcularValorTotal();
    let oferta_ListaCanasta = [];

    if (productosSeleccionados.length === 1) {
      const producto = productosSeleccionados[0];
      
      for (let i = 0; i < lleva; i++) {
        const esUnidadGratis = i >= paga;
        
        oferta_ListaCanasta.push({
          codbarra: producto.codbarra,
          descripcionProducto: producto.descripcionProducto,
          cantidad: 1,
          porcDescuento: esUnidadGratis ? 100 : 0,
        });
      }
    } else {
      const precioMenor = Math.min(...productosSeleccionados.map(p => p.precioVenta || 0));
      
      productosSeleccionados.forEach(producto => {
        const esProductoMenor = producto.precioVenta === precioMenor;
        
        oferta_ListaCanasta.push({
          codbarra: producto.codbarra,
          descripcionProducto: producto.descripcionProducto,
          cantidad: 1,
          porcDescuento: esProductoMenor ? 100 : 0,
        });
      });
    }

    return {
      codigoOferta: ofertaEditar.codigoOferta,
      codigoTipo: 3,
      descripcion: nombreOferta.trim(),
      fechaInicial: startDate.toISOString(),
      fechaFinal: endDate.toISOString(),
      horaInicio: startTime ? startTime.format("HH:mm") : "",
      horaFin: endTime ? endTime.format("HH:mm") : "",
      diasSemana: convertirDiasAString(diasSemana),
      fAplicaMix: productosSeleccionados.length > 1,
      activo: ofertaActiva,
      oferta_Regla: {
        signo: "=",
        cantidad: lleva,
        tipoDescuento: "$",
        valor: valorTotal,
        aplicacion: "Unidad",
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
    console.log("📤 ENVIANDO ACTUALIZACIÓN N x M");
    console.log(JSON.stringify(ofertaActualizada, null, 2));
    console.log("========================================");

    showLoading();

    Ofertas.updateOferta(
      ofertaActualizada,
      (data, response) => {
        console.log("✅ Oferta actualizada exitosamente:", data);
        hideLoading();
        showMessage("Oferta N x M actualizada exitosamente");
        limpiarFormulario();
        onClose();
        if (onOfertaActualizada) {
          setTimeout(() => onOfertaActualizada(), 100);
        }
      },
      (error) => {
        console.error("❌ Error al actualizar:", error);
        hideLoading();
        const mensajeError = error?.message || error?.descripcion || "Error desconocido";
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

  const detalleCalculo = obtenerDetalleCalculo();

  /**
   * 📊 Componente de Resumen Visual
   */
  const ResumenCalculo = () => {
    if (!lleva || !paga || !detalleCalculo) return null;

    if (detalleCalculo.tipo === 'producto_unico') {
      return (
        <Box sx={{ mt: 2, p: 2, backgroundColor: "#f0f7ff", borderRadius: 1, border: "1px solid #2196f3" }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            <strong>📊 Resumen - Producto Único</strong>
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            • Producto: <strong>{detalleCalculo.producto}</strong>
          </Typography>
          <Typography variant="body2" gutterBottom>
            • Código: <strong>{detalleCalculo.codbarra}</strong>
          </Typography>
          <Typography variant="body2" gutterBottom>
            • Precio unitario: <strong>${detalleCalculo.precioUnitario}</strong>
          </Typography>
          <Typography variant="body2" gutterBottom>
            • Lleva: <strong>{detalleCalculo.lleva}</strong> unidades
          </Typography>
          <Typography variant="body2" gutterBottom>
            • Paga: <strong>{detalleCalculo.paga}</strong> unidades
          </Typography>
          <Typography variant="body2" gutterBottom>
            • Gratis: <strong>{detalleCalculo.unidadesGratis}</strong> unidades (100% desc)
          </Typography>
          
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #2196f3' }}>
            <Typography variant="body2">
              • Total sin descuento: <strong>${detalleCalculo.totalSinDescuento}</strong>
            </Typography>
            <Typography variant="body2" color="success.main" fontWeight="bold">
              • Total a pagar: <strong>${detalleCalculo.totalConDescuento}</strong>
            </Typography>
            <Typography variant="body2" color="error.main" fontWeight="bold">
              💰 Ahorro: ${detalleCalculo.descuentoTotal}
            </Typography>
          </Box>
        </Box>
      );
    }

    if (detalleCalculo.tipo === 'productos_multiples') {
      return (
        <Box sx={{ mt: 2, p: 2, backgroundColor: "#fff8e1", borderRadius: 1, border: "1px solid #ffa726" }}>
          <Typography variant="subtitle2" color="warning.dark" gutterBottom>
            <strong>📊 Resumen - Productos Múltiples</strong>
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            • Productos: <strong>{detalleCalculo.productos.length}</strong>
          </Typography>
          
          <Box sx={{ ml: 2, my: 1 }}>
            {detalleCalculo.productos.map((prod, idx) => (
              <Typography 
                key={idx} 
                variant="caption" 
                display="block" 
                color={prod.esMenor ? "success.main" : "textSecondary"}
                fontWeight={prod.esMenor ? "bold" : "normal"}
              >
                {prod.esMenor ? "✓ " : "- "}{prod.descripcion}: ${prod.precio}
                {prod.esMenor && " (GRATIS)"}
              </Typography>
            ))}
          </Box>
          
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #ffa726' }}>
            <Typography variant="body2">
              • Producto gratis: <strong>{detalleCalculo.productoMenor}</strong>
            </Typography>
            <Typography variant="body2">
              • Total sin descuento: <strong>${detalleCalculo.totalSinDescuento}</strong>
            </Typography>
            <Typography variant="body2" color="success.main" fontWeight="bold">
              • Total a pagar: <strong>${detalleCalculo.totalConDescuento}</strong>
            </Typography>
            <Typography variant="body2" color="error.main" fontWeight="bold">
              💰 Ahorro: ${detalleCalculo.descuentoTotal}
            </Typography>
          </Box>
        </Box>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onClose={handleCerrar} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6"> Editar Oferta N x M</Typography>
      </DialogTitle>

      <DialogContent dividers>
        {errorCargaProductos && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorCargaProductos}
          </Alert>
        )}

        {cargandoProductos && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, gap: 2 }}>
            <CircularProgress size={30} />
            <Typography variant="body2" color="textSecondary">
              Cargando información de productos...
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nombre de la Oferta"
            value={nombreOferta}
            onChange={(e) => setNombreOferta(e.target.value)}
            fullWidth
            required
            placeholder="Ej: 3x2 en productos seleccionados"
          />

          <SearchListOffers
            refresh={refresh}
            setRefresh={setRefresh}
            onProductoSeleccionado={handleProductoSeleccionado}
          />

          {productosSeleccionados.length > 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Productos ({productosSeleccionados.length})
              </Typography>
              <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                      <TableCell><strong>Código</strong></TableCell>
                      <TableCell><strong>Descripción</strong></TableCell>
                      <TableCell align="center"><strong>Precio</strong></TableCell>
                      <TableCell align="center"><strong>Acción</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productosSeleccionados.map(producto => (
                      <TableRow 
                        key={producto.codbarra}
                        sx={{
                          backgroundColor: (!producto.precioVenta || producto.precioVenta === 0) 
                            ? '#fff3e0' 
                            : 'inherit'
                        }}
                      >
                        <TableCell>
                          <Chip label={producto.codbarra} size="small" color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell>{producto.descripcionProducto}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            {(!producto.precioVenta || producto.precioVenta === 0) && (
                              <WarningAmberIcon fontSize="small" color="warning" />
                            )}
                            <Typography 
                              variant="body2" 
                              fontWeight="bold"
                              color={(!producto.precioVenta || producto.precioVenta === 0) ? 'error' : 'primary'}
                            >
                              ${producto.precioVenta}
                            </Typography>
                          </Box>
                          {(!producto.precioVenta || producto.precioVenta === 0) && (
                            <Typography variant="caption" color="error" display="block">
                              Sin precio
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleEliminarProducto(producto.codbarra)}
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

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Lleva (N)"
              type="text"
              value={lleva || ""}
              onChange={(e) => handleNumericChange(setLleva, e.target.value)}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
              fullWidth
              required
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              helperText="Cantidad que se lleva el cliente"
            />
            <TextField
              label="Paga (M)"
              type="text"
              value={paga || ""}
              onChange={(e) => handleNumericChange(setPaga, e.target.value)}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
              fullWidth
              required
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              helperText="Cantidad que paga el cliente"
            />
          </Box>

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

export default DialogEditarOfertaNxM;