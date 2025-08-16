/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import SideBar from "../Componentes/NavBar/SideBar";
import ReporteCostoGananciaListado from "./ReporteCostoGananciaListado";


const ReporteCostoGanancia = () => {

  const [refresh, setRefresh] = useState(false);

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <ReporteCostoGananciaListado
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default ReporteCostoGanancia;
