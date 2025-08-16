import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import IPagoBoleta, { IProductoPagoBoleta, ITransferencia } from '../Types/IPagoBoleta.ts';
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';


class PagoBoleta extends Model implements IPagoBoleta  {
    idUsuario: number;
    codigoClienteSucursal: number;
    codigoCliente: number;
    total: number;
    products: IProductoPagoBoleta[];
    metodoPago: string;
    transferencias: ITransferencia;

    async hacerPago(data, modo_avion,callbackOk, callbackWrong){
      console.log("modo avion?" + (modo_avion?"si":"no"))
        try {
          const configs = ModelConfig.get()
          var url = configs.urlBase

          if(modo_avion){
            url += "/api/Ventas/RedelcomImprimirTicket"
          }else{
            url += "/api/GestionDTE/GenerarBoletaDTE"
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

export default PagoBoleta;