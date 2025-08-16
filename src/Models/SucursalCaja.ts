import TiposPasarela from "../definitions/TiposPasarela.ts";
import EndPoint from "./EndPoint.ts";
import ModelConfig from "./ModelConfig.ts";
import Pasarela from "./Pasarela.ts";

class SucursalCaja extends Pasarela {
  tipo = TiposPasarela.CAJA


  async getEstados(callbackOk, callbackWrong){
    const url = ModelConfig.get("urlBase") + "/Cajas/GetEstadoCajas"
    EndPoint.sendGet(url,(responseData, response)=>{
      callbackOk(responseData, response)
    },callbackWrong)
  }

}

export default SucursalCaja;
