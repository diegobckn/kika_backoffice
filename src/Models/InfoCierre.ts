import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';


class InfoCierre extends Model {
    info: any;


    async obtenerDeServidor(idUsuario,callbackOk, callbackWrong){
      try {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/api/Cajas/GetArqueoCajaByIdUsuario?idusuario=" + idUsuario

        const response = await axios.get(url);
        console.log("Response:", response.data);
        if (response.data.statusCode === 200) {
          // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
          this.info = response.data;
          callbackOk(response.data)
        } else {
          callbackWrong("Error al realizar el pago")
        }
      } catch (error) {
        callbackWrong(error)
      }
    }
};

export default InfoCierre;