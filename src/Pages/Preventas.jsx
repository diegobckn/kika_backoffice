import React, { useContext, useEffect, useState } from "react";
import {
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Snackbar,
  IconButton,
  Collapse,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import SideBar from "../Componentes/NavBar/SideBar";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ReporteVenta from "../Models/ReporteVenta";
import System from "../Helpers/System";
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";
import SmallButton from "../Componentes/Elements/SmallButton";
import PreventaDetalle from "../Componentes/ScreenDialog/PreventaDetalle";
import EstadosPreventa, { EstadosPreventaFiltrar } from "../definitions/EstadosPreventa";
import BoxOptionList from "../Componentes/Elements/BoxOptionList";
import User from "../Models/User";



const Preventa = () => {

  const {
    userData,
    showMessage,
    showAlert,
    showConfirm,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [data, setData] = useState([]);
  const [todas, setTodas] = useState([]);
  const [usuariosParaFiltrar, setUsuariosParaFiltrar] = useState([]);

  const [usuarios, setUsuarios] = useState([]);



  const [showDetail, setShowDetail] = useState(false);
  const [detailInfo, setDetailInfo] = useState(null);

  const [filtroEstado, setfiltroEstado] = useState(-1)
  const [filtroUsuario, setfiltroUsuario] = useState(-1)


  const handleBuscarClick = () => {
    if (!startDate) {
      setSnackbarMessage("Por favor, seleccione la fecha de inicio.");
      setSnackbarOpen(true);
      return;
    }

    if (!endDate) {
      setSnackbarMessage("Por favor, seleccione la fecha de término.");
      setSnackbarOpen(true);
      return;
    }



    fetchDataPreventas();
    // fetchData();
  };

  const cargarUsuarios = async () => {
    User.getAll((users) => {
      setUsuarios(users)
    }, showMessage)
  }

  const separarUsuariosParaFiltrar = (preventasServer) => {
    var usuariosDiferentes = []
    var idsUsuariosDiferentes = {}

    preventasServer.forEach((preventa) => {
      if (!idsUsuariosDiferentes[preventa.idUsuario]) {
        idsUsuariosDiferentes[preventa.idUsuario] = true
        usuariosDiferentes[getUsuarioInfoGrilla(preventa)] = preventa.idUsuario
      }
    })

    usuariosDiferentes["Todos"] = -1
    setUsuariosParaFiltrar(usuariosDiferentes)
  }

  const getUsuarioInfoGrilla = (preventaItem) => {
    // console.log("getUsuarioInfoGrilla", preventaItem)
    var txt = preventaItem.idUsuario + "";
    var encontrado = false
    usuarios.forEach((user) => {
      if (user.codigoUsuario == preventaItem.idUsuario) {
        txt = User.mostrarNombre(user)
        encontrado = true
      }
    })

    if (!encontrado) {
      setTimeout(() => {
        getUsuarioInfoGrilla(preventaItem)
      }, 1000);
    }

    return txt
  }


  const fetchDataPreventas = async () => {
    const aEnviar = {
      // fechadesde: "2025-01-01",
      fechadesde: startDate ? startDate.format("YYYY-MM-DD") : "",
      fechahasta: endDate ? endDate.format("YYYY-MM-DD") : "",
    }

    showLoading("Buscando preventas...")
    ReporteVenta.getInstance().searchPreventasInServer(aEnviar, (responseData, response) => {
      setData(response.data.preventaReportes);
      setTodas(response.data.preventaReportes);
      separarUsuariosParaFiltrar(response.data.preventaReportes);
      setfiltroEstado(-1)
      setfiltroUsuario(-1)
      hideLoading()
    }, (error) => {
      hideLoading()
      console.error("Error al buscar datos:", error);
      showMessage("Error fetching data");
    })
  };


  const condicionfiltrarEstado = (pre) => {
    return (
      (filtroEstado == EstadosPreventaFiltrar.Todas)
      || (filtroEstado == EstadosPreventaFiltrar.Usadas && pre.procesada)
      || (filtroEstado == EstadosPreventaFiltrar.Descartadas && !pre.procesada)
    )
  }

  const condicionfiltrarUsuario = (pre) => {
    return (
      (filtroUsuario == -1)
      || (filtroUsuario == pre.idUsuario)
    )
  }


  const filtrar = () => {
    var filtrado = []
    showLoading("Filtrando")
    todas.forEach((pre) => {
      if (
        condicionfiltrarEstado(pre)
        && condicionfiltrarUsuario(pre)
      ) {
        filtrado.push(pre)
      }
    })

    setData([])
    setTimeout(() => {
      setData(filtrado)
      hideLoading()
    }, 300);


  }

  useEffect(() => {
    setStartDate(dayjs())
    setEndDate(dayjs())

    cargarUsuarios()
  }, [])

  useEffect(() => {
    if (!showDetail) {
      setDetailInfo(null)
    }
  }, [showDetail])

  useEffect(() => {
    if (detailInfo) {
      setShowDetail(true)
    }
  }, [detailInfo])


  useEffect(() => {
    console.log("cambio filtroEstado", filtroEstado)
    filtrar()
  }, [filtroEstado, filtroUsuario])


  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={1} alignItems="center">
          <Typography variant="h5">
            <br />
            Ranking de preventas
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha Inicio"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      sx: { mb: 2 },
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha Término"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      sx: { mb: 2 },
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Button
                sx={{ p: 2, mb: 3 }}
                variant="contained"
                onClick={handleBuscarClick}
                fullWidth
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
        </Grid>


        {todas.length > 0 && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} lg={12}>
              <Typography sx={{ textAlign: "left" }}>Filtro estado</Typography>
              <BoxOptionList
                optionSelected={filtroEstado}
                setOptionSelected={setfiltroEstado}
                options={
                  Object.keys(EstadosPreventaFiltrar).map((key) => {
                    return {
                      id: EstadosPreventaFiltrar[key],
                      value: key
                    }
                  })
                }
              />
            </Grid>

            <Grid item xs={12} lg={12}>
              <Typography sx={{ textAlign: "left" }}>Filtro usuarios</Typography>
              <BoxOptionList
                optionSelected={filtroUsuario}
                setOptionSelected={setfiltroUsuario}
                options={
                  Object.keys(usuariosParaFiltrar).map((key) => {
                    return {
                      id: usuariosParaFiltrar[key],
                      value: key
                    }
                  })
                }
              />
            </Grid>
          </Grid>
        )}


        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TableContainer>
              <Table sx={{ border: "1px solid #ccc" }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#ccc" }}>
                    <TableCell align="center" sx={{ width: 120 }}>
                      <Typography>Fecha Hora</Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography>Monto</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>Usuario</Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography>Estado</Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography>Acciones</Typography>
                    </TableCell>
                  </TableRow>

                </TableHead>
                <TableBody>
                  {data.map((preventa) => (
                    <TableRow key={preventa.idCabecera}>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography>{System.formatDateServer(preventa.fechaIngreso)}</Typography>
                      </TableCell>

                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography>${System.formatMonedaLocal(preventa.total, false)}</Typography>
                      </TableCell>

                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography>{getUsuarioInfoGrilla(preventa)}</Typography>
                      </TableCell>

                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography>{preventa.procesada ? "Usada" : "Descartada"}</Typography>
                      </TableCell>


                      <TableCell sx={{ textAlign: "center" }}>
                        <SmallButton textButton={"Detalles"} actionButton={() => {
                          setDetailInfo(preventa)
                        }} />
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {detailInfo && (
              <PreventaDetalle
                openDialog={showDetail}
                setOpenDialog={setShowDetail}
                info={detailInfo}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );

};

export default Preventa;
