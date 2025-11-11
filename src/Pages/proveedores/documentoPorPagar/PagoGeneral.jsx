import React, { useState, useContext, useEffect } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Avatar,
  TextField,
  CircularProgress,
  Snackbar,
  Checkbox,
  IconButton,
  Collapse,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SideBar from "../../../Componentes/NavBar/SideBar";
import axios from "axios";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ModelConfig from "../../../Models/ModelConfig";
import User from "../../../Models/User";
import PagoTransferencia from "../../../Componentes/ScreenDialog/FormularioTransferencia";
import PagoCheque from "../../../Componentes/ScreenDialog/FormularioCheque";
import PagoParcial from "../../../Componentes/ScreenDialog/PagoParcial";
import System from "../../../Helpers/System";
import PagoSimple from "./PagoSimple";
import { SelectedOptionsContext } from "./../../../Componentes/Context/SelectedOptionsProvider";
import Proveedor from "../../../Models/Proveedor";
import ProveedorDocumento from "../../../Models/ProveedorDocumento";


const PagoGeneral = ({
  openPagar,
  handlePagarClose,
  compras,

  onFinishPago = ()=>{}
}) => {

  const {
    showMessage,
    showAlert,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [selectedIds, setSelectedIds] = useState([]);

  const selectedTotal = compras
    .filter((proveedor) => selectedIds.includes(proveedor.id))
    .reduce((total, proveedor) => total + proveedor.total, 0);



  const allSelected = selectedIds.length === compras.length;


  const [showModalPago, setShowModalPago] = useState(false);
  const [montoAPagar, setMontoAPagar] = useState("");
  const [cantidadPagada, setCantidadPagada] = useState(0);

  const handleSelectOne = (event, id) => {
    if (event.target.checked) {
      setSelectedIds((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedIds((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
    }
  };

  const selectAll = () => {
    const allIds = compras.map((proveedor) => proveedor.id);
    setSelectedIds(allIds);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      selectAll()
    } else {
      setSelectedIds([]);
    }
  };



  useEffect(() => {
    selectAll()
  }, [openPagar])

  const procesarPago = async ({ metodoPago, cantidadPagada }) => {
    showLoading()
    var itemsPagos = []
    compras.forEach((compra) => {
      itemsPagos.push({
        "idProveedorCompraCabecera": compra.id,
        "total": compra.total
      })
    })

    var requestBody = {
      "fechaIngreso": System.getInstance().getDateForServer(),
      "codigoUsuario": User.getInstance().getFromSesion().codigoUsuario,
      "codigoSucursal": "0",
      "puntoVenta": "0",
      "compraDeudaIds": itemsPagos,
      "montoPagado": cantidadPagada,
      "metodoPago": metodoPago
    }
    // console.log("Request Body antes de enviar:", requestBody);
    ProveedorDocumento.AddProveedorCompraPagar(requestBody, (responseData, response) => {
      hideLoading()
      showMessage("Realizado correctamente")
      onFinishPago(requestBody, responseData)
    }, (err) => {
      hideLoading()
      showAlert(err)
    })
  };


  return (
    <Dialog
      open={openPagar}
      onClose={handlePagarClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Pagos del Proveedor</DialogTitle>
      <DialogContent dividers>
        {compras.length > 0 && (
          <div>
            <Typography variant="h6">
              Proveedor: {compras[0].razonSocial}
            </Typography>
            <Typography variant="subtitle1">
              RUT: {compras[0].rut}
            </Typography>
            <Typography variant="h6" style={{ marginTop: "16px" }}>
              Compras:
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell padding="checkbox"> */}
                    {/* <Checkbox
                        indeterminate={
                          selectedIds.length > 0 &&
                          selectedIds.length < compras.length
                        }
                        checked={allSelected}
                        onChange={handleSelectAll}
                      /> */}
                    {/* </TableCell> */}
                    <TableCell>Tipo Documento</TableCell>
                    <TableCell>Folio</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Monto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {compras.map((proveedor) => (
                    <TableRow key={proveedor.id}>
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds.includes(proveedor.id)}
                          onChange={(event) =>{
                            // handleSelectOne(event, proveedor.id)
                          }}
                        />
                      </TableCell> */}
                      <TableCell>{proveedor.tipoDocumento}</TableCell>
                      <TableCell>{proveedor.folio}</TableCell>
                      <TableCell>
                        {dayjs(proveedor.fechaIngreso).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell> ${System.formatMonedaLocal(proveedor.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="h6">
                Total Deuda : ${System.formatMonedaLocal(selectedTotal)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                disabled={selectedTotal <= 0}
                onClick={() => {
                  setMontoAPagar(selectedTotal);
                  setCantidadPagada(selectedTotal);
                  setShowModalPago(true)
                }}
              >
                Pagar Total ${System.formatMonedaLocal(selectedTotal)}
              </Button>
            </Box>
          </div>
        )}

        <PagoSimple
          openDialog={showModalPago}
          setOpenDialog={setShowModalPago}

          montoAPagar={montoAPagar}
          puedePagarParcial={false}

          onChangeMetod={(metodoPago) => {

          }}

          onConfirm={procesarPago}
        />






      </DialogContent>
      <DialogActions>
        <Button onClick={handlePagarClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PagoGeneral;
