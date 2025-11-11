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
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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
import StorageSesion from "../../Helpers/StorageSesion";
import Shop from "../../Models/Shop";
import SearchProducts from "../Elements/Compuestos/SearchProducts";
import InputNumber from "../Elements/Compuestos/InputNumber";

const AsignaIngredientes = ({
  producto,
  openDialog,
  setOpenDialog
}) => {

  const {
    showLoading,
    hideLoading,
    showMessage,
    showConfirm,
    showAlert
  } = useContext(SelectedOptionsContext);



  const [valueProperty, setValueProperty] = useState(null)

  const [infoComercio, setInfoComercio] = useState(null)
  const [productos, setProductos] = useState([])

  const [cambio, setCambio] = useState(false)

  useEffect(() => {
    if (openDialog) {
      var comSes = new StorageSesion("comercio")
      if (comSes.hasOne()) {
        setInfoComercio(comSes.cargar(1))
      } else {
        showAlert("abrir config de la tienda para obtener informacion basica")
      }
    }
  }, [openDialog])


  useEffect(() => {
    if (infoComercio) {
      // console.log("cambio info comercio", infoComercio)
      // if (isEdit) {
      cargarPropiedad()
      // }
    }
  }, [infoComercio])


  const actualizarPropiedad = (valor) => {
    console.log("actualizarPropiedad ", "valor", valor)
    // showLoading("Cargando imagen")
    Shop.updateProperty("producto", producto.idProducto, "ingredientes", valor, infoComercio, (resp) => {
      // console.log("respuesta del servidor", resp)
      if (resp.info != "") {
        setProductos(JSON.parse(resp.info))
      }
      showMessage("Guardado correctamente")
      // hideLoading()
    }, (er) => {
      // hideLoading()
      showMessage(er)
    })
  }

  const cargarPropiedad = () => {
    // showLoading("Cargando imagen")
    Shop.getProperty("producto", producto.idProducto, "ingredientes", infoComercio, (resp) => {
      // console.log("respuesta del servidor", resp)
      if (resp.info != "") {
        setProductos(JSON.parse(resp.info))

      }
      if (resp.info == "[object Object]") {
        setProductos([])
      }
      // hideLoading()
    }, (er) => {
      // hideLoading()
      showMessage(er)
    })
  }


  const onDeleteClick = (prod, index) => {
    console.log("eliminar ", prod)
    console.log("eliminar index", index)

    const prs = productos.filter((pr, ix) => {
      return ix != index
    })

    setProductos([...prs])

    setCambio(true)
  }


  const confirmAgregar = (prod) => {
    console.log("agregando ", prod)
    prod.cantidad = 1
    const prs = productos
    prs.push(prod)

    console.log("prs", prs)
    setProductos([...prs])
    setCambio(true)

  }


  const checkSalir = () => {
    if (cambio) {
      showConfirm("Guardar los cambios?", () => {
        guardarCambios()
        setOpenDialog(false)
      }, () => {
        setOpenDialog(false)
      })
    } else {
      setOpenDialog(false)
    }
  }

  const guardarCambios = () => {
    setValueProperty(JSON.stringify(productos))
    setCambio(false)

  }


  useEffect(() => {
    if (valueProperty != null) {
      // console.log("cambio", valueProperty)
      // console.log("type cambio", typeof (valueProperty))
      actualizarPropiedad(valueProperty)
    }
  }, [valueProperty])


  return (<Dialog open={openDialog} onClose={checkSalir}
    fullWidth maxWidth={"md"}
    PaperProps={{
      sx: {
        height: "90%"
      }
    }}>
    <DialogTitle>Ingredientes para {producto.nombre}</DialogTitle>
    <DialogContent>

      <SearchProducts onProductSelect={confirmAgregar} labelInput="Buscar para agregar..." />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell># </TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Cantidad </TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!productos.length ? (
            <TableRow>
              <TableCell colSpan={20}>No se asignaron productos</TableCell>
            </TableRow>
          ) : (
            productos.map((product, index) => {
              // console.log("key:" + product.idProducto 
              //   + "////nombre: " + product.nombre
              //   + "////count: " + pageProduct.length
              // )
              return (<TableRow key={index}>
                <TableCell>{product.idProducto}</TableCell>
                <TableCell>
                  {product.nombre}

                </TableCell>
                <TableCell>

                  <InputNumber
                    inputState={[product.cantidad, (nuevoValor) => {
                      const prs = productos
                      prs[index].cantidad = nuevoValor
                      console.log("cambia cant", [...prs])
                      setProductos([...prs])

                      setCambio(true)

                    }]}
                    isDecimal={true}
                    label={""}
                    withLabel={false}
                  />

                </TableCell>
                <TableCell>
                  <IconButton onClick={() => onDeleteClick(product, index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              )
            }
            )
          )}
        </TableBody>
      </Table>

    </DialogContent>
    <DialogActions>
      <SmallButton textButton={"Guardar cambios"} actionButton={guardarCambios} />

      <Button onClick={checkSalir} color="primary">
        Atras
      </Button>
    </DialogActions>
  </Dialog>)
};

export default AsignaIngredientes;
