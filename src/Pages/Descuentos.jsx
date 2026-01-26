import React, { useState } from "react";
import { Button, Dialog, Box } from "@mui/material";
import SideBar from "../Componentes/NavBar/SideBar.jsx";
import { Typography } from "@mui/joy";
import DescuentoUnidadAgrupado from "../Componentes/Ofertas/DescuentoUnidadAgrupado.jsx"



const Descuentos = () => {
  // Estados para controlar la apertura/cierre de los modales
  const [openDescuentoUnidad, setOpenDescuentoUnidad] = useState(false);
  const [openDescuentosMultiples, setOpenDescuentosMultiples] = useState(false);
  const [openDescuentosNxM, setOpenDescuentosNxM] = useState(false);

  // Funciones para abrir y cerrar los modales
  const handleOpenDescuentoUnidad = () => setOpenDescuentoUnidad(true);
  const handleCloseDescuentoUnidad = () => setOpenDescuentoUnidad(false);

  const handleOpenDescuentosMultiples = () => setOpenDescuentosMultiples(true);
  const handleCloseDescuentosMultiples = () => setOpenDescuentosMultiples(false);

  const handleOpenDescuentosNxM = () => setOpenDescuentosNxM(true);
  const handleCloseDescuentosNxM = () => setOpenDescuentosNxM(false);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100px", // Misma altura que el componente Stock
        }}
      >
        <SideBar />
        <Button
          variant="outlined"
          sx={{
            my: 1,
            mx: 2,
          }}
          onClick={handleOpenDescuentoUnidad}
        >
          Descuentos
        </Button>

        {/* <Button
          variant="outlined"
          sx={{
            my: 1,
            mx: 2,
          }}
          onClick={handleOpenDescuentosMultiples}
        >
          Descuentos Múltiples Productos
        </Button>

        <Button
          variant="outlined"
          sx={{
            my: 1,
            mx: 2,
          }}
          onClick={handleOpenDescuentosNxM}
        >
          Descuentos NxM 
        </Button> */}
      </Box>
      <Dialog
        open={openDescuentoUnidad}
        onClose={handleCloseDescuentoUnidad}
        maxWidth="lg"
        fullWidth
      >
        <DescuentoUnidadAgrupado onClose={handleCloseDescuentoUnidad} />
      </Dialog>

      {/* Dialogs para cada tipo de oferta */}
      {/*
       <Dialog
        open={openDescuentoUnidad}
        onClose={handleCloseDescuentoUnidad}
        maxWidth="lg"
        fullWidth
      >
        <DescuentoUnidadAgrupado onClose={handleCloseDescuentoUnidad} />
      </Dialog>

      <Dialog
        open={openDescuentosMultiples}
        onClose={handleCloseDescuentosMultiples}
        maxWidth="lg"
        fullWidth
      >
        <DescuentosProductosMultiples onClose={handleCloseDescuentosMultiples} />
      </Dialog>

      <Dialog
        open={openDescuentosNxM}
        onClose={handleCloseDescuentosNxM}
        maxWidth="lg"
        fullWidth
      >
        <DescuentosNxM onClose={handleCloseDescuentosNxM} />
      </Dialog> */}
    </>
  );
};

export default Descuentos;