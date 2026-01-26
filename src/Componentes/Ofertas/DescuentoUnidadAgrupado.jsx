
import React, { useState } from "react";
import { Button, Dialog, Box } from "@mui/material";
import SideBar from "../NavBar/SideBar.jsx";
import { Typography } from "@mui/joy";
import OfertasProductoSimilar from "./OfertaProductoSimilar.jsx";
import OfertasProductosComplementarios from "./OfertasProductosComplementarios.jsx"
import OfertasProductoUnidad from "./OfertasProductoUnidad.jsx";
import DescuentosProductosAgrupados from "./DescuentosProductosAgrupados.jsx";
const OfertasProductosMultiples = () => {
  // Estados para controlar la apertura/cierre de los modales
  const [openProductoSimilar, setOpenProductoSimilar] = useState(false);
  const [openOfertasMultiples, setOpenOfertasMultiples] = useState(false);

  // Funciones para abrir y cerrar los modales
  const handleOpenProductoSimilar = () => setOpenProductoSimilar(true);
  const handleCloseProductoSimilar = () => setOpenProductoSimilar(false);

  const handleOpenOfertasMultiples = () => setOpenOfertasMultiples(true);
  const handleCloseOfertasMultiples = () => setOpenOfertasMultiples(false);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100px", // Misma altura que el componente Stock
        }}
      >
    
        <Button
          variant="outlined"
          sx={{
            my: 1,
            mx: 2,
          }}
          onClick={handleOpenProductoSimilar}
        >
        Descuento Producto Unidad
        </Button>

        <Button
          variant="outlined"
          sx={{
            my: 1,
            mx: 2,
          }}
          onClick={handleOpenOfertasMultiples}
        >
          Descuento Productos Agrupados
        </Button>

       
      </Box>

      {/* Dialogs para cada tipo de oferta */}
      <Dialog
        open={openProductoSimilar}
        onClose={handleCloseProductoSimilar}
        maxWidth="lg"
        fullWidth
      >
        <OfertasProductoUnidad onClose={handleCloseProductoSimilar} />
      </Dialog>

      <Dialog
        open={openOfertasMultiples}
        onClose={handleCloseOfertasMultiples}
        maxWidth="lg"
        fullWidth
      >
        <DescuentosProductosAgrupados onClose={handleCloseOfertasMultiples} />
      </Dialog>

    
    </>
  );
};

export default OfertasProductosMultiples;