import React, { useState, useEffect,useContext } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ModelConfig from "../../Models/ModelConfig";
import { Label } from "@mui/icons-material";
import PreciosGeneralesProducItem from "./PreciosGeneralesProducItem";
import Product from "../../Models/Product";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";


export const defaultTheme = createTheme();

const PreciosPorCategoria = ({ onClose }) => {

  const {
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);


  const apiUrl =  ModelConfig.get().urlBase;
  const [txtBuscar, setTxtBuscar] = useState("");
  const [products, setProducts] = useState([]);
  const [productsSinFiltrar, setProductsSinFiltrar] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [checkTodas, setCheckTodas] = useState(false);
  const [checkCategorias, setCheckCategorias] = useState(false);
  const [checkSubcategorias, setCheckSubcategorias] = useState(false);
  const [checkFamilias, setCheckFamilias] = useState(false);
  const [checkSubfamilias, setCheckSubfamilias] = useState(false);

  useEffect(() => {

    const fetchProducts = async () => {
      Product.getInstance().getAll((prods)=>{
        setProducts(prods.slice(0, 10));
        setProductsSinFiltrar(prods);
      },(error)=>{
        setErrorMessage("Error al buscar el producto por descripción");
        setOpenSnackbar(true);
      })
    };

    fetchProducts();
  }, []);

  const handleSearchButtonClick = async () => {
    if (txtBuscar.trim() === "") {
      setErrorMessage("El campo de búsqueda está vacío");
      setOpenSnackbar(true);
      // setProducts([])
      return;
    }

    filtrarProductos()
  };

  const filtrarProductos = ()=>{


    var cantidadEncontrada = 0
    showLoading("filtrando...")
    var productsFilter = productsSinFiltrar.filter((product)=>{
      const aplica = ( (checkTodas || checkCategorias) && product.categoria.toLowerCase().indexOf(txtBuscar.toLowerCase())> -1)
      || ((checkTodas || checkSubcategorias) && product.subCategoria.toLowerCase().indexOf(txtBuscar.toLowerCase())> -1)
      || ((checkTodas || checkFamilias) && product.familia.toLowerCase().indexOf(txtBuscar.toLowerCase())> -1)
      || ((checkTodas || checkSubfamilias) && product.subFamilia.toLowerCase().indexOf(txtBuscar.toLowerCase())> -1)
      if(aplica) cantidadEncontrada++;
      console.log("buscando..aplica?", aplica, "..producto", product,"texto buscado", txtBuscar)
      return (
        cantidadEncontrada <= 50 && (
          //product.nombre.toLowerCase().indexOf(txtBuscar)> -1
          aplica
        )
      )
    })

    hideLoading()

    console.log("productsFilter")
    console.log(productsFilter)
    setProducts(productsFilter)
  }


  const checkTxtBuscar = (e)=>{
    // console.log(e)
    if(e.keyCode == 13)
    handleSearchButtonClick()
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={10} lg={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Precios por categorias
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
                  Buscar una categoria
                </InputLabel>
              </Grid>

              <Grid
                item
                xs={10}
                md={10}
                sm={10}
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
                  placeholder="Ingresar Descripcion"
                  value={txtBuscar}
                  onChange={(e) => setTxtBuscar(e.target.value)}
                  onKeyDown={(e) => checkTxtBuscar(e)}
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


              <Grid item
                xs={10}
                md={10}
                sm={10}
                lg={12}

                sx={{
                  margin: 1,
                }}
                >
                <FormControlLabel
                  sx={{
                    userSelect:"none"
                  }}
                  label="Todas"
                  checked={checkTodas}
                  control={<Checkbox onChange={(e)=>{ setCheckTodas(e.target.checked) }} />}
                />

                <FormControlLabel
                  sx={{
                    userSelect:"none"
                  }}
                  label="Categorias"
                  checked={checkCategorias}
                  control={<Checkbox onChange={(e)=>{ setCheckCategorias(e.target.checked) }} />}
                />

                <FormControlLabel
                    sx={{
                      userSelect:"none"
                    }}
                  label="Subcategorias"
                  checked={checkSubcategorias}
                  control={<Checkbox onChange={(e)=>{ setCheckSubcategorias(e.target.checked) }} />}
                />

                <FormControlLabel
                    sx={{
                      userSelect:"none"
                    }}
                  label="Famillias"
                  checked={checkFamilias}
                  control={<Checkbox onChange={(e)=>{ setCheckFamilias(e.target.checked) }} />}
                />

                <FormControlLabel
                    sx={{
                      userSelect:"none"
                    }}
                  label="Subfamilias"
                  checked={checkSubfamilias}
                  control={<Checkbox onChange={(e)=>{ setCheckSubfamilias(e.target.checked) }} />}
                />


                </Grid>

              {/* <Grid item
                xs={10}
                md={10}
                sm={10}
                lg={12}

                sx={{
                  margin: 1,
                }}
                >
                <Typography variant="p">
                  Margen de ganancia(en %)
                </Typography>

                <TextField
                  name="precio"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={margen}
                  onChange={(e) => {
                    //handlePrecioChange(e, index)
                    setMargen(e.target.value)
                  }}
                />
              </Grid> */}
              {/* <Grid
                item
                xs={10}
                md={10}
                sm={10}
                lg={12}
                sx={{
                  margin: 1,
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                }}
              >
              <Button
                onClick={() => {
                  console.log("guardar todo")
                }}
                variant="contained"
                color="secondary"
              >
                Aplicar cambios
              </Button>
              </Grid> */}
            </div>

            <TableContainer
              component={Paper}
              style={{
                overflowX: "auto",
                marginTop: 20,
               }}
            >
              <Table>
                <TableHead>
                <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="h5">
                    Productos afectados
                  </Typography>
                  </TableCell>
                </TableRow>
                </TableHead>
             
                <TableBody key={1}>
                  {products.map((product, index) => (
                      <PreciosGeneralesProducItem 
                      key={product.id} 
                      producto={product} 
                      index={index} 
                      setProducts={setProducts}
                      onUpdatedOk={()=>{
                        setSuccessMessage("Precio editado exitosamente");
                        setOpenSnackbar(true);
                        setTimeout(() => {
                          // onClose();
                        }, 2000);
                      }}
                      onUpdatedWrong={(error)=>{
                        console.error("Error al actualizar el producto:", error);
                        setErrorMessage("Error al actualizar el producto");
                        setOpenSnackbar(true);
                      }}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
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

export default PreciosPorCategoria;
