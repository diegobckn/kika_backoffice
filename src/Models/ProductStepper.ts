import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';


class ProductStepper extends Model{
    
    static instance: ProductStepper | null = null;
    static getInstance():ProductStepper{
        if(ProductStepper.instance == null){
            ProductStepper.instance = new ProductStepper();
        }

        return ProductStepper.instance;
    }

};



export default ProductStepper;