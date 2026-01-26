import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import System from '../Helpers/System.ts';
import EndPoint from './EndPoint.ts';

// Interfaces para tipar la respuesta de la API
interface OfertaProduct {
  codbarra: string;
  descripcion: string;
}

interface OfertaRegla {
  signo: string;
  cantidad: number;
  tipoDescuento: string;
  valor: number;
  aplicacion: string;
}

interface OfertaNMLItem {
  categoriaID: number;
  subCategoriaID: number;
  familiaID: number;
  subFamiliaID: number;
}

interface Oferta {
  codigoOferta: number;
  codigoTipo: number;
  descripcion: string;
  fechaInicial: string;
  fechaFinal: string;
  horaInicio: string | null;
  horaFin: string | null;
  diasSemana: string;
  fAplicaMix: boolean;
  fechaIngreso: string;
  fechaUltAct: string;
  bajaLogica: boolean;
  activo: boolean;
  products: OfertaProduct[];
  oferta_Regla: OfertaRegla;
  oferta_ListaCanasta?: OfertaCanastaItem[];
  oferta_ListaNMLs?: OfertaNMLItem[]; // Nueva propiedad para ofertas por familia/subfamilia
}

interface OfertasResponse {
  statusCode: number;
  descripcion: string;
  cantidad: number;
  ofertas: Oferta[];
}

// Interface para crear/actualizar ofertas
interface OfertaCanastaItem {
  codbarra: string;
  descripcionProducto: string;
  cantidad: number;
  porcDescuento: number;
}

interface NuevaOferta {
  codigoTipo: number;
  descripcion: string;
  fechaInicial: string;
  fechaFinal: string;
  horaInicio: string;
  horaFin: string;
  diasSemana: string;
  fAplicaMix: boolean;
  activo: boolean;
  oferta_Regla: {
    signo: string;
    cantidad: number;
    tipoDescuento: string;
    valor: number;
    aplicacion: string;
  };
  oferta_ListaCanasta: OfertaCanastaItem[];
}

// Interface para crear ofertas por NML (Nivel-Marca-Línea)
interface NuevaOfertaNML {
  codigoTipo: number;
  descripcion: string;
  fechaInicial: string;
  fechaFinal: string;
  horaInicio: string;
  horaFin: string;
  diasSemana: string;
  fAplicaMix: boolean;
  activo: boolean;
  oferta_Regla: {
    signo: string;
    cantidad: number;
    tipoDescuento: string;
    valor: number;
    aplicacion: string;
  };
  oferta_ListaNMLs: OfertaNMLItem[];
}

// Interface para actualizar ofertas (incluye codigoOferta)
interface ActualizarOferta extends NuevaOferta {
  codigoOferta: number;
}

// Interface para actualizar ofertas NML (incluye codigoOferta)
interface ActualizarOfertaNML extends NuevaOfertaNML {
  codigoOferta: number;
}

// Interfaces para Familias y Subfamilias
interface Familia {
  id: number;
  descripcion: string;
  codigo?: string;
  estado?: boolean;
}

interface Subfamilia {
  id: number;
  descripcion: string;
  familiaID: number;
  codigo?: string;
  estado?: boolean;
}

interface FamiliasResponse {
  statusCode: number;
  descripcion: string;
  cantidad: number;
  familias: Familia[];
}

interface SubfamiliasResponse {
  statusCode: number;
  descripcion: string;
  cantidad: number;
  subfamilias: Subfamilia[];
}

// Interfaces para compatibilidad con código legacy (si se usa en otros lugares)
interface OfertaLegacy {
  products: OfertaProduct[];
  monto: number;
  cantidad: number;
  signo: string;
  aplicacion: string;
  tipo: number;
  bajaLogica: boolean;
}

class Ofertas extends Model {
  static instance: Ofertas | null = null;

  static getInstance(): Ofertas {
    if (Ofertas.instance == null) {
      Ofertas.instance = new Ofertas();
    }
    return Ofertas.instance;
  }

  /**
   * Obtiene todas las ofertas disponibles
   * @param callbackOk - Callback ejecutado en caso de éxito
   * @param callbackWrong - Callback ejecutado en caso de error
   */
  static async getOfertas(callbackOk: (ofertas: Oferta[], response: any) => void, callbackWrong: (error: any) => void) {
    const configs = ModelConfig.get();
    const url = configs.urlBase + "/Ofertas/GetOfertas";
    
    EndPoint.sendGet(url, (responseData: OfertasResponse, response:any) => {
      callbackOk(responseData.ofertas, response);
    }, callbackWrong);
  }

  /**
   * Obtiene TODAS las ofertas presentes (incluyendo las dadas de baja lógica)
   * @param callbackOk - Callback ejecutado en caso de éxito
   * @param callbackWrong - Callback ejecutado en caso de error
   */
  static async getAllOfertas(callbackOk: (ofertas: Oferta[], response: any) => void, callbackWrong: (error: any) => void) {
    const configs = ModelConfig.get();
    const url = configs.urlBase + "/Ofertas/GetAllOfertas";
    
    console.log("Fetching all ofertas from:", url);
    
    EndPoint.sendGet(url, (responseData: OfertasResponse, response:any) => {
      console.log("Response completa de ofertas:", responseData);
      console.log("Primera oferta (ejemplo):", responseData.ofertas[0]);
      callbackOk(responseData.ofertas, response);
    }, callbackWrong);
  }

  /**
   * Obtiene ofertas filtradas por código de barra
   * @param codBarra - Código de barra del producto
   * @param callbackOk - Callback ejecutado en caso de éxito
   * @param callbackWrong - Callback ejecutado en caso de error
   */
  static async getOfertasByProduct(codBarra: string, callbackOk: (ofertas: Oferta[], response: any) => void, callbackWrong: (error: any) => void) {
    const configs = ModelConfig.get();
    const url = configs.urlBase + "/Ofertas/GetOfertas?codBarra=" + codBarra;
    
    EndPoint.sendGet(url, (responseData: OfertasResponse, response:any) => {
      // Filtrar ofertas que contengan el producto con el código de barra especificado
      const ofertasFiltradas = responseData.ofertas.filter(oferta => 
        oferta.products.some(product => product.codbarra === codBarra)
      );
      callbackOk(ofertasFiltradas, response);
    }, callbackWrong);
  }

  /**
   * Crea una nueva oferta
   * @param data - Datos de la oferta a crear
   * @param callbackOk - Callback ejecutado en caso de éxito
   * @param callbackWrong - Callback ejecutado en caso de error
   */
  static async addOferta(data: NuevaOferta, callbackOk: (responseData: any, response: any) => void, callbackWrong: (error: any) => void) {
    const configs = ModelConfig.get();
    const url = configs.urlBase + "/Ofertas/AddOferta";
    
    EndPoint.sendPost(url, data, (responseData:any, response:any) => {
      callbackOk(responseData, response);
    }, callbackWrong);
  }

  /**
   * Crea una nueva oferta por NML (Nivel-Marca-Línea - Familia/Subfamilia)
   * @param data - Datos de la oferta a crear
   * @param callbackOk - Callback ejecutado en caso de éxito
   * @param callbackWrong - Callback ejecutado en caso de error
   */
  static async addOfertaNML(data: NuevaOfertaNML, callbackOk: (responseData: any, response: any) => void, callbackWrong: (error: any) => void) {
    const configs = ModelConfig.get();
    const url = configs.urlBase + "/Ofertas/AddOfertaNML";
    
    console.log("Enviando oferta NML a:", url);
    console.log("Datos NML:", data);
    
    EndPoint.sendPost(url, data, (responseData:any, response:any) => {
      console.log("Respuesta de AddOfertaNML:", responseData);
      callbackOk(responseData, response);
    }, callbackWrong);
  }

  /**
   * Actualiza una oferta existente
   * @param data - Datos completos de la oferta a actualizar (debe incluir codigoOferta)
   * @param callbackOk - Callback ejecutado en caso de éxito
   * @param callbackWrong - Callback ejecutado en caso de error
   */
  static async updateOferta(data: ActualizarOferta, callbackOk: (responseData: any, response: any) => void, callbackWrong: (error: any) => void) {
    const configs = ModelConfig.get();
    const url = configs.urlBase + "/Ofertas/PutOferta";
    
    console.log("Enviando PUT a:", url);
    console.log("Datos de oferta:", data);
    
    EndPoint.sendPut(url, data, (responseData:any, response:any) => {
      callbackOk(responseData, response);
    }, callbackWrong);
  }

  /**
   * Actualiza una oferta NML existente
   * @param data - Datos completos de la oferta NML a actualizar
   * @param callbackOk - Callback ejecutado en caso de éxito
   * @param callbackWrong - Callback ejecutado en caso de error
   */
  static async updateOfertaNML(data: ActualizarOfertaNML, callbackOk: (responseData: any, response: any) => void, callbackWrong: (error: any) => void) {
    const configs = ModelConfig.get();
    const url = configs.urlBase + "/Ofertas/PutOfertaNML";
    
    console.log("Enviando PUT NML a:", url);
    console.log("Datos de oferta NML:", data);
    
    EndPoint.sendPut(url, data, (responseData:any, response:any) => {
      callbackOk(responseData, response);
    }, callbackWrong);
  }

  /**
   * Crea o actualiza una oferta (método legacy - se recomienda usar addOferta o updateOferta)
   * @param data - Datos de la oferta a crear/actualizar
   * @param callbackOk - Callback ejecutado en caso de éxito
   * @param callbackWrong - Callback ejecutado en caso de error
   */
  static async saveOferta(data: Oferta, callbackOk: (responseData: any, response: any) => void, callbackWrong: (error: any) => void) {
    const configs = ModelConfig.get();
    const url = configs.urlBase + "/Ofertas/SaveOferta";
    
    EndPoint.sendPost(url, data, (responseData:any, response:any) => {
      callbackOk(responseData, response);
    }, callbackWrong);
  }

  /**
   * Elimina una oferta (baja lógica)
   * @param codigoOferta - Código de la oferta a eliminar
   * @param callbackOk - Callback ejecutado en caso de éxito
   * @param callbackWrong - Callback ejecutado en caso de error
   */
  static async deleteOferta(codigoOferta: number, callbackOk: (responseData: any, response: any) => void, callbackWrong: (error: any) => void) {
    const configs = ModelConfig.get();
    const url = configs.urlBase + "/Ofertas/DeleteOferta?CodigoOferta=" + codigoOferta;
    
    EndPoint.sendDelete(url, {}, (responseData:any, response:any) => {
      callbackOk(responseData, response);
    }, callbackWrong);
  }

  /**
   * Obtiene ofertas activas (bajaLogica = false)
   * @param callbackOk - Callback ejecutado en caso de éxito
   * @param callbackWrong - Callback ejecutado en caso de error
   */
  static async getOfertasActivas(callbackOk: (ofertas: Oferta[], response: any) => void, callbackWrong: (error: any) => void) {
    this.getOfertas((ofertas, response:any) => {
      const ofertasActivas = ofertas.filter(oferta => !oferta.bajaLogica);
      callbackOk(ofertasActivas, response);
    }, callbackWrong);
  }

  /**
   * Obtiene todas las familias disponibles
   * @param callbackOk - Callback ejecutado en caso de éxito
   * @param callbackWrong - Callback ejecutado en caso de error
   */
  static async getFamilias(callbackOk: (familias: Familia[], response: any) => void, callbackWrong: (error: any) => void) {
    const configs = ModelConfig.get();
    // Nota: Ajusta esta URL según tu endpoint real para obtener familias
    const url = configs.urlBase + "/Familias/GetFamilias";
    
    console.log("Obteniendo familias desde:", url);
    
    EndPoint.sendGet(url, (responseData: FamiliasResponse, response:any) => {
      console.log("Familias obtenidas:", responseData);
      callbackOk(responseData.familias, response);
    }, callbackWrong);
  }

  /**
   * Obtiene subfamilias por familia
   * @param familiaId - ID de la familia
   * @param callbackOk - Callback ejecutado en caso de éxito
   * @param callbackWrong - Callback ejecutado en caso de error
   */
  static async getSubfamilias(familiaId: number, callbackOk: (subfamilias: Subfamilia[], response: any) => void, callbackWrong: (error: any) => void) {
    const configs = ModelConfig.get();
    // Nota: Ajusta esta URL según tu endpoint real para obtener subfamilias
    const url = `${configs.urlBase}/Subfamilias/GetSubfamiliasByFamilia?familiaId=${familiaId}`;
    
    console.log("Obteniendo subfamilias desde:", url);
    
    EndPoint.sendGet(url, (responseData: SubfamiliasResponse, response:any) => {
      console.log("Subfamilias obtenidas:", responseData);
      callbackOk(responseData.subfamilias, response);
    }, callbackWrong);
  }

  /**
   * Obtiene ofertas por familia/subfamilia
   * @param familiaId - ID de la familia (opcional)
   * @param subfamiliaId - ID de la subfamilia (opcional)
   * @param callbackOk - Callback ejecutado en caso de éxito
   * @param callbackWrong - Callback ejecutado en caso de error
   */
  static async getOfertasByNML(familiaId?: number, subfamiliaId?: number, callbackOk?: (ofertas: Oferta[], response: any) => void, callbackWrong?: (error: any) => void) {
    const configs = ModelConfig.get();
    let url = configs.urlBase + "/Ofertas/GetOfertasByNML";
    
    const params = [];
    if (familiaId) params.push(`familiaId=${familiaId}`);
    if (subfamiliaId) params.push(`subfamiliaId=${subfamiliaId}`);
    
    if (params.length > 0) {
      url += "?" + params.join("&");
    }
    
    console.log("Obteniendo ofertas NML desde:", url);
    
    EndPoint.sendGet(url, (responseData: OfertasResponse, response:any) => {
      console.log("Ofertas NML obtenidas:", responseData);
      if (callbackOk) callbackOk(responseData.ofertas, response);
    }, callbackWrong || (() => {}));
  }
}

export default Ofertas;