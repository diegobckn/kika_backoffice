
import axios from "axios";
import Model from "./Model.ts";
import ModelConfig from "./ModelConfig.ts";
import EndPoint from "./EndPoint.ts";

class Sucursal extends Model {


  static instance: Sucursal | null = null;
  static getInstance(): Sucursal {
    if (Sucursal.instance == null) {
      Sucursal.instance = new Sucursal();
    }

    return Sucursal.instance;
  }

  async add(data,callbackOk, callbackWrong){
    try {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        + "/Sucursales/AddSucursal"
        const response = await axios.post(url,data);
        if (
        response.status === 200
        || response.status === 201
        ) {
        // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
        callbackOk(response.data, response)
        } else {
        callbackWrong("Respuesta desconocida del servidor")
        }
    } catch (error) {
      if (error.response && error.response.status && error.response.status === 409) {
          callbackWrong(error.response.descripcion)
      } else {
        callbackWrong(error.message)
      }
    }
  }

  static async getAll(callbackOk, callbackWrong){
    const url = ModelConfig.get("urlBase") + "/Sucursales/GetAllSucursales"
    EndPoint.sendGet(url,(responseData, response)=>{
      callbackOk(responseData.sucursals, response)
    },callbackWrong)
  }
}

export default Sucursal;
