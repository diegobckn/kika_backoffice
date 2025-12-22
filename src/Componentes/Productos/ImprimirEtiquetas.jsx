import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  Select,
  Grid,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import System from "../../Helpers/System";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SearchProducts from "../Elements/Compuestos/SearchProducts";
import PrinterIframe from "../../Models/PrinterIframe";
import SmallButton from "../Elements/SmallButton";

export default ({
  openDialog,
  setOpenDialog
}) => {

  const {
    showLoading,
    hideLoading,
    showAlert,
    showMessage,
    crearCodigoBarras
  } = useContext(SelectedOptionsContext);

  const [productos, setProductos] = useState([])

  const handleProductSelect = (prod) => {
    var prods = [...productos];
    prod.cantidad = 1
    prods.push(prod)
    setProductos(prods);
  }

  const handleQuantityChange = (value, index) => {
    // console.log("handleQuantityChange")
    if (!isNaN(parseInt(value))) {
      const updatedProducts = [...productos];

      updatedProducts[index].cantidad = parseInt(value);
      setProductos(updatedProducts);
    }
  }

  const doPrint = () => {
    var txtArr = [];
    productos.forEach((prod, ix) => {
      for (let index = 0; index < prod.cantidad; index++) {
        txtArr.push(printProd(prod))
      }
    })
    // console.log("txtArr", txtArr)
    PrinterIframe.printArr(txtArr)
    PrinterIframe.afterPrintFunction = () => {
      showMessage("Realizado correctamente")
    }

  }

  const printProd = (producto) => {
    var htmlImprimir = "";
    htmlImprimir += "<html>"
    htmlImprimir += "<head>"
    htmlImprimir += "</head>"
    htmlImprimir += "<body "
    htmlImprimir += " style=' text-align:center; font-family: monospace; margin:5px 0; '"
    htmlImprimir += ">"

    htmlImprimir += crearCodigoBarras(producto.idProducto)

    htmlImprimir += "<p"
    htmlImprimir += " style=' font-size: 18px; margin: 5px 0;'"
    htmlImprimir += ">"
    htmlImprimir += producto.idProducto
    htmlImprimir += "</p>"

    htmlImprimir += "<p"
    htmlImprimir += " style=' font-size: 18px; margin: 5px 0;'"
    htmlImprimir += ">"
    htmlImprimir += producto.nombre
    htmlImprimir += "</p>"

    htmlImprimir += "<p"
    htmlImprimir += " style=' font-size: 45px; margin: 5px 0;'"
    htmlImprimir += ">"
    htmlImprimir += "$" + System.formatMonedaLocal(producto.precioVenta, false)
    htmlImprimir += "</p>"

    htmlImprimir += "</body>"
    htmlImprimir += "</html>"

    return htmlImprimir
  }

  return (
    //fullScreen
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth={"lg"}>
      <DialogTitle>Imprimir Etiquetas</DialogTitle>
      <DialogContent>


        <Grid item xs={12}>
          <SearchProducts
            textButton="Buscar y Agregar"
            onProductSelect={handleProductSelect}
            agregarSiEsUnico={true}
          />
        </Grid>


        <TableContainer
          component={Paper}
          style={{ overflowX: "auto", height: 250 }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Precio </TableCell>
                <TableCell sx={{ width: "50%" }}>Cantidad a imprimir</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{
              minHeight: "250px",
              overflow: "scroll"
            }}>
              {productos.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography>
                      {product.idProducto}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {product.nombre}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      ${System.formatMonedaLocal(product.precioVenta)}
                    </Typography>
                  </TableCell>
                  <TableCell>

                    <TextField
                      value={product.cantidad}
                      onChange={(e) => {
                        handleQuantityChange(e.target.value, index)
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>


      </DialogContent>
      <DialogActions>

        <SmallButton
          isDisabled={productos.length === 0}
          textButton={"limpiar"}
          actionButton={() => {
            setProductos([])
          }} />

        <SmallSecondaryButton
          isDisabled={productos.length === 0}
          textButton={"imprimir"}
          actionButton={doPrint} />

        <Button onClick={() => setOpenDialog(false)} variant="outlined">
          Atras
        </Button>
      </DialogActions>
    </Dialog>
  );
};
