import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';


class Suspender extends Model{
    usuario: number
    descripcion: string
    ventaSuspenderDetalle: any
    // [
        // {
            // "cantidad": 0,
            // "codProducto": "string"
        // }
    // ]


  
  static instance: Suspender | null = null;

    static getInstance():Suspender{
        if(Suspender.instance == null){
            Suspender.instance = new Suspender();
        }

        return Suspender.instance;
    }
    
    async suspender(callbackOk, callbackWrong){
        if(
            !this.usuario
            || !this.descripcion
            || !this.ventaSuspenderDetalle
        ){
            console.log("faltan datos");
            return
        }

        const data = this.getFillables()
        data["ventaSuspenderDetalle"] = this.ventaSuspenderDetalle
        try {
          const configs = ModelConfig.get()
          var url = configs.urlBase
          "/api/Ventas/SuspenderVentaAdd"

          const response = await axios.post(url,data);
    
          if (
            response.data.statusCode === 200
            || response.data.statusCode === 201
          ) {
            // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
            callbackOk(response.data)
          } else {
            callbackWrong("Respuesta desconocida del servidor")
          }
        } catch (error) {
          callbackWrong(error)
        }
    }

    async listarVentas(userId,callbackOk, callbackWrong){
      try {

        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/api/Ventas/SuspenderVentaGetByIdUsuario?idusuario=" + userId;

        const response = await axios.get(url);
  
        if (
          response.data.statusCode === 200
          || response.data.statusCode === 201
        ) {
          // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
          callbackOk(response.data.ventaSuspenderCabeceras,response)
        } else {
          callbackWrong("Respuesta desconocida del servidor")
        }
      } catch (error) {
        callbackWrong(error)
      }
    }

    async recuperar(id,callbackOk, callbackWrong){
      try {
        const data = {
          id: id
        }

        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/api/Ventas/SuspenderVentaDelete"
        const response = await axios.post(url,data);
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
        callbackWrong(error)
      }
    }
};

export default Suspender;