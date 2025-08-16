/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import SideBar from "../Componentes/NavBar/SideBar";
import Box from "@mui/material/Box";
import ProductosCriticos from "../Componentes/Productos/ProductosCriticos";

const ReporteProductosStockCritico = () => {

  const [refresh, setRefresh] = useState(false);


  const [open, setOpen] = useState(false);

  const [open2, setOpen2] = useState(false);

  const handleOpenStepper = () => {
    setOpen(true);
  };
  const handleCloseStepper = () => {
    setOpen(false);
  };

  const handleOpenStepper2 = () => {
    setOpen2(true);
  };
  const handleCloseStepper2 = () => {
    setOpen2(false);
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Box sx={{ flexGrow: 1, p: 3 }}>

        <ProductosCriticos
          refresh={refresh}
          setRefresh={setRefresh}
        />

        

      </Box>
    </div>
  );
};

export default ReporteProductosStockCritico;
