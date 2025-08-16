/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Button, Dialog, Grid, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";
import SideBar from "../Componentes/NavBar/SideBar";
import IngresoCajaSucursal from "../Componentes/Sucursales/IngresoCajaSucursal"
import ListadoCajas from "../Componentes/Sucursales/ListadoCajas";

export default function CajaSucursal() {
  const [open, setOpen] = useState(false);

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
            onClick={()=>{setOpen(true);}}
          >
         Ingrese Caja sucursal 
          </Button>
          {/* <SearchList /> */}
          <ListadoCajas/>
        </Box>
      </Box>

      {open ? (
        <IngresoCajaSucursal
          openDialog={open}
          setOpendialog={setOpen}
          onClose={()=>{setOpen(false);}}
          onCreate={()=>{
            setOpen(false)
            window.location.href = window.location.href
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
}
