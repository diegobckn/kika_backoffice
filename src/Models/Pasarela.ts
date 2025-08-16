
import axios from "axios";
import Model from "./Model.ts";
import ModelConfig from "./ModelConfig.ts";
import EndPoint from "./EndPoint.ts";

type TypePuntoVentaConfiguracions = {
  fechaIngreso: string
  fechaUltAct: string
  idCaja: number
  grupo: string
  entrada: string
  valor: string
}

class Pasarela extends Model {
    idCaja: number
    idSucursal: number
    puntoVenta: string
    idSucursalPvTipo: number
    fechaIngreso: string
    fechaUltAct: string
    puntoVentaConfiguracions: TypePuntoVentaConfiguracions[]

    tipo: number //esta propiedad la tienen que sobreescribir sus hijos

  async add(data,callbackOk, callbackWrong){
    data.idSucursalPvTipo = this.tipo
    console.log("vamos a hacer el add", data)

    const url = ModelConfig.get("urlBase") + "/Sucursales/AddPuntoVenta"
    EndPoint.sendPost(url,data,(responseData, response)=>{
      callbackOk(responseData, response)
    },callbackWrong)
  }
}

export default Pasarela;
