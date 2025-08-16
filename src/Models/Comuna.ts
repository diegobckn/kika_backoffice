import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.ts';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';


class Comuna{
    static instance: Comuna | null = null;
    sesion: StorageSesion;

    constructor(){
      this.sesion = new StorageSesion("client");
    }

    static getInstance():Comuna{
      if(Comuna.instance == null){
          Comuna.instance = new Comuna();
      }

      return Comuna.instance;
    }

    async findByRegion(regionId, callbackOk, callbackWrong){
      try {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/RegionComuna/GetComunaByIDRegion?IdRegion=" + regionId
        const response = await axios.get(url);
        if (response.data.statusCode === 201
          || response.data.statusCode === 200
        ) {
          // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
          callbackOk(response.data.comunas)
        } else {
          callbackWrong("Error de servidor")
        }
      } catch (error) {
        console.error(error);
        callbackWrong(error)
      }
    }
};

export default Comuna;