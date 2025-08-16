import React, { useState, useEffect, useContext } from "react";
import {
  Paper,
  Grid,
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  ListItem,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputLabel,
  Alert,
  Snackbar,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  DialogActions,
  Tooltip,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import ModelConfig from "../../../Models/ModelConfig";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import Product from "../../../Models/Product";
import Proveedor from "../../../Models/Proveedor";
import { SelectedOptionsContext } from "../../../Componentes/Context/SelectedOptionsProvider";
import Validator from "../../../Helpers/Validator";
import AjustePrecios from "../../../Componentes/ScreenDialog/AjustePrecios";
import System from "../../../Helpers/System";
import IngresoDocProvBuscarProductos from "./BuscarProductos";
import CrearProducto from "../../CrearProducto";
import FormularioProveedor from "../FormularioProveedor";
import CriterioCosto from "../../../definitions/CriterioCosto";

const FormularioCompra = ({
  openDialog,
  setOpenDialog,
  onClose,
  onFinish
}) => {

  const {
    showLoading,
    hideLoading,
    showMessage,
    showAlert,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const apiUrl = ModelConfig.get().urlBase;

  const [open, setOpen] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [folioDocumento, setFolioDocumento] = useState("");
  const [fecha, setFecha] = useState(dayjs());
  const [searchText, setSearchText] = useState("");
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [showPanel, setShowPanel] = useState(true);

  const [showAjustePrecios, setShowAjustePrecios] = useState(false);
  const [productoSel, setProductoSel] = useState(null);
  const [showCreateProveedor, setShowCreateProveedor] = useState(false);

  const [associating, setAssociating] = useState(null)
  const [searchProd, setSearchProd] = useState("");
  const [searchCodProv, setSearchCodProv] = useState("");
  const [searchDescProv, setSearchDescProv] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [countPackage, setCountPackage] = useState(0);

  const [showCreateProduct, setShowCreateProduct] = useState(false);

  const ajustarPrecio = (producto, index) => {
    producto.index = index
    setProductoSel(producto)
    setShowAjustePrecios(true)
  }
  // console.log("selectedProveedor", selectedProveedor);

  const handleQuantityBlur = (index) => {
    console.log("handleQuantityBlur")


    const updatedProducts = [...selectedProducts];
    const value = updatedProducts[index].cantidad
    // Parse the input value to an integer
    // console.log("value", value)

    const valStr = value + ""
    const ultStr = valStr.substr(valStr.length - 1)
    // console.log("valStr", valStr)
    // console.log("ultStr", ultStr)
    if ((ultStr == ".")) {
      updatedProducts[index].cantidad = value + "0";
      updatedProducts[index].total = calcularTotal(
        updatedProducts[index].precioCosto,
        parseFloat(value + "0"),
        updatedProducts[index].cantidadProveedor
      )

      setSelectedProducts(updatedProducts);
      return
    }
  }

  const handleQuantityChange = (value, index) => {
    // console.log("handleQuantityChange")
    const updatedProducts = [...selectedProducts];
    // Parse the input value to an integer
    // console.log("value", value)

    const valStr = value + ""
    const ultStr = valStr.substr(valStr.length - 1)
    // console.log("valStr", valStr)
    // console.log("ultStr", ultStr)
    if ((ultStr == ".")) {
      updatedProducts[index].cantidad = value;
      setSelectedProducts(updatedProducts);
      return
    }

    const parsedValue = parseFloat(value);
    // console.log("parsedValue", parsedValue)

    // Check if the parsed value is NaN or less than zero
    if (isNaN(parsedValue) || parsedValue < 0) {
      showMessage("valor incorrecto")
      // console.log("cantidad incorrecta")
      return
      // If it's NaN or less than zero, set quantity and total to zero
      // updatedProducts[index].cantidad = 0;
      // updatedProducts[index].total = 0;
    } else {
      // console.log("cantidad correcta", parsedValue)
      // Otherwise, update quantity and calculate total
      updatedProducts[index].cantidad = parsedValue;
      updatedProducts[index].total = calcularTotal(
        updatedProducts[index].precioCosto,
        parsedValue,
        updatedProducts[index].cantidadProveedor
      )

    }

    setSelectedProducts(updatedProducts);
  };

  const handleCostoChange = (value, index) => {
    const updatedProducts = [...selectedProducts];
    // console.log("updatedProduct")
    // console.log(updatedProducts[index])
    // // Parse the input value to an integer
    const parsedValue = parseInt(value);

    // Check if the parsed value is NaN or less than zero
    if (isNaN(parsedValue) || parsedValue < 0) {

      showMessage("valor incorrecto")
      // If it's NaN or less than zero, set quantity and total to zero
      // updatedProducts[index].cantidad = 0;
      // updatedProducts[index].precioCosto = 0;
      // updatedProducts[index].precio = 0;
      // updatedProducts[index].total = 0;
      return
    } else {
      // Otherwise, update quantity and calculate total

      updatedProducts[index].precioCosto = parsedValue;
      const prod = updatedProducts[index]
      updatedProducts[index] = Product.logicaPrecios(prod, "final")
      // updatedProducts[index].precio = parsedValue;
      updatedProducts[index].total = calcularTotal(
        parsedValue,
        updatedProducts[index].cantidad,
        updatedProducts[index].cantidadProveedor
      )
    }

    setSelectedProducts(updatedProducts);
  };


  const calcularTotal = (costo, cantidad, cantidadProveedor) => {
    // console.log("calcularTotal..costo", costo, "..cantidad:", cantidad,"..cantidad proveedor:",cantidadProveedor)
    // const total = parseFloat(costo + "") * parseFloat(cantidad + "") * parseFloat(cantidadProveedor + "")
    // console.log("devuelvo el total", total)
    return parseFloat(costo + "") * parseFloat(cantidad + "") * parseFloat(cantidadProveedor + "")
  }

  const handleAddProductToSelecteds = (product) => {
    console.log("agregando ", product)
    const existingProductIndex = selectedProducts.findIndex(
      (p) => (p.id === product.idProducto && p.codigoInternoProveedor == product.codigoInternoProveedor)
    );

    if (existingProductIndex !== -1) {
      // Producto ya existe, incrementar la cantidad
      const updatedProducts = selectedProducts.map((p, index) => {
        if (index === existingProductIndex) {
          const updatedQuantity = p.cantidad + 1;
          return {
            ...p,
            cantidad: updatedQuantity,
            total: calcularTotal(
              p.precioCosto,
              updatedQuantity,
              p.cantidadProveedor
            )


          };
        }
        return p;
      });
      setSelectedProducts(updatedProducts);
    } else {
      product.id = product.idProducto
      product.cantidad = 1
      // product.precioVenta = product.precioCosto
      // if(product.cantidadProveedor === undefined){
      //   product.cantidadProveedor = countPackage
      // }
      if (!product.cantidadProveedor) {
        product.cantidadProveedor = 1
      }


      const criterioComercio = ModelConfig.get("criterioCostoComercio")
      const criterioProveedor = selectedProveedor.criterioCosto
      console.log('criterioComercio', criterioComercio)
      console.log('criterioProveedor', criterioProveedor)
      console.log('product.precioCosto', product.precioCosto)
      if (criterioComercio != criterioProveedor) {
        product.precioCostoOriginal = product.precioCosto + 0
        if (criterioComercio == CriterioCosto.NETO && criterioProveedor == CriterioCosto.BRUTO) {
          product.precioCosto = parseFloat(product.precioCosto / 1.19)
        } else {
          product.precioCosto = parseFloat(product.precioCosto * 1.19)
        }

        product = Product.iniciarLogicaPrecios(product)
        product = Product.logicaPrecios(product)
      } else {
        product = Product.iniciarLogicaPrecios(product)
      }


      product.total = calcularTotal(product.precioCosto, product.cantidad, product.cantidadProveedor)
      product.impuestosValor = Product.calcularImpuestos(product)

      console.log("agregado queda asi:", System.clone(product))
      // setSelectedProducts([...selectedProducts, newProduct]);
      // console.log("seleccionados:",[...selectedProducts, product]);
      setSelectedProducts([...selectedProducts, product]);
    }

    setAssociating(false)
  };

  useEffect(() => {
    if (!openDialog) return
    Proveedor.getInstance().getAll((provs) => {
      setProveedores(provs);
    }, () => { })
  }, [open]);

  const buscarProveedor = () => {
    console.log("buscarProveedor")
    setSelectedProveedor("");
    if (searchText.trim() === "") {
      showMessage("Campo vacío, ingresa proveedor ...");
    } else {
      const filteredResults = proveedores.filter((proveedor) =>
        proveedor.razonSocial.toLowerCase().includes(searchText.toLowerCase()) ||
        proveedor.rut.toLowerCase().includes(searchText.toLowerCase())
      );
      setProveedoresFiltrados(filteredResults);
    }
  };

  const clickEnProveedor = (result) => {
    setSelectedProveedor(result);
    setProveedoresFiltrados([]);
    setSearchText("");
    setShowPanel(false)
  };

  const hoy = dayjs();
  const inicioRango = dayjs().subtract(1, "week");


  const handleSubmit = async () => {

    console.log("handleSubmit")
    setLoading(true);

    try {
      if (!tipoDocumento) {
        showMessage("Por favor complete tipo de documento.");
        setLoading(false);
        return;
      }

      if (!folioDocumento) {
        showMessage("Por favor complete campo folio.");
        setLoading(false);
        return;
      } else if (folioDocumento) {
      }

      if (!selectedProveedor) {
        showMessage("No se ha seleccionado ningún proveedor.");
        setLoading(false);
        return;
      }
      if (selectedProducts.length === 0) {
        showMessage("No se han seleccionado productos.");
        setLoading(false);
        return;
      }

      // Calculating total
      let total = 0;
      selectedProducts.forEach((product) => {
        total += product.total;
      });
      if (total === 0) {
        showMessage("El total no puede ser cero.");
        setLoading(false);
        return;
      }

      var noPrice = 0
      var totalNeto = 0
      var totalIva = 0
      const proveedorCompraDetalles = selectedProducts.map((product) => {
        if (!product.total) {
          noPrice++
        }

        var cantidadProveedor = product.cantidadProveedor

        totalNeto = totalNeto + (product.precioNeto * (product.cantidad * cantidadProveedor))
        totalIva = totalIva + (product.ivaValor * (product.cantidad * cantidadProveedor))
        console.log("producto ingresando 2", product)
        console.log("totalNeto", totalNeto + 0)
        console.log("totalIva", totalIva + 0)
        if (!cantidadProveedor) cantidadProveedor = 1
        return {
          codProducto: product.id,
          descripcionProducto: product.nombre,
          cantidad: product.cantidad * cantidadProveedor,
          precioUnidad: product.precioVenta,
          costo: product.total,
          precioNeto: product.precioNeto,
          precioIva: product.ivaValor,
        }
      });

      if (noPrice > 0) {
        var txt = ""
        if (noPrice == 1) {
          txt = " item"
        } else {
          txt = " items"
        }
        showMessage("Completar todos los precios de costo. Hay " + noPrice + txt + " sin valor")
        return
      }

      const dataToSend = {
        fechaIngreso: System.getInstance().getDateForServer(),
        tipoDocumento: tipoDocumento,
        folio: folioDocumento,
        codigoProveedor: selectedProveedor.codigoProveedor,
        total: parseFloat(parseFloat(total).toFixed(2)),
        proveedorCompraDetalles,
        montoNeto: totalNeto,
        montoIva: totalIva,
      };
      console.log("Datos a enviar al servidor:", dataToSend);

      Proveedor.agregarCompra(dataToSend, (responseData, response) => {
        showMessage("Realizado correctamente");
        console.log("responseData", responseData)

        setTipoDocumento("");
        setFolioDocumento("");
        setFecha(dayjs());
        setSearchText("");
        setSelectedProveedor(null);
        setSelectedProducts([]);
        setProveedoresFiltrados([]);

        setTimeout(() => {
          setOpenDialog(false);
        }, 2000);

      }, (err) => {
        showMessage(err)
        setLoading(false);
      })
    } catch (err) {
      showMessage(err)
      console.log(err)
    }
  };

  const handleFolioChange = (e) => {
    // Obtener la tecla presionada
    const keyPressed = e.key;

    if (Validator.isTeclaControl(e)) {
      return
    }

    if (!Validator.isNumeric(keyPressed)) {
      // console.log("e", e)
      // console.log("keyPressed", keyPressed)
      showMessage("valor incorrecto")
      e.preventDefault();
      return
    }
  };
  const grandTotal = selectedProducts.reduce(
    (total, product) => total + product.total,
    0
  );

  const handleDeleteProduct = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };



  const handleAsocAndAddProductToSales = (product) => {
    console.log("asociando", product)
    if (countPackage < 1) {
      showMessage("Ingresar la cantidad de cada paquete")
      return
    }

    Proveedor.assignAndAssociateProduct(product, {
      codigoProveedor: selectedProveedor.codigoProveedor,
      searchCodProv,
      searchDescProv,
      countPackage
    }, (productx, response) => {
      handleAddProductToSelecteds(productx)
    }, (error) => {
      showMessage(error)
    })
  }


  const cerrarPantalla = () => {
    showConfirm("Realmente quiere salir?", () => {
      setOpenDialog(false)

      setProductoSel(null)
      setAssociating(null)
      setShowPanel(true)
      setSelectedProducts([])
      setSelectedProveedor(null)
      setProveedores([])
      setTipoDocumento("")
      setFolioDocumento("")

    }, () => { })
  }

  const checkFolio = () => {
    Proveedor.checkExistFolio(folioDocumento, () => {
      showAlert("Ya existe el folio")
    })
  }

  const revisarLabelCriterioCosto = (producto) => {
    if (producto.precioCostoOriginal != undefined) {
      return System.formatMonedaLocal(producto.precioCostoOriginal)
    } else {
      return ""
    }
  }

  return (
    <>
      <Dialog open={openDialog} fullWidth maxWidth={"lg"}
        PaperProps={{
          sx: {
            height: "90%"
          }
        }}
        onClose={cerrarPantalla}
      >

        <DialogContent>
          <Box sx={{
            backgroundColor: "#f0f0f0",
            borderRadius: "3px",
            position: "relative",
            border: "1px solid #b9b5b5",
            padding: "20px"
          }}>
            <Grid container spacing={2}>
              <Button sx={{
                position: "absolute",
                bottom: 0,
                color: "#fff",
                right: "10px",
                backgroundColor: "#b9b5b5",
                padding: "4px 10px",

                borderRadius: (showPanel ? "20px 0 0 0" : "0 0 0 20px"),
                top: (showPanel ? "" : "0px"),
                marginRight: "-10px",
                "&:hover": {
                  backgroundColor: "#000 ",
                  color: "white",
                },
              }} onClick={() => {
                setShowPanel(!showPanel)
              }}
                endIcon={showPanel ? (<ArrowUpward />) : (<ArrowDownward />)}>
                {showPanel ? "Ocultar panel" : "Ver panel"}
              </Button>
              {showPanel &&
                (<>
                  <Grid item xs={12} sm={12} md={6} lg={6}>


                    <TextField
                      select
                      label="Tipo de documento"
                      value={tipoDocumento}
                      onChange={(e) => setTipoDocumento(e.target.value)}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      <MenuItem value="Factura">Factura</MenuItem>
                      <MenuItem value="Boleta">Boleta</MenuItem>
                      <MenuItem value="Ticket">Ticket</MenuItem>
                      <MenuItem value="Ingreso Interno">Ingreso Interno</MenuItem>
                    </TextField>

                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>


                    <TextField
                      name="folioDocumento"
                      label="Folio documento"
                      value={folioDocumento}
                      onKeyDown={handleFolioChange}
                      onChange={(e) => setFolioDocumento(e.target.value)}
                      onBlur={checkFolio}
                      fullWidth
                      sx={{ mb: 2 }}
                    />

                  </Grid>
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Fecha de ingreso"
                        value={fecha}
                        onChange={(newValue) => setFecha(newValue)}
                        input={(params) => (
                          <TextField {...params} sx={{ mb: 2 }} />
                        )}
                        format="DD/MM/YYYY"
                        minDate={inicioRango}
                        maxDate={hoy}
                        sx={{
                          width: "100%"
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>

                    <TextField
                      fullWidth
                      sx={{ mb: 2 }}
                      placeholder="Nombre o RUT de Proveedor"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key == "Enter") {
                          buscarProveedor()
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} lg={3}>

                    <Button onClick={buscarProveedor} variant="contained" sx={{
                      width: "100%",
                      height: "55px"
                    }}>
                      Buscar
                    </Button>

                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    {proveedoresFiltrados.map((result) => (
                      <Chip
                        key={result.codigoProveedor}
                        label={`${result.razonSocial} ${result.rut}`}
                        onClick={() => clickEnProveedor(result)}
                        sx={{
                          backgroundColor: "#2196f3",
                          margin: "5px",
                        }}
                      />
                    ))}
                  </Grid>
                </>
                )}
            </Grid>
          </Box>

          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Box
                sx={{
                  flexWrap: "nowrap",
                  overflowX: "auto",

                  position: "relative",
                  top: "-50px",
                  display: "inline-block",
                  marginBottom: "-40px"
                }}
              >
                {selectedProveedor && (
                  <ListItem key={selectedProveedor.codigoCliente}
                    sx={{

                    }}>
                    <Chip
                      label={`${selectedProveedor.razonSocial} ${selectedProveedor.rut}`}
                      icon={<CheckCircleIcon />}
                      sx={{
                        backgroundColor: "#A8EB12",
                        margin: "5px",
                      }}
                    />

                    {associating && (
                      <Chip
                        label={"Asociando"}
                        icon={<CheckCircleIcon />}
                        sx={{
                          backgroundColor: (associating ? "#1DB8FF" : "#fff"),
                          margin: "5px",
                        }}

                        onClick={() => {

                          showConfirm("Cancelar asociacion?", () => {
                            setAssociating(false)
                          }, () => { })
                        }}
                      />
                    )}
                  </ListItem>
                )}

              </Box>

              <div style={{
                alignItems: "center",
                marginTop: "-20px"
              }}>


                <IngresoDocProvBuscarProductos

                  searchProd={searchProd}
                  setSearchProd={setSearchProd}
                  searchCodProv={searchCodProv}
                  setSearchCodProv={setSearchCodProv}
                  searchDescProv={searchDescProv}
                  setSearchDescProv={setSearchDescProv}
                  searchedProducts={searchedProducts}
                  setSearchedProducts={setSearchedProducts}


                  selectedProveedor={selectedProveedor}
                  associating={associating}
                  setAssociating={setAssociating}
                  onAddProduct={handleAddProductToSelecteds}
                  onAssociateAndAddProduct={handleAsocAndAddProductToSales}

                  countPackage={countPackage}
                  setCountPackage={setCountPackage}
                />


                <TableContainer
                  component={Paper}
                  style={{ overflowX: "auto", height: 250 }}
                >
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: "23%" }}>Descripción</TableCell>
                        <TableCell sx={{ width: "23%" }}>Precio Costo</TableCell>
                        <TableCell sx={{ width: "23%" }}>Cantidad</TableCell>
                        <TableCell sx={{}}>Total</TableCell>
                        <TableCell sx={{}}>P. Venta sugerido</TableCell>
                        <TableCell colSpan={2} sx={{ width: "20%" }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{
                      minHeight: "250px",
                      overflow: "scroll"
                    }}>
                      {selectedProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography sx={{
                              display: "inline-block",
                              cursor: "default",
                              fontSize: "12px"
                            }} variant="p">

                              <Tooltip title={product.nombre}>
                                <>
                                  {System.maxStr(product.nombre, 10)}


                                  {product.codigoInternoProveedor && (
                                    <Typography sx={{
                                      backgroundColor: "#ebffcc",
                                      display: "inline-block",
                                      padding: "10px"
                                    }} variant="span">Int.{product.codigoInternoProveedor}</Typography>
                                  )}

                                </>
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {/* {product.precioCosto} */}

                            <TextField
                              label={revisarLabelCriterioCosto(product)}
                              // value={revisarInputCriterioCosto(product.precioCosto)}
                              value={(product.precioCosto).toFixed(2)}
                              onChange={(e) =>
                                handleCostoChange(e.target.value, index)
                              }
                            />
                          </TableCell>
                          <TableCell>

                            <TextField
                              value={product.cantidad}
                              onChange={(e) =>
                                handleQuantityChange(e.target.value, index)
                              }

                              onBlur={(e) =>
                                handleQuantityBlur(index)
                              }

                              sx={{
                                width: "50%",
                                display: "inline-block"

                              }}
                            />
                            {product.cantidadProveedor > 1 && (
                              <Typography sx={{
                                marginLeft: "5px",
                                position: "relative",
                                display: "inline-block",
                                backgroundColor: "#ebffcc",
                                padding: "17px 10px"
                              }}> x {product.cantidadProveedor}</Typography>

                            )}
                          </TableCell>
                          <TableCell>{System.formatMonedaLocal(product.total)}</TableCell>
                          <TableCell>{System.formatMonedaLocal(product.precioVenta)}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => {
                                ajustarPrecio(product, index)
                              }}
                              variant="contained"
                              color="error"
                              sx={{
                                fontSize: "10.5px"
                              }}
                            >
                              Ajuste precios
                            </Button>
                          </TableCell>
                          <TableCell>
                            <IconButton

                              onClick={() => handleDeleteProduct(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>

                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Button
                  variant="contained"
                  color="secondary"
                  disabled={ !selectedProveedor}
                  onClick={() => {
                    if (associating && !countPackage) {
                      showMessage("Ingresar la cantidad por paquete antes de crear un producto")
                      return
                    }
                    setShowCreateProduct(true)
                  }}
                  sx={{
                    marginTop: "20px"
                  }}
                >
                  {associating ? "Crear y asociar producto" : "Crear producto"}
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    setShowCreateProveedor(true)
                  }}
                  sx={{
                    marginTop: "20px",
                    marginLeft: "5px",
                  }}
                >
                  Crear Proveedor
                </Button>

                <Typography variant={'h5'} sx={{
                  padding: "20px",
                  fontWeight: "bold",
                  float: "right"
                }}>
                  Total: {"   "}
                  <Typography sx={{
                    display: "inline",
                    fontWeight: "bold",
                    fontSize: "23px"
                  }}>${System.formatMonedaLocal(grandTotal)}</Typography>
                </Typography>
              </div>
            </Grid>
          </Grid>

          <DialogActions>


            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              Guardar
            </Button>
            <Button onClick={() => {
              cerrarPantalla()
            }} color="primary">
              Salir
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>


      <AjustePrecios
        openDialog={showAjustePrecios}
        setOpenDialog={setShowAjustePrecios}
        productoSel={productoSel}
        onChange={(changed) => {
          console.log("el changed es", changed)
          changed.total = calcularTotal(changed.precioCosto, changed.cantidad, changed.cantidadProveedor)
          System.addAllInArr(setSelectedProducts, selectedProducts, changed.index, changed)
        }}
      />

      <CrearProducto
        openAdd={showCreateProduct}
        setopenAdd={setShowCreateProduct}
        onSuccessAdd={(product) => {
          if (associating) {
            handleAsocAndAddProductToSales(product)
          } else {
            handleAddProductToSelecteds(product)
          }
          console.log("agregado ok")
        }}
      />

      <FormularioProveedor
        openDialog={showCreateProveedor}
        setOpenDialog={setShowCreateProveedor}
        onFinish={(proveedorNuevo) => {
          console.log("agregando proveedor", proveedorNuevo)
          setSelectedProveedor(proveedorNuevo)
        }}

        onClose={() => { }}
      />

    </>
  );
};

export default FormularioCompra;
