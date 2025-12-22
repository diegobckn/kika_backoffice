import React, { useState, useEffect, useContext } from "react";
import {
  Paper,
  Grid,
  Button,
  TextField,
  ListItem,
  Chip,
  Typography,
  Snackbar,
  InputLabel,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Icon,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import SmallButton from "../Elements/SmallButton";
import ArrowDown from "@mui/icons-material/ArrowDropDown";
import SmallDangerButton from "../Elements/SmallDangerButton";
import SmallGrayButton from "../Elements/SmallGrayButton";
import SelectList from "../Elements/Compuestos/SelectList";
import System from "../../Helpers/System";
import InputNumber from "../Elements/Compuestos/InputNumber";
import InputGeneric from "../Elements/Compuestos/InputGeneric";
import SelectRegion from "../Elements/Compuestos/SelectRegion";
import ImportarListaPrecio from "./ImportarListaPrecio";
import CrearListaPrecio from "./CrearListaPrecio";
import SearchProducts from "../Elements/Compuestos/SearchProducts";
import { Box } from "@mui/system";
import UNIDADES from "../../definitions/Unidades";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import FormRangoPrecio from "../ScreenDialog/FormRangoPrecio";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Product from "../../Models/Product";
import ModelConfig from "../../Models/ModelConfig";


const VALOR_APLICAR = [
  "Aumento",
  "Descuento",
]

export default ({
  openDialog,
  setOpendialog = (x) => { }
}) => {

  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    showMessage,
    showConfirm,
  } = useContext(SelectedOptionsContext);


  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showFormPrecio, setShowFormPrecio] = useState(null)

  const [editandoPrecio, setEditandoPrecio] = useState(false)
  const [indexEditando, setIndexEditando] = useState(null)

  const [precios, setPrecios] = useState([])

  const buscarUnidad = (idUnidad) => {
    var enc = null
    UNIDADES.forEach((unidad) => {
      if (unidad.idUnidad == idUnidad) {
        enc = unidad
      }
    })

    if (enc) {
      return enc.descripcion
    } else {
      return ""
    }
  }

  const quitar = (index) => {
    const copiaPrecios = System.clone(precios)

    copiaPrecios.splice(index, 1)
    setPrecios(copiaPrecios)
    const copiaProd = System.clone(selectedProduct)
    copiaProd.mostrarPrecioRangos = copiaPrecios
    setSelectedProduct(copiaProd)
    // console.log("queda asi", copiaProd)
  }
  const guardarCambios = () => {
    showLoading("Guardando...")

    const arrayPrecios = precios.map((itemPrecio) => {
      return {
        "codBarra": selectedProduct.idProducto,
        "codigoSucursal": 0,
        "puntoVenta": "0",
        "fechaIngreso": System.getInstance().getDateForServer(),
        "cantidadDesde": parseFloat(itemPrecio.cantidadDesde),
        "cantidadHasta": parseFloat(itemPrecio.cantidadHasta),
        "precioVenta": parseFloat(itemPrecio.precioVenta)
      }
    })
    Product.crearRangoPrecios(arrayPrecios, () => {
      hideLoading()
      setSelectedProduct(null)
    }, (er) => {
      hideLoading()
      showMessage(er)
    })


  }

  useEffect(() => {
    // console.log("cambio selectedProduct", selectedProduct)
    if (selectedProduct) {
      setPrecios(selectedProduct.mostrarPrecioRangos)
    } else {
      setPrecios([])
    }
  }, [selectedProduct])

  return (<Dialog open={openDialog} onClose={() => setOpendialog(false)} fullWidth maxWidth={"lg"}>
    <DialogTitle>Precios por unidades vendidas</DialogTitle>
    <DialogContent>

      <Grid container spacing={2}>

        {!selectedProduct && (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <SearchProducts
                  onProductSelect={(prod) => {
                    setSelectedProduct(prod)
                    // console.log("prod", prod)
                  }}
                  agregarSiEsUnico={true}
                />
              </Grid>
            </Grid>
          </Grid>
        )}

        {selectedProduct && (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <SmallButton fullWidth textButton={"Cambiar producto"} actionButton={() => {
                  setSelectedProduct(null)
                }} />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Box
                  sx={{
                    border: "1px solid #ddd",
                    padding: 2,
                    borderRadius: 2,
                    marginTop: 2,
                  }}
                >

                  <Typography variant="h6">Producto Seleccionado:</Typography>
                  <Table sx={{ border: "1px ", borderRadius: "8px" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Codigo</TableCell>
                        <TableCell>Descripcion</TableCell>
                        <TableCell>Unidad Venta</TableCell>
                        <TableCell>Precio Costo</TableCell>
                        <TableCell>
                          Precio venta
                          <br />
                          de unidad
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{selectedProduct.idProducto}</TableCell>
                        <TableCell>{selectedProduct.nombre}</TableCell>
                        <TableCell>{buscarUnidad(selectedProduct.unidad)}</TableCell>
                        <TableCell>${System.formatMonedaLocal(selectedProduct.precioCosto)}</TableCell>
                        <TableCell>${System.formatMonedaLocal(selectedProduct.precioVenta)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>


                </Box>
              </Grid>


              <Grid item xs={12} sm={12} md={12} lg={12}>
                <br />
                <br />
                <SmallButton textButton={"Agregar"} actionButton={() => {
                  setEditandoPrecio(false)
                  setIndexEditando(null)
                  setShowFormPrecio(true)
                }} />

                <FormRangoPrecio
                  openDialog={showFormPrecio}
                  setOpenDialog={setShowFormPrecio}
                  product={selectedProduct}
                  onComplete={(itemForm) => {
                    // console.log("onComplete..itemForm", itemForm)
                    const copiaPrecios = System.clone(precios)
                    if (editandoPrecio && indexEditando !== null) {
                      copiaPrecios[indexEditando] = itemForm
                    } else {
                      copiaPrecios.push(itemForm)
                    }
                    setPrecios(copiaPrecios)

                    const copiaProd = System.clone(selectedProduct)
                    copiaProd.mostrarPrecioRangos = copiaPrecios
                    setSelectedProduct(copiaProd)

                    // console.log("queda asi", copiaProd)
                  }}
                  isEdit={editandoPrecio}
                  indexEdit={indexEditando}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={8} lg={8}>
                    <Table sx={{ border: "1px ", borderRadius: "8px" }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Desde</TableCell>
                          <TableCell>Hasta</TableCell>
                          <TableCell>Valor</TableCell>
                          <TableCell>&nbsp;</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {precios.map((precio, ix) => (
                          <TableRow key={ix}>
                            <TableCell>{precio.cantidadDesde}</TableCell>
                            <TableCell>{precio.cantidadHasta}</TableCell>
                            <TableCell>${System.formatMonedaLocal(precio.precioVenta)}</TableCell>
                            <TableCell>
                              <SmallSecondaryButton textButton={"Editar"} actionButton={() => {
                                setEditandoPrecio(true)
                                setIndexEditando(ix)
                                setShowFormPrecio(true)
                              }} />
                              <SmallButton textButton={"Quitar"} actionButton={() => {
                                quitar(ix)
                              }} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
              </Grid>

            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <br />
              <br />
              <br />
              <SmallSecondaryButton
                textButton={"Guardar cambios"}
                actionButton={() => {
                  guardarCambios()
                }} />
            </Grid>
          </Grid>
        )}


      </Grid>


    </DialogContent >
    <DialogActions >
      <Button
        onClick={() => {

          if (precios.length > 1 || (precios.length && precios[0].cantidadDesde != 0)) {
            showConfirm("Salir sin guardar?", () => {
              setOpendialog(false)
            })
          } else {
            setOpendialog(false)
          }
        }}
      >
        Atras
      </Button>
    </DialogActions >



  </Dialog >);
};
