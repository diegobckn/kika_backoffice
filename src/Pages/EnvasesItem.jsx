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
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider.jsx";
import Model from '../Models/Model';
import { Table } from 'react-bootstrap';
import SmallButton from '../Componentes/Elements/SmallButton.jsx';
import System from '../Helpers/System';
import EditIcon from "@mui/icons-material/Edit";
import ListIcon from "@mui/icons-material/List";
import FormPrecioEnvase from '../Componentes/ScreenDialog/FormPrecioEnvase.jsx';
import EnvasesVerProductos from '../Componentes/ScreenDialog/EnvasesVerProductos.jsx';


export default ({
  envaseInfo,
  onEdit
}) => {


  const {
    showAlert,
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [showEdit, setShowEdit] = useState(false)
  const [showProds, setShowProds] = useState(false)

  return (
    <TableRow>
      <TableCell>
        {envaseInfo.grupo}
      </TableCell>
      <TableCell>
        ${System.formatMonedaLocal(parseFloat(envaseInfo.valor), false)}
      </TableCell>
      <TableCell>
        <IconButton onClick={() => {
          console.log("editar")
          setShowEdit(true)
        }}>
          <EditIcon />
        </IconButton>
        <Button onClick={() => {
          console.log("Ver productos")
          setShowProds(true)
        }}>
          <ListIcon />
          <Typography>Ver productos</Typography>
        </Button>

        <FormPrecioEnvase
          openDialog={showEdit}
          setOpenDialog={setShowEdit}
          envase={envaseInfo}
          onComplete={() => {
            onEdit()
          }}
          isEdit={true}
        />

        <EnvasesVerProductos
          openDialog={showProds}
          setOpenDialog={setShowProds}
          envase={envaseInfo}
        />
      </TableCell>
    </TableRow>

  );
};

