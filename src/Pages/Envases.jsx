import React, { useContext, useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, Dialog, Grid, IconButton, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Add from '@mui/icons-material/Add';

import SideBar from '../Componentes/NavBar/SideBar.jsx';
import AsocCliente from '../Componentes/Card-Modal/AsocCliente.jsx';
import PreciosGenerales from '../Componentes/Card-Modal/PreciosGenerales.jsx';
import BoxBuscador from '../Componentes/Card-Modal/BoxBuscador.jsx';
import PreciosPorCategoria from '../Componentes/Card-Modal/PreciosPorCategoria.jsx';
import PreciosPorClientes from '../Componentes/Precios/PreciosPorClientes.jsx';
import PreciosPorUnidadesVendidas from '../Componentes/Card-Modal/PreciosPorUnidadesVendidas.jsx';
import PreciosPorLista from '../Componentes/Card-Modal/PreciosPorLista.jsx';
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";
import Model from '../Models/Model';
import { Table } from 'react-bootstrap';
import SmallButton from '../Componentes/Elements/SmallButton.jsx';
import System from '../Helpers/System';
import EditIcon from "@mui/icons-material/Edit";
import EnvasesItem from './EnvasesItem.jsx';


export const defaultTheme = createTheme();

export default ({
}) => {


  const {
    showAlert,
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);


  const [envases, setEnvases] = useState([])
  const [hasResults, setHasResults] = useState(false);


  const loadInitial = () => {
    showLoading("Buscando la informacion")
    Model.getAllEnvases((envs) => {
      setEnvases(envs)
      hideLoading()
      setHasResults(true)
    }, (err) => {
      showAlert("No se pudo obtener la informacion")
      setHasResults(false)
      hideLoading()
    })
  }


  useEffect(() => {
    loadInitial()
  }, [])

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Box
        sx={{
          display: 'flex',
          padding: "10px",
          minHeight: '100px'
        }}>
        <SideBar />


        <Grid container spacing={2} sx={{
          margin: "10px 0",
          padding: "10px 0",
          textAlign: "left",
          // backgroundColor:"red"
        }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography variant='h4'>Envases</Typography>
          </Grid>


          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "gainsboro" }}>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {envases.map((envase, ix) => {
                    return envase.entrada != "Trabaja" ? (
                      <EnvasesItem
                        envaseInfo={envase}
                        key={ix}
                        onEdit={() => {
                          loadInitial()
                        }}
                      />) : (null)
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

