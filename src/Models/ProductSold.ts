import StorageSesion from '../Helpers/StorageSesion.ts';
import Product from './Product.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import System from '../Helpers/System.ts';


class ProductSold extends Product{
    quantity: number;
    total: number;
    idProducto: number;
    description: string | null;
    price: number;

    pesable: undefined | boolean;
    tipoVenta: undefined | number;
    precioCosto: string | null | undefined;
    ownerEnvaseId: string | number | null | undefined;
    hasEnvase: boolean | undefined;
    isEnvase: boolean | undefined;


    static instance: ProductSold | null = null;
    static getInstance():ProductSold{
        if(ProductSold.instance == null){
            ProductSold.instance = new ProductSold();
        }

        return ProductSold.instance;
    }

    esPesable(product:any | null = null){
        if(!product) product = this
        if(product.pesable != undefined)
            return product.pesable

        if(product.tipoVenta != undefined)
            return product.tipoVenta == 2

        if(product.cantidad != undefined)
            return parseInt(product.cantidad) != parseFloat(product.cantidad)
        
        return false
    }

    getSubTotal(){
        return Math.round(this.quantity * this.price);
    }

    //price = 0 -> original price
    addQuantity(quantity = 1, price = 0){
        this.quantity = System.getInstance().typeIntFloat(this.quantity)
        quantity = System.getInstance().typeIntFloat(quantity)

        this.quantity += quantity;
        if(price != 0) this.price = price;
        this.total = this.getSubTotal();
        return this;
    }

    changeQuantity(quantity){
        this.quantity = quantity;
        this.updateSubtotal();
    }

    updateSubtotal(){
        return this.total = this.getSubTotal()
    }

    static tieneEnvases(producto){
        // console.log("tiene envases?")
        // console.log(producto)
        return(
            (
            //caso cuando viene del back
            Array.isArray(producto.envase) 
            && producto.envase.length>0 
            && producto.envase[0].costo>0
            && producto.envase[0].descripcion!=""
            )

            ||
            
            //caso cuando ya esta en el listado
            (
                producto.hasEnvase
            )



        )
    }

    static getOwnerByEnvase(envase, otherProducts){
        var owner:any = null
        otherProducts.forEach((pro)=>{
            if(pro.idProducto == envase.ownerEnvaseId){
                owner = pro
            }
        })
        return owner
    }

    static esEnvase(productData){
        return (productData.ownerEnvaseId!= undefined || productData.isEnvase)
    }

    static getEnvaseByOwner(owner, otherProducts){
        var envase:any = null
        otherProducts.forEach((pro)=>{
            if(owner.idProducto == pro.ownerEnvaseId){
                envase = pro
            }
        })
        return envase
    }
    

};

export default ProductSold;