import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';

class CerrarCaja extends Model {

    async enviar(data,callbackOk, callbackWrong){
        try {
          const configs = ModelConfig.get()
            var url = configs.urlBase
             + "/api/Cajas/AddCajaArqueo";

            const response = await axios.post(url,data);
      
            console.log("Response:", response.data);
      
            if (response.data.statusCode === 201) {
              // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
              callbackOk(response.data)
            } else {
              callbackWrong("Error al realizar el pago")
            }
          } catch (error) {
            callbackWrong(error)
          }
    }
};

export default CerrarCaja;