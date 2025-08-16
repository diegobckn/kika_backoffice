import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import Product from './Product.ts';
import Singleton from './Singleton.ts';
import ProductSold from './ProductSold.ts';
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';


class Sales{
    products: ProductSold[] = []
    sesionProducts: StorageSesion;

    constructor(){
      this.sesionProducts = new StorageSesion("salesproducts");
    }

    loadFromSesion(){
      if(!this.sesionProducts.hasOne()) return [];
      this.products = [];
      var prodsSession = this.sesionProducts.cargarGuardados()[0];
      for (let index = 0; index < prodsSession.length; index++) {
        const prodSold = new ProductSold();
        prodSold.fill(prodsSession[index]);
        this.products[index] = prodSold
      }
      return(this.products);
    }

  findKeyInProducts(productId: number): number{
      return this.products.findIndex(
          (productSold:ProductSold) => productSold.idProducto === productId
      );
  }

  findKeyAndPriceInProducts(productId: number, price): number{
    return this.products.findIndex(
        (productSold:ProductSold) => (
          productSold.idProducto === productId
          && productSold.price === price
        )
    );
  }

  findKeyAndPriceAndNameInProducts(productId: number, price,name): number{
      return this.products.findIndex(
          (productSold:ProductSold) => (
            productSold.idProducto === productId
            && productSold.price === price
            && productSold.description === name
          )
      );
  }

    getTotal(){
        var allTotal = 0;
        this.products.forEach(function(product:ProductSold) {
          allTotal = allTotal + product.getSubTotal();
        })
        return allTotal;
    }

    incrementQuantityByIndex(index, quantity = 1,newPrice = 0){
      const updatedSalesData = [...this.products];
        updatedSalesData[index] = 
        updatedSalesData[index].addQuantity(quantity,newPrice);
        this.products = updatedSalesData;
        return(updatedSalesData);
    }

    decrementQuantityByIndex(index){
      console.log("decrementQuantityByIndex")
      console.log("revisar quantity de envases?")
        const updatedSalesData = [...this.products];
        updatedSalesData[index] = 
        updatedSalesData[index].addQuantity(-1);

        if(updatedSalesData[index].quantity < 1){
            updatedSalesData.splice(index,1);
        }
        return(updatedSalesData);
    }

    checkQuantityEnvase(index){
      var productoCambiando = this.products[index];
        if(productoCambiando.hasEnvase != undefined){
          // console.log("tiene un envase")
          const ownerEnvaseId = productoCambiando.idProducto//producto con envase
          for (let index = 0; index < this.products.length; index++) {
            const posibleEnvase = this.products[index];
            if(ownerEnvaseId == posibleEnvase.ownerEnvaseId){//encontro su envase
              posibleEnvase.quantity = productoCambiando.quantity
              posibleEnvase.updateSubtotal()
            }
          }
        }
    }

    changeQuantityByIndex(index, quantity, removeIfQuantityIs0 = false){
        this.products[index].quantity = quantity;
        this.products[index].updateSubtotal();

        this.checkQuantityEnvase(index)

        if(removeIfQuantityIs0 && this.products[index].quantity <= 0){
          console.log("eliminando")
            this.products.splice(index,1);
        }
        this.sesionProducts.guardar(this.products)
        return(this.products);
    }



    addProduct(product, quantity:number | null = null){
      const newPrice = product.precioVenta || 0;
      if(quantity == null && product.cantidad>0) quantity = product.cantidad
      if(quantity == null) quantity = 1

      if(product.idProducto == 0) {
        //si es un envasa y viene de preventa, lo recupero de acuerdo al producto agregado anteriormente
        const anterior = this.products[this.products.length-1]
        const envase = new ProductSold()
        envase.idProducto = 0
        envase.description = product.descripcion
        envase.quantity = quantity
        envase.pesable = false
        envase.tipoVenta = 1
        envase.ownerEnvaseId = anterior.idProducto
        envase.price = product.precioUnidad
        envase.precioCosto = product.costo
        envase.updateSubtotal()
        this.products = [...this.products, envase]

        anterior.hasEnvase = true
        envase.isEnvase = true

        this.sesionProducts.guardar(this.products)
        return this.products;
      }

        const existingProductIndex = this.findKeyAndPriceAndNameInProducts(product.idProducto,product.precioVenta, product.nombre)
        if (
          !ProductSold.getInstance().esPesable(product)
          && existingProductIndex !== -1
        ) {
          this.products = this.incrementQuantityByIndex(existingProductIndex,quantity, newPrice);
          this.checkQuantityEnvase(existingProductIndex)
        } else {
            const newProductSold = new ProductSold()
            newProductSold.idProducto = product.idProducto
            newProductSold.description = product.nombre
            newProductSold.quantity = quantity
            newProductSold.pesable = (product.tipoVenta == 2)
            newProductSold.tipoVenta = product.tipoVenta
            newProductSold.price = newPrice
            newProductSold.precioCosto = product.precioCosto
            newProductSold.updateSubtotal()
            this.products = [...this.products, newProductSold]


            //si viene con envases desde back agrego como un producto especial
            if(ProductSold.tieneEnvases(product)){
              const envase = new ProductSold()
              envase.idProducto = 0
              envase.description = product.envase[0].descripcion
              envase.quantity = quantity
              envase.pesable = false
              envase.tipoVenta = 1
              envase.ownerEnvaseId = product.idProducto
              envase.price = product.envase[0].costo
              envase.precioCosto = product.envase[0].costo
              envase.updateSubtotal()
              this.products = [...this.products, envase]

              const lastProductIndex = this.findKeyAndPriceAndNameInProducts(product.idProducto,product.precioVenta, product.nombre)
              const lastProduct = this.products[lastProductIndex]

              lastProduct.hasEnvase = true
              envase.isEnvase = true
            }
          }
          this.sesionProducts.guardar(this.products)
          return this.products;
      }

      removeFromIndex(index){
        const productoAEliminar = this.products[index];
        if(ProductSold.tieneEnvases(productoAEliminar)){
          this.products = this.products.filter((pro_, i) => {
            return pro_.ownerEnvaseId !== productoAEliminar.idProducto
          })
        }
        this.products = this.products.filter((_, i) => i !== index)
        this.sesionProducts.guardar(this.products)
        return this.products
      }
};


export default Sales;