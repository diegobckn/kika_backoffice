/* eslint-disable no-redeclare */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";
import Product from "../../Models/Product";
import System from "../../Helpers/System";

const EditarProducto = ({ 
  product, 
  open, 
  handleClose,
  onEdit
}) => {
  const apiUrl = ModelConfig.get().urlBase;

  const [editedProduct, setEditedProduct] = useState({});
  
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [esPesable, setEsPesable] = useState( false );

  const [successMessage, setSuccessMessage] = useState("");

  const [changesNML,setchangesNML] = useState({
    "idCategoria" : 0,
    "idSubCategoria" : 0,
    "idFamilia" : 0,
    "idSubFamilia" : 0,
  })

  //INICIADOR DE DATOS
  
  useEffect(() => {
    setEditedProduct(product);
    setEsPesable( product.tipoVenta == 2 )
  }, [open]);
    

  const checkChangeNML = ()=>{
    // console.log("checkChangeNML")
    // console.log("Valores NML:", JSON.parse(JSON.stringify(changesNML)))
    // console.log("editedProduct:", JSON.parse(JSON.stringify(editedProduct)))
    if(changesNML.idCategoria != editedProduct.idCategoria){
      return "idCategoria"
    }

    if(changesNML.idSubCategoria != editedProduct.idSubCategoria){
      return "idSubCategoria"
    }

    if(changesNML.idFamilia != editedProduct.idFamilia){
      return "idFamilia"
    }

    if(changesNML.idSubFamilia != editedProduct.idSubFamilia){
      return "idSubFamilia"
    }
    return ""
  }

  
  const cargarCategorias = ()=>{
    // console.log("cargarCategorias")
    Product.getInstance().getCategories((categorias)=>{
      setCategories(categorias);
      // console.log("las categorias son:",categorias);
      if(editedProduct.idCategoria!=0){
        changesNML.idCategoria = editedProduct.idCategoria
        // console.log("Valores NML:", JSON.parse(JSON.stringify(changesNML)))
        // console.log("tiene idCategoria:" + editedProduct.idCategoria + "..cargamos subcategorias")
        cargarSubCategorias()
      }else{
        setSubCategories([])
        setFamilies([])
        setSubFamilies([])
      }
    }, (err)=>{ })

  }

  const cargarSubCategorias = ()=>{
    // console.log("cargarSubCategorias")
    if(editedProduct.idCategoria != 0){
      Product.getInstance().getSubCategories(editedProduct.idCategoria,(subcategorias)=>{
        setSubCategories(subcategorias);
        // console.log("las subcategorias son:",subcategorias);
        if(editedProduct.idSubCategoria!=0){
          changesNML.idSubCategoria = editedProduct.idSubCategoria
          // console.log("Valores NML:", JSON.parse(JSON.stringify(changesNML)))
          // console.log("tiene idSubCategoria:" + editedProduct.idSubCategoria + "..cargamos familias")
          cargarFamilias()
        }else{
          setFamilies([])
          setSubFamilies([])
        }
      },()=>{})
    }
  }

    const cargarFamilias = ()=>{
      // console.log("cargarFamilias")
      if (
        editedProduct.idCategoria != 0
        && editedProduct.idSubCategoria != 0
      ) {
        Product.getInstance().getFamiliaBySubCat({
          categoryId:editedProduct.idCategoria,
          subcategoryId:editedProduct.idSubCategoria,
        },(familias)=>{
          setFamilies(familias);
          // console.log("las familias son:",familias);
          if(editedProduct.idFamilia!=0){
            changesNML.idFamilia = editedProduct.idFamilia
            // console.log("Valores NML:", JSON.parse(JSON.stringify(changesNML)))
            // console.log("tiene idFamilia:" + editedProduct.idFamilia + "..cargamos subfamilias")
            cargarSubFamilias()
          }else{
            setSubFamilies([])
          }
        },()=>{})
      }
    }

    const cargarSubFamilias = ()=>{
      // console.log("cargarSubFamilias")

      if (
        editedProduct.idCategoria != 0
        && editedProduct.idSubCategoria != 0
        && editedProduct.idFamilia != 0
      ) {
        Product.getInstance().getSubFamilia({
          categoryId: editedProduct.idCategoria,
          subcategoryId:editedProduct.idSubCategoria,
          familyId:editedProduct.idFamilia
        },(subfamilias)=>{
          setSubFamilies(subfamilias);
          // console.log("las subfamilias son:",subfamilias);
          if(editedProduct.idSubFamilia!=0){
            changesNML.idSubFamilia = editedProduct.idSubFamilia
            // console.log("Valores NML:", JSON.parse(JSON.stringify(changesNML)))
            // console.log("tiene idSubFamilia:" + editedProduct.idSubFamilia)
          }
        },()=>{})
      }
  }

  // setEditedProduct({
  //   ...editedProduct,
  //   idSubCategoria:0,
  //   idFamilia:0,
  //   idSubFamilia:0,
  // })

  const checkCambiosNML = ()=>{
    // console.log("Valores NML:", JSON.parse(JSON.stringify(changesNML)))
    const someChangesNML = checkChangeNML()


    // console.log("someChangesNML:",someChangesNML)
    if(someChangesNML!= ""){
      switch(someChangesNML){
        case "idCategoria":
          cargarSubCategorias();
        break;
        case "idSubCategoria":
          cargarFamilias();
        break;
        case "idFamilia":
          cargarSubFamilias();
        break;
        default:
          console.log("no cambio nada")
          return
        break
      }

      changesNML[someChangesNML] = editedProduct[someChangesNML]
      // console.log("actualizando valor " + someChangesNML + " en NML:", changesNML)
    }
  }

  useEffect(() => {
    if(Object.keys(editedProduct).length<1) return
    console.log(editedProduct)

    if(categories.length<1) {
      cargarCategorias()
    }else{
      checkCambiosNML()
    }
    
  }, [
    editedProduct,
    // categories.length,
    // subcategories.length,
    // families.length,
    // subfamilies.length,
  ]);

  

  const closeSuccessDialog = () => {
    setOpenErrorDialog(false);
  };

  const handleSave = async (event) => {

    
    event.preventDefault();
    
    var nuevoObjetoActualizado = {
      ...editedProduct,
      tipoVenta: (esPesable ? 2 : 1)
    };


    nuevoObjetoActualizado.stockActual = parseInt(nuevoObjetoActualizado.stockActual)
    
    delete nuevoObjetoActualizado.categoria
    delete nuevoObjetoActualizado.subCategoria
    delete nuevoObjetoActualizado.familia
    delete nuevoObjetoActualizado.subFamilia
    
    console.log("para enviar:", nuevoObjetoActualizado)
    Product.getInstance().update(nuevoObjetoActualizado,(res)=>{
      // setSuccessDialogOpen(true);
      setSuccessMessage(res.message);
      handleClose();
      if(onEdit) onEdit()
      // window.location.reload(1)
    },(err)=>{
      setErrorMessage(err.message);
      setOpenErrorDialog(true);
    })
  };

  const checkEsPesable = (e)=>{
    // console.log("e")
    // console.log(e)
    setEsPesable(!esPesable)
  }


  return (
    //fullScreen
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Editar Producto</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{
          marginTop:"-10px"
        }}>
          <Grid item xs={8}>
            <TextField
              name="nombre"
              label="Nombre Producto"
              value={editedProduct.nombre || ""}
              onChange={(e) => {
                setEditedProduct({
                  ...editedProduct,
                  nombre: e.target.value,
                });
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Categoría</InputLabel>
            <Select
              fullWidth
              value={categories.length>0 ? editedProduct.idCategoria : 0}
              
              onChange={(e) => {
                console.log("antes de cambiar categoria el prod esta asi:", JSON.parse(JSON.stringify(editedProduct) ) )
                setEditedProduct({
                  ...editedProduct,
                  // categoria: e.target.value,
                  idCategoria: e.target.value,
                  idSubCategoria: 0,
                  idFamilia: 0,
                  idSubFamilia: 0,
                });
                changesNML.idSubCategoria = 0
                changesNML.idFamilia = 0
                changesNML.idSubFamilia = 0
              }}
              label="Selecciona Categoría"
            >
              <MenuItem
                  key={0}
                  value={0}
                >
                  SELECCIONAR CATEGORIA
                </MenuItem>
              {categories.map((category,ix) => (
                <MenuItem
                  key={ix}
                  value={category.idCategoria}
                >
                  {category.descripcion}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Sub-Categoría</InputLabel>
            <Select
              fullWidth
              // value={subcategories.length > 0 ? editedProduct.idSubCategoria : ""}
              value={subcategories.length > 0 ? editedProduct.idSubCategoria : 0}
              onChange={(e) => {
                setEditedProduct({
                  ...editedProduct,
                  // categoria: e.target.value,
                  idSubCategoria: e.target.value,
                  idFamilia: 0,
                  idSubFamilia: 0,
                });

                changesNML.idFamilia = 0
                changesNML.idSubFamilia = 0
              }}
              label="Selecciona Sub-Categoría"
            >
              <MenuItem
                  key={0}
                  value={0}
                >
                  SELECCIONAR SUBCATEGORIA
                </MenuItem>
              {subcategories.map((subcategory) => (
                <MenuItem
                  key={subcategory.idSubcategoria}
                  value={subcategory.idSubcategoria}
                >
                  {subcategory.descripcion}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Familia</InputLabel>
            <Select
              fullWidth
              value={families.length>0 ? editedProduct.idFamilia : 0}
              onChange={(e) => {
                setEditedProduct({
                  ...editedProduct,
                  // categoria: e.target.value,
                  idFamilia: e.target.value,
                  idSubFamilia: 0,
                });
                changesNML.idSubFamilia = 0
              }}
              label="Selecciona Familia"
            >
              <MenuItem
                  key={0}
                  value={0}
                >
                  SELECCIONAR FAMILIA
                </MenuItem>

              {families.map((family) => (
                <MenuItem 
                key={family.idFamilia} 
                value={family.idFamilia}>
                  {family.descripcion}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Sub Familia</InputLabel>
            <Select
              fullWidth
              value={subfamilies.length>0 ? editedProduct.idSubFamilia : 0}
              onChange={(e) => {
                console.log("antes de cambiar subfamilia el prod esta asi:", JSON.parse(JSON.stringify(editedProduct) ) )
                setEditedProduct({
                  ...editedProduct,
                  // categoria: e.target.value,
                  idSubFamilia: e.target.value,
                });
              }}
              label="Selecciona SubFamilia"
            >

                <MenuItem
                  key={0}
                  value={0}
                >
                  SELECCIONAR SUBFAMILIA
                </MenuItem>
              {subfamilies.map((subfamily) => (
                <MenuItem
                  key={subfamily.idSubFamilia}
                  value={subfamily.idSubFamilia}
                >
                  {subfamily.descripcion}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <InputLabel>Marca</InputLabel>
            <Grid item xs={12}>
              <TextField
                name="marca"
                label=""
                value={editedProduct.marca || ""}
                onChange={(e) => {
                  // setSelectedCategoryId(e.target.value);
                  // // setEditedProduct.categoria=e.target.value;
                  setEditedProduct((prevProduct) => ({
                    ...prevProduct,
                    marca: e.target.value,
                  }));
                }}
                fullWidth
              />
            </Grid>

          </Grid>


          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Grid display="flex" alignItems="center">
              <label onClick={checkEsPesable}
               style={{
                marginTop: (System.isXsOrSm() ? "0": "41px"),
                userSelect:"none"
               }}>
                Es Pesable
                </label>
              <input
                type="checkbox"
                checked={esPesable}

                onChange={()=>{ } }

                onClick={checkEsPesable}
                style={{
                  marginTop: (System.isXsOrSm() ? "0": "41px"),
                  width:"50px",
                  height:"20px"
                }}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
            <InputLabel>Precio venta</InputLabel>
            <Grid item xs={12}>
              <TextField
                name="precioVenta"
                label=""
                value={editedProduct.precioVenta || ""}
                onChange={(e) => {
                  // setSelectedCategoryId(e.target.value);
                  // // setEditedProduct.categoria=e.target.value;
                  setEditedProduct((prevProduct) => ({
                    ...prevProduct,
                    precioVenta: parseFloat(e.target.value),
                  }));
                }}
                fullWidth
              />
            </Grid>

          </Grid>


          {/* <Grid item xs={6}>
            <InputLabel>Ingresa Proveedor</InputLabel>
            <Select
              fullWidth
              value={selectedProveedorId}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  proveedor: e.target.value,
                }));
              }}
              label="Selecciona Proveedor"
            >
              <MenuItem value={editedProduct.id || ""}>
                {editedProduct.proveedor}
              </MenuItem>
              {proveedores.map((proveedor) => (
                <MenuItem
                  key={proveedor.id}
                  value={proveedor.nombreResponsable}
                >
                  {proveedor.nombreResponsable}
                </MenuItem>
              ))}
            </Select>
          </Grid> */}

          <Grid item xs={12}>
          <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              name="stockInicial"
              label="Stock Inicial"
              type="number"
              value={editedProduct.stockInicial || ""}
              onChange={(e) => {
                // setSelectedCategoryId(e.target.value);
                // // setEditedProduct.categoria=e.target.value;
                // setEditedProduct((prevProduct) => ({
                //   ...prevProduct,
                //   stockInicial: e.target.value,
                // }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              name="stockActual"
              label="Stock actual"
              type="number"
              value={editedProduct.stockActual || ""}
              onChange={(e) => {
                // setSelectedCategoryId(e.target.value);
                // // setEditedProduct.categoria=e.target.value;
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  stockActual: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              name="stockCritico"
              label="Stock Critico"
              type="number"
              value={editedProduct.stockCritico || ""}
              onChange={(e) => {
                // setSelectedCategoryId(e.target.value);
                // // setEditedProduct.categoria=e.target.value;
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  stockCritico: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>
          </Grid>
          </Grid>


          


          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Guardar
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Cerrar
            </Button>

            <Typography sx={{
              float:"right",
              display:"inline-block",
            }}
            variant="p"
            >
              Precio vta $
              <Typography sx={{
                fontSize:"23px",
                position:"relative",
                top:"2px"
            }}
            variant="span">
              { (editedProduct.precioVenta ? editedProduct.precioVenta.toLocaleString() : "0") }
              </Typography>
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <Dialog open={successDialogOpen} onClose={closeSuccessDialog}>
        <DialogTitle> Edición Exitosa </DialogTitle>
        <DialogContent>
          <Typography>{successMessage}</Typography>{" "}
          {/* Aquí se muestra el mensaje de éxito */}
        </DialogContent>
      </Dialog>

      <Dialog open={openErrorDialog} onClose={closeSuccessDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
          <DialogContentText>
            Ingrese uno nuevo y repita el proceso
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSuccessDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default EditarProducto;
