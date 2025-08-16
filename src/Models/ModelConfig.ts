import axios from 'axios';
import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig";


class ModelConfig {
    static instance: ModelConfig | null = null;
    sesion: StorageSesion;

    constructor(){
        this.sesion = new StorageSesion("config");
    }

    static getInstance():ModelConfig{
        if(ModelConfig.instance == null){
            ModelConfig.instance = new ModelConfig();
        }

        return ModelConfig.instance;
    }

    static get(propName = ""){
        var rs = ModelConfig.getInstance().sesion.cargar(1)
        if(!rs){
            this.getInstance().sesion.guardar(BaseConfig);
        }
        rs = ModelConfig.getInstance().sesion.cargar(1)

        if(propName != ""){
            if( rs[propName] != undefined ){
                return rs[propName]
            }else{
                rs[propName] = BaseConfig[propName]
                this.getInstance().sesion.guardar(rs);
                return rs[propName]
            }
        }
        return rs;
    }

    static getValueOrDefault(name){
        const all = ModelConfig.get()

        if(all[name] == undefined){
            if(BaseConfig[name] != undefined){
                ModelConfig.change(name, BaseConfig[name])
                return BaseConfig[name]
            }
            console.log("no existe el valor defualt para '" + name + "'")
        }else{
            return all[name] 
        }
    }

    static change(propName, propValue){
        var all = ModelConfig.get();
        all[propName] = propValue;
        ModelConfig.getInstance().sesion.guardar(all); 
    }

    getAll(){
        return this.sesion.cargarGuardados();
    }

    getFirst(){
        if(!this.sesion.hasOne()){
            this.sesion.guardar(BaseConfig);
        }
        return(this.sesion.getFirst())
    }


    static async getAllComercio(callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase

            url += "/Configuracion/GetAllConfiguracionCliente"

            const response = await axios.get(url);
            if (response.data.statusCode === 200) {
            // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
            callbackOk(response.data)
            } else {
            callbackWrong("Error del servidor")
            }
        } catch (error) {
            callbackWrong(error)
        }
    }
    
    static async updateComercio(data,callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase

            url += "/Configuracion/PutConfiguracionCliente"

            const response = await axios.put(url,data);
            if (response.data.statusCode === 200) {
            // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
            callbackOk(response.data)
            } else {
            callbackWrong("Error del servidor")
            }
        } catch (error) {
            callbackWrong(error)
        }
    }

    static async getAllImpresion(callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase

            url += "/Configuracion/GetAllConfiguracionImpresion"

            const response = await axios.get(url);
            if (response.data.statusCode === 200) {
            // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
            callbackOk(response.data)
            } else {
            callbackWrong("Error del servidor")
            }
        } catch (error) {
            callbackWrong(error)
        }
    }

    static async updateImpresion(data,callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase

            url += "/Configuracion/PutAllConfiguracionImpresion"

            const response = await axios.put(url,data);
            if (response.data.statusCode === 200) {
            // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
            callbackOk(response.data)
            } else {
            callbackWrong("Error del servidor")
            }
        } catch (error) {
            callbackWrong(error)
        }
    }

    static async getAllSimpleApi(callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase

            url += "/Configuracion/GetAllConfiguracionSimpleAPI"

            const response = await axios.get(url);
            if (response.data.statusCode === 200) {
            // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
            callbackOk(response.data)
            } else {
            callbackWrong("Error del servidor")
            }
        } catch (error) {
            callbackWrong(error)
        }
    }

    static async updateSimpleApi(data,callbackOk, callbackWrong){
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase

            url += "/Configuracion/PutAllConfiguracionSimpleAPI"

            const response = await axios.put(url,data,{
                // headers: {
                //   'Content-Type': 'multipart/form-data'
                // }
              });
            if (response.data.statusCode === 200) {
            // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
            callbackOk(response.data)
            } else {
            callbackWrong("Error del servidor")
            }
        } catch (error) {
            callbackWrong(error)
        }
    }

};

export default ModelConfig;