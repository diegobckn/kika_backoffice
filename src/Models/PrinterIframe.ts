import BaseConfig from "../definitions/BaseConfig.ts";
import ModelConfig from './ModelConfig.ts';
import System from '../Helpers/System.ts';
import PagoBoleta from './PagoBoleta.ts';

class PrinterIframe {
    static arrPrints: any = []

    static instance: PrinterIframe | null = null;
    static vaPrint = -1

    static afterPrintFunction = () => { }
    // static preguntaFuncion = (txt: string, callyes: any, callno: any) => { }

    static getInstance(): PrinterIframe {
        if (PrinterIframe.instance == null) {
            PrinterIframe.instance = new PrinterIframe();
        }

        return PrinterIframe.instance;
    }

    static printNext() {

        if (this.vaPrint >= (this.arrPrints.length - 1)) {
            this.vaPrint = -1
            this.arrPrints = []
            this.afterPrintFunction()
            return
        }

        this.vaPrint++

        var imprimirTxt = this.arrPrints[this.vaPrint]
        if (imprimirTxt.trim() == "") return


        imprimirTxt = imprimirTxt.replace("80mm auto", "80mm")
        imprimirTxt = imprimirTxt.replace("size: 80mm", "size: 80mm auto")


        var ss: any = document.querySelector("#ifm");
        if (ss) {
            ss.style.display = "block"
            ss.srcdoc = imprimirTxt
        }

        ss.style.display = "none"
        ss.onload = function () {
            try {
                ss.contentWindow.print();

                if (ss.contentWindow.matchMedia) {
                    const mediaQueryList = ss.contentWindow.matchMedia('print');
                    mediaQueryList.addListener(function (mql: any) {
                        if (!mql.matches) {
                            PrinterIframe.printNext()
                        }
                    });
                }

            } catch (error) {
                console.error("Printing failed. Ensure content is from the same origin.", error);
            }
        };
    }

    static printArr(arrText: any) {
        this.arrPrints = arrText
        this.vaPrint = -1
        this.printNext()
    }

};

export default PrinterIframe;