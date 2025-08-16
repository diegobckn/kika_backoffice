/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  Tabs,
  Tab,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditarProducto from "../Productos/EditarProducto";
import ModelConfig from "../../Models/ModelConfig";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Product from "../../Models/Product";
import SearchListProductItem from "./SearchListProductItem";
import System from "../../Helpers/System";


const ITEMS_PER_PAGE = 10;
const SearchListProducts = ({
  refresh,
  setRefresh
}) => {

  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const apiUrl = ModelConfig.get().urlBase;
  const [searchTerm, setSearchTerm] = useState("");
  const [product, setProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1000);
  const [pageProduct, setPageProduct] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  // const [refresh, setRefresh] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [hasResult, setHasResult] = useState(false);

  const handleTabChange = (event, newValue) => {
    // setSelectedTab(newValue);
  };

  const setPageCount = (productCount) => {
    const totalPages = Math.ceil(productCount / ITEMS_PER_PAGE);
    if (!isNaN(totalPages)) {
      setTotalPages(totalPages);
    } else {
      console.error("Invalid product count:", productCount);
    }
  };

   const listarProductos = async () => {
     // console.log("vars:", System.getUrlVars())
     var urlVars = System.getUrlVars()
     if(urlVars.search != undefined){
       console.log("cae aca")
       doSearch(urlVars.search)
       return
      }
      
      console.log("Cargando productos...")
      showLoading("Cargando productos...")

      Product.getInstance().getAllPaginate({
        pageNumber:currentPage
      },(prods,response)=>{
        if (Array.isArray(response.data.productos)) {
          setProduct(response.data.productos);
          setFilteredProducts(response.data.productos);
          setPageCount(response.data.cantidadRegistros);
          setPageProduct(response.data.productos);
          setHasResult(response.data.productos.length>0)
        }
        hideLoading()
      },(error)=>{
        console.error("Error fetching product:", error);
        setHasResult(false)
        hideLoading()
      })
    };

  const doSearch = (replaceSearch = "")=>{
    if(searchTerm == "" && replaceSearch == "")return

    
    var txtSearch = searchTerm
    if(txtSearch == "") {
      txtSearch = replaceSearch
      setSearchTerm(replaceSearch)
    }


    console.log("hace busqueda")
    showLoading("haciendo busqueda por descripcion")
    
      
    
      Product.getInstance().findByDescriptionPaginado({
        description: txtSearch,canPorPagina: 10,pagina:currentPage
      }, (prods)=>{
        // setFilteredProducts(prods);
        // setProduct(prods);
        // setFilteredProducts(prods);
        // setPageCount(prods);

        if(prods.length<1){
          showLoading("haciendo busqueda por codigo")
          Product.getInstance().findByCodigoBarras({
            codigoProducto: txtSearch
          }, (prods)=>{
            // setFilteredProducts(prods);
            // setProduct(prods);
            // setFilteredProducts(prods);
            // setPageCount(prods);
            setPageProduct(prods);
            
            console.log("asigno productos")
            console.log(prods)
            hideLoading()
            setHasResult(prods.length>0)
          }, ()=>{
            hideLoading()
            setHasResult(false)
          })
        }else{
          setPageProduct(prods);
          hideLoading()
          setHasResult(prods.length>0)
        }
      }, ()=>{
        hideLoading()
        setHasResult(false)
      })
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const updateList = ()=>{
    if(searchTerm.trim() == ""){
      listarProductos()
    }else{
      console.log("tiene algo para buscar")
      doSearch()
    }
  }

  useEffect(() => {
    console.log("cambio pageProduct")
  }, [pageProduct,]);

  useEffect(() => {
    console.log("cambio searchTerm")
  }, [
    searchTerm
    ]);
  


  useEffect(() => {
    console.log("cambio hasResult")
  }, [
    hasResult
    ]);

  useEffect(() => {
    updateList()
    console.log("cambio de pagina")
  }, [currentPage]);



  const handleDelete = async (id) => {
    try {
      // Eliminar el producto localmente
      const updatedProducts = product.filter((p) => p.idProducto !== id);
      setProduct(updatedProducts);

      // Llamada a la API para eliminar el producto
      const response = await axios.delete(
        apiUrl + `/ProductosTmp/DeleteProducto?id=${id}`
      );

      if (response.data.statusCode === 201) {
        showMessage("Producto eliminado correctamente");
        setRefresh(!refresh); // Actualizar la lista después de la eliminación
      } else {
        showMessage("Error al eliminar el producto");
      }
    } catch (error) {
      showMessage("Error al eliminar el producto");
      console.error("Error deleting product:", error);
    }
  };

  // Dentro de useEffect, después de eliminar el producto, actualiza la lista de productos
  useEffect(() => {
    updateList()
  }, [refresh]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };
  const handleOpenDialog = (product) => {
    setProductToDelete(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      handleDelete(productToDelete.idProducto);
      handleCloseDialog();
    }
  };


  const checkEnterSearch = (e)=>{
    if(e.keyCode == 13){
      // console.log("apreto enter")
      doSearch()
    }
  }

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <div>
        {/* <Tabs value={selectedTab} onChange={handleTabChange}> */}
        <Tabs value={0}>
          <Tab label="Productos sin codigos" />
          {/* <Tab label="Productos con codigos" /> */}
        </Tabs>
        {/* <div style={{ p: 2, mt: 4 }} role="tabpanel" hidden={selectedTab !== 0}> */}
        <div style={{ p: 2, mt: 4 }} role="tabpanel">
          <TextField
            sx={{
              marginTop:"30px",
              width:"250px",
            }}
            margin="dense"
            label="Buscar productos..."
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            onKeyDown={(e)=>{
              checkEnterSearch(e)
            }}
          />
          <Button sx={{
              marginTop:"30px",
              marginLeft:"10px",
              height:"55px !important",
              width:"150px",
              color:"white",
              backgroundColor:"midnightblue",
              "&:hover": {
              backgroundColor: "#1c1b17 ",
              color: "white",
            },
            }}
            onClick={()=>{doSearch()}}
            >Buscar</Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Productos </TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Mercado Lógico</TableCell>
                <TableCell>Precios </TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Impuestos</TableCell>
                <TableCell>Bodega</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!hasResult ? (
                <TableRow>
                  <TableCell colSpan={2}>No se encontraron productos</TableCell>
                </TableRow>
              ) : (
                pageProduct.map((product,index) => {
                  // console.log("key:" + product.idProducto 
                  //   + "////nombre: " + product.nombre
                  //   + "////count: " + pageProduct.length
                  // )
                  return(
                    <SearchListProductItem 
                      product={product}
                      key={index}
                      index={index}
                      onEditClick={(p) => handleEdit(p)}
                      onDeleteClick={(p) => handleOpenDialog(p)}
                    />
                )
                }
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Pagination
        count={currentPage + 1}
        page={currentPage}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />

      {openEditModal && selectedProduct && (
        <EditarProducto
          product={selectedProduct}
          open={openEditModal}
          handleClose={handleCloseEditModal}
          onEdit={()=>{
            showMessage("Editado correctamente")
            setTimeout(() => {
              setRefresh(!refresh)
            }, 100);
          }}
        />
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"Confirmar Eliminación"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este producto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
     
    </Box>
  );
};

export default SearchListProducts;
