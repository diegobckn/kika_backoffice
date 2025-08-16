import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Paper,
  MenuItem,
  InputLabel,
  CircularProgress,
  Grid,
  Button,
  Dialog,
  Select,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import PaymentsIcon from "@mui/icons-material/Payments";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import EditDialog from "./EditDialog";
import ProductDialog from "./ProductDialog";
import ModelConfig from "../../../../Models/ModelConfig";

const validateDateInput = (e) => {
  const allowedKeys = [
    "Backspace",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Tab",
  ];
  if (allowedKeys.includes(e.key)) return;

  const dateRegex = /^(\d{0,4})-?(\d{0,2})-?(\d{0,2})$/;
  const currentValue = e.target.value;
  const newValue = currentValue + e.key;

  if (!dateRegex.test(newValue)) {
    e.preventDefault();
  }
};

const SearchListDocumento = () => {
  const apiUrl = ModelConfig.get("urlBase")

  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const hoy = dayjs();
  const inicioRango = dayjs().subtract(1, "week");

  const [editFormData, setEditFormData] = useState({
    idCabeceraCompra: 0,
    rut: "",
    tipoDocumento: "",
    fechaIngreso: "",
    folio: "",

    total: 0,
    proveedorCompraDetalleUpdates: [],
    proveedorCompraPagoUpdates: [],
  });

  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermFolio, setSearchTermFolio] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [compraToDelete, setCompraToDelete] = useState(null);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [openProduct, setOpenProduct] = useState(false);

  const [searchTermProd, setSearchTermProd] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(
    editFormData.proveedorCompraDetalleUpdates || []
  );

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        apiUrl + `/Proveedores/GetProveedorCompraByFecha`,
        {
          params: {
            fechaDesde: startDate.format("YYYY-MM-DD"),
            fechaHasta: endDate.format("YYYY-MM-DD"),
          },
        }
      );
      setData(response.data.proveedorCompraCabeceraReportes);
    } catch (error) {
      setError("Error fetching data");
    }
    setLoading(false);
  };
  // console.log("DAtos fechas", data);
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        apiUrl + `/Proveedores/DeleteProveedorCompra`,
        {
          params: {
            idCabeceraCompra: compraToDelete.idCabeceraCompra,
          },
        }
      );
      setSnackbarMessage(response.data.descripcion);
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      setSnackbarMessage("Error al eliminar el documento");
      setSnackbarOpen(true);
    }
  };

  const handleEdit = async () => {
    // Formatear la fecha de ingreso
    const formattedFechaIngreso = editFormData.fechaIngreso
      ? editFormData.fechaIngreso.toISOString()
      : null;

    // Formatear las fechas de los pagos
    const formattedPagos = editFormData.proveedorCompraPagoUpdates.map(
      (pago) => ({
        ...pago,
        fechaPago: pago.fechaPago ? pago.fechaPago.toISOString() : null,
      })
    );

    // Preparar los datos para enviar
    const dataToSend = {
      idCabeceraCompra: editFormData.idCabeceraCompra,
      tipoDocumento: editFormData.tipoDocumento,
      folio: editFormData.folio,
      codigoProveedor: editFormData.codigoProveedor,
      total: editFormData.total,
      fechaIngreso: formattedFechaIngreso, // Fecha formateada
      proveedorCompraDetalleUpdates:
        editFormData.proveedorCompraDetalleUpdates.map((detalle) => ({
          idDetalle: detalle.idDetalle,
          codProducto: detalle.codProducto,
          descripcionProducto: detalle.descripcionProducto,
          cantidad: detalle.cantidad,
          precioUnidad: detalle.precioUnidad,
          idCabeceraCompra: detalle.idCabeceraCompra, // Asegurarse de incluir idCabeceraCompra
        })),
      proveedorCompraPagoUpdates: formattedPagos.map((pago) => ({
        idPago: pago.idPago,
        fechaPago: pago.fechaPago, // Fecha formateada
        codigoUsuario: pago.codigoUsuario,
        montoPagado: pago.montoPagado,
        metodoPago: pago.metodoPago,
      })),
    };

    console.log("Datos a enviar:", dataToSend);

    try {
      const response = await axios.put(
        apiUrl + `/Proveedores/PutProveedorCompra`,
        dataToSend
      );

      console.log("Respuesta del servidor:", response.data); // Imprimir la respuesta del servidor
      setSnackbarMessage(response.data.descripcion);
      setSnackbarOpen(true);
      setEditDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error al editar el documento:", error); // Imprimir el error en caso de que ocurra
      setSnackbarMessage("Error al editar el documento");
      setSnackbarOpen(true);
    }
  };

  const filteredData = data.filter((compra) => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const lowercasedFolioFilter = searchTermFolio.toLowerCase();

    if (compra && compra.rut && compra.razonSocial && compra.folio) {
      const rut = compra.rut.toString().toLowerCase();
      const razonSocial = compra.razonSocial.toString().toLowerCase();
      const folio = compra.folio.toString().toLowerCase();
      return (
        (rut.includes(lowercasedFilter) ||
          razonSocial.includes(lowercasedFilter)) &&
        (folio.includes(lowercasedFolioFilter) || !lowercasedFolioFilter)
      );
    }
    return false;
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
  };
  const handleSearchFolio = (value) => {
    setSearchTermFolio(value);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = (compra) => {
    setSelectedCompra(compra);
    setOpenDialog(true);
  };
  const handleOpenProduct = () => {
    setOpenProduct(true);
  };
  const handleCloseProduct = () => {
    setOpenProduct(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCompra(null);
  };

  const handleOpenDeleteDialog = (compra) => {
    setCompraToDelete(compra);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCompraToDelete(null);
  };

  const handleOpenEditDialog = (compra) => {
    console.log(compra); // Verifica los datos de entrada

    setEditFormData({
      idCabeceraCompra: compra.idCabeceraCompra || "",
      tipoDocumento: compra.tipoDocumento || "",
      folio: compra.folio || "",
      codigoProveedor: compra.codigoProveedor || "",
      total: compra.total || 0,
      fechaIngreso: dayjs(compra.fechaIngreso) || null,
      proveedorCompraDetalleUpdates: compra.detalles.map((detalle) => ({
        idDetalle: detalle.idDetalle !== undefined ? detalle.idDetalle : "",
        codProducto:
          detalle.codProducto !== undefined ? detalle.codProducto : "",
        descripcionProducto: detalle.descripcionProducto || "",
        cantidad: detalle.cantidad !== undefined ? detalle.cantidad : 0,
        precioUnidad:
          detalle.precioUnidad !== undefined ? detalle.precioUnidad : 0,
      })),
      proveedorCompraPagoUpdates: compra.pagos.map((pago) => ({
        idPago: pago.idPago !== undefined ? pago.idPago : "",
        fechaPago: dayjs(pago.fechaPago) || null,
        total: pago.total !== undefined ? pago.total : 0,
        codigoUsuario: Number(pago.codigoUsuario) || 0, // Asegurarse de que sea un número entero
        montoPagado: pago.montoPagado !== undefined ? pago.montoPagado : 0,
        metodoPago: pago.metodoPago || "",
      })),
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleBuscarClick = () => {
    fetchData();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };
  const handleOpenProductDialog = () => {
    setOpenProduct(true);
  };

  const handleCloseProductDialog = () => {
    setOpenProduct(false);
  };
 
  


  // const handleAddProductToEdit = (product) => {
  //   setEditFormData((prevData) => {
  //     // Crear una nueva lista que sólo contiene el nuevo producto
  //     const updatedDetails = [
  //       {
  //         idDetalle: product.idProducto,
  //         codProducto: product.idProducto, // si es necesario agregar este campo
  //         descripcionProducto: product.nombre,
  //         cantidad: 1,
  //         precioUnidad: product.precioCosto,
  //       },
  //     ];
  
  //     return {
  //       ...prevData,
  //       proveedorCompraDetalleUpdates: updatedDetails,
  //     };
  //   });
  // };
  
  
  const handleAddProductToEdit = (product) => {

    
    setEditFormData((prevData) => ({
      ...prevData,
      proveedorCompraDetalleUpdates: [
        {
          idDetalle: product.idProducto,
          codProducto: product.idProducto, // Agregado este campo si es necesario
          descripcionProducto: product.nombre,
          cantidad: 1,
          precioUnidad: product.precioCosto,
        },
      ],
    }));
   
  };
  
  
  
  
  

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditDetailChange = (index, field, value) => {
    const updatedDetails = [...editFormData.proveedorCompraDetalleUpdates];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value,
    };
    setEditFormData((prevData) => ({
      ...prevData,
      proveedorCompraDetalleUpdates: updatedDetails,
    }));
  };

  const handleDeleteDetail = (index) => {
    const updatedDetails = [...editFormData.proveedorCompraDetalleUpdates];
    updatedDetails.splice(index, 1);
    setEditFormData((prevData) => ({
      ...prevData,
      proveedorCompraDetalleUpdates: updatedDetails,
    }));
  };




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

  const calculateTotal = () => {
    const total = selectedProducts.reduce(
      (sum, product) => sum + product.total,
      0
    );
    setGrandTotal(total);
  };


  // console.log("selectedProducts", selectedProducts);
  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Documentos de Compra" />
      </Tabs>
      <div role="tabpanel" hidden={selectedTab !== 0}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Inicio"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="DD/MM/YYYY"
                input={(params) => (
                  <TextField {...params} sx={{ mb: 2 }} fullWidth />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Término"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="DD/MM/YYYY"
                input={(params) => (
                  <TextField {...params} sx={{ mb: 2 }} fullWidth />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              sx={{ p: 2, mb: 4 }}
              variant="contained"
              onClick={handleBuscarClick}
              fullWidth
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Snackbar
            open={Boolean(error)}
            autoHideDuration={6000}
            message={error}
            onClose={handleSnackbarClose}
          />
        ) : (
          <>
            <Grid gap={3} sx={{ display: "flex" }}>
              <Grid item xs={12} md={8}>
                <TextField
                  sx={{ width: 500 }}
                  label="Buscar por RUT o Razón Social"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: 500 }}
                  label="Buscar por Folio"
                  variant="outlined"
                  value={searchTermFolio}
                  onChange={(e) => setSearchTermFolio(e.target.value)}
                />
              </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>RUT</TableCell>
                    <TableCell>Razón Social</TableCell>
                    <TableCell>Tipo Documento</TableCell>
                    <TableCell>Folio</TableCell>
                    <TableCell>Fecha Ingreso</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((compra) => (
                    <TableRow key={compra.idCabeceraCompra}>
                      <TableCell>{compra.idCabeceraCompra}</TableCell>
                      <TableCell>{compra.rut}</TableCell>
                      <TableCell>{compra.razonSocial}</TableCell>
                      <TableCell>{compra.tipoDocumento}</TableCell>
                      <TableCell>{compra.folio}</TableCell>
                      <TableCell>
                        {new Date(compra.fechaIngreso).toLocaleDateString(
                          "es-ES"
                        )}
                      </TableCell>
                      <TableCell>{compra.total}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => handleOpenDialog(compra)}
                        >
                          Detalle
                        </Button>
                        <IconButton
                          onClick={() => handleOpenDeleteDialog(compra)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleOpenEditDialog(compra)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </div>
      <Dialog
        maxWidth="lg"
        fullWidth
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Detalles del Documento</DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{ mt: 2, maxWidth: "90%", margin: "auto" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "gainsboro" }}>
                  <TableCell>
                    <strong>RUT</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Razón Social</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tipo Documento</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Folio</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Fecha Ingreso</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{selectedCompra?.rut}</TableCell>
                  <TableCell>{selectedCompra?.razonSocial}</TableCell>
                  <TableCell>{selectedCompra?.tipoDocumento}</TableCell>
                  <TableCell>{selectedCompra?.folio}</TableCell>
                  <TableCell>
                    {new Date(selectedCompra?.fechaIngreso).toLocaleDateString(
                      "es-ES"
                    )}
                  </TableCell>
                  <TableCell>{selectedCompra?.total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            Detalle de productos :
          </div>
          <TableContainer
            component={Paper}
            sx={{ mt: 2, maxWidth: "90%", margin: "auto" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "gainsboro" }}>
                  <TableCell>Producto</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio Unidad</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedCompra?.detalles.map((detalle) => (
                  <TableRow key={detalle.idDetalle}>
                    <TableCell>{detalle.descripcionProducto}</TableCell>
                    <TableCell>{detalle.cantidad}</TableCell>
                    <TableCell>{detalle.precioUnidad}</TableCell>
                    <TableCell>
                      {detalle.cantidad * detalle.precioUnidad}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            Detalles de Pagos :
          </div>
          <TableContainer
            component={Paper}
            sx={{ mt: 2, maxWidth: "90%", margin: "auto" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "gainsboro" }}>
                  <TableCell>Monto Pagado</TableCell>
                  <TableCell>Método de Pago</TableCell>
                  <TableCell>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedCompra?.pagos.map((pagos) => (
                  <TableRow key={pagos.idPago}>
                    <TableCell>{pagos.montoPagado}</TableCell>
                    <TableCell>{pagos.metodoPago}</TableCell>
                    <TableCell>
                      {new Date(pagos.fechaPago).toLocaleDateString("es-ES")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="contained"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <EditDialog
        editDialogOpen={editDialogOpen}
        handleCloseEditDialog={handleCloseEditDialog}
        editFormData={editFormData}
        handleEditFormChange={handleEditFormChange}
        handleNumericKeyDown={handleNumericKeyDown}
        handleEditDetailChange={handleEditDetailChange}
        handleOpenProduct={handleOpenProduct}
        handleDeleteDetail={handleDeleteDetail}
        // handleEditPaymentChange={handleEditPaymentChange}
        handleEdit={handleEdit}
      />
        <ProductDialog 
        openProduct={openProduct} 
        handleCloseProduct={handleCloseProductDialog} 
        handleAddProductToEdit={handleAddProductToEdit} 
      />


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este documento?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDelete} variant="contained" color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchListDocumento;
