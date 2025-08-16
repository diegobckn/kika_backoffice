import axios from "axios";
import Model from "./Model.ts";
import ModelConfig from "./ModelConfig.ts";
import EndPoint from "./EndPoint";

class PreVenta extends Model {

  // codigoUsuario: number;
  // rut: string;
  // clave: string;

  // deudaIds: any
  // idUsuario:number

  static instance: PreVenta | null = null;
  static getInstance(): PreVenta {
    if (PreVenta.instance == null) {
      PreVenta.instance = new PreVenta();
    }

    return PreVenta.instance;
  }

  async add(data, callbackOk, callbackWrong) {
    try {
      const configs = ModelConfig.get()
      var url = configs.urlBase
        + "/PreVenta/AddPreVenta"
      const response = await axios.post(url, data);
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
  

  static async findPreVenta(data, callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        url += "/Ventas/PreVentaGET"

        if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")


        EndPoint.sendPost(url, data, (responseData, response) => {
            if (response.data.preventa.length > 0) {
                callbackOk(response.data.preventa[0].products, response.data);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        }, (err) => {
            callbackWrong(err)
        })
    }
}

export default PreVenta;
