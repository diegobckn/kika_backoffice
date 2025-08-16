import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Snackbar,
  Grid,
} from "@mui/material";
import axios from "axios";
import ModelConfig from "../../Models/ModelConfig";

const EditarCliente = ({ open, handleClose, cliente, onEditSuccess }) => {
  const apiUrl = ModelConfig.get().urlBase;
  const [editedCliente, setEditedCliente] = useState({});
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    setEditedCliente(cliente); // Al recibir un nuevo cliente, actualizamos el estado de cliente editado
    setSelectedRegion(cliente.regionId); // Actualizamos la región seleccionada
    setSelectedComuna(cliente.comunaId); // Actualizamos la comuna seleccionada
  }, [cliente]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedCliente((prevCliente) => ({
      ...prevCliente,
      [name]: value,
    }));
  };
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedComuna, setSelectedComuna] = useState("");
  console.log("editedCliente:", editedCliente);
  useEffect(() => {
    // Obtener regiones
    axios
      .get(`${apiUrl}/RegionComuna/GetAllRegiones`)
      .then((response) => {
        setRegiones(response.data.regiones);
      })
      .catch((error) => {
        console.error("Error al obtener las regiones:", error);
      });
  }, []);

  const handleRegionChange = (event) => {
    const selectedRegionId = event.target.value;

    setSelectedRegion(selectedRegionId);

    // Obtener comunas para la región seleccionada
    axios
      .get(
        apiUrl + `/RegionComuna/GetComunaByIDRegion?IdRegion=${selectedRegionId}`
      )
      .then((response) => {
        setComunas(response.data.comunas);
      })
      .catch((error) => {
        console.error("Error al obtener las comunas:", error);
      });
  };

  const handleSaveChanges = async () => {
    try {
      const updatedCliente = {
        codigoCliente: editedCliente.codigoCliente || "",
        rut: editedCliente.rut || "",
        nombre: editedCliente.nombre || "",
        apellido: editedCliente.apellido || "",
        direccion: editedCliente.direccion || "",
        telefono: editedCliente.telefono || "",
        region: (selectedRegion || "").toString(),
        comuna: selectedComuna || "", // Incluir comuna seleccionada
        correo: editedCliente.correo || "",
        giro: editedCliente.giro || "",
        urlPagina: editedCliente.urlPagina || "",
        formaPago: editedCliente.formaPago || "",
        usaCuentaCorriente: editedCliente.usaCuentaCorriente || 0,
        razonSocial: editedCliente.razonSocial || "",
      };

      // Depuración: Imprimir datos antes de la solicitud
      console.log("Datos enviados antes de la solicitud:", updatedCliente);

      const response = await axios.put(
        `${apiUrl}/Clientes/PutClienteCliente`,
        updatedCliente
      );

      // Depuración: Imprimir detalles de la respuesta
      console.log("Respuesta del servidor:", response);

      if (response.status === 200) {
        setSnackbarMessage(response.data.descripcion);
        setSnackbarOpen(true);
        onEditSuccess();
      } else {
        throw new Error("No se pudo editar el cliente");
      }

      // Depuración: Imprimir datos después de la solicitud
      console.log("Datos recibidos después de la solicitud:", response.data);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);

      // Depuración: Imprimir detalles del error
      if (error.response) {
        console.error("Respuesta de error del servidor:", error.response);
      } else if (error.request) {
        console.error("Solicitud sin respuesta:", error.request);
      } else {
        console.error("Error general:", error.message);
      }

      // Lógica para manejar el error
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent>
          <Grid container item xs={12} sm={12} md={12} lg={12} spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                name="nombre"
                value={editedCliente.nombre || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dirección"
                name="direccion"
                value={editedCliente.direccion || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Giro"
                name="giro"
                value={editedCliente.giro || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                name="telefono"
                value={editedCliente.telefono || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                select
                label="Región"
                value={editedCliente.region}
                onChange={handleRegionChange}
                fullWidth
              >
                {regiones.map((region) => (
                  <MenuItem key={region.id} value={region.id}>
                    {region.regionNombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                error={!!errors.comuna}
                select
                label="Comuna"
                value={editedCliente.comuna}
                onChange={(e) => setSelectedComuna(e.target.value)}
                fullWidth
              >
                {comunas.map((comuna) => (
                  <MenuItem key={comuna.id} value={comuna.comunaNombre}>
                    {comuna.comunaNombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
          <Button onClick={handleSaveChanges} color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
};

export default EditarCliente;
