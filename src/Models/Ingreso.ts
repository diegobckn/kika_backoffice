import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';


class Ingreso extends Model{
  codigoUsuario: number;
  codigoSucursal: number;
  puntoVenta: string;
  fechaIngreso: string;
  idTurno: number;
  tipo: string;
  detalleTipo: string;
  observacion: string;
  monto: number;

  motivo: string | null | undefined;
  rutProveedor: string | null | undefined;
  idUsuario: string | null | undefined;
  
  static TIPO = "INGRESO"



    async otros(callbackOk, callbackWrong){
      if(!this.motivo){
        console.log("Ingreso. Otros ingresos. Falta motivo");
        return
      }
      this.tipo = Ingreso.TIPO
      this.detalleTipo = "OTROSINGRESOS"
      this.observacion = this.motivo

      const data = this.getFillables()
      delete data.motivo
        try {
          const configs = ModelConfig.get()
          var url = configs.urlBase
          +"/api/Cajas/AddCajaFlujo"
          
          const response = await axios.post(url, data);
    
          console.log("Response:", response.data);

          if (response.data.statusCode === 201) {
            // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
            callbackOk(response.data)
          } else {
            callbackWrong("Error de servidor")
          }
        } catch (error) {
          callbackWrong(error)
        }
    }

};

export default Ingreso;