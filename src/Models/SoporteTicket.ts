import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import Singleton from './Singleton.ts';
import User from './User';
import TiposPasarela from '../definitions/TiposPasarela.ts';


class SoporteTicket extends Singleton {

  static reportarError = true

  static catchRequest(requestData) {
    if (SoporteTicket.reportarError) console.log("capturando request desde SoporteTicket", requestData)

    var data: any = {
      urlCliente: window.location.href,
      usuarioLogueado: User.getInstance().sesion.cargarGuardados()[0],
      configDispositivoCliente: ModelConfig.getInstance().getAll()[0],
      endpointUrl: requestData.config.url,
      datosEnviados: requestData.config.data,
      cabeceraEnvio: {
        Accept: requestData.config.headers.Accept,
        "Content-Type": requestData.config.headers["Content-Type"],
        method: requestData.config.method,
        timeout: requestData.config.timeout,
      },
      datosRespuestaEndpoint: {
        code: requestData.status,
        data: requestData.data,
      }
    }

    if (data.datosEnviados != "") {
      data.datosEnviados = JSON.parse(data.datosEnviados)
    }

    if (requestData.response) {
      data.datosRespuestaEndpoint.status = requestData.response.status
      data.datosRespuestaEndpoint.data = requestData.response.data
      data.datosRespuestaEndpoint.statusText = requestData.response.statusText
    }
    if (SoporteTicket.reportarError) console.log("informacion del soporte", data)

    this.enviarError(data, () => { }, () => { })
  }

  static catchRequestError(error: any) {
    if (SoporteTicket.reportarError) console.log("capturando error desde SoporteTicket catch", error)

    var data: any = {
      urlCliente: window.location.href,
      usuarioLogueado: User.getInstance().sesion.cargarGuardados()[0],
      configDispositivoCliente: ModelConfig.getInstance().getAll()[0],
      endpointUrl: error.config.url,
      datosEnviados: error.config.data,
      cabeceraEnvio: {
        Accept: error.config.headers.Accept,
        "Content-Type": error.config.headers["Content-Type"],
        method: error.config.method,
        timeout: error.config.timeout,
      },
      datosRespuestaEndpoint: {
        code: error.code,
        message: error.message,
        name: error.name,
        stack: error.stack,
      }
    }

    if (data.datosEnviados) {
      data.datosEnviados = JSON.parse(data.datosEnviados)
    } else {
      data.datosEnviados = []
    }

    if (error.response) {
      data.datosRespuestaEndpoint.status = error.response.status
      data.datosRespuestaEndpoint.data = error.response.data
      data.datosRespuestaEndpoint.statusText = error.response.statusText
    }
    if (SoporteTicket.reportarError) console.log("informacion del soporte", data)

    this.enviarError(data, () => { }, () => { })
  }

  static async enviarError(data, callbackOk, callbackWrong) {
    if (!SoporteTicket.reportarError) return
    if (data.configDispositivoCliente.afterLogin && typeof data.configDispositivoCliente.afterLogin === "number") {
      const types = Object.keys(TiposPasarela)
      const values = Object.values(TiposPasarela)

      const find = values.indexOf(data.configDispositivoCliente.afterLogin)
      if (find > -1) {
        data.configDispositivoCliente.afterLogin = types[find]
      }
    }
    try {
      var url = "https://softus.com.ar/send-public-ticket-email/2jdsu3471823jasdjm12l3k1012mascd"

      const response = await axios.post(url, data);
      if (
        response.data.statusCode === 200
        || response.data.statusCode === 201
      ) {
        // Restablecer estados y cerrar diálogos después de realizar el ticket exitosamente
        callbackOk(response.data)
      } else {
        callbackWrong("Error al realizar el ticket")
      }
    } catch (error) {
      callbackWrong(error)
    }
  }
};

export default SoporteTicket;