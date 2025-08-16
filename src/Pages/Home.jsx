import React, { useState, useContext, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import SideBar from '../Componentes/NavBar/SideBar';
import CardTotalCompras from '../Componentes/Home/CardTotalCompras';
import CardTotalVentas from '../Componentes/Home/CardTotalVentas';

import { useNavigate } from "react-router-dom";
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";
import ModelConfig from '../Models/ModelConfig';
import dayjs from 'dayjs';
import axios from 'axios';
import User from '../Models/User';
import LongClick from '../Helpers/LongClick';
import SucursalCaja from '../Models/SucursalCaja';
import System from '../Helpers/System';
import CardSemaforo from '../Componentes/Home/CardSemaforo';
import CardUsuariosActivos from '../Componentes/Home/CardUsuariosActivos';
import CardUsuariosInactivos from '../Componentes/Home/CardUsuariosInactivos';
import Validator from '../Helpers/Validator';
import CardTotalPreventasTodas from '../Componentes/Home/CardTotalPreventasTodas';
import CardTotalPreventasUsadas from '../Componentes/Home/CardTotalPreventasUsadas';
import CardTotalPreventasDescartadas from '../Componentes/Home/CardTotalPreventasDescartadas';
import Product from '../Models/Product';
import CardEstadoCajas from '../Componentes/Home/CardEstadoCajas';

const defaultTheme = createTheme();

const Home = ({ }) => {

  const {
    userData,
    showMessage,
    showAlert,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const [usuariosActivos, setUsuariosActivos] = useState([])

  const [roles, setRoles] = useState([])
  const [rol, setRol] = useState("rol")

  const [productosCriticos, setProductosCriticos] = useState(0)
  const navigate = useNavigate();

  const solicitarRoles = () => {

    User.getRoles((roles, response) => {
      window.roles = roles
      setRoles(roles)
    }, (error) => {
      console.log(error);
    })
  }

  const revisarStockCriticos = () => {
    Product.getInstance().getCriticosPaginate({
      pageNumber: 1,
      rowPage: 10
    }, (prods, response) => {
      setProductosCriticos(response.data.cantidadRegistros)
    }, (error) => {
      console.log("error al buscar productos criticos", error)
    })
  }

  const checkRol = (roles) => {
    if (!userData) {
      return
    }
    if (Validator.isNumeric(userData.rol)) {

      roles.forEach((rolx) => {
        if (rolx.idRol == userData.rol) {
          setRol(rolx.rol)
        }
      })

    } else {
      return userData.rol
    }

    return userData ? userData.rol : 'rol'
  }

  useEffect(() => {
    solicitarRoles()
    revisarStockCriticos()
  }, [])

  useEffect(() => {
    if (productosCriticos > 0) {
      showConfirm("Se han detectado productos en su nivel o menor de stock critico, ¿Desea ver cuales son?", () => {
        navigate("/reportes/stockcriticos");
      })
    }
  }, [productosCriticos])

  useEffect(() => {
    checkRol(roles)
  }, [userData, roles])



  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <SideBar />
        <Box sx={{ flex: 1, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">
              Bienvenido {userData ? `${userData.nombres} ${userData.apellidos}` : 'Usuario'}
            </Typography>

          </Box>
          <Typography variant="h6">
            Rol: {rol}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <CardSemaforo />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}></Grid>


            <Grid item xs={12} sm={12} md={6} lg={6}>
              <CardTotalCompras />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <CardTotalVentas />
            </Grid>


            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Typography sx={{
                marginTop: "50px"
              }}>Preventas</Typography>
            </Grid>


            <Grid item xs={12} sm={12} md={4} lg={4}>
              <CardTotalPreventasTodas />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4}>
              <CardTotalPreventasUsadas />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4}>
              <CardTotalPreventasDescartadas />
            </Grid>





            <Grid item xs={12} sm={12} md={12} lg={12}>
              <CardUsuariosActivos setActivos={setUsuariosActivos} />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <CardUsuariosInactivos usuariosActivos={usuariosActivos} />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <CardEstadoCajas
              setInactivos={setUsuariosActivos} />
            </Grid>

          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Home;