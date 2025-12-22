import React, { useState, useContext, useEffect } from "react";
import {
  Typography,
  Grid,
  Button,
  TableRow,
  TableCell,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  CardHeader
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";
import { Person, Search } from "@mui/icons-material";
import { Box } from "@mui/system";
import Client from "../../Models/Client";
import SmallButton from "./SmallButton";

export default ({
  onSelect,
  onSetNull = () => { }
}) => {

  const {
    showLoading,
    hideLoading,
    showAlert,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [busqueda, setBusqueda] = useState('');
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const cargarClientes = () => {
    const clientModel = Client.getInstance();
    clientModel.getAllFromServer((clientes) => {
      setClientes(clientes);
    }, (error) => {
      console.error("Error al obtener clientes:", error);
      showMessage(`Error al cargar clientes: ${error}`);
    }
    );
  };

  // Filtrar clientes por búsqueda
  const clientesFiltrados = busqueda
    ? clientes.filter(cliente => {
      return (
        (cliente.nombre && cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
        (cliente.apellido && cliente.apellido.toLowerCase().includes(busqueda.toLowerCase())) ||
        (cliente.rut && cliente.rut.toLowerCase().includes(busqueda.toLowerCase()))
      );
    })
    : clientes;

  useEffect(() => {
    cargarClientes();
  }, []);

  return (<Grid container spacing={3}>

    {clienteSeleccionado ? (
      <Grid item xs={12}>
        <CardHeader
          title={
            <Typography variant="h5">
              Cliente:
              <Box component="span" color="primary.main" ml={1}>
                {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}

                <SmallButton textButton={"Cambiar"} actionButton={() => {
                  setClienteSeleccionado(null)
                  onSetNull()
                }} />
              </Box>
            </Typography>
          }
        />
      </Grid>
    ) : (
      <>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Buscar cliente"
            placeholder="Nombre, apellido o RUT..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Seleccionar Cliente
          </Typography>
          <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
            {clientesFiltrados.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  No se encontraron clientes
                </Typography>
              </Box>
            ) : (
              <List>
                {clientesFiltrados.map((cliente, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      button
                      onClick={() => {
                        onSelect(cliente)
                        setClienteSeleccionado(cliente)
                      }}
                      sx={{
                        backgroundColor: clienteSeleccionado?.codigoCliente === cliente.codigoCliente
                          ? 'action.selected'
                          : 'background.paper',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${cliente.nombre} ${cliente.apellido}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" display="block">
                              RUT: {cliente.rut}
                            </Typography>
                            <Typography component="span" variant="body2" display="block">
                              {cliente.direccion}, {cliente.comuna}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < clientesFiltrados.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </>
    )}
  </Grid >)
};
