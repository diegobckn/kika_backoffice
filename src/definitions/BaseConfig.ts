import dayjs from "dayjs";

const BaseConfig:any =  {
    shopName:'EasyPOSLite',
    urlBase : (import.meta.env.VITE_URL_BASE),
    sesionStart: dayjs().format('DD/MM/YYYY-HH:mm:ss'),
    sesionExprire: 2 * 60 * 1000, //en milisegundos
    margenGanancia: 30, //en %
    iva: 19, //en %
    cantidadDescripcionCorta:30,
    porcentajeMargen:30,
    buttonDelayClick: 1500, //en milisegundos

    criterioCostoComercio:0,

    dashboardRefreshConexion:20,

    dashboardRefreshUsuarios:30,
    dashboardRefreshEstadoCajas:30,

    dashboardRefreshVentas:30,
    dashboardRefreshCompras:30,

    dashboardRefreshTodasPreventas:30,
    dashboardRefreshPreventasUsadas:30,
    dashboardRefreshPreventasDescartadas:30,
    
    idEmpresa:0,
};

export default BaseConfig;