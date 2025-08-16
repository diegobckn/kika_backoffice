import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


export default class ReporteCompra {


  /**
   * 
   * @param fechadesde "YYYY-MM-DD"
   * @param fechahasta "YYYY-MM-DD"
   * @param tipoComprobante 0,1,2"
   */
  static async searchInServer(data: {
    fechadesde: string,
    fechahasta: string,
    tipoComprobantes: string
  }, callbackOk, callbackWrong) {

    var url = ModelConfig.get("urlBase")
      + "/Proveedores/ReporteProveedorCompraByFechaGet?"
      + "fechadesde=" + data.fechadesde
      + "&fechahasta=" + data.fechahasta
      + "&tipocomprobantes=" + data.tipoComprobantes

    EndPoint.sendGet(url, (responseData, response) => {
      callbackOk(responseData.proveedorCompraCabeceraReportes, response);
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