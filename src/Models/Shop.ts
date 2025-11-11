import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.ts';
import ModelConfig from './ModelConfig.ts';
import ModelSingleton from './ModelSingleton.ts';
import EndPoint from './EndPoint.ts';
import SoporteTicket from './SoporteTicket.ts';


class Shop extends ModelSingleton {


    static async prepare(infoComercio: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/create-or-search-shop-from-commerce"

        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, infoComercio, (responseData: any, response: any) => {
            callbackOk(responseData, response);
            SoporteTicket.reportarError = ant
        }, (err: any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = ant
        })
    }

    static async actualizarInfoComercio(infoComercio: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/update-info-shop"

        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, infoComercio, (responseData: any, response: any) => {
            callbackOk(responseData, response);
            SoporteTicket.reportarError = ant
        }, (err: any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = ant
        })
    }

    static async enviarImagen(fileInput:any, infoComercio: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/update-image"

        var formData = new FormData();
        formData.append('image', fileInput);
        formData.append('id', infoComercio.id);

        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, formData, (responseData: any, response: any) => {
            callbackOk(responseData, response);
            SoporteTicket.reportarError = ant
        }, (err: any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = ant
        }, {
            headers: {
                'Content-Type': 'multipart/form-data', // El servidor debe procesar esto
            },
        })
    }


    static async enviarImagenProperty(topic: string, unique: string, fileInput: any, infoComercio: any, callbackOk: any, callbackWrong: any) {
        // console.log("infocomercio", infoComercio)
        // callbackWrong("x")
        // return
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/update-image-property"

        var formData = new FormData();
        formData.append('image', fileInput);
        formData.append('Nro_Rut', infoComercio.Nro_Rut);
        formData.append('topic', topic);
        formData.append('unique', unique);

        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, formData, (responseData: any, response: any) => {
            callbackOk(responseData, response);
            SoporteTicket.reportarError = ant
        }, (err: any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = ant
        }, {
            headers: {
                'Content-Type': 'multipart/form-data', // El servidor debe procesar esto
            },
        })
    }

    static async eliminarImagenProperty(topic: string, unique: string, infoComercio: any, callbackOk: any, callbackWrong: any) {
        // console.log("infocomercio", infoComercio)
        // callbackWrong("x")
        // return
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/delete-image-property"

        var formData = new FormData();
        formData.append('Nro_Rut', infoComercio.Nro_Rut);
        formData.append('topic', topic);
        formData.append('unique', unique);

        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, formData, (responseData: any, response: any) => {
            callbackOk(responseData, response);
            SoporteTicket.reportarError = ant
        }, (err: any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = ant
        }, {
            headers: {
                'Content-Type': 'multipart/form-data', // El servidor debe procesar esto
            },
        })
    }

    static async getProperty(topic: string, unique: string, name:string, infoComercio: any, callbackOk: any, callbackWrong: any) {
        // console.log("infocomercio", infoComercio)
        // callbackWrong("x")
        // return
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/get-property"

        var formData = new FormData();
        formData.append('Nro_Rut', infoComercio.Nro_Rut);
        formData.append('topic', topic);
        formData.append('name', name);
        formData.append('unique', unique);

        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, formData, (responseData: any, response: any) => {
            callbackOk(responseData, response);
            SoporteTicket.reportarError = ant
        }, (err: any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = ant
        }, {
            headers: {
                'Content-Type': 'multipart/form-data', // El servidor debe procesar esto
            },
        })
    }

    static async updateProperty(topic: string, unique: string, name:string, value:string, infoComercio: any, callbackOk: any, callbackWrong: any) {
        // console.log("infocomercio", infoComercio)
        // callbackWrong("x")
        // return
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/update-property"

        var formData = new FormData();
        formData.append('Nro_Rut', infoComercio.Nro_Rut);
        formData.append('topic', topic);
        formData.append('unique', unique);
        formData.append('name', name);
        formData.append('value', value);

        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, formData, (responseData: any, response: any) => {
            callbackOk(responseData, response);
            SoporteTicket.reportarError = ant
        }, (err: any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = ant
        }, {
            headers: {
                'Content-Type': 'multipart/form-data', // El servidor debe procesar esto
            },
        })
    }


    static async getLinkMp(infoComercio: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/get-link-connect-mp"

        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, {
            id: infoComercio.id
        }, (responseData: any, response: any) => {
            callbackOk(responseData, response);
            SoporteTicket.reportarError = ant
        }, (err: any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = ant
        })
    }

    static async checkConeccionMP(infoComercio: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/is-connected-mp"

        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, {
            id: infoComercio.id
        }, (responseData: any, response: any) => {
            callbackOk(responseData, response);
            SoporteTicket.reportarError = ant
        }, (err: any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = ant
        })
    }



};

export default Shop;