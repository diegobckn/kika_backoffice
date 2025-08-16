import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';


class Retiro extends Model{
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
  
  static TIPO = "EGRESO"



    async retiroDeCaja(callbackOk, callbackWrong){
      if(!this.motivo){
        console.log("Retiro. retiroDeCaja. Falta motivo");
        return
      }
      this.tipo = Retiro.TIPO
      this.detalleTipo = "RETIRODECAJA"
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


    async anticipoTrabajador(callbackOk, callbackWrong){
      if(this.codigoUsuario == null){
        console.log("Retiro. pago de factura. Falta codigoUsuario");
        return
      }
      this.tipo = Retiro.TIPO
      this.detalleTipo = "ANTICIPOTRABAJADOR"

      const data = this.getFillables()
        try {
          const configs = ModelConfig.get()
          var url = configs.urlBase
          +"/api/Cajas/AddCajaFlujo"

          const response = await axios.post(url, data);
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

export default Retiro;