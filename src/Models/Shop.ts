import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.ts';
import ModelConfig from './ModelConfig.ts';
import ModelSingleton from './ModelSingleton.ts';
import EndPoint from './EndPoint.ts';
import SoporteTicket from './SoporteTicket.ts';
import System from '../Helpers/System.ts';


class Shop extends ModelSingleton {


    static async prepare(infoComercio: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/create-or-search-shop-from-commerce"
        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, infoComercio, (responseData: any, response: any) => {
            // console.log("prepare..responseData..", responseData)
            if (typeof (responseData.info) == "string") {
                callbackWrong(responseData.info);
            } else {
                callbackOk(responseData, response);
            }
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

    static async enviarImagen(fileInput: any, infoComercio: any, callbackOk: any, callbackWrong: any) {
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

    static async getProperty(topic: string, unique: string, name: string, infoComercio: any, callbackOk: any, callbackWrong: any) {
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

    static async updateProperty(topic: string, unique: string, name: string, value: string, infoComercio: any, callbackOk: any, callbackWrong: any) {
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

    static async getAllZones(infoComercio: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/get-all-zones"

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

    static async getAllTimes(infoComercio: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/get-all-times"

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

    static async getAllZonesCommerce(infoComercio: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/get-all-zones-of-commerce"

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

    static async getAllTimesCommerce(infoComercio: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/get-all-times-of-commerce"

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

    static async addZoneToCommerce(infoComercio: any, zone: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/add-zone-to-commerce"
        const info = Object.assign(infoComercio, {
            zone_id: zone.id
        })
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

    static async addTimeToCommerce(infoComercio: any, time: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/add-time-to-commerce"
        const info = Object.assign(infoComercio, {
            time_id: time.id
        })
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

    static async removeZoneToCommerce(infoComercio: any, zone: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/remove-zone-to-commerce"
        const info = Object.assign(infoComercio, {
            zone_id: zone.id
        })
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

    static async removeTimeToCommerce(infoComercio: any, time: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/remove-time-to-commerce"
        const info = Object.assign(infoComercio, {
            time_id: time.id
        })
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

    static async createAndAssignZoneToCommerce(infoComercio: any, zone: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/create-zone-and-assign-to-commerce"
        const info = Object.assign(infoComercio, {
            zone_id: zone.id,
            zone_price: zone.price,
            zone_name: zone.name,
            zone_distance_gps: zone.distance_gps,
        })
        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, info, (responseData: any, response: any) => {
            callbackOk(responseData, response);
            SoporteTicket.reportarError = ant
        }, (err: any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = ant
        })
    }

    static async createAndAssignTimeToCommerce(infoComercio: any, time: any, callbackOk: any, callbackWrong: any) {
        // const configs = ModelConfig.get()
        var url = "https://softus.com.ar/easypos/create-time-and-assign-to-commerce"
        const info = Object.assign(infoComercio, {
            time_id: time.id,
            time_name: time.name,
        })
        const ant = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, info, (responseData: any, response: any) => {
            callbackOk(responseData, response);
            SoporteTicket.reportarError = ant
        }, (err: any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = ant
        })
    }



};

export default Shop;