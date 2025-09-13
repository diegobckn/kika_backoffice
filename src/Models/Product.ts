import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import System from '../Helpers/System.ts';
import EndPoint from './EndPoint.ts';
import dayjs from 'dayjs';


class Product extends Model {
    idProducto: number;
    description: string | null;
    price: number;
    precioCosto: string | null | undefined;


    static instance: Product | null = null;
    static getInstance(): Product {
        if (Product.instance == null) {
            Product.instance = new Product();
        }

        return Product.instance;
    }

    static calcularImpuestos(producto) {
        var impIva = producto.impuesto.toLowerCase()

        impIva = impIva.replace("iva", "")
        impIva = impIva.replace("%", "")
        impIva = impIva.trim()
        impIva = parseInt(impIva)

        return impIva
    }

    static iniciarLogicaPrecios(product) {
        const margenConfig = ModelConfig.get("porcentajeMargen")

        if (!product.gananciaPorcentaje) {
            if (product.precioNeto > 0 && product.precioCosto > 0) {
                product.gananciaPorcentaje = this.getGanPorByCostoYNeto(product.precioCosto, product.precioNeto)
            } else {
                product.gananciaPorcentaje = margenConfig
            }
        }

        if (!product.ivaPorcentaje) {
            product.ivaPorcentaje = 19
        }

        if (!product.precioNeto && product.precioCosto > 0) {
            product.precioNeto = Product.getNetoByCostoGanPor(product.precioCosto, product.gananciaPorcentaje)
        }

        if (!product.gananciaValor && product.precioNeto > 0 && product.precioCosto > 0) {
            product.gananciaValor = product.precioNeto - product.precioCosto
        }

        if (!product.ivaValor && product.precioNeto > 0 && product.precioVenta > 0) {
            product.ivaValor = product.precioVenta - product.precioNeto
        }

        if (!product.precioCosto && !product.precioVenta) {
            product.ivaValor = 0
            product.gananciaValor = 0
        }

        return product
    }

    //direccion indica si se calcula para el lado del costo o del precio final
    static logicaPrecios(product, direccion = "final") {
        // console.log("logicaPrecios " + direccion + " para ")
        // console.log("entra con:",System.clone(product))
        const margenConfig = ModelConfig.get("porcentajeMargen")

        if (!product.gananciaPorcentaje) product.gananciaPorcentaje = margenConfig
        if (product.ivaPorcentaje) product.ivaPorcentaje = ModelConfig.get().iva
        // if(product.precioVenta <= 0 && product.precioCosto > 0){
        if (direccion == 'final') {
            const sumGan = (product.precioCosto) * ((product.gananciaPorcentaje) / 100)
            const neto = parseFloat(product.precioCosto) + sumGan
            const sumIva = (neto) * ((product.ivaPorcentaje) / 100)
            const final = ((neto + sumIva))

            product.precioVenta = this.redondeo_precioVenta(final)
            product.precioNeto = this.redondeo_precioNeto(neto)
            product.gananciaValor = this.redondeo_gananciaValor(sumGan)
            product.ivaValor = this.redondeo_ivaValor(sumIva)
        } else if (direccion == "costo") {
            const neto = parseFloat(product.precioVenta) /
                (1 + (parseInt(product.ivaPorcentaje) / 100))
            const costo = neto / (1 + parseInt(product.gananciaPorcentaje) / 100)
            var sumGan = neto - costo
            var sumIva = product.precioVenta - neto

            product.precioCosto = this.redondeo_precioCosto(costo)
            product.precioNeto = this.redondeo_precioNeto(neto)
            product.gananciaValor = this.redondeo_gananciaValor(sumGan)
            product.ivaValor = this.redondeo_ivaValor(sumIva)
        }
        // console.log("sale con:",System.clone(product))
        return product
    }

    static calcularMargen(product) {
        const neto = parseFloat(product.precioVenta) / (1 + (parseInt(product.ivaPorcentaje) / 100))
        const sumGan = neto - product.precioCosto
        const porMar = ((neto - product.precioCosto) * 100) / product.precioCosto

        var sumIva = product.precioVenta - neto
        product.ivaValor = this.redondeo_ivaValor(sumIva)
        product.gananciaPorcentaje = this.redondeo_gananciaPorcentaje(porMar)
        product.precioNeto = this.redondeo_precioNeto(neto)
        product.gananciaValor = this.redondeo_gananciaValor(sumGan)

        return product
    }

    static getNetoByCostoGanPor(costo, gananciaPorcentaje) {
        const sumGan = (costo) * ((gananciaPorcentaje) / 100)
        return this.redondeo_precioNeto(parseFloat(costo) + sumGan)
    }

    static getGanPorByCostoYNeto(costo, neto) {
        return this.redondeo_gananciaPorcentaje(((neto - costo) * 100) / costo)
    }

    // REDONDEOS
    static redondeo_precioCosto(precio) {
        return parseInt(parseFloat(precio).toFixed(0))
    }

    static redondeo_gananciaPorcentaje(precio) {
        return parseInt(parseFloat(precio).toFixed(0))
    }

    static redondeo_gananciaValor(precio) {
        return parseInt(parseFloat(precio).toFixed(0))
    }

    static redondeo_ivaPorcentaje(precio) {
        return parseInt(parseFloat(precio).toFixed(0))
    }

    static redondeo_ivaValor(precio) {
        return parseInt(parseFloat(precio).toFixed(0))
    }

    static redondeo_precioNeto(precio) {
        return parseInt(parseFloat(precio).toFixed(0))
    }

    static redondeo_precioVenta(precio) {
        return parseInt(parseFloat(precio).toFixed(0))
    }


    // SERVICIOS

    async getAll(callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase + "/ProductosTmp/GetProductos"
            url = url.replace("/api", "/api")

            const response = await axios.get(url);
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ) {
                callbackOk(response.data.productos, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            callbackWrong(error)
        }
    }

    async getAllPaginate({
        pageNumber = 1,
        rowPage = 10
    }, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase + "/ProductosTmp/GetProductosPaginados"
            url += "?pageNumber=" + pageNumber
            url += "&rowPage=" + rowPage

            const response = await axios.get(url);
            // console.log("API Response:", response.data);

            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ) {
                callbackOk(response.data.productos, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }

        } catch (error) {
            console.error("Error fetching products:", error);
            callbackWrong(error)
        }
    }

    static async getStockValorizadoPaginado(data: {
        fechadesde: string,
        fechahasta: string,
        tipo: number,

        pageNumber: number,
        rowPage: number,
    }, callbackOk, callbackWrong) {


        // &precio=PrecioVenta&pageNumber=1&rowPage=10


        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/ProductosTmp/GetProductosStockValorizadoPaginados?"//cambiar
            + "fechadesde=" + data.fechadesde
            + "&fechahasta=" + data.fechahasta
            + "&precio=" + data.tipo

            + "&pageNumber=" + data.pageNumber
            + "&rowPage=" + data.rowPage

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong)
    }

    async getCriticosPaginate({
        pageNumber = 1,
        rowPage = 10
    }, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase + "/ProductosTmp/GetProductosStockCriticoPaginados"
            url += "?pageNumber=" + pageNumber
            url += "&rowPage=" + rowPage

            const response = await axios.get(url);
            // console.log("API Response:", response.data);

            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ) {
                callbackOk(response.data.productos, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }

        } catch (error) {
            console.error("Error fetching products:", error);
            callbackWrong(error)
        }
    }

    async findByDescription({ description, codigoCliente }, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase +
                "/ProductosTmp/GetProductosByDescripcion?descripcion=" + (description + "")
            if (codigoCliente) {
                url += "&codigoCliente=" + codigoCliente
            }
            const response = await axios.get(url);
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ) {
                callbackOk(response.data.productos, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            callbackWrong(error)
        }
    }

    async findByDescriptionPaginado({
        description,
        codigoCliente,
        canPorPagina = 10,
        pagina = 1
    }, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase +
                "/ProductosTmp/GetProductosByDescripcionPaginado?descripcion=" + (description + "")
            if (codigoCliente) {
                url += "&codigoCliente=" + codigoCliente
            }
            url += "&pageNumber=" + pagina
            url += "&rowPage=" + canPorPagina
            const response = await axios.get(url);
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ) {
                callbackOk(response.data.productos, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            callbackWrong(error)
        }
    }

    async findByCodigo({ codigoProducto, codigoCliente }, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase +
                "/ProductosTmp/GetProductosByCodigo?idproducto=" + codigoProducto
            if (codigoCliente) {
                url += "&codigoCliente=" + codigoCliente
            }
            const response = await axios.get(url);
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ) {
                callbackOk(response.data.productos, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            callbackWrong(error)
        }
    }

    async findByCodigoBarras({ codigoProducto, codigoCliente }, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase +
                "/ProductosTmp/GetProductosByCodigoBarra?codbarra=" + codigoProducto
            if (codigoCliente) {
                url += "&codigoCliente=" + codigoCliente
            }
            const response = await axios.get(url);
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ) {
                callbackOk(response.data.productos, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            callbackWrong(error)
        }
    }

    async update(data, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase +
                "/ProductosTmp/UpdateProducto"

            const response = await axios.put(url, data);
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ) {
                callbackOk(response.data, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.log(error)
            if (error.response && error.response.data && error.response.data.descripcion) {
                callbackWrong(error.response.data.descripcion);
            } else if (error.response && error.response.status === 500) {
                callbackWrong(
                    "Error interno del servidor. Por favor, inténtalo de nuevo más tarde."
                );
            } else if (error.message != "") {
                callbackWrong(error.message)
            } else {
                callbackWrong(
                    "Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde."
                );
            }
        }
    }

    async updatePrecios(data, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase +
                "/ProductosTmp/UpdateProductoPrecio"
            data.codigoSucursal = 0;
            data.puntoVenta = ""
            data.codbarra = data.idProducto
            data.fechaIngreso = System.getInstance().getDateForServer()

            const response = await axios.put(url, data);
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ) {
                callbackOk(response.data, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.log(error)
            if (error.response && error.response.data && error.response.data.descripcion) {
                callbackWrong(error.response.data.descripcion);
            } else if (error.response && error.response.status === 500) {
                callbackWrong(
                    "Error interno del servidor. Por favor, inténtalo de nuevo más tarde."
                );
            } else if (error.message != "") {
                callbackWrong(error.message)
            } else {
                callbackWrong(
                    "Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde."
                );
            }
        }
    }


    async getCategories(callbackOk, callbackWrong) {
        try {

            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/NivelMercadoLogicos/GetAllCategorias"

            const response = await axios.get(
                url
            );

            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ) {
                callbackOk(response.data.categorias, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.log(error);
            callbackWrong(error)
        }
    }


    async getSubCategories(categoriaId, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=" + categoriaId

            const response = await axios.get(
                url
            );

            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ) {
                callbackOk(response.data.subCategorias, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }




    async getFamiliaBySubCat({
        categoryId,
        subcategoryId
    }, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?" +
                "CategoriaID=" + categoryId +
                "&SubCategoriaID=" + subcategoryId
            const response = await axios.get(
                url
            );
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ) {
                callbackOk(response.data.familias, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }

    async getSubFamilia({
        categoryId,
        subcategoryId,
        familyId
    }, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?" +
                "CategoriaID=" + categoryId +
                "&SubCategoriaID=" + subcategoryId +
                "&FamiliaID=" + familyId

            const response = await axios.get(
                url
            );
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ) {
                callbackOk(response.data.subFamilias, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }


    async getProductsNML({
        catId,
        subcatId,
        famId,
        subFamId
    }, callbackOk, callbackWrong) {

        if (!catId) catId = 1
        if (!subcatId) subcatId = 1

        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/ProductosTmp/GetProductosByIdNML?idcategoria=" + catId
                + "&idsubcategoria=" + subcatId
                + "&idfamilia=" + famId
                + "&idsubfamilia=" + subFamId

            const response = await axios.get(
                url
            );
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ) {
                callbackOk(response.data.productos, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }


    async getProductsFastSearch(callbackOk, callbackWrong) {

        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/ProductosTmp/ProductosVentaRapidaGet"

            const response = await axios.get(
                url
            );
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ) {
                callbackOk(response.data.productosVentaRapidas, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }

    async addProductFastSearch(product, callbackOk, callbackWrong) {

        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/ProductosTmp/ProductosVentaRapidaPost"

            const response = await axios.post(
                url
                , product
            );
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ) {
                callbackOk(response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }

    async changeProductFastSearch(product, callbackOk, callbackWrong) {

        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/ProductosTmp/ProductosVentaRapidaPut"

            const response = await axios.put(
                url
                , product
            );
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ) {
                callbackOk(response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }

    async assignPrice(product, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/ProductosTmp/UpdateProductoPrecio"

            const response = await axios.put(
                url
                , product);
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ) {
                callbackOk(response.data);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }

    async newProductFromCode(product, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/ProductosTmp/AddProductoNoEncontrado"

            const response = await axios.post(
                url
                , product);
            console.log(response)
            console.log(response.data)
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ) {
                callbackOk(response.data);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.error("Error fetching:");
            console.error(error);
            callbackWrong(error);
        }
    }

    async getTipos(callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/ProductosTmp/GetProductoTipos"

            const response = await axios.get(
                url
            );
            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201
            ) {
                callbackOk(response.data.productoTipos);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
        } catch (error) {
            console.error("Error fetching:", error);
            callbackWrong(error);
        }
    }

    static async addFull(data, callbackOk, callbackWrong) {

        var url = ModelConfig.get("urlBase")
            + "/ProductosTmp/AddProducto"

        // if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        // if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendPost(url, data, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong)

    }


    static async addCategory(data: { descripcionCategoria }, callbackOk, callbackWrong) {
        var url = ModelConfig.get("urlBase")
            + "/NivelMercadoLogicos/AddCategoria"

        // if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        // if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")


        EndPoint.sendPost(url, data, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong)

    }


    static async editCategory(data: { idCategoria, descripcionCategoria }, callbackOk, callbackWrong) {
        var url = ModelConfig.get("urlBase")
            + "/NivelMercadoLogicos/UpdateCategoria"

        // if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        // if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")


        EndPoint.sendPut(url, data, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong)

    }


    static async deleteCategory(data: {
        Categoriaid
    }, callbackOk, callbackWrong) {
        var url = ModelConfig.get("urlBase")
            + "/NivelMercadoLogicos/DeleteCategoria"

        // if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        // if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")


        EndPoint.sendDelete(url, data, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong, true)
    }

    static async deleteSubCategory(data: {
        categoriaid,
        subcategoriaid
    }, callbackOk, callbackWrong) {
        var url = ModelConfig.get("urlBase")
            + "/NivelMercadoLogicos/DeleteSubCategoria"

        // if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        // if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")


        EndPoint.sendDelete(url, data, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong, true)
    }

    static async deleteFamiliy(data: {
        categoriaid,
        subcategoriaid,
        familiaid
    }, callbackOk, callbackWrong) {
        var url = ModelConfig.get("urlBase")
            + "/NivelMercadoLogicos/DeleteFamilia"

        // if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        // if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")


        EndPoint.sendDelete(url, data, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong, true)
    }

    static async deleteSubFamily(data: {
        categoriaid,
        subcategoriaid,
        familiaid,
        subfamiliaid,
    }, callbackOk, callbackWrong) {
        var url = ModelConfig.get("urlBase")
            + "/NivelMercadoLogicos/DeleteSubFamilia"

        // if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        // if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")


        EndPoint.sendDelete(url, data, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong, true)
    }


    static async addSubCategory(data: { idCategoria, descripcionSubCategoria }, callbackOk, callbackWrong) {
        var url = ModelConfig.get("urlBase")
            + "/NivelMercadoLogicos/AddSubCategoria"

        // if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        // if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")


        EndPoint.sendPost(url, data, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong)

    }

    static async editSubCategory(data: {
        idCategoria,
        idSubCategoria,
        descripcionSubCategoria
    },
        callbackOk, callbackWrong) {
        var url = ModelConfig.get("urlBase")
            + "/NivelMercadoLogicos/UpdateSubCategoria"

        // if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        // if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendPut(url, data, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong)
    }


    static async addFamily(data: { idCategoria, idSubcategoria, descripcionFamilia }, callbackOk, callbackWrong) {
        var url = ModelConfig.get("urlBase")
            + "/NivelMercadoLogicos/AddFamilia"

        // if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        // if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendPost(url, data, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong)

    }

    static async editFamily(data: {
        idCategoria,
        idSubcategoria,
        descripcionFamilia,
        idFamilia,
    },
        callbackOk, callbackWrong) {
        var url = ModelConfig.get("urlBase")
            + "/NivelMercadoLogicos/UpdateFamilia"

        // if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        // if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendPut(url, data, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong)
    }


    static async addSubFamily(data: {
        idCategoria,
        idSubcategoria,
        idFamilia,
        descripcionSubFamilia
    }, callbackOk, callbackWrong) {
        var url = ModelConfig.get("urlBase")
            + "/NivelMercadoLogicos/AddSubFamilia"

        // if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        // if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendPost(url, data, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong)

    }

    static async editSubFamily(data: {
        idCategoria,
        idSubcategoria,
        idFamilia,
        idSubFamilia,
        descripcionSubFamilia,
    },
        callbackOk, callbackWrong) {
        var url = ModelConfig.get("urlBase")
            + "/NivelMercadoLogicos/UpdateSubFamilia"

        // if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        // if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendPut(url, data, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong)
    }


};



export default Product;