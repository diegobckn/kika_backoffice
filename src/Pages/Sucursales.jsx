/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Button,Dialog,Grid, Typography } from "@mui/material";
import IngresoUsuarios from "../Componentes/ScreenDialog/Users/Create";
import Add from "@mui/icons-material/Add";

import SideBar from "../Componentes/NavBar/SideBar";
import SearchList from "../Componentes/ScreenDialog/Users/SearchList";
import IngresoSucursal from "../Componentes/Sucursales/IngresoSucursal"
import ListadoSucursales from "../Componentes/Sucursales/ListadoSucursales";

export const defaultTheme = createTheme();

export default function Sucursales() {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  return (
    <ThemeProvider theme={defaultTheme}>
    <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <SideBar  />
        <Box sx={{  flex: 1 }}>
          <Button
            variant="outlined"
            sx={{
              my: 1,
              mx: 2,
            }}
            startIcon={<Add />}
            onClick={()=>{setOpen(true)}}
          >
            Crear Sucursal
          </Button>
          {/* <SearchList /> */}
        <ListadoSucursales changeToRefresh={refresh}/>
        </Box>
      </Box>

      {open ? (
        <IngresoSucursal
        openDialog={open}
        setOpendialog={setOpen}
        onClose={()=>{setOpen(false)}}
        onCreate={()=>{
          setRefresh(!refresh)
        }}
      />
      ) : (
        <></>
      )}



      

  </ThemeProvider>

  );
}
