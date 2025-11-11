import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';
import ModelSingleton from './ModelSingleton.ts';
import Proveedor from './Proveedor.ts';
import System from '../Helpers/System.ts';


class ProveedorDocumento extends ModelSingleton {

  sesionBorradores: StorageSesion

  constructor() {
    super()
    this.sesion = new StorageSesion("ProveedorDocumento");
    this.sesionBorradores = new StorageSesion("BorradoresDocumentosProv");
  }

  static getBorradores() {
    const ses = ProveedorDocumento.getInstance().sesionBorradores
    if (ses.hasOne()) {
      return ses.cargarGuardados()[0]
    } else {
      return []
    }
  }

  static crearBorrador(nroFolio: string, tipoDoc: string, fechaIngreso: string, proveedor: any, productos: any = []) {
    var bors = this.getBorradores()
    const antes = bors.length
    const nwBorrador = {
      nroFolio,
      tipoDoc,
      fechaIngreso,
      proveedor,
      productos
    }

    if (bors.length > 0) {

      var existeKey = -1
      bors.forEach((bor: any, ix: number) => {
        if (bor.nroFolio == nroFolio) {
          existeKey = ix
        }
      })
      if (existeKey > -1) {
        bors[existeKey] = nwBorrador
      } else {
        bors.push(nwBorrador)
      }
    } else {
      bors.push(nwBorrador)
    }

    ProveedorDocumento.getInstance().sesionBorradores.guardar(bors)
    var bors = this.getBorradores()
    const despues = bors.length
    return antes != despues
  }

  static eliminarBorrador(nroFolio: string) {
    var bors = this.getBorradores()
    if (bors.length > 0) {
      var existeKey = -1
      const copia: any = []
      bors.forEach((bor: any, ix: number) => {
        if (bor.nroFolio != nroFolio) {
          copia.push(bor)
        }
      })
      ProveedorDocumento.getInstance().sesionBorradores.guardar(copia)
    }
  }

  static async agregarCompra(datosCompra: any, callbackOk: any, callbackWrong: any) {
    const url = ModelConfig.get("urlBase") + "/Proveedores/AddProveedorCompra"
    EndPoint.sendPost(url, datosCompra, (responseData: any, response: any) => {
      callbackOk(responseData, response)
    }, callbackWrong)
  }


  static async getCompras(callbackOk: any, callbackWrong: any) {
    const url = ModelConfig.get("urlBase") + "/Proveedores/GetProveedorCompra"
    EndPoint.sendGet(url, (responseData: any, response: any) => {
      callbackOk(responseData.proveedorCompra.proveedorCompraCabeceras, response)
    }, callbackWrong)
  }

  static async checkExistFolio(nroFolio: any, existFolio: any) {
    this.getCompras((compras: any) => {
      var existe = false
      compras.forEach((compra: any) => {
        if (compra.folio == nroFolio) {
          existe = true
        }
      });
      if (existe) existFolio()
    }, (err: any) => {
      console.log("error al revisar si existe folio", err)
    })
  }

  static async AddProveedorCompraPagar(datos: any, callbackOk: any, callbackWrong: any) {
    const url = ModelConfig.get("urlBase") + "/Proveedores/AddProveedorCompraPagar"
    EndPoint.sendPost(url, datos, (responseData: any, response: any) => {
      callbackOk(responseData, response)
    }, callbackWrong)
  }

};

export default ProveedorDocumento;