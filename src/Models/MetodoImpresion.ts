
import axios from "axios";
import Model from "./Model.ts";
import ModelConfig from "./ModelConfig.ts";

class MetodoImpresion extends Model {


  static instance: MetodoImpresion | null = null;
  static getInstance(): MetodoImpresion {
    if (MetodoImpresion.instance == null) {
      MetodoImpresion.instance = new MetodoImpresion();
    }

    return MetodoImpresion.instance;
  }

  async add(data,callbackOk, callbackWrong){
    try {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        + "/MetodoImpresiones/AddMetodoImpresion"
        const response = await axios.post(url,data);
        if (
        response.status === 200
        || response.status === 201
        ) {
        // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
        callbackOk(response.data, response)
        } else {
        callbackWrong("Respuesta desconocida del servidor")
        }
    } catch (error) {
        if (error.response && error.response.status && error.response.status === 409) {
            callbackWrong(error.response.descripcion)
        } else {
            callbackWrong(error.message)
          }


    }
}
}

export default MetodoImpresion;
