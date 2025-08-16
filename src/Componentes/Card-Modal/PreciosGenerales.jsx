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
import PreciosGeneralesProducItem from "./PreciosGeneralesProducItem";
import Product from "../../Models/Product";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import dayjs from "dayjs";

export const defaultTheme = createTheme();

const PreciosGenerales = ({ onClose }) => {


  const {
    showLoading,
    hideLoading,
    showMessage
  } = useContext(SelectedOptionsContext);


  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  useEffect(() => {
    const fetchProducts = async () => {
      Product.getInstance().getAllPaginate({
        rowPage:5
      },(prods)=>{
        setProducts(prods);
      },(error)=>{
        setErrorMessage("Error al buscar el producto por descripción");
        setOpenSnackbar(true);
      })
    };

    fetchProducts();

  }, []);

  const handleSearchButtonClick = async () => {
    if (searchTerm.trim() === "") {
      setErrorMessage("El campo de búsqueda está vacío");
      setOpenSnackbar(true);
      setProducts([])
      return;
    }



    // Product.getInstance().findByDescription({
    //   description: searchTerm
    // },(prods)=>{
    //   setProducts(prods);
    // },(error)=>{
    //   console.error("Error al buscar el producto:", error);
    //   setErrorMessage("Error al buscar el producto");
    //   setOpenSnackbar(true);
    // })




    setProducts([])    
    showLoading("haciendo busqueda por descripcion")
    Product.getInstance().findByDescriptionPaginado({
      description: searchTerm
    }, (prods)=>{
      if(prods.length<1){
        showLoading("haciendo busqueda por codigo")
        Product.getInstance().findByCodigoBarras({
          codigoProducto: searchTerm
        }, (prods)=>{
          // setFilteredProducts(prods);
          // setProduct(prods);
          // setFilteredProducts(prods);
          // setPageCount(prods);
          setProducts(prods);
          hideLoading()
        }, (error)=>{
          hideLoading()

          console.error("Error al buscar el producto:", error);
          setErrorMessage("Error al buscar el producto");
          setOpenSnackbar(true);


        })
      }else{
        setProducts(prods);
        hideLoading()
      }
    }, (error)=>{

      hideLoading()
      console.error("Error al buscar el producto:", error);
      setErrorMessage("Error al buscar el producto");
      setOpenSnackbar(true);
    })

  };

  const checkEnterSearch = (e)=>{
    if(e.keyCode == 13){
      // console.log("apreto enter")
      handleSearchButtonClick()
    }
  }


  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container justifyContent="center" sx={{  }}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Precios Generales
            </Typography>
            <div style={{ alignItems: "center" }}>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                sx={{ display: "flex", margin: 1 }}
              >
                <InputLabel
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    margin: 1,
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  Buscador de productos
                </InputLabel>
              </Grid>

              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                sx={{
                  margin: 1,
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                }}
              >
                <TextField
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "5px",
                  }}
                  fullWidth
                  focused
                  placeholder="Ingresa Búsqueda"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e)=>{
                    checkEnterSearch(e)
                  }}
                />
                <Button
                  sx={{
                    width: "30%",
                    margin: "1px",
                    backgroundColor: " #283048",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1c1b17 ",
                      color: "white",
                    },
                  }}
                  onClick={handleSearchButtonClick}
                >
                  Buscar
                </Button>
              </Grid>
            </div>

          <Table>
            <TableBody>
              { (products.length <= 0) ? (
                <TableRow>
                  <TableCell colSpan={20}>No se encontraron productos</TableCell>
                </TableRow>
              ) : (
                products.map((product, index) => (
                  <PreciosGeneralesProducItem 
                  producto={product} 
                  key={index} 
                  index={index} 
                  setProducts={setProducts}
                  onUpdatedOk={()=>{
                    showMessage("Precio editado exitosamente");
                  }}
                  onUpdatedWrong={(error)=>{
                    console.error("Error al actualizar el producto:", error);
                    showMessage(error);
                  }}
                  />
                ))

              )}
            </TableBody>
          </Table>
            
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        {successMessage ? (
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        ) : (
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        )}
      </Snackbar>
    </ThemeProvider>
  );
};

export default PreciosGenerales;
