import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";

import Tooltip from "@mui/material/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import * as xlsx from "xlsx/xlsx.mjs";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Grid,
  Paper,
  Box,
  TextField,
  IconButton,
  Button,
  CircularProgress,
  MenuItem,
  InputLabel,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ModelConfig from "../../Models/ModelConfig";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import User from "../../Models/User";
import Proveedor from "../../Models/Proveedor";
import { Check, Dangerous } from "@mui/icons-material";

const IngresoPV = ({ 
  onClose,
  onFinish
 }) => {
  const apiUrl = ModelConfig.get().urlBase;
  
  const [rut, setRut] = useState("");
  const [rutOk, setRutOk] = useState(null);

  const [razonSocial, setRazonSocial] = useState("");
  const [giro, setGiro] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [region, setRegion] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [pagina, setUlrPagina] = useState("");
  const [formaPago, setFormaPago] = useState("");
  const [nombreResponsable, setNombreResponsable] = useState("");
  const [correoResponsable, setcorreoResponsable] = useState("");
  const [telefonoResponsable, setTelefonoResponsable] = useState("");
  const [errors, setErrors] = useState([]);
  const [response, setResponse] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const theme = createTheme();
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedComuna, setSelectedComuna] = useState("");
  const [camposVacios, setCamposVacios] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [regionOptions, setRegionOptions] = useState([]);
  const [comunaOptions, setComunaOptions] = useState([]);

  const {
    userData, 
    showMessage
  } = useContext(SelectedOptionsContext);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Reset loading to false on unmount
    return () => setLoading(false);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = xlsx.read(data, { type: "array" });

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        if (jsonData.length > 0) {
          const firstDataRow = jsonData[0];
          setRazonSocial(firstDataRow.razonSocial || "");
          setGiro(firstDataRow.giro || "");
          setEmail(firstDataRow.email || "");
          setDireccion(firstDataRow.direccion || "");
          setTelefono(firstDataRow.telefono || "");
          setRegion(firstDataRow.region || "");
          setComuna(firstDataRow.comuna || "");
          setSucursal(firstDataRow.sucursal || "");
          setUlrPagina(firstDataRow.pagina || "");
          setFormaPago(firstDataRow.formaPago || "");
          setRut(firstDataRow.rut || "");
          setNombreResponsable(firstDataRow.nombreResponsable || "");
          setcorreoResponsable(firstDataRow.correoResponsable || "");
          setTelefonoResponsable(firstDataRow.telefonoResponsable || "");
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExportExcel = () => {
    const jsonData = [
      {
        razonSocial: razonSocial,
        giro: giro,
        email: email,
        direccion: direccion,
        telefono: telefono,
        comuna: comuna,
        region: region,
        sucursal: sucursal,
        pagina: pagina,
        formaPago: formaPago,
        rut: rut,
        nombreResponsable: nombreResponsable,
        correoResponsable: correoResponsable,
        telefonoResponsable: telefonoResponsable,
      },
    ];

    const worksheet = xlsx.utils.json_to_sheet(jsonData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(excelBlob, "exported_data.xlsx");
  };

  useEffect(() => {
    if (formSubmitted && response) {
      setShowModal(true);
    }
  }, [formSubmitted, response]);

  const handleCloseModal = () => {
    setShowModal(false);
    setFormSubmitted(false);
  };

  useEffect(() => {
    axios
      .get(`${apiUrl}/RegionComuna/GetAllRegiones`)
      .then((response) => {
        setRegiones(response.data.regiones);
      })
      .catch((error) => {
        console.error("Error al obtener las regiones:", error);
      });
  }, []);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(
         `${apiUrl}/RegionComuna/GetAllRegiones`
        );
        setRegionOptions(response.data.regiones);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    const fetchComunas = async () => {
      if (selectedRegion) {
        try {
          const response = await axios.get(
            `${apiUrl}/RegionComuna/GetComunaByIDRegion?IdRegion=${selectedRegion}`
          );
          setComunaOptions(
            response.data.comunas.map((comuna) => comuna.comunaNombre)
          );
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchComunas();
  }, [selectedRegion]);


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    
    // Prevenir espacios en cualquier parte del correo
    const lastChar = inputEmail.charAt(inputEmail.length - 1);
    if (lastChar === " ") {
      e.target.value = inputEmail.slice(0, -1);
      return;
    }
    
    setEmail(inputEmail.trim()); // Remover espacios en los extremos
  
    setErrors((prevErrors) => {
      const hasSpaces = /\s/.test(inputEmail); // Verifica si hay espacios en cualquier parte
      const isEmpty = !inputEmail.trim();
      const isValidFormat = validateEmail(inputEmail.trim());
  
      return {
        ...prevErrors,
        correo: isEmpty
          ? "Favor completar email"
          : hasSpaces
          ? "El correo no debe contener espacios"
          : !isValidFormat
          ? "Formato de correo no es válido"
          : "",
      };
    });
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const errors = [];
    const validateUrl = (url) => {
      // Expresión regular para validar una URL sin prefijos
      const urlRegex =
        /^(([\w-]+\.)*[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

      return urlRegex.test(url);
    };

    // Validaciones
    if (!rut) {
      errors.rut = "Favor completar rut ";
    } else if (!validarRutChileno(rut)) {
      errors.rut = "El RUT ingresado NO es válido.";
    }

    if (!razonSocial) {
      errors.razonSocial = "Favor completar razon social";
    }

    if (!giro) {
      errors.giro = "Favor completar giro";
    }

    if (!email) {
      errors.email = "Favor completar email";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/.test(email)) {
      errors.email = "Formato de email no es válido";
    }

    if (!telefono) {
      errors.telefono = "Favor completar telefono";
    }

    if (!direccion) {
      errors.direccion = "Favor completar direccion";
    }

    if (!selectedRegion) {
      errors.region = "Favor completar region";
    }

    if (!selectedComuna) {
      errors.comuna = "Favor completar comuna";
    }

    if (!sucursal) {
      errors.sucursal = "Favor completar sucursal";
    }

    if (!pagina) {
      errors.pagina = "Favor completar página web";
    } else if (!validateUrl(pagina)) {
      errors.pagina = "La URL ingresada NO es válida.";
    }

    if (!formaPago) {
      errors.formaPago = "Favor completar forma de pago";
    }

    if (!nombreResponsable) {
      errors.nombreResponsable = "Favor completar nombre del responsable";
    }

    if (!correoResponsable) {
      errors.correoResponsable = "Favor completar correo del responsable";
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/.test(correoResponsable)) {
      errors.correoResponsable = "Formato de correo responsable no es válido";
    }

    if (!telefonoResponsable) {
      errors.telefonoResponsable = "Favor completar telefono del responsable";
    }

    // Validación para campos vacíos
    if (
      Object.values({
        rut,
        razonSocial,
        giro,
        email,
        telefono,
        direccion,
        region,
        comuna,
        sucursal,
        pagina,
        formaPago,
        nombreResponsable,
        correoResponsable,
        telefonoResponsable,
      }).every((value) => !value)
    ) {
      setCamposVacios("Todos los campos están vacíos, Favor completar");
      setLoading(false);

      return;
    } else {
      setCamposVacios("");
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setLoading(false); // Habilitar el botón si hay errores

      return;
    } else {
      const cliente = {
        razonSocial,
        giro,
        email,
        sucursal,
        direccion,
        telefono,
        region: selectedRegion.toString(),
        comuna: selectedComuna,
        pagina,
        formaPago,
        rut,
        nombreResponsable,
        correoResponsable,
        telefonoResponsable,
      };
      console.log("Datos a enviar:", cliente); // Aquí se muestran los datos en la consola

      try {
        const response = await axios.post(
          `${apiUrl}/Proveedores/AddProveedor`,
          cliente
        );
        setResponse(response.data);
        setFormSubmitted(true);
        setLoading(false);

        console.log("respuesta post", response);
        if (response.status === 201) {
          setSnackbarMessage("Proveedor creado con éxito");
          setSnackbarOpen(true);
          setRazonSocial("");
          setGiro("");
          setEmail("");
          setDireccion("");
          setTelefono("");
          setSucursal("");
          setSelectedRegion("");
          setSelectedComuna("");
          setUlrPagina("");
          setFormaPago("");
          setRut("");
          setNombreResponsable("");
          setcorreoResponsable("");
          setTelefonoResponsable("");

          setTimeout(() => {
            onClose(); ////Cierre Modal al finalizar
          }, 2000);

          onFinish()
        }
      } catch (error) {
        console.error(error);
        setSnackbarMessage("Error al crear el proveedor");
        setOpenSnackbar(true);
        setLoading(false);
      }
    }
  };

  const handleNumericKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;
  
    if(event.key == "Tab"){
      return
    }

    // Verifica si el carácter es un número, backspace o delete
    if (
    !/\d/.test(key) && // números
      key!== 'Backspace' && // backspace
      key!== 'Delete' // delete
    ) {
      event.preventDefault();
    }
  
    // Previene espacios iniciales y al final de la cadena
    if (
      key === ' ' &&
      (input.length === 0 || input.endsWith(' '))
    ) {
      event.preventDefault();
    }
  };
  
  const handleTextKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    if(event.key == "Tab"){
      return
    }
  
    // Verifica si el carácter es alfanumérico o uno de los caracteres permitidos
    if (
     !/^[a-zA-Z0-9]$/.test(key) && // letras y números
      key!== ' ' && // espacio
      key!== 'Backspace' && // backspace
      key!== 'Delete' // delete
    ) {
      event.preventDefault();
    }
  
    // Previene espacios iniciales y al final de la cadena
    if (
      key === ' ' &&
      (input.length === 0 || input.endsWith(' '))
    ) {
      event.preventDefault();
    }
  };
  const handleEmailKeyDown = (event) => {

    if(event.key == "Tab"){
      return
    }

    const charCode = event.which ? event.which : event.keyCode;
  
    // Prevenir espacios en cualquier parte del correo
    if (charCode === 32) { // 32 es el código de la tecla espacio
      event.preventDefault();
    }
  };
  const handleRUTKeyDown = (event) => {
    if(event.key == "Tab"){
      return
    }
    const key = event.key;
    const input = event.target.value;
  
    
    if (
     !isNaN(key) || // números
      key === 'Backspace' || // backspace
      key === 'Delete' || // delete
      (key === '-' && !input.includes('-')) ||// guion y no hay guion previamente
      (key === 'k' && !input.includes('k')) // guion y no hay guion previamente
    ) {
      // Permitir la tecla
    } else {
      // Prevenir cualquier otra tecla
      event.preventDefault();
    }
  
    // Prevenir espacios iniciales y asegurar que el cursor no esté en la posición inicial
    if (key === ' ' && (input.length === 0 || event.target.selectionStart === 0)) {
      event.preventDefault();
    }
  };

  const handleTextOnlyKeyDown = (event) => {
    if(event.key == "Tab"){
      return
    }

    const key = event.key;
    const input = event.target.value;
  
    // Verifica si el carácter es una letra (mayúscula o minúscula), espacio, backspace o delete
    if (
     !/[a-zA-Z]/.test(key) && // letras mayúsculas y minúsculas
      key!== ' ' && // espacio
      key!== 'Backspace' && // backspace
      key!== 'Delete' // delete
    ) {
      event.preventDefault();
    }
  
    // Previene espacios iniciales y al final de la cadena
    if (
      key === ' ' &&
      (input.length === 0 || input.endsWith(' '))
    ) {
      event.preventDefault();
    }
  };
  
  const checkRut = ()=>{
    // console.log("checkRut")
    if(rut === "") return

    Proveedor.getInstance().existRut({
      rut
    },(proveedores)=>{
      // console.log(proveedores)
      if(proveedores.length>0){
        showMessage("Ya existe el rut ingresado")
        setRutOk(false)
      }else{
        showMessage("Rut disponible")
        setRutOk(true)
      }
    }, (err)=>{
      console.log(err)
      if(err.response.status == 404){
        showMessage("Rut disponible")
        setRutOk(true)
      }
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          py: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 2, borderRadius: 2, maxWidth: 1200, width: "100%" }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h2>Ingreso Proveedores</h2>
              </Grid>
              <Grid item xs={12} md={12}>
                {/* {Object.keys(errors).length > 0 && (
          <div style={{ color: "red", marginBottom: "1%", marginTop: "1%" }}>
            <ul>{Object.values(errors).map((error, index) => <li key={index}>{error}</li>)}</ul>
          </div>
        )} */}

                {Object.keys(errors).length > 0 && (
                  <div
                    style={{
                      color: "red",
                      marginBottom: "1%",
                      marginTop: "1%",
                    }}
                  >
                    <ul>{Object.values(errors)[0]}</ul>
                  </div>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                {camposVacios && (
                  <p style={{ color: "red" }}> {camposVacios}</p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel sx={{ marginBottom: "2%", }}>
                  Ingresa rut sin puntos y con guión
                </InputLabel>
                <TextField
                  fullWidth
                 
                  id="rut"
                  label="ej: 11111111-1"
                  name="rut"
                  autoComplete="rut"
                  autoFocus
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  onKeyDown={handleRUTKeyDown}
                  onBlur={checkRut}

                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <Check sx={{
                          color:"#06AD16",
                          display: (rutOk && rut!="" ? "flex" : "none"),
                          marginRight:"10px"
                        }} />
        
                        <Dangerous sx={{
                          color:"#CD0606",
                          display: ( ( rutOk === false ) ? "flex" : "none")
                        }} />
                      </InputAdornment>
                    ),
                  }}
                  />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel sx={{ marginBottom: "2%", }}>
                  Ingresa Razón social
                </InputLabel>
                <TextField
                  label="Razón social"
                  fullWidth
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value)}
                  // error={!!errors.razonSocial}
                  // helperText={errors.razonSocial}
                  onKeyDown={handleTextKeyDown}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel sx={{ marginBottom: "2%", }}>
                  Ingresa Giro
                </InputLabel>
                <TextField
                  label="Giro"
                  fullWidth
                  value={giro}
                  onChange={(e) => setGiro(e.target.value)}
                  // error={!!errors.giro}
                  // helperText={errors.giro}
                  onKeyDown={handleTextOnlyKeyDown}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel sx={{ marginBottom: "2%",  }}>
                  Ingresa Correo Electrónico
                </InputLabel>
                <TextField
                  label="Email"
                  fullWidth
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyDown={handleEmailKeyDown}
                  // helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa Teléfono
                </InputLabel>
                <TextField
                  fullWidth
               
                  id="telefono"
                  label="Teléfono"
                  name="telefono"
                  autoComplete="telefono"
                  
                  value={telefono}
                  onKeyDown={handleNumericKeyDown}
                  onChange={(e) => setTelefono(e.target.value)}
                  inputProps={{
                    maxLength: 12,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa Dirección
                </InputLabel>
                <TextField
                  label="Dirección"
                  fullWidth
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  onKeyDown={handleTextKeyDown}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Selecciona Región
                </InputLabel>
                <TextField
                 
                  fullWidth
                  id="region"
                  select
                  label="Región"
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                  }}
                >
                  {regionOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.regionNombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Selecciona Comuna
                </InputLabel>
                <TextField
              
                  id="comuna"
                  select
                  fullWidth
                  label="Comuna"
                  value={selectedComuna}
                  onChange={(e) => {
                    const comunaValue = e.target.value;
                    setSelectedComuna(e.target.value);
                  }}
                >
                  {comunaOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa Sucursal
                </InputLabel>
                <TextField
                  label="Sucursal"
                  fullWidth
                  value={sucursal}
                  onChange={(e) => setSucursal(e.target.value)}
                  onKeyDown={handleTextKeyDown}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa Página Web
                </InputLabel>
                <TextField
                  label="Página Web"
                  fullWidth
                  value={pagina}
                  onChange={(e) => setUlrPagina(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa Forma de Pago
                </InputLabel>
                <TextField
                  label="Forma de Pago"
                  fullWidth
                  value={formaPago}
                  onChange={(e) => setFormaPago(e.target.value)}
                  // onKeyDown={handleTextKeyDown}
                  onKeyDown={handleTextOnlyKeyDown}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa Nombre del Responsable
                </InputLabel>
                <TextField
                  label="Nombre del Responsable"
                  fullWidth
                  value={nombreResponsable}
                  onChange={(e) => setNombreResponsable(e.target.value)}
                  onKeyDown={handleTextOnlyKeyDown}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa Correo Electrónico del Responsable
                </InputLabel>
                <TextField
                  fullWidth
                
                  type="email"
                  id="correo"
                  label="Correo Electrónico"
                  name="correo"
                  autoComplete="correo"
                  
                  value={correoResponsable}
                  onChange={(e) => setcorreoResponsable(e.target.value)}
                  onKeyDown={handleEmailKeyDown}
                />
                {/* <TextField
                  label="Correo del Responsable"
                  fullWidth
                  value={correoResponsable}
                  onChange={(e) => setcorreoResponsable(e.target.value)}
                  error={!!errors.correoResponsable}
                  helperText={errors.correoResponsable}
                /> */}
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa Teléfono del Responsable
                </InputLabel>
                <TextField
                  label="Teléfono del Responsable"
                  fullWidth
                  value={telefonoResponsable}
                  onChange={(e) => setTelefonoResponsable(e.target.value)}
                  onKeyDown={handleNumericKeyDown}
                  inputProps={{
                    maxLength: 12,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" disabled={loading} variant="contained"
                  sx={{
                    height:"50px",
                    width:"50%",
                    minWidth:"100px",
                    margin:"0 25%"
                  }}
                >
                  {loading ? (
                    <>
                      Guardando... <CircularProgress size={24} />
                    </>
                  ) : (
                    "Guardar"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Box>
    </ThemeProvider>
  );
};

export default IngresoPV;
