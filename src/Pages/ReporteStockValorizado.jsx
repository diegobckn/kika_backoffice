/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import SideBar from "../Componentes/NavBar/SideBar";
import Box from "@mui/material/Box";
import ProductosValorizados from "../Componentes/Productos/ProductosValorizados";

const ReporteStockValorizado = () => {

  const [refresh, setRefresh] = useState(false);

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Box sx={{ flexGrow: 1, p: 3 }}>

        <ProductosValorizados
          refresh={refresh}
          setRefresh={setRefresh}
        />

        

      </Box>
    </div>
  );
};

export default ReporteStockValorizado;
