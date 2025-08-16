
import axios from "axios";
import Model from "./Model.ts";
import ModelConfig from "./ModelConfig.ts";

class PasarelaPago extends Model {

  // codigoUsuario: number;
  // rut: string;
  // clave: string;

  // deudaIds: any
  // idUsuario:number

  static instance: PasarelaPago | null = null;
  static getInstance(): PasarelaPago {
    if (PasarelaPago.instance == null) {
      PasarelaPago.instance = new PasarelaPago();
    }

    return PasarelaPago.instance;
  }

  async add(data,callbackOk, callbackWrong){
    try {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        + "/PasarelaPago/AddPasarelaPago"
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

export default PasarelaPago;
