import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import EndPoint from './EndPoint.ts';
import ModelConfig from './ModelConfig.ts';
import axios from 'axios';


class ModelSingleton {
  sesion: StorageSesion;

  static instances = {};

  constructor() {
    this.sesion = new StorageSesion(eval("this.__proto__.constructor.name"));
  }

  fill(values) {
    for (var campo in values) {
      const valor = values[campo]
      this[campo] = valor;
    }
  }

  getFillables() {
    var values: any = {};
    for (var prop in this) {
      if (typeof (this[prop]) != 'object'
        && this[prop] != undefined
      ) {
        values[prop] = this[prop]
      }
    }
    return values
  }

  static getInstance() {
    if (this.instances[this.name] === undefined) {
      this.instances[this.name] = new this();
    }
    return this.instances[this.name];
  }
};

export default ModelSingleton;