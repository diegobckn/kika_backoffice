import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model';
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import Singleton from './Singleton.ts';
import User from './User';
import CONSTANTS from '../definitions/Constants.ts';


class SoporteTicket extends Singleton {
  static catchRequest(requestData){
    console.log("capturando request desde SoporteTicket", requestData)

    var data:any = {
      urlCliente: window.location.href,
      usuarioLogueado: User.getInstance().sesion.cargarGuardados()[0],
      configDispositivoCliente : ModelConfig.getInstance().getAll()[0],
      endpointUrl: requestData.config.url,
      datosEnviados:requestData.config.data,
      cabeceraEnvio : {
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

    if(data.datosEnviados != ""){
      data.datosEnviados = JSON.parse(data.datosEnviados)
    }

    if(requestData.response){
      data.datosRespuestaEndpoint.status = requestData.response.status
      data.datosRespuestaEndpoint.data = requestData.response.data
      data.datosRespuestaEndpoint.statusText = requestData.response.statusText
    }
    console.log("informacion del soporte", data)

    this.enviarError(data, ()=>{}, ()=>{})
  }
  
  static catchRequestError(error:any){
    console.log("capturando error desde SoporteTicket catch", error)

    var data:any = {
      urlCliente: window.location.href,
      usuarioLogueado: User.getInstance().sesion.cargarGuardados()[0],
      configDispositivoCliente : ModelConfig.getInstance().getAll()[0],
      endpointUrl: error.config.url,
      datosEnviados:error.config.data,
      cabeceraEnvio : {
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

    if(data.datosEnviados){
      data.datosEnviados = JSON.parse(data.datosEnviados)
    }else{
      data.datosEnviados = []
    }

    if(error.response){
      data.datosRespuestaEndpoint.status = error.response.status
      data.datosRespuestaEndpoint.data = error.response.data
      data.datosRespuestaEndpoint.statusText = error.response.statusText
    }
    console.log("informacion del soporte", data)

    this.enviarError(data, ()=>{}, ()=>{})
  }

  static async enviarError(data,callbackOk, callbackWrong){
    console.log("se hace el enviar error")
    try {
      var url = "https://softus.com.ar/send-public-ticket-email/2jdsu3471823jasdjm12l3k1012mascd"

      data.navegador = {
        idioma: navigator.language,
        info:navigator.userAgent,
        so:navigator.platform
      }
      if(navigator["userAgentData"]!= undefined){
        data.navegador.extra = navigator["userAgentData"]
      }

      data.ventana = {
        ancho:window.innerWidth,
        alto:window.innerHeight
      }
      data.pantalla = {
        ancho:screen.width,
        alto:screen.height
      }
      data.sistemVersion = CONSTANTS.appVersion

      const response = await axios.post(url, data);
      if (
        response.data.statusCode === 200 
        ||  response.data.statusCode === 201
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