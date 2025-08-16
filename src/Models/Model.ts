import StorageSesion from '../Helpers/StorageSesion.ts';
import Sale from './Sale.ts';
import Sales from './Sales.ts';

import BaseConfig from "../definitions/BaseConfig.ts";
import Singleton from './Singleton.ts';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class Model extends Singleton{
    sesion: StorageSesion;

    constructor(){
        super()
        this.sesion = new StorageSesion(eval("this.__proto__.constructor.name"));
    }

    fill(values:any){
        for(var campo in values){
            const valor = values[campo]
            this[campo] = valor;
        }
    }

    getFillables(){
        var values:any = {};
        for(var prop in this){
            if(typeof(this[prop]) != 'object'
                && this[prop] != undefined
            ){
                values[prop] = this[prop]
            }
        }
        return values
    }

    async cargarDeSesion1(nombre){

        // console.log("cargarDeSesion1.. sesion", this.sesion)
        // console.log("cargarDeSesion1.. nombre", nombre)
        var sesion1 = await this.sesion.cargar(1)
        if(sesion1){
            if(sesion1[nombre]){
                // console.log("cargarDeSesion1.. devuelvo", sesion1[nombre])
                return sesion1[nombre]
            }
        }
        
        // console.log("cargarDeSesion1.. devuelvo", null)
        return null
    }

    static async getConexion(callbackOk, callbackWrong){
        const url = ModelConfig.get("urlBase") + "/Cajas/EstadoApi"
        EndPoint.sendGet(url,(responseData, response)=>{
          callbackOk(responseData.sucursals, response)
        },callbackWrong)
    }

    static async getSupervision(data,callbackOk, callbackWrong){
        const url = ModelConfig.get("urlBase") + "/Ventas/AutorizarAccion?fechaIngreso=" + data.fechaIngreso 
        + "&idUsuario=" + data.idUsuario + "&CodeAutorizacion=" + data.CodeAutorizacion + "&Accion=" + data.Accion
        EndPoint.sendPost(url,data.body,(responseData, response)=>{
            callbackOk(responseData.sucursals, response)
        },callbackWrong)
    }

    static async addSupervision(data,callbackOk, callbackWrong){
        const url = ModelConfig.get("urlBase") + "/Usuarios/CrearAutorizador"
        EndPoint.sendPost(url,data,(responseData, response)=>{
            callbackOk(responseData, response)
        },callbackWrong)
    }


};

export default Model;