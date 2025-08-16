/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {
  createTheme,
  CssBaseline,
  Paper,
  TextField,
  MenuItem,
  InputLabel,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  Snackbar
} from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";

const IngresoSubCategorias = ({onClose}) => {
  const apiUrl = ModelConfig.get().urlBase;

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [descripcionCategoria, setDescripcionCategoria] = useState("");
  const [errors, setErrors] = useState({});
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = createTheme();
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          `${apiUrl}/NivelMercadoLogicos/GetAllCategorias`
        );
        console.log("API response:", response.data.categorias); // Add this line
        setCategories(response.data.categorias);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCategories();
  }, []);

  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descripcionCategoria || !selectedCategoryId) {
      setErrors({
        descripcionCategoria: "Favor completar campo",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/NivelMercadoLogicos/AddSubCategoria`,
        {
          idCategoria: selectedCategoryId,
          descripcionSubCategoria: descripcionCategoria,
        }
      );
      if (response.data.statusCode === 201) {
        // Show the success snackbar
        setSnackbarOpen(true);
        setSnackbarMessage("Sub Categoría creada con éxito");

        setTimeout(() => {
           onClose();
        }, 2000);
       

        setDescripcionFamilia("");
      } else {
        setSnackbarOpen(true);
        setSnackbarMessage("Error al crear la familia");
      }
    } catch (error) {
      console.log(error, "Error Debug");
      // Handle error and display a message
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh", width: "90vw" }}>
        <CssBaseline />

        <Grid
          item
          xs={12}
          sm={8}
          md={12}
          component={Paper}
          elevation={24}
          square
        >
          <Box
            sx={{
              my: 1,
              mx: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h4>Ingreso Sub-Categorias</h4>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={10}>
                  <InputLabel>Selecciona Categoría</InputLabel>
                  <Select
                    fullWidth
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    label="Selecciona Categoría"
                  >
                    {categories.map((category) => (
                      <MenuItem
                        key={category.idCategoria}
                        value={category.idCategoria}
                      >
                        {category.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <TextField
                    autoComplete="off"
                    name="descripcionCategoria"
                    required
                    fullWidth
                    id="descripcionCategoria"
                    label="Ingresa SubCategoría"
                    error={!!errors.descripcionCategoria}
                    helperText={errors.descripcionCategoria}
                    value={descripcionCategoria}
                    onChange={(e) => setDescripcionCategoria(e.target.value)}
                    autoFocus
                  />
                </Grid>

                <Button
                  type="submit"
                  size="md"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Guardar
                </Button>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>Guardado </DialogTitle>
        <DialogContent>SubCategoría creada con éxito</DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default IngresoSubCategorias;
