import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  InputLabel,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ModelConfig from "../../Models/ModelConfig";
import { AttachMoney, Percent } from "@mui/icons-material";
import Validator from "../../Helpers/Validator";
import Product from "../../Models/Product";
import System from "../../Helpers/System";
import { SelectedOptionsContext } from "./../Context/SelectedOptionsProvider";
export const defaultTheme = createTheme();

const PreciosGeneralesProducItem = ({ 
  producto,
  index,
  onChange = null,
  onUpdatedOk,
  onUpdatedWrong,
 }) => {

  const {
    showLoading,
    hideLoading,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const [ultimoFoco, setUltimoFoco] = useState("-")
  const [cargaUnica, setCargaUnica] = useState(true)
  const [fijarCosto, setFijarCosto] = useState(false);
  const [fijarVenta, setFijarVenta] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(()=>{
    // console.log("cambio producto",product)
    
    if(cargaUnica){
      console.log("primera carga de producto", product)
      init()
      setCargaUnica(false)
      console.log("llego hasta cambiar primera carga")
      return
    }
    console.log("product")
  if(onChange)onChange(product)

    if(ultimoFoco == "precioCosto" || ultimoFoco == "gananciaPorcentaje"){

      if(fijarVenta || fijarCosto){
        if(product.precioVenta<= product.precioCosto){
          showMessage("El precio de venta debe ser mayor al de costo")
          System.addAllInObj(setProduct,{
            gananciaValor:0,
            ivaValor:0,
          })
          setUltimoFoco("")
          return
        }
        console.log("algo fijo")
        const resul = Product.calcularMargen(product)
        System.addAllInObj(setProduct,resul)
        setUltimoFoco("")
        return
      }

        const resul = Product.logicaPrecios(product,"final")
        System.addAllInObj(setProduct,resul)
        setUltimoFoco("")
    }

    if(ultimoFoco == "precioVenta"){
      if(fijarVenta || fijarCosto){
        if(product.precioVenta<= product.precioCosto){
          showMessage("El precio de venta debe ser mayor al de costo")
          System.addAllInObj(setProduct,{
            gananciaValor:0,
            ivaValor:0,
          })
          setUltimoFoco("")
          return
        }
        console.log("algo fijo")
        
        const resul = Product.calcularMargen(product)
        System.addAllInObj(setProduct,resul)
        setUltimoFoco("")
        return
      }
      const resul = Product.logicaPrecios(product,"costo")
      System.addAllInObj(setProduct,resul)
      setUltimoFoco("")
    }

    
  },[ product
  ])

  useEffect(()=>{
    console.log("cambio desde afuera", producto)
    setCargaUnica(true)
  },[producto])

  const init = ()=>{
    console.log("inicia con:",System.clone(producto))
    const resul = Product.iniciarLogicaPrecios(System.clone(producto))
    System.addAllInObj(setProduct,resul)
    console.log("termina la carga inicial asi", System.clone(resul))
    // setProduct(producto)
  }

  const changePriceValue = (propName,newValue)=>{
    console.log("propName", propName)
    // console.log("index", index)
    if(newValue == '') newValue = "0"
    newValue = parseFloat(newValue)
    newValue = newValue.toFixed(2)
    newValue = parseFloat(newValue)

    console.log("changePriceValue para " + propName + ".. nuevo valor : " + newValue)
    if(Validator.isPeso(newValue)){
      console.log("es valido")
      System.addInObj(setProduct,propName,parseInt(parseFloat(newValue).toFixed(0)))
    }else{
      // console.log("no es valido")
    }
    console.log("con el cambio queda asi:",product)
    setUltimoFoco(propName)
  }

  const checkFijarCosto = (e)=>{
    if(!fijarCosto && fijarVenta){
      setFijarVenta(false)
    }
    setFijarCosto(!fijarCosto)
  }

  const checkFijarVenta = (e)=>{
    if(!fijarVenta && fijarCosto){
      setFijarCosto(false)
    }
    setFijarVenta(!fijarVenta)
  }



  const handleGuardarClick = async () => {
    // console.log("guardando...")
    // try {
      // console.log("Datos antes de la actualización:", product);
      if(product.precioNeto <= 0){
        alert("falta calcular valores")
        return
      }
      const editedProduct = {
        ...product,
        categoria: product.idCategoria,
        subCategoria: product.idsubCategoria,
        familia: product.idFamilia,
        subFamilia: product.idSubFamilia,
        margen: product.gananciaPorcentaje
      };
      console.log("para enviar",editedProduct)
      Product.getInstance().update(editedProduct,(data,response)=>{
        onUpdatedOk(editedProduct,response)
      },(error)=>{
        onUpdatedWrong(error)
      })
    // } catch (error) {
    // }
  };

  return !product ? (<></>): (
    <TableRow key={index} sx={{
      backgroundColor: ( index % 2 == 0 ? "whitesmoke" : "#e5e5e5")
    }}>
      <TableCell>{product.nombre}</TableCell>
      <TableCell>
      <InputLabel>Precio compra</InputLabel>
        <TextField
          variant="outlined"
          fullWidth
          value={product.precioCosto}
          onChange={(e) => changePriceValue("precioCosto",e.target.value)}
          onClick={()=>setUltimoFoco("precioCosto")}
          InputProps={{
            pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
          }}
        />
        
        <label style={{
          userSelect:"none",
          width:"100%",
          textAlign:"center",
          fontSize:"15px"
        }}>
          Fijar
        <input 
          type="checkbox"
          checked={fijarCosto}
          onChange={()=>{}}
          onClick={checkFijarCosto}
          style={{
            position:"relative",
            top:"5px",
            marginTop:"15px",
            width:"30px",
            height:"20px"
          }}
          />
          </label>
      </TableCell>


      <TableCell>
      <InputLabel>Utilidad</InputLabel>

      <TextField
          variant="outlined"
          fullWidth
          value={product.gananciaPorcentaje}
          onChange={(e) => changePriceValue("gananciaPorcentaje",e.target.value)}
          onClick={()=>setUltimoFoco("gananciaPorcentaje")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Percent />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          name="gananciaValor"
          variant="outlined"
          fullWidth
          disabled={true}

          value={product.gananciaValor}
          onChange={(e) => changePriceValue("gananciaValor",e.target.value)}

          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
          }}
        />
      </TableCell>
      <TableCell>
      <InputLabel>Iva</InputLabel>

      <TextField
          name="ivaPorcentaje"
          variant="outlined"
          fullWidth
          value={product.ivaPorcentaje}
          disabled={true}
          onChange={(e) => changePriceValue("ivaPorcentaje",e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Percent />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          name="ivaValor"
          variant="outlined"
          fullWidth
          disabled={true}

          value={product.ivaValor}
          onChange={(e) => changePriceValue("ivaValor",e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
          }}
        />
      </TableCell>

      <TableCell>
      <InputLabel>Precio final</InputLabel>

      <TextField
          name="precio"
          variant="outlined"
          fullWidth
          value={product.precioVenta}
          onChange={(e) => changePriceValue("precioVenta",e.target.value)}
          onClick={()=>setUltimoFoco("precioVenta")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
          }}
        />

        <label style={{
          userSelect:"none",
          width:"100%",
          textAlign:"center",
          fontSize:"15px"
        }}>
          Fijar
        <input 
            type="checkbox"
            checked={fijarVenta}
            onChange={()=>{}}
            onClick={checkFijarVenta}
            style={{
              position:"relative",
              top:"5px",
              marginTop:"15px",
              width:"30px",
              height:"20px"
            }}
            />
            </label>

      </TableCell>

      <TableCell>
        <Button
          onClick={() => handleGuardarClick()}
          variant="contained"
          color="secondary"
        >
          Guardar
        </Button>
      </TableCell>
    </TableRow>
  )
};

export default PreciosGeneralesProducItem;
