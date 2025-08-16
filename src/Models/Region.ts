import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.ts';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';


class Region{
    static instance: Region | null = null;
    sesion: StorageSesion;

    constructor(){
      this.sesion = new StorageSesion("client");
    }

    static getInstance():Region{
      if(Region.instance == null){
          Region.instance = new Region();
      }

      return Region.instance;
    }

    

    async getAll(callbackOk,callbackWrong){
      try {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/RegionComuna/GetAllRegiones"

        const response = await axios.get(url);
        if (response.data.statusCode === 201
          || response.data.statusCode === 200
        ) {
          // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
          callbackOk(response.data.regiones)
        } else {
          callbackWrong("Error de servidor")
        }
      } catch (error) {
        console.error(error);
        callbackWrong(error)
      }
    };

};

export default Region;