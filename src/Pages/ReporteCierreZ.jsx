import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SideBar from "../Componentes/NavBar/SideBar";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";
import ModelConfig from "../Models/ModelConfig";
import axios from "axios";
import { fontWeight } from "@mui/system";
import BoxSelectList from "../Componentes/Proveedores/BoxSelectList";
import System from "../Helpers/System";


import ReporteCierreZDetalles from "../Componentes/ScreenDialog/ReporteCierreZDetalles"
import ReporteCierreZSelTurno from "../Componentes/ScreenDialog/ReporteCierreZSelTurno";

const ReporteCierreZ = () => {

  const {
    showLoading,
    hideLoading,
    userData,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const apiUrl = ModelConfig.get().urlBase;

  const [showDetails, setShowDetails] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  const [totalInfo, setTotalInfo] = useState([]);


  const handleBuscarClick = () => {
    if (!startDate) {
      showMessage("Por favor, seleccione la fecha de inicio.");
      return;
    }

    if (!endDate) {
      showMessage("Por favor, seleccione la fecha de término.");
      return;
    }

    

    fetchData();
  };

  const fetchData = async () => {
    showLoading("Buscando...")
    
    try {
      const response = await axios.get(
        `${apiUrl}/ReporteVentas/ReporteCierreCajaByFecha`,
        {
          params: {
            fechaDesde: startDate ? startDate.format("YYYY-MM-DD") : "",
            fechaHasta: endDate ? endDate.format("YYYY-MM-DD") : "",
          },
        }
      );

      hideLoading()
      
      // console.log("response pro", response.data)

      // setShowDetails(true)
      agruparPorCaja(response.data)
      cargarResumen(response.data)
      setTotalInfo(response.data)

    } catch (error) {
      console.log(error)
      hideLoading()
    }
  };

  const [resumenTotal, setResumenTotal] = useState(0);
  const [resumenEfectivo, setResumenEfectivo] = useState(0);
  const [resumenTarjetas, setResumenTarjetas] = useState(0);
  const [resumenOperaciones, setResumenOperaciones] = useState(0);

  const [cajas, setCajas] = useState([]);
  const [cajaSel, setCajaSel] = useState(null);
  const [infoPorCaja, setInfoPorCaja] = useState([]);
  const [detailsInfo, setDetailsInfo] = useState(null);
  const [turnoSel, setTurnoSel] = useState(null);
  const [showTurnos, setShowTurnos] = useState(false);
  const [turnoNombre, setTurnoNombre] = useState("")

  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSel, setUsuarioSel] = useState(null);
  const [resumenFiltroTotal, setResumenFiltroTotal] = useState(0);
  const [resumenFiltroEfectivo, setResumenFiltroEfectivo] = useState(0);
  const [resumenFiltroOtros, setResumenFiltroOtros] = useState(0);
  const [resumenFiltroDiferencia, setResumenFiltroDiferencia] = useState(0);

  const agruparPorCaja = (data)=>{
    var prodCaja = []
    var prodUsuario = []
    data.cierreCajaReportes.forEach((infoItem)=>{
      if(!prodCaja.includes(infoItem.puntoVenta)){
        prodCaja.push(infoItem.puntoVenta)
      }

      if(!prodUsuario.includes(infoItem.nombreApellidoUsuario)){
        prodUsuario.push(infoItem.nombreApellidoUsuario)
      }
    })

    if(prodCaja.length > 0){
      prodCaja.push("Todas")
      prodUsuario.push("Todos")
      setCajaSel( prodCaja.length -1 )
      setUsuarioSel( prodUsuario.length -1 )

      // cargarInfoCaja( prodCaja[prodCaja.length -1], prodUsuario[prodUsuario.length -1])
    }else{
      showMessage("Sin resultados")
    }

    setCajas(prodCaja)
    setUsuarios(prodUsuario)
    // console.log("cajas", prodCaja)
  }

  const cargarResumen = (todaLaInfo)=>{
    var totalVentas = 0
    var efectivo = 0
    var tarjetas = 0
    var operaciones = 0


    todaLaInfo.cierreCajaReportes.forEach((info,ix)=>{

      info.cierreCajaDetalles.forEach((detalleInfo,ix2)=>{
        if(detalleInfo.detalleMovimientoCaja == "VENTA"){

          switch(detalleInfo.metodoPago){
            case "EFECTIVO":
              efectivo += detalleInfo.monto
            break

            case "DEBITO":
            case "CREDITO":
              tarjetas += detalleInfo.monto
            break
          }
          totalVentas += detalleInfo.monto
          operaciones += 1
        }
      })
    })
    setResumenTotal(totalVentas)
    setResumenEfectivo(efectivo)
    setResumenTarjetas(tarjetas)
    setResumenOperaciones(operaciones)
  }

  const cargarResumenFiltro = (todaLaInfo)=>{
    var totalVentas = 0
    var efectivo = 0
    var otros = 0
    var diferencias = 0

    const cajaSelValor = cajas[cajaSel]
    const usuarioSelValor = usuarios[usuarioSel]
    
    todaLaInfo.cierreCajaReportes.forEach((info,ix)=>{
      if(
        (info.puntoVenta == cajaSelValor || cajaSelValor.toLowerCase() == "todas")
        && (info.nombreApellidoUsuario == usuarioSelValor || usuarioSelValor.toLowerCase() == "todos")
      ){
        info.cierreCajaDetalles.forEach((detalleInfo,ix2)=>{
          if(detalleInfo.detalleMovimientoCaja == "VENTA"){

            switch(detalleInfo.metodoPago){
              case "EFECTIVO":
                efectivo += detalleInfo.monto
              break
              default:
                otros += detalleInfo.monto
              break
            }
            totalVentas += detalleInfo.monto
          }
        })

        diferencias += info.diferencia
      }
    })
    setResumenFiltroTotal(totalVentas)
    setResumenFiltroEfectivo(efectivo)
    setResumenFiltroOtros(otros)
    setResumenFiltroDiferencia(diferencias)
  }

  const cargarInfoCaja = (cajaElegida, usuarioElegido)=>{
    var prodCaja = []
    totalInfo.cierreCajaReportes.forEach((infoItem)=>{
      // console.log("infoItem", infoItem)
      if(
        (infoItem.puntoVenta == cajaElegida || cajaElegida.toLowerCase() == "todas")
        && (infoItem.nombreApellidoUsuario == usuarioElegido || usuarioElegido.toLowerCase() == "todos")
      ){
        prodCaja.push(infoItem)
      }
    })

    setInfoPorCaja(prodCaja)
  }


  useEffect(()=>{
    setStartDate(dayjs())
    setEndDate(dayjs())
  },[])


  useEffect(()=>{
    if(totalInfo && cajaSel !== null && usuarioSel !== null){
      cargarResumenFiltro(totalInfo)
    }
  },[cajaSel, usuarioSel])



  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={1} alignItems="center">
          Reportes Cierre Z
          <Grid container spacing={2} sx={{ mt: 2 }}>


            <Grid item xs={12} sm={12} md={6} lg={6}>
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

            <Grid item xs={12} sm={12} md={6} lg={6}>
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



            <Grid item xs={12} md={3}>
              <Button
                sx={{ p: 2, mb: 3 }}
                variant="contained"
                onClick={handleBuscarClick}
                fullWidth
              >
                Buscar
              </Button>
            </Grid>




            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TableContainer>
              <Table sx={{
                backgroundColor:"rgb(236 249 252)",
                margin:"4px",
                width:"90.7%"
              }}>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={10}>
                        Resumen general
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        Total ventas
                      </TableCell>

                      <TableCell>
                        Efectivo
                      </TableCell>

                      <TableCell>
                        Tarjetas
                      </TableCell>

                      <TableCell>
                        Cantidad operaciones
                      </TableCell>

                    </TableRow>
                  </TableHead>
   
                  <TableBody>
                    <TableRow>
                      
                    <TableCell>
                        $ {resumenTotal.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        $ {resumenEfectivo.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        $ {resumenTarjetas.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        {resumenOperaciones.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {cajas.length>0 &&(
              <Grid item xs={12} sm={12} md={12} lg={12}>
              <Typography>Seleccionar caja</Typography>
                <Grid item xs={12} sm={12} md={8} lg={8}>
                  <BoxSelectList
                    listValues={cajas}
                    selected={cajaSel}
                    setSelected={(sel)=>{
                      setCajaSel(sel)
                      cargarInfoCaja(cajas[sel], usuarios[usuarioSel])
                    }}
                    />
                </Grid>
              </Grid>
            )}

            {usuarios.length>0 &&(
              <Grid item xs={12} sm={12} md={12} lg={12}>
              <Typography>Seleccionar Usuario</Typography>
                <Grid item xs={12} sm={12} md={8} lg={8}>
                  <BoxSelectList
                    listValues={usuarios}
                    selected={usuarioSel}
                    setSelected={(sel)=>{
                      setUsuarioSel(sel)
                      cargarInfoCaja(cajas[cajaSel], usuarios[sel])
                    }}
                    />
                </Grid>
              </Grid>
            )}

            { cajas.length > 0 && (

              <Grid item xs={12} sm={12} md={12} lg={12}>
              <TableContainer>
              <Table sx={{
                backgroundColor:"rgb(236 249 252)",
                margin:"4px",
                width:"90.7%"
              }}>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={10}>
                        Resumen filtrado
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        Total ventas
                      </TableCell>

                      <TableCell>
                        Efectivo
                      </TableCell>

                      <TableCell>
                        Otros
                      </TableCell>

                      <TableCell>
                        Diferencia total
                      </TableCell>

                    </TableRow>
                  </TableHead>
   
                  <TableBody>
                    <TableRow>
                      
                    <TableCell>
                        $ {resumenFiltroTotal.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        $ {resumenFiltroEfectivo.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        $ {resumenFiltroOtros.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        ${resumenFiltroDiferencia.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            )}

            {infoPorCaja.length>0 &&(
              <TableContainer>
              <Table sx={{
                backgroundColor:"whitesmoke",
                margin:"1%",
                width:"90%"
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={10}>
                      Reporte
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      fecha Ingreso
                    </TableCell>

                    <TableCell>
                      fecha Termino
                    </TableCell>

                    <TableCell>
                      total ventas
                    </TableCell>

                    <TableCell>
                      diferencia
                    </TableCell>

                    <TableCell colSpan={2}>
                      Usuario
                    </TableCell>

                  </TableRow>
                </TableHead>

                <TableBody>
              {infoPorCaja.map((infoDeCaja,ix)=>(
                  <TableRow key={ix}>
                    <TableCell>
                      {System.formatDateServer(infoDeCaja.fechaIngreso)}
                    </TableCell>

                    <TableCell>
                      {System.formatDateServer(infoDeCaja.fechaTermino)}
                    </TableCell>

                    <TableCell>
                      ${infoDeCaja.totalSistema.toLocaleString()}
                    </TableCell>

                    <TableCell>
                      ${infoDeCaja.diferencia.toLocaleString()}
                    </TableCell>

                    <TableCell>
                      {infoDeCaja.nombreApellidoUsuario}
                    </TableCell>

                    <TableCell>
                      <Button variant="contained" color="secondary" onClick={()=>{
                        setDetailsInfo(infoDeCaja)
                        setShowTurnos(true)
                      }}>Detalles</Button>
                    </TableCell>

                  </TableRow>
              ))}
              </TableBody>
              </Table>
              
              </TableContainer>
              
            )}


            <ReporteCierreZSelTurno
              openDialog={showTurnos}
              setOpenDialog={setShowTurnos}
              info={detailsInfo}
              cajaSel={cajaSel}
              turnoSel={turnoSel}
              setTurnoSel={(t,turnoNombre)=>{
                setTurnoSel(t)
                if(t!= null){
                  setShowDetails(true)
                  setTurnoNombre(turnoNombre)
                }
              }
              }
            />


              <ReporteCierreZDetalles
              openDialog={showDetails}
              setOpenDialog={setShowDetails}
              info={detailsInfo}
              turnoIndex={turnoSel}
              turnoNombre={turnoNombre}
              />



          </Grid>
      </Grid>
    </Grid>

    </div>
  );
};

export default ReporteCierreZ;
