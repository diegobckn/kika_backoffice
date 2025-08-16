import StorageSesion from "../Helpers/StorageSesion.ts";
import Model from "./Model.ts";
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import ModelConfig from "./ModelConfig.ts";

class EntradaSalidaStock extends Model {
  stockFisico: number;
  fechaAjuste: number;
  tipoAjuste: string;
  ajusteDescripcion: string;

  static instance: EntradaSalidaStock | null = null;

  static getInstance(): EntradaSalidaStock {
    if (EntradaSalidaStock.instance == null) {
      EntradaSalidaStock.instance = new EntradaSalidaStock();
    }
    return EntradaSalidaStock.instance;
  }

  async add(data, callbackOk, callbackWrong) {
    try {
        const configs = ModelConfig.get();
        var url = configs.urlBase + "/Stock/EntradaSalidaStock";
        const response = await axios.post(url, data);
        if (response.status === 200 || response.status === 201) {
            callbackOk(response.data, response);
        } else {
            callbackWrong("Respuesta desconocida del servidor");
        }
    } catch (error) {
        if (error.response && error.response.status && error.response.status === 409) {
            callbackWrong(error.response.descripcion);
        } else {
            callbackWrong(error.message);
        }
    }
}
}

export default EntradaSalidaStock;