import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


export default class ReporteVenta extends Model {
  static instance: ReporteVenta | null = null;
  sesion: StorageSesion;

  constructor() {
    super()
    this.sesion = new StorageSesion("client");
  }

  static getInstance(): ReporteVenta {
    if (ReporteVenta.instance == null) {
      ReporteVenta.instance = new ReporteVenta();
    }

    return ReporteVenta.instance;
  }

  /**
   * 
   * @param fechadesde "YYYY-MM-DD"
   * @param fechahasta "YYYY-MM-DD"
   * @param tipoComprobante 0,1,2"
   */
  async searchInServer(data: {
    fechadesde: string,
    fechahasta: string,
    tipoComprobante: string
  }, callbackOk, callbackWrong) {
    try {
      const configs = ModelConfig.get()
      var url = configs.urlBase
        + "/ReporteVentas/ReporteLibroIVA"

      const params = { ...data };

      const response = await axios.get(url, { params });

      if (
        response.data.statusCode === 200
        || response.data.statusCode === 201
      ) {
        // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
        callbackOk(response)
      } else {
        callbackWrong("Respuesta desconocida del servidor")
      }
    } catch (error) {
      console.log(error)
      if (error.response) {
        callbackWrong(
          "Credenciales incorrectas. Por favor, verifica tu nombre de usuario y contraseña." +
          error.message
        );
      } else if (error.response && error.response.status === 500) {
        callbackWrong(
          "Error interno del servidor. Por favor, inténtalo de nuevo más tarde."
        );
      } else if (error.message != "") {
        callbackWrong(error.message)
      } else {
        callbackWrong(
          "Error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde."
        );
      }
    }
  }


  async searchPreventasInServer(data: {
    fechadesde: string,
    fechahasta: string,
  }, callbackOk, callbackWrong) {

    const configs = ModelConfig.get()
      var url = configs.urlBase
        + "/ReporteVentas/ReportePreventa?"
        + "fechadesde=" + data.fechadesde
        + "&fechahasta=" + data.fechahasta

      EndPoint.sendGet(url, (responseData, response) => {
        callbackOk(responseData, response);
      }, callbackWrong)
  }

  static async searchCostoMargen(data: {
    fechadesde: string,
    fechahasta: string,
    tipo: number,

    categoria: number,
    subcategoria: number,
    familia: number,
    subfamilia: number,
    
    pageNumber: number,
    rowPage: number,
  }, callbackOk, callbackWrong) {

    const configs = ModelConfig.get()
      var url = configs.urlBase
        + "/ReporteVentas/ReporteVentaCostoMargen?"
        + "fechadesde=" + data.fechadesde
        + "&fechahasta=" + data.fechahasta
        
        + "&categoria=" + data.categoria
        + "&subcategoria=" + data.subcategoria
        + "&familia=" + data.familia
        + "&subfamilia=" + data.subfamilia
        
        + "&pageNumber=" + data.pageNumber
        + "&rowPage=" + data.rowPage

      EndPoint.sendGet(url, (responseData, response) => {
        callbackOk(responseData, response);
      }, callbackWrong)
  }
};