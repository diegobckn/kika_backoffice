/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Button, Dialog, Grid, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";
import SideBar from "../Componentes/NavBar/SideBar";
import IngresoPreVenta from "../Componentes/Sucursales/IngresoPreVenta"
import ListadoPreventas from "../Componentes/Sucursales/ListadoPreventas";

export default function Preventa() {
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box sx={{ flex: 1 }}>
          <Button
            variant="outlined"
            sx={{
              my: 1,
              mx: 2,
            }}
            startIcon={<Add />}
            onClick={handleOpenModal}
          >
         Ingrese Pre Venta 
          </Button>
          {/* <SearchList /> */}
          <ListadoPreventas/>
        </Box>
      </Box>

      {open ? (
        <IngresoPreVenta
          openDialog={open}
          setOpendialog={setOpen}
          onClose={handleCloseModal}
          onCreate={()=>{
            handleCloseModal()
            window.location.href = window.location.href
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
}
