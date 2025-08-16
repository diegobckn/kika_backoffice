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


const ReporteZ = () => {

  const {
    showLoading,
    hideLoading,
    userData,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const apiUrl = ModelConfig.get().urlBase;

  const [showDialog, setShowDialog] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
      
      console.log("response pro", response.data)

      setShowDialog(true)

    } catch (error) {
      console.log(error)
      hideLoading()
    }
  };


  const styleHeader = {
    fontWeight:"bold",
    backgroundColor:"#e4e4e4"
  }

  const styleHeaderLight = {
    fontWeight:"bold",
    backgroundColor:"#F0F0F0"
  }

  const styleSubHeaderLight = {
    backgroundColor:"#F0F0F0"
  }


  const styleTitle = {
    fontWeight:"bold",
    color:"white",
    textAlign:"center",
    backgroundColor:"#9A9898"
  }


  useEffect(()=>{
    setStartDate(dayjs())
    setEndDate(dayjs())
  },[])




  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={1} alignItems="center">
          Reportes Z
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



            
            <Dialog
              open={showDialog}
              onClose={()=>{ setShowDialog(false) }}
              fullWidth
              maxWidth="lg"
            >
          <DialogTitle>Detalles</DialogTitle>
          <DialogContent>

          
          <TableContainer>
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell colSpan={20} sx={styleTitle}>
                    Horarios
                  </TableCell>
                  </TableRow>

                <TableRow>
                  <TableCell colSpan={3} sx={styleHeader}>
                    Apertura de caja
                  </TableCell>
                  <TableCell>
                    xxx
                  </TableCell>
                  
                  <TableCell sx={styleHeader}>
                    Cierre de caja
                  </TableCell>
                  <TableCell>
                    xxx
                  </TableCell>


                  <TableCell sx={styleHeader}>
                    1º Venta
                  </TableCell>
                  <TableCell>
                    xxx
                  </TableCell>

                  <TableCell colSpan={3} sx={styleHeader}>
                    Ultima venta
                  </TableCell>
                  <TableCell>
                    xxx
                  </TableCell>



                </TableRow>
                  

                <TableRow>
                  <TableCell colSpan={3} sx={styleHeader}>
                    Usuario
                  </TableCell>
                  <TableCell>
                    xxx
                  </TableCell>
                  
                  <TableCell sx={styleHeader}>
                    Usuario
                  </TableCell>
                  <TableCell>
                    xxx
                  </TableCell>


                  <TableCell sx={styleHeader}>
                    Usuario
                  </TableCell>
                  <TableCell>
                    xxx
                  </TableCell>

                  <TableCell colSpan={3} sx={styleHeader}>
                    Usuario
                  </TableCell>
                  <TableCell>
                    xxx
                  </TableCell>

                </TableRow>



                <TableRow>
                  <TableCell colSpan={20} sx={styleTitle}>
                    Documentos
                  </TableCell>
                  </TableRow>
                  
                  
                <TableRow>
                  <TableCell sx={styleHeader}>
                    Facturas
                  </TableCell>
                  
                  <TableCell>
                    Cantidad
                  </TableCell>


                  <TableCell>
                    Valor
                  </TableCell>

                  <TableCell>
                    % Total
                  </TableCell>


                  <TableCell sx={styleHeader}>
                    Boletas
                  </TableCell>
                  
                  <TableCell>
                    Cantidad
                  </TableCell>


                  <TableCell>
                    Valor
                  </TableCell>

                  <TableCell>
                    % Total
                  </TableCell>


                  <TableCell sx={styleHeader}>
                    Ticket
                  </TableCell>
                  
                  <TableCell>
                    Cantidad
                  </TableCell>


                  <TableCell>
                    Valor
                  </TableCell>

                  <TableCell>
                    % Total
                  </TableCell>

                  </TableRow>


                  <TableRow>
                  <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                  </TableRow>




                  <TableRow>
                  <TableCell sx={styleHeader}>
                    Facturas Anuladas
                  </TableCell>
                  
                  <TableCell>
                    Cantidad
                  </TableCell>


                  <TableCell>
                    Valor
                  </TableCell>

                  <TableCell>
                    {" "}
                  </TableCell>


                  <TableCell sx={styleHeader}>
                    Preventas
                  </TableCell>
                  
                  <TableCell>
                    Cantidad
                  </TableCell>


                  <TableCell>
                    Valor
                  </TableCell>

                  <TableCell>
                    {" "}
                  </TableCell>


                  <TableCell sx={styleHeader}>
                    Preventas No Cerradas
                  </TableCell>
                  
                  <TableCell>
                    Cantidad
                  </TableCell>


                  <TableCell>
                    Valor
                  </TableCell>

                  <TableCell>
                    {" "}
                  </TableCell>

                  </TableRow>


                  <TableRow>
                  <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      {" "}
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      {" "}
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      {" "}
                    </TableCell>
                  </TableRow>


                  <TableRow>
                  <TableCell colSpan={20} sx={styleTitle}>
                    <Typography sx={{
                      display:"inline-block"
                    }}>
                      Ventas 
                    </Typography>
                    <Typography sx={{
                      marginLeft:"30px",
                      display:"inline-block"
                    }}>
                      Total Ventas $xx
                    </Typography>
                  </TableCell>
                  </TableRow>



                  <TableRow>
                  
                  <TableCell sx={styleHeader}>
                    Efectivo
                  </TableCell>


                  <TableCell sx={styleHeader}>
                    Cantidad
                  </TableCell>

                  <TableCell sx={styleHeader}>
                    Valor
                  </TableCell>

                  <TableCell sx={styleHeader}>
                    % total
                  </TableCell>

                  <TableCell sx={styleHeaderLight}>
                    Debito
                  </TableCell>

                  <TableCell sx={styleHeaderLight}>
                    Cantidad
                  </TableCell>

                  <TableCell sx={styleHeaderLight}>
                    Valor
                  </TableCell>

                  <TableCell sx={styleHeaderLight}>
                    % total
                  </TableCell>

                  <TableCell sx={styleHeader}>
                    Credito
                  </TableCell>

                  <TableCell sx={styleHeader}>
                    Cantidad
                  </TableCell>

                  <TableCell sx={styleHeader}>
                    Valor
                  </TableCell>

                  <TableCell sx={styleHeader}>
                    % total
                  </TableCell>
                  </TableRow>

                  <TableRow>
                  <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      {" "}
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      {" "}
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      {" "}
                    </TableCell>
                  </TableRow>


                  <TableRow>
                  <TableCell sx={styleHeader}>
                    Transferencia
                  </TableCell>


                  <TableCell sx={styleHeader}>
                    Cantidad
                  </TableCell>

                  <TableCell sx={styleHeader}>
                    Valor
                  </TableCell>

                  <TableCell sx={styleHeader}>
                    % total
                  </TableCell>

                  <TableCell sx={styleHeaderLight}>
                    Cheque
                  </TableCell>

                  <TableCell sx={styleHeaderLight}>
                    Cantidad
                  </TableCell>

                  <TableCell sx={styleHeaderLight}>
                    Valor
                  </TableCell>

                  <TableCell sx={styleHeaderLight}>
                    % total
                  </TableCell>

                  <TableCell sx={styleHeader}>
                    Cta. Cte.
                  </TableCell>

                  <TableCell sx={styleHeader}>
                    Cantidad
                  </TableCell>

                  <TableCell sx={styleHeader}>
                    Valor
                  </TableCell>

                  <TableCell sx={styleHeader}>
                    % total
                  </TableCell>
                  </TableRow>

                  <TableRow>
                  <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      {" "}
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      {" "}
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>
                    <TableCell>
                      {" "}
                    </TableCell>
                  </TableRow>



                  <TableRow>
                  <TableCell colSpan={20} sx={styleTitle}>
                    <Typography sx={{
                      display:"inline-block"
                    }}>
                    Ingresos, retiros y pagos
                    </Typography>
                  </TableCell>
                  </TableRow>


                  <TableRow>
                  <TableCell colSpan={3} sx={styleHeaderLight}>
                    Retiros
                  </TableCell>
                  <TableCell>
                    {" "}
                  </TableCell>



                  <TableCell colSpan={3} sx={styleHeaderLight}>
                    Ingresos
                  </TableCell>
                  <TableCell>
                    {" "}
                  </TableCell>


                  <TableCell colSpan={3} sx={styleHeaderLight}>
                    Pagos
                  </TableCell>

                  <TableCell>
                    {" "}
                  </TableCell>

                  
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      Retiro max cant en caja
                    </TableCell>
                    <TableCell sx={styleSubHeaderLight}>
                      xxx
                    </TableCell>

                    <TableCell>
                      {" "}
                    </TableCell>


                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      Envases
                    </TableCell>
                    <TableCell sx={styleSubHeaderLight}>
                      xxx
                    </TableCell>

                    <TableCell>
                      {" "}
                    </TableCell>


                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      Pago fact 123 provee(usuario)
                    </TableCell>
                    <TableCell sx={styleSubHeaderLight}>
                      xxx
                    </TableCell>

                    <TableCell>
                      {" "}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      anticipo(usuario)
                    </TableCell>
                    <TableCell sx={styleSubHeaderLight}>
                      xxx
                    </TableCell>

                    <TableCell>
                      {" "}
                    </TableCell>


                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      pago cta cte(usuario)
                    </TableCell>
                    <TableCell sx={styleSubHeaderLight}>
                      xxx
                    </TableCell>

                    <TableCell>
                      {" "}
                    </TableCell>


                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      Pago fact 123 provee2(usuario)
                    </TableCell>
                    <TableCell sx={styleSubHeaderLight}>
                      xxx
                    </TableCell>

                    <TableCell>
                      {" "}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      Retiro max cant en caja
                    </TableCell>
                    <TableCell sx={styleSubHeaderLight}>
                      xxx
                    </TableCell>

                    <TableCell>
                      {" "}
                    </TableCell>


                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      pago cta cte cliente 2
                    </TableCell>
                    <TableCell sx={styleSubHeaderLight}>
                      xxx
                    </TableCell>

                    <TableCell>
                      {" "}
                    </TableCell>


                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      {" "}
                    </TableCell>
                    <TableCell sx={styleSubHeaderLight}>
                      {" "}
                    </TableCell>

                    <TableCell>
                      {" "}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      devolucion envases(usuario)
                    </TableCell>
                    <TableCell sx={styleSubHeaderLight}>
                      xxx
                    </TableCell>

                    <TableCell>
                      {" "}
                    </TableCell>


                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      {" "}
                    </TableCell>
                    <TableCell sx={styleSubHeaderLight}>
                      {" "}
                    </TableCell>

                    <TableCell>
                      {" "}
                    </TableCell>


                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      {" "}
                    </TableCell>
                    <TableCell sx={styleSubHeaderLight}>
                      {" "}
                    </TableCell>

                    <TableCell>
                      {" "}
                    </TableCell>
                  </TableRow>



                  <TableRow>
                  <TableCell colSpan={20} sx={styleTitle}>
                    Cuadratura de caja y efectivo
                  </TableCell>
                  </TableRow>


                  <TableRow>
                    <TableCell colSpan={4} sx={styleSubHeaderLight}>
                      {" "}
                      </TableCell>
                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      Apertura de caja
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>

                    <TableCell>
                      +
                    </TableCell>
                    <TableCell colSpan={4} sx={styleSubHeaderLight}>
                      {" "}
                      </TableCell>

                  </TableRow>
                  
                  <TableRow>
                  <TableCell colSpan={4} sx={styleSubHeaderLight}>
                      {" "}
                      </TableCell>
                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      Ventas Efectivo
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>

                    <TableCell>
                      +
                    </TableCell>
                    <TableCell colSpan={4} sx={styleSubHeaderLight}>
                      {" "}
                      </TableCell>
                  </TableRow>



                  <TableRow>
                  <TableCell colSpan={4} sx={styleSubHeaderLight}>
                      {" "}
                      </TableCell>
                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      Ingresos de caja
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>

                    <TableCell>
                      +
                    </TableCell>
                    <TableCell colSpan={4} sx={styleSubHeaderLight}>
                      {" "}
                      </TableCell>
                  </TableRow>


                  <TableRow>
                  <TableCell colSpan={4} sx={styleSubHeaderLight}>
                      {" "}
                      </TableCell>
                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      Egresos
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>

                    <TableCell>
                      -
                    </TableCell>
                    <TableCell colSpan={4} sx={styleSubHeaderLight}>
                      {" "}
                      </TableCell>
                  </TableRow>


                  <TableRow>
                  <TableCell colSpan={4} sx={styleSubHeaderLight}>
                      {" "}
                      </TableCell>
                    <TableCell colSpan={2} sx={styleSubHeaderLight}>
                      Total caja cierre
                    </TableCell>
                    <TableCell>
                      xxx
                    </TableCell>

                    <TableCell>
                      =
                    </TableCell>
                    <TableCell colSpan={4} sx={styleSubHeaderLight}>
                      {" "}
                      </TableCell>
                  </TableRow>








              </TableBody>



            </Table>
          </TableContainer>




          </DialogContent>
          </Dialog>








          </Grid>
      </Grid>
    </Grid>

    </div>
  );
};

export default ReporteZ;
