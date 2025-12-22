import React, { useState, useContext, useEffect } from "react";
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import InputNumber from "../Elements/Compuestos/InputNumber";
import SendingButton from "../Elements/SendingButton";
import System from "../../Helpers/System";
import SearchProducts from "../Elements/Compuestos/SearchProducts";
import { TextField, Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import User from "../../Models/User";
import Stock from "../../Models/Stock";
import SmallButton from "../Elements/SmallButton";
import InputName from "../Elements/Compuestos/InputName";
import ModalLogin from "../ScreenDialog/ModalLogin";
import { height, width } from "@mui/system";
import SmallDangerButton from "../Elements/SmallDangerButton";
import Validator from "../../Helpers/Validator";

const MovimientoStock = ({
  onClose,
  product = null,
  onUpdate = (sentInfo) => { }
}) => {
  const {
    showLoading,
    hideLoading,
    showAlert,
    showConfirm,
    showMessage
  } = useContext(SelectedOptionsContext);

  var states = {
    entradaSalida: useState(""),
    descripcion: useState(""),
  }

  var validatorStates = {
    entradaSalida: useState(null),
    descripcion: useState(null),
  }

  // const [selectedProduct, setSelectedProduct] = useState(null); // Para almacenar el producto seleccionado
  const [showLogin, setShowLogin] = useState(false); // Para almacenar el producto seleccionado

  const [selectedProducts, setSelectedProducts] = useState([]); // Para almacenar el producto seleccionado

  const handleProductSelect = (product) => {
    console.log("Producto seleccionado:", product);
    var prods = [...selectedProducts];
    product.cantidad = 1
    prods.push(product)
    setSelectedProducts(prods);
  }

  const handleQuantityChange = (value, index) => {
    console.log("handleQuantityChange..value", value)
    // if (!Validator.isPeso(parseFloat(value))) {
      const updatedProducts = [...selectedProducts];

      updatedProducts[index].cantidad = (value);
      setSelectedProducts(updatedProducts);
    // } else {
    //   console.log("es nan")
    // }
  }

  const quitarSeleccion = (index) => {
    var copia = []

    selectedProducts.forEach((prod, ix) => {
      if (ix != index) {
        copia.push(prod)
      }
    })
    setSelectedProducts(copia)
  }

  const enviarAjuste = (selectedProduct, callbackOk, callbackWrong) => {
    var nuevaCantidad = parseFloat(selectedProduct.stockActual + 0)
    if (states.entradaSalida[0] == "entrada") {
      nuevaCantidad += parseFloat(selectedProduct.cantidad)
    } else {
      nuevaCantidad -= parseFloat(selectedProduct.cantidad)
    }

    var userInfo = User.getInstance().getFromSesion()
    var idUsuario = 0
    if (userInfo) {
      idUsuario = userInfo.codigoUsuario
    } else {
      setShowLogin(true)
      return
    }

    const data = {
      "tipoAjuste": states.entradaSalida[0].toUpperCase(),
      "observacion": states.descripcion[0].toUpperCase(),
      "idUsuario": idUsuario,
      "fechaIngreso": System.getInstance().getDateForServer(),
      "stockMovimientoConceptos": [
        {
          "cantidad": parseFloat(selectedProduct.cantidad + ""),
          "stockActual": parseFloat(selectedProduct.stockActual + 0),
          "stockAjustado": parseFloat(nuevaCantidad.toFixed(2)),
          "codProducto": selectedProduct.idProducto + ""
        }
      ]
    }


    console.log("Datos antes de enviar:", data)
    Stock.movimientoEntradaSalida(
      data,
      (res) => {
        callbackOk()
      },
      (error) => {
        callbackWrong(error)
      }
    );
  }

  const handleSubmit = async () => {
    if (!System.allValidationOk(validatorStates, showMessage)) {
      return false
    }

    if (selectedProducts.length < 1) {
      showMessage("Debe agregar al menos un producto")
      return
    }

    console.log("todo ok", selectedProducts)
    // Validar antes de enviar

    var cantidadProcesada = 0
    var cantidadProcesadaCorrectas = 0
    var cantidadProcesadaIncorrectas = 0

    const revisarAlFinalizar = () => {
      hideLoading()

      if (cantidadProcesada != cantidadProcesadaCorrectas) {
        if (cantidadProcesadaCorrectas > 0) {
          showAlert("No se pudo procesar todos los movimientos. Revisar los datos y volver a intentar.")
        }
      } else {
        showMessage("Procesados correctamente")
        setSelectedProducts([])
        states.descripcion[1]("")
      }
    }

    showLoading("Aplicando movimiento/s de stock")
    selectedProducts.forEach((selec) => {
      enviarAjuste(selec, () => {
        cantidadProcesada++
        cantidadProcesadaCorrectas++
        if (cantidadProcesada == selectedProducts.length) revisarAlFinalizar()
      }, (err) => {
        cantidadProcesada++
        cantidadProcesadaIncorrectas++
        showMessage(err)
        if (cantidadProcesada == selectedProducts.length) {
          revisarAlFinalizar()
        }
      })
    })
  };

  return (
    <Paper elevation={16} square sx={{ padding: "2%" }}>
      <Grid container spacing={2}>

        <ModalLogin
          onSuccess={(userOk) => {
            User.getInstance().saveInSesion(userOk)
            setTimeout(() => {
              handleSubmit()
            }, 300);
          }}
          openDialog={showLogin}
          setOpenDialog={() => { setShowLogin(false) }}
        />


        <Grid item xs={12}>
          <h2>Movimiento stock {states.entradaSalida[0]}</h2>
        </Grid>



        {/* Reemplazamos el TextField con el InputNumber para Stock Físico */}
        {!states.entradaSalida[0] ? (

          <Grid item xs={12} sm={12} md={12} lg={12} >


            <SmallButton
              style={{
                width: "400px",
                height: "100px"
              }}
              textButton={"Entrada"}
              actionButton={() => {
                states.entradaSalida[1]("entrada")
              }} />
            <SmallButton
              style={{
                width: "400px",
                height: "100px"
              }}
              textButton={"Salida"}
              actionButton={() => {
                states.entradaSalida[1]("salida")
              }} />
          </Grid>

        ) : (
          <Grid item xs={12} sm={12} md={12} lg={12} >
            <Grid container spacing={2}>

              <Grid item xs={12}>
                {/* SearchProducts ahora pasa el producto seleccionado */}
                {states.entradaSalida[0] && (
                  <SearchProducts
                    focus={states.entradaSalida[0] != ""}
                    onProductSelect={handleProductSelect}
                    agregarSiEsUnico={true}
                  />
                )}
              </Grid>

              <Grid item xs={8} sm={8} md={8} lg={8} >
                <InputName
                  inputState={states.descripcion}
                  validationState={validatorStates.descripcion}
                  withLabel={true}
                  fieldName="descripcion"
                  label="Descripcion/Glosa"
                  required={true}
                />
              </Grid>


              <Grid item xs={12} sm={12} md={12} lg={12} >

                <TableContainer
                  component={Paper}
                  style={{ overflowX: "auto", height: 250 }}
                >
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell>Stock actual </TableCell>
                        <TableCell sx={{ width: "50%" }}>Cantidad a {states.entradaSalida[0] == "entrada" ? "ingresar" : "quitar"}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{
                      minHeight: "250px",
                      overflow: "scroll"
                    }}>
                      {selectedProducts.length > 0 && selectedProducts.map((product, index) => (
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
                              {product.stockActual}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={product.cantidad}
                              onChange={(e) => {
                                handleQuantityChange(e.target.value, index)
                              }}
                            />

                            <SmallDangerButton textButton={"Quitar"} actionButton={() => {
                              showConfirm("Quitar " + product.nombre + "?", () => {
                                quitarSeleccion(index)
                              })
                            }} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>


            </Grid>
          </Grid>
        )}





        {states.entradaSalida[0] != "" && (
          <Grid item xs={12} sm={12} md={8} lg={8}>
            {states.entradaSalida[0] != "entrada" ? (
              <SmallDangerButton
                style={{
                  width: "200px",
                  height: "50px",
                }}
                textButton={"Cambiar a Entrada"}
                actionButton={() => {
                  states.entradaSalida[1]("entrada")
                }} />
            ) : (
              <SmallDangerButton
                style={{
                  width: "200px",
                  height: "50px",
                }}
                textButton={"Cambiar a Salida"}
                actionButton={() => {
                  states.entradaSalida[1]("salida")
                }} />
            )}
          </Grid>
        )}

        <Grid item xs={12} sm={12} md={4} lg={4}>
          {states.entradaSalida[0] && (
            <SendingButton
              textButton={states.entradaSalida[0] == "entrada" ? "Aplicar entrada" : "Aplicar salida"}
              actionButton={handleSubmit}
              sending={false}
              sendingText="Realizando..."
              style={{
                width: "100%",
                backgroundColor: "#950198"
              }}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MovimientoStock;
