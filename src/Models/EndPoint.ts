import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import Singleton from './Singleton.ts';
import User from './User';
import SoporteTicket from './SoporteTicket.ts';


class EndPoint extends Singleton {

  static admError(error, callbackWrong) {
    console.log("admError", error)
    SoporteTicket.catchRequestError(error)
    if (callbackWrong == undefined) return
    if (error.response) {
      if (error.response.data && error.response.data.descripcion) {
        callbackWrong(error.response.data.descripcion);
      } else if (error.response.status === 500) {
        callbackWrong("Error interno del servidor. Por favor, inténtalo de nuevo más tarde.");
      } else {
        callbackWrong(error.message);
      }
    } else if (error.message != "") {
      callbackWrong(error.message)
    } else {
      callbackWrong(
        "Error de comunicacion con el servidor"
      );
    }
  }

  static async sendGet(url, callbackOk, callbackWrong) {
    try {
      const response = await axios.get(url);
      if (
        (response.status === 200 || response.status === 201)
        || (response.data.statusCode === 200 || response.data.statusCode === 201)
      ) {
        if (callbackOk != undefined) callbackOk(response.data, response)
      } else {
        var msgError = "Error de servidor"
        callbackWrong(response.data.descripcion);
        if (response.data && response.data.descripcion) msgError = response.data.descripcion
        if (callbackWrong != undefined) callbackWrong(msgError)
        SoporteTicket.catchRequest(response)
      }
    } catch (error) {
      this.admError(error, callbackWrong)
    }
  }


  static async sendPost(url, data, callbackOk, callbackWrong, headers:any = undefined) {
    try {
      const response = await axios.post(url, data, headers);
      if (
        (response.status === 200 || response.status === 201)
        || (response.data.statusCode === 200 || response.data.statusCode === 201)
      ) {
        if (callbackOk != undefined) callbackOk(response.data, response)
      } else {
        if (callbackWrong != undefined) callbackWrong("Error de servidor")
        SoporteTicket.catchRequest(response)
      }
    } catch (error) {
      this.admError(error, callbackWrong)
    }
  }

  static async sendPut(url, data, callbackOk, callbackWrong) {
    try {
      const response = await axios.put(url, data);
      if (
        (response.status === 200 || response.status === 201)
        || (response.data.statusCode === 200 || response.data.statusCode === 201)
      ) {
        if (callbackOk != undefined) callbackOk(response.data, response)
      } else {
        if (callbackWrong != undefined) callbackWrong("Error de servidor")
        SoporteTicket.catchRequest(response)
      }
    } catch (error) {
      this.admError(error, callbackWrong)
    }
  }

  static async sendDelete(url, data, callbackOk, callbackWrong, pasarAUrl = false) {
    try {
      console.log("ya envio la data", data)

      if (pasarAUrl) {
        var aUrl = ""
        const keys = Object.keys(data)
        keys.forEach((key) => {
          if (aUrl != "") aUrl += "&"
          aUrl += key + "=" + data[key]
        })
        if (aUrl != "") {
          aUrl = "?" + aUrl
          url += aUrl
        }
        // console.log("aUrl", aUrl)
      }
      const response = await axios.delete(url,
        {
          data: data,
        });
      if (
        (response.status === 200 || response.status === 201)
        || (response.data.statusCode === 200 || response.data.statusCode === 201)
      ) {
        if (callbackOk != undefined) callbackOk(response.data, response)
      } else {
        if (callbackWrong != undefined) callbackWrong("Error de servidor")
        SoporteTicket.catchRequest(response)
      }
    } catch (error) {
      this.admError(error, callbackWrong)
    }
  }
};

export default EndPoint;