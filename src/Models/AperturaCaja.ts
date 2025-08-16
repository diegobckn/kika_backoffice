import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.ts';
import ModelConfig from './ModelConfig.ts';


class AperturaCaja extends Model{
    motivo: string | null | undefined;
    rutProveedor: string | null | undefined;
    idUsuario: string | null | undefined;
    codigoUsuario: number;
    codigoSucursal: number;
    puntoVenta: string;
    fechaIngreso: string;
    tipo: string;
    detalleTipo: string;
    observacion: string;
    monto: number;
    idTurno: number;

    static instance: AperturaCaja | null = null;

    static getInstance():AperturaCaja{
        if(AperturaCaja.instance == null){
            AperturaCaja.instance = new AperturaCaja();
        }

        return AperturaCaja.instance;
    }

    saveInSesion(data){
        this.sesion.guardar(data)
        // localStorage.setItem('userData', JSON.stringify(data));
        return data;
    }

    getFromSesion(){
        return this.sesion.cargar(1)
        // var dt = localStorage.getItem('userData') || "{}";
        // return JSON.parse(dt);
    }

    
    async sendToServer(callbackOk, callbackWrong){
        var data = this.getFillables();
        try{
            const configs = ModelConfig.get()
            var url = configs.urlBase
            +"/api/Cajas/AddCajaFlujo"

            const response = await axios.post(
                url,
                data
            );

            console.log("Respuesta del servidor:", response.data);
            if (   response.data.statusCode == 201) {
                callbackOk(response.data);
            }else{
                callbackWrong(response.data.descripcion);
            }
            
        }catch(error){
            console.log("catch del servicio");
            console.log(error)
        }
    }
    

};

export default AperturaCaja;