import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.ts';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';


class Client extends Model {
    id: number;
    codigoCliente: number;
    rut: string;
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
    region: string;
    comuna: string;
    correo: string;
    giro: string;
    urlPagina: string;
    clienteSucursal: number;
    formaPago: string;
    usaCuentaCorriente: number;
    fechaIngreso: string;
    fechaUltAct: string;
    bajaLogica: boolean;

    codigoClienteSucursal:number | null | undefined
    data:any

    static instance: Client | null = null;
    


    static getInstance():Client{
      if(Client.instance == null){
          Client.instance = new Client();
      }

      return Client.instance;
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

    async searchInServer(searchText,callbackOk, callbackWrong){
      try {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        + `/api/Clientes/GetClientesByNombreApellido?nombreApellido=${searchText}`

        const response = await axios.get(
          url
        );
        if (Array.isArray(response.data.clienteSucursal)) {
          callbackOk(response.data.clienteSucursal);
        } else {
          callbackOk([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        callbackWrong(error);
      }
    }

    async getAllFromServer(callbackOk, callbackWrong){
        try{
          const configs = ModelConfig.get()
          var url = configs.urlBase
          + "/api/Clientes/GetAllClientes"
          const response = await axios.get(
            url
          );

          if (
              response.data.statusCode == 200

          ) {
              callbackOk(response.data.cliente);
          }else{
              callbackWrong(response.data.descripcion);
          }
        }catch(error){
          callbackWrong(error);
        }
    }

    async findById(id,callbackOk, callbackWrong){
      this.getAllFromServer((clientes)=>{
        var clienteEncontrado = null
        clientes.forEach((cl)=>{
          if(cl.codigoCliente == id){
            clienteEncontrado = cl
            return
          }else{
            // console.log("no coincide con " + cl.codigoCliente)
          }
        })
        if(clienteEncontrado){
          callbackOk(clienteEncontrado)
        }else{
          callbackWrong("No hay coincidencia")
        }
      },callbackWrong)
    }

    async getDeudasByMyId(callbackOk, callbackWrong){
        if(!this.id){
            console.log("Client. getDeudasByMyId. No se asigno un id para buscar deudas del cliente");
            return
        }

        this.clienteSucursal = 0;
        try{
            const configs = ModelConfig.get()
            var url = configs.urlBase
            + "/api/Clientes/GetClientesDeudasByIdCliente"
            + "?codigoClienteSucursal=" + this.clienteSucursal 
            + "&codigoCliente=" + this.id

            const response = await axios.get(
                url
            );

            // console.log("Respuesta del servidor:", response.data);
            if (
                response.data.statusCode == 200

            ) {
                callbackOk(response.data.clienteDeuda);
            }else{
                callbackWrong(response.data.descripcion);
            }
            
        }catch(error){
            callbackWrong(error);
        }
    }

    async pagarFiado(callbackOk, callbackWrong){
        if(!this.data){
            console.log("falta asignar la data para enviar")
            return
        }
        // console.log("enviando al servidor, esta informacion:");
        // console.log(this.data)
        // setTimeout(()=>{
        //   callbackOk({
        //     descripcion:"todo ok"
        //   }
        //   )
        // },2000)
        // return
          try {
              const configs = ModelConfig.get()
              var url = configs.urlBase
              +"/api/Clientes/PostClientePagarDeudaByIdClienteFlujoCaja"

              const response = await axios.post(url, this.data);
        
              // console.log("Response:", response.data);
  
              if (response.data.statusCode === 201
                || response.data.statusCode === 200
              ) {
                // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
                callbackOk(response.data)
              } else {
                callbackWrong("Error de servidor")
              }
            } catch (error) {
              callbackWrong(error)
            }
      }

    async getLastSale(callbackOk, callbackWrong){
        if(!this.codigoClienteSucursal && this.clienteSucursal)
            this.codigoClienteSucursal = this.clienteSucursal
        if(
            this.codigoClienteSucursal == undefined
            || this.codigoCliente == undefined
            ){
            console.log("Modelo Client.definir clienteSucursal y codigo cliente como propiedad");
            return
        }
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
            +"/api/Clientes/GetClienteUltimaVentaByIdCliente" + 
            "?codigoClienteSucursal=" + this.codigoClienteSucursal + 
            "&codigoCliente=" +this.codigoCliente

            const response = await axios.get(url);
            const { ticketBusqueda } = response.data; // Extraer la sección de ticket de la respuesta
            var result:any = []
            // Verificar si hay información de tickets antes de procesarla
            if (Array.isArray(ticketBusqueda) && ticketBusqueda.length > 0) {
              ticketBusqueda.forEach((ticket) => {
                const products = ticket.products; // Extraer la matriz de productos del ticket
      
                // Verificar si hay productos antes de enviarlos a addToSalesData
                if (Array.isArray(products) && products.length > 0) {
                  products.forEach((product) => {
                    result.push(product);
                  });
                }
              });

              callbackOk(result)
            } else {
              callbackWrong("Formato erroneo del servidor")
            }
          } catch (error) {
            callbackWrong(error);
          }
    }

    async getRegions (callbackOk,callbackWrong){
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


    async getComunasFromRegion(regionId, callbackOk, callbackWrong){
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


    async create(data,callbackOk,callbackWrong){
      try {
        data.usaCuentaCorriente = 0

        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/Clientes/AddCliente"

        const response = await axios.post(url,data);

        if (response.status === 201
          || response.status === 200
        ) {
          // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
          callbackOk(response.data)
        } else {
          callbackWrong("Error de servidor")
        }
      } catch (error) {
        if (error.response) {
          callbackWrong(error.message);
        } else if (error.response && error.response.status === 500) {
          callbackWrong("Error interno del servidor. Por favor, inténtalo de nuevo más tarde.");
        } else if(error.message != ""){
          callbackWrong(error.message)
        }else {
          callbackWrong(error);
        }
        // console.error(error);
      }
    };

    async existRut(rut,callbackOk,callbackWrong){
      try {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/Clientes/GetClientesByRut?rut=" + rut

        const response = await axios.get(url);

        if (response.data.statusCode === 201
          || response.data.statusCode === 200
        ) {
          // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
          callbackOk(response.data)
        } else {
          callbackWrong("Error de servidor")
        }
      } catch (error) {
        console.error(error);
        callbackWrong(error)
      }
    };

    static completoParaFactura(info){
      // console.log("revisando si esta para facturar")
      // console.log(info)
      return (
        info.rutResponsable && info.rutResponsable.length>0 &&
        info.razonSocial && info.razonSocial.length>0 &&
        info.nombreResponsable && info.nombreResponsable.length>0 &&
        info.apellidoResponsable && info.apellidoResponsable.length>0 &&
        info.direccion && info.direccion.length>0 &&
        info.region && info.region.length>0 &&
        info.comuna && info.comuna.length>0 &&
        info.giro && info.giro.length>0
      )
    }
};

export default Client;