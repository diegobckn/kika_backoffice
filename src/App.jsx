import React, { useState } from 'react';
import {
  
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
 } from 'react-router-dom';

 
import Home from './Pages/Home';
import Registro from './Pages/Registro';
import Login from './Pages/Login';
import Usuarios from './Pages/Usuarios';
import Sucursales from './Pages/Sucursales';
import Precios from './Pages/Precios';
import Proveedores from './Pages/proveedores/Proveedores';
import Productos from './Pages/Productos';
import Clientes from './Pages/Clientes';
import IngresoDocumento from './Pages/proveedores/ingresoDocumento/Main';
import Categorias from './Pages/Categoria';
import SubCategorias from './Pages/SubCategoria';
import Familias from './Pages/Familias';
import SubFamilias from './Pages/SubFamilias';
import ProveedoresDocumentosPorPagar from './Pages/proveedores/documentoPorPagar/DocumentosPorPagar';
import Reportes from './Pages/Reportes';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/@fontsource/roboto/300.css';
import '../node_modules/@fontsource/roboto/400.css';
import '../node_modules/@fontsource/roboto/500.css';
import '../node_modules/@fontsource/roboto/700.css';
import ReportesClientes from './Pages/ReportesClientes';
import ReportesCtaCorriente from './Pages/ReportesCtaCorriente';
import ReportesCtaCorrienteProv from './Pages/ReportesCtaCorrienteProv';
import ReporteProductosStockCritico from './Pages/ReporteProductosStockCritico';
import ReporteCostoGanancia from './Pages/ReporteCostoGanancia';
import RankingVentas from './Pages/RankingVentas';
import RankingProductos from './Pages/RankingProductos';
import RankingLibroVentas from './Pages/RankingLibroVentas';
import RankingLibroCompras from './Pages/RankingLibroCompras';
import ReporteMaestroProductos from './Pages/ReporteMaestroProductos';
import Stock from './Pages/Stock/';
import EntradaSalidaStock from './Pages/EntradaSalidaStock';
import Preventas from './Pages/Preventas';

import { SelectedOptionsProvider } from "./Componentes/Context/SelectedOptionsProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import StockMobile from './Pages/StockMobile';
// import MetodoImpresion from './Pages/MetodoImpresion';
import CajaSucursal from './Pages/CajaSucursal';
import MetodoImpresion from './Pages/MetodoImpresion';
import PasarelaPago from './Pages/PasarelaPago';
import Preventa from './Pages/PreventaSucursal';
import ReporteZ from './Pages/ReporteZ';
import ReporteCierreZ from './Pages/ReporteCierreZ';
import ReporteStockValorizado from './Pages/ReporteStockValorizado';

function App() {
  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SelectedOptionsProvider>
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/registro" element={<Registro />} />
            <Route
              path="/home"
              element={<Home/>}
            />

            <Route
              path="/"
              element={<Home/>}
            />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/sucursales" element={<Sucursales />} />
            <Route path="/sucursales/metodoimpresion" element={<MetodoImpresion/>} />
            <Route path="/sucursales/cajasucursal" element={<CajaSucursal />} />
            <Route path="/sucursales/preventa" element={<Preventa />} />
            <Route path="/sucursales/pasarelapago" element={<PasarelaPago />} />
            <Route path="/precios" element={<Precios />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/reportes" element={<ReportesClientes />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/categorias" element={<Categorias />} />
            <Route path="/productos/subcategorias" element={<SubCategorias />} />
            <Route path="/productos/familias" element={<Familias />} />
            <Route path="/productos/subfamilias" element={<SubFamilias />} />
            <Route path="/proveedores/ingresodocumento" element={<IngresoDocumento />} />
            <Route path="/proveedores/documentosporpagar" element={<ProveedoresDocumentosPorPagar />} />
            <Route path="reportes" element={<Reportes />} />
            <Route path="reportes/cuentacorrienteclientes" element={<ReportesCtaCorriente />} />
            <Route path="reportes/cuentacorrienteproveedores" element={<ReportesCtaCorrienteProv />} />
            <Route path="reportes/rankingventas" element={<RankingVentas />} />
            <Route path="reportes/rankingproductos" element={<RankingProductos />} />
            <Route path="reportes/rankinglibroventas" element={<RankingLibroVentas />} />
            <Route path="reportes/stockcriticos" element={<ReporteProductosStockCritico />} />
            <Route path="reportes/costosganancias" element={<ReporteCostoGanancia />} />
            <Route path="reportes/rankinglibrocompras" element={<RankingLibroCompras />} />
            <Route path="stock" element={<Stock />} />
            <Route path="stock/entradasalidastock" element={<EntradaSalidaStock />} />
            <Route path="stockmobile" element={<StockMobile />} />
            <Route path="reportes/reportez" element={<ReporteZ />} />
            <Route path="reportes/reportecierrez" element={<ReporteCierreZ />} />
            <Route path="reportes/reportestockvalorizado" element={<ReporteStockValorizado />} />
            <Route path="reportes/maestro-productos" element={<ReporteMaestroProductos />} />
            <Route path="reportes/preventas" element={<Preventas />} />
          </Routes>
        </SelectedOptionsProvider>
      </LocalizationProvider>
  );
}

export default App;
