import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import EndPoint from './EndPoint.ts';
import ModelConfig from './ModelConfig.ts';
import ProductSold from './ProductSold.ts';


class Sale extends ProductSold{


   static async borradoLogico(data,callbackOk, callbackWrong){
        const url = ModelConfig.get("urlBase") + "/Ventas/AnularVentaTicket?idCabecera=" + data.idCabecera
        EndPoint.sendPut(url,data,(responseData, response)=>{
            callbackOk(responseData, response)
        },callbackWrong)
    }

};

export default Sale;