import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';


class TicketPreventa extends Model {
    async hacerTicket(data,callbackOk, callbackWrong){
        try {
          const configs = ModelConfig.get()
          var url = configs.urlBase
          +"/api/Ventas/PreVentaAdd"

          const response = await axios.post(url, data);
          if (response.data.statusCode === 200) {
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

export default TicketPreventa;