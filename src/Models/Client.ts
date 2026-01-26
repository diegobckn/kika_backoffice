import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.ts';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class Client extends Model {
  id: number | undefined;
  codigoCliente: number | undefined;
  rut: string | undefined;
  nombre: string | undefined;
  apellido: string | undefined;
  direccion: string | undefined;
  telefono: string | undefined;
  region: string | undefined;
  comuna: string | undefined;
  correo: string | undefined;
  giro: string | undefined;
  urlPagina: string | undefined;
  clienteSucursal: number | undefined;
  formaPago: string | undefined;
  usaCuentaCorriente: number | undefined;
  fechaIngreso: string | undefined;
  fechaUltAct: string | undefined;
  bajaLogica: boolean | undefined;

  codigoClienteSucursal: number | null | undefined
  data: any

  static instance: Client | null = null;



  static getInstance(): Client {
    if (Client.instance == null) {
      Client.instance = new Client();
    }

    return Client.instance;
  }

  saveInSesion(data: any) {
    this.sesion.guardar(data)
    // localStorage.setItem('userData', JSON.stringify(data));
    return data;
  }

  getFromSesion() {
    return this.sesion.cargar(1)
    // var dt = localStorage.getItem('userData') || "{}";
    // return JSON.parse(dt);
  }

  fill(values: any) {
    var me: any = this
    for (var campo in values) {
      const valor = values[campo]
      me[campo] = valor;
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

  async searchInServer(searchText: string, callbackOk: any, callbackWrong: any) {
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

  async getAllFromServer(callbackOk: any, callbackWrong: any) {
    try {
      const configs = ModelConfig.get()
      var url = configs.urlBase
        + "/Clientes/GetAllClientes"
      const response = await axios.get(
        url
      );

      if (
        response.data.statusCode == 200

      ) {
        callbackOk(response.data.cliente);
      } else {
        callbackWrong(response.data.descripcion);
      }
    } catch (error) {
      callbackWrong(error);
    }
  }

  async findById(id: number, callbackOk: any, callbackWrong: any) {
    this.getAllFromServer((clientes: any) => {
      var clienteEncontrado = null
      clientes.forEach((cl: any) => {
        if (cl.codigoCliente == id) {
          clienteEncontrado = cl
          return
        } else {
          // console.log("no coincide con " + cl.codigoCliente)
        }
      })
      if (clienteEncontrado) {
        callbackOk(clienteEncontrado)
      } else {
        callbackWrong("No hay coincidencia")
      }
    }, callbackWrong)
  }

  async getDeudasByMyId(callbackOk: any, callbackWrong: any) {
    if (!this.id) {
      console.log("Client. getDeudasByMyId. No se asigno un id para buscar deudas del cliente");
      return
    }

    this.clienteSucursal = 0;
    try {
      const configs = ModelConfig.get()
      var url = configs.urlBase
        + "/Clientes/GetClientesDeudasByIdCliente"
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
      } else {
        callbackWrong(response.data.descripcion);
      }

    } catch (error) {
      callbackWrong(error);
    }
  }

  async getDeudasByFecha(fechadesde: string, fechahasta: string, callbackOk: any, callbackWrong: any) {
    var url = ModelConfig.get("urlBase")
      + "/ReporteClientes/GetClientesDeudasByFecha"
      + "?fechaDesde=" + fechadesde
      + "&fechaHasta=" + fechahasta

    EndPoint.sendGet(url, (responseData:any, response:any) => {
      callbackOk(responseData, response)
    }, callbackWrong)
  }

  async pagarFiado(callbackOk: any, callbackWrong: any) {
    if (!this.data) {
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
        + "/Clientes/PostClientePagarDeudaByIdClienteFlujoCaja"

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

  async getLastSale(callbackOk: any, callbackWrong: any) {
    if (!this.codigoClienteSucursal && this.clienteSucursal)
      this.codigoClienteSucursal = this.clienteSucursal
    if (
      this.codigoClienteSucursal == undefined
      || this.codigoCliente == undefined
    ) {
      console.log("Modelo Client.definir clienteSucursal y codigo cliente como propiedad");
      return
    }
    try {
      const configs = ModelConfig.get()
      var url = configs.urlBase
        + "/Clientes/GetClienteUltimaVentaByIdCliente" +
        "?codigoClienteSucursal=" + this.codigoClienteSucursal +
        "&codigoCliente=" + this.codigoCliente

      const response = await axios.get(url);
      const { ticketBusqueda } = response.data; // Extraer la sección de ticket de la respuesta
      var result: any = []
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

  async getRegions(callbackOk: any, callbackWrong: any) {
    try {
      const configs = ModelConfig.get()
      var url = configs.urlBase
        + "/RegionComuna/GetAllRegiones"

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


  async getComunasFromRegion(regionId: number, callbackOk: any, callbackWrong: any) {
    try {
      const configs = ModelConfig.get()
      var url = configs.urlBase
        + "/RegionComuna/GetComunaByIDRegion?IdRegion=" + regionId
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


  async create(data: any, callbackOk: any, callbackWrong: any) {
    try {
      data.usaCuentaCorriente = 0

      data.comuna = data.comuna + ""
      data.region = data.region + ""

      const configs = ModelConfig.get()
      var url = configs.urlBase
        + "/Clientes/AddCliente"

      const response = await axios.post(url, data);

      if (response.status === 201
        || response.status === 200
      ) {
        // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
        callbackOk(response.data)
      } else {
        callbackWrong("Error de servidor")
      }
    } catch (error: any) {
      if (error.response) {
        callbackWrong(error.message);
      } else if (error.response && error.response.status === 500) {
        callbackWrong("Error interno del servidor. Por favor, inténtalo de nuevo más tarde.");
      } else if (error.message != "") {
        callbackWrong(error.message)
      } else {
        callbackWrong(error);
      }
      // console.error(error);
    }
  };

  async edit(data: any, callbackOk: any, callbackWrong: any) {
    try {
      data.usaCuentaCorriente = 0

      const configs = ModelConfig.get()
      var url = configs.urlBase
        + "/Clientes/PutClienteCliente"

      const response = await axios.put(url, data);

      if (response.status === 201
        || response.status === 200
      ) {
        // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
        callbackOk(response.data)
      } else {
        callbackWrong("Error de servidor")
      }
    } catch (error: any) {
      if (error.response) {
        callbackWrong(error.message);
      } else if (error.response && error.response.status === 500) {
        callbackWrong("Error interno del servidor. Por favor, inténtalo de nuevo más tarde.");
      } else if (error.message != "") {
        callbackWrong(error.message)
      } else {
        callbackWrong(error);
      }
      // console.error(error);
    }
  };

  async existRut(rut: string, callbackOk: any, callbackWrong: any) {
    try {
      const configs = ModelConfig.get()
      var url = configs.urlBase
        + "/Clientes/GetClientesByRut?rut=" + rut

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

  static completoParaFactura(info: any) {
    // console.log("revisando si esta para facturar")
    // console.log(info)
    return (
      info.rutResponsable && info.rutResponsable.length > 0 &&
      info.razonSocial && info.razonSocial.length > 0 &&
      info.nombreResponsable && info.nombreResponsable.length > 0 &&
      info.apellidoResponsable && info.apellidoResponsable.length > 0 &&
      info.direccion && info.direccion.length > 0 &&
      info.region && info.region.length > 0 &&
      info.comuna && info.comuna.length > 0 &&
      info.giro && info.giro.length > 0
    )
  }

  async getClientPrices(
    codigoClienteSucursal: number,
    codigoCliente: number,
    callbackOk: any,
    callbackWrong: any,
    pagina = 1,
    cantidadPorPagina = 10
  ) {
    try {
      const configs = ModelConfig.get();
      var url = `${configs.urlBase}`
        + `/Clientes/GetClientesProductoPrecioByIdCliente`
        + `?`
        + `codigoClienteSucursal=${codigoClienteSucursal}`
        + `&codigoCliente=${codigoCliente}`
        + `&pageNumber=${pagina}`
        + `&rowPage=${cantidadPorPagina}`


      const response = await axios.get(url);

      if (response.data.statusCode === 200) {
        callbackOk(response.data.clientesProductoPrecioMostrar, response);
      } else {
        callbackWrong(
          response.data.descripcion ||
          "Error al obtener los precios del cliente"
        );
      }
      console.log()
    } catch (error) {
      console.error("Error fetching client prices:", error);
      callbackWrong(error);
    }
  }

  async saveClientPrices(data: any, callbackOk: any, callbackWrong: any) {
    try {
      const configs = ModelConfig.get();
      const url = `${configs.urlBase}/Clientes/PutClientesProductoActualizarPrecioByIdCliente`;

      // Hacer la solicitud al endpoint con los datos proporcionados
      const response = await axios.put(url, data);
      console.log("precios clientes", response)

      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        callbackOk(response.data);
        console.log("precios clientes", response.data)

      } else {
        callbackWrong(
          response.data.descripcion ||
          "Error al actualizar los precios del cliente"
        );
      }
    } catch (error) {
      console.error("Error updating client prices:", error);
      callbackWrong(error);
    }

  }
};

export default Client;