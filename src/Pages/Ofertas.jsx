import React, { useState } from "react";
import { Button, Dialog, Box } from "@mui/material";
import SideBar from "../Componentes/NavBar/SideBar.jsx";
import { Typography } from "@mui/joy";

// Importar los componentes de ofertas (deberás crearlos)
import DescuentoUnidadAgrupado from "../Componentes/Ofertas/DescuentoUnidadAgrupado.jsx";
import OfertasProductosMultiples from "../Componentes/Ofertas/OfertasProductosMultiples.jsx";
import OfertasNxM from "../Componentes/Ofertas/OfertasNxM.jsx";

const Ofertas = () => {
  // Estados para controlar la apertura/cierre de los modales
  const [openDescuentoUnidad, setOpenDescuentoUnidad] = useState(false);
  const [openOfertasMultiples, setOpenOfertasMultiples] = useState(false);
  const [openOfertasNxM, setOpenOfertasNxM] = useState(false);

  // Funciones para abrir y cerrar los modales
  const handleOpenDescuentoUnidad = () => setOpenDescuentoUnidad(true);
  const handleCloseDescuentoUnidad = () => setOpenDescuentoUnidad(false);

  const handleOpenOfertasMultiples = () => setOpenOfertasMultiples(true);
  const handleCloseOfertasMultiples = () => setOpenOfertasMultiples(false);

  const handleOpenOfertasNxM = () => setOpenOfertasNxM(true);
  const handleCloseOfertasNxM = () => setOpenOfertasNxM(false);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100px", // Misma altura que el componente Stock
        }}
      >
        <SideBar />
        {/* <Button
          variant="outlined"
          sx={{
            my: 1,
            mx: 2,
          }}
          onClick={handleOpenDescuentoUnidad}
        >
          Descuento Unidad/Agrupado
        </Button> */}

        <Button
          variant="outlined"
          sx={{
            my: 1,
            mx: 2,
          }}
          onClick={handleOpenOfertasMultiples}
        >
          Ofertas Múltiples Productos
        </Button>

        <Button
          variant="outlined"
          sx={{
            my: 1,
            mx: 2,
          }}
          onClick={handleOpenOfertasNxM}
        >
          Ofertas NxM 
        </Button>
      </Box>

      {/* Dialogs para cada tipo de oferta */}
      <Dialog
        open={openDescuentoUnidad}
        onClose={handleCloseDescuentoUnidad}
        maxWidth="lg"
        fullWidth
      >
        <DescuentoUnidadAgrupado onClose={handleCloseDescuentoUnidad} />
      </Dialog>

      <Dialog
        open={openOfertasMultiples}
        onClose={handleCloseOfertasMultiples}
        maxWidth="lg"
        fullWidth
      >
        <OfertasProductosMultiples onClose={handleCloseOfertasMultiples} />
      </Dialog>

      <Dialog
        open={openOfertasNxM}
        onClose={handleCloseOfertasNxM}
        maxWidth="lg"
        fullWidth
      >
        <OfertasNxM onClose={handleCloseOfertasNxM} />
      </Dialog>
    </>
  );
};

export default Ofertas;