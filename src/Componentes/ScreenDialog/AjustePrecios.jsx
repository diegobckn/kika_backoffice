import React, { useState, useContext, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";
import { useNavigate } from "react-router-dom";
import User from "../../Models/User";
import PreciosGeneralesProducItem from "../Card-Modal/PreciosGeneralesProducItem";
import { Box } from "@mui/system";
import System from "../../Helpers/System";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import Product from "../../Models/Product";

const AjustePrecios = ({
  productoSel,
  openDialog,
  setOpenDialog,
  setSelectedProducts,
  onChange
}) => {

  const {
    showLoading,
    hideLoading,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);


  const [ajusteVentaPublico, setAjuste] = useState(0)
  const [producto, setProductox] = useState(null)
  const [productoInterno, setProductoInterno] = useState(null)
  const [ajustoInterno, setAjustoInterno] = useState(true)

  const [cambiosGuardados, setCambiosGuardados] = useState(true)
  const [precioVentaInicial, setPrecioVentaInicial] = useState(0);

  useEffect(() => {
    if (!openDialog) return



    console.log("recibiendo el prod:", productoSel)

    const idProd = productoSel.idProducto
    Product.getInstance().findByCodigoBarras({ codigoProducto: idProd }, (prods) => {
      if (prods.length > 0) {
        setPrecioVentaInicial(prods[0].precioVenta)
      }
    }, () => {
      setPrecioVentaInicial(0)

    })



    setAjuste(productoSel.precioVenta)
    setProductox(productoSel)
    setCambiosGuardados(true)
  }, [openDialog])

  useEffect(() => {
    console.log("cambio el producto desdes ajustes")
  }, [producto])

  useEffect(() => {
    if (!productoInterno || ajustoInterno) return
    console.log("cambio ajusteVentaPublico")
    productoInterno.precioVenta = ajusteVentaPublico
    const resul = Product.calcularMargen(productoInterno)
    System.addAllInObj(setProductox, resul)
    console.log("setProductox")

    setCambiosGuardados(false)
  }, [ajusteVentaPublico, ajustoInterno])

  const checkCambio = (cambio) => {
    if (!cambio) return
    console.log("checkCambio", cambio)
    setAjustoInterno(true)
    setProductoInterno(cambio)
    setAjuste(cambio.precioVenta)
  }

  const roundUp = () => {
    var val = ajusteVentaPublico + ""
    const ultima = val.substring(val.length - 1, val.length)
    if (ultima !== "0" && ultima !== "5") {
      var dif = parseFloat(ultima)
      if (dif > 5) {
        dif = 10 - dif
      } else {
        dif = 5 - dif
      }
      setAjuste(ajusteVentaPublico + dif)
    } else {
      setAjuste(ajusteVentaPublico + 5)
    }
    setAjustoInterno(false)
  }

  const roundDown = () => {
    var val = ajusteVentaPublico + ""
    const ultima = val.substring(val.length - 1, val.length)
    if (ultima !== "0" && ultima !== "5") {
      var dif = parseFloat(ultima)
      if (dif > 5) dif = dif - 5
      setAjuste(ajusteVentaPublico - dif)
    } else {
      setAjuste(ajusteVentaPublico - 5)
    }
    setAjustoInterno(false)
  }

  return !producto ? (<></>) : (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}
      fullWidth maxWidth={"md"}
      PaperProps={{
        sx: {
          height: "90%"
        }
      }}>
      <DialogTitle>Ajuste precios</DialogTitle>
      <DialogContent>
        <DialogContentText>

          <PreciosGeneralesProducItem
            producto={producto}
            index={productoSel ? productoSel.index : 0}
            onChange={checkCambio}
            onUpdatedOk={(saved) => {
              showMessage("Guardado correctamente")
              onChange(saved)
              setCambiosGuardados(true)
              setOpenDialog(false)
            }}
            onUpdatedWrong={(error) => {
              console.error("Error al actualizar el producto:", error);
              showMessage(error);
            }}

            darFocoCosto={true}
          />

          <Box sx={{
            width: "100%",
            backgroundColor: "#f5f5f5",
          }}>
            <Box sx={{
              // width: "30%",
              padding: "20px",
              margin: "0 auto"
            }}>

              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Typography sx={{
                    textAlign: "center",
                    marginBottom: "20px"
                  }}>Ajuste precio venta publico</Typography>
                </Grid>


                <Grid item xs={3} sm={3} md={3} lg={3}>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={ajusteVentaPublico}
                    sx={{
                    }}
                    inputProps={{
                      style: {
                        height: "75px",
                        // backgroundColor:"blue",
                        textAlign: "center !important",
                        margin: "0 auto"

                      }
                    }}
                    onChange={(e) => {
                      setAjuste(e.target.value)
                      setAjustoInterno(false)
                    }}
                  />
                </Grid>


                <Grid item xs={1} sm={1} md={1} lg={1} sx={{
                }}>
                  <SmallButton style={{
                    position: "relative",
                    height: "52px",
                    top: "2px",
                    width: "45px",
                    backgroundColor: "#6c6ce7",
                    fontSize: "25px",
                    margin: "0 0 2px 0",
                    color: "white"
                  }}
                    withDelay={false}
                    actionButton={() => {
                      roundUp()
                    }}
                    textButton={<ArrowUpward />} />
                  <SmallButton style={{
                    position: "relative",
                    height: "52px",
                    top: "2px",
                    width: "45px",
                    backgroundColor: "#6c6ce7",
                    fontSize: "25px",
                    margin: "0",
                    color: "white"
                  }}
                    withDelay={false}
                    actionButton={() => {
                      roundDown()
                    }}
                    textButton={<ArrowDownward />} />
                </Grid>


                <Grid item xs={1} sm={1} md={1} lg={1}>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                  <Typography sx={{
                    marginTop: "20px",
                    textAlign: "center"
                  }}>Precio venta en pos</Typography>
                  <Typography sx={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    color: "black",
                    backgroundColor: "#fff",
                    padding: "10px",
                    textAlign: "center"
                  }}>${precioVentaInicial}</Typography>
                </Grid>



              </Grid>

            </Box>
          </Box>

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          if (!cambiosGuardados) {
            showConfirm("Hay cambios sin guardar, quiere salir igualmente?", () => {
              setOpenDialog(false)
            })
            return
          }
          setOpenDialog(false)
        }} color="primary">
          Atras
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default AjustePrecios;
