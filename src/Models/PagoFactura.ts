import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';


class PagoFactura extends Model{
    idUsuario: number;
    codigoClienteSucursal: number;
    codigoCliente: number;
    total: number;
    products: any[];
    metodoPago: string;
    transferencias: any;

    async hacerPagoFactura(data,callbackOk, callbackWrong){

      const modo_avion = false//modo avion es para no figurar en afip

        try {
          const configs = ModelConfig.get()
          var url = configs.urlBase

          if(modo_avion){
            url += "/api/Ventas/RedelcomImprimirTicket"
          }else{
            url += "/api/GestionDTE/GenerarFacturaDTE"
          }

            const response = await axios.post(url, data);
            if (response.data.statusCode === 200) {
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

export default PagoFactura;