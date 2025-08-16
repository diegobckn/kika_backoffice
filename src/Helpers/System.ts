import { Height } from "@mui/icons-material";
import CONSTANTS from "../definitions/Constants";
import dayjs from "dayjs";


class System {
    static instance: System | null = null;

    getAppName() {
        return CONSTANTS.appName + " " + CONSTANTS.appVersion
    }

    static getInstance(): System {
        if (System.instance == null) {
            System.instance = new System();
        }

        return System.instance;
    }

    getWindowWidth() {
        return window.innerWidth;
    }

    getWindowHeight() {
        return window.innerHeight;
    }

    static isXs() {
        return System.getInstance().getWindowWidth() <= 768
    }

    static isSm() {
        return System.getInstance().getWindowWidth() <= 899
    }

    static isXsOrSm() {
        return this.isXs() || this.isSm()
    }

    getCenterStyle(widthPercent = 80, heightPercent = 80) {
        return {
            width: (widthPercent * (System.getInstance().getWindowWidth()) / 100) + "px",
            height: (heightPercent * (System.getInstance().getWindowHeight()) / 100) + "px",
            overflow: "auto"
        };
    }

    getMiddleHeigth() {
        return this.getWindowHeight() - 200 - 76
    }

    fechaYMD() {
        const fecha = new Date();
        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, "0");
        const day = fecha.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    bancosChile() {
        return [
            { id: 1, nombre: "Banco de Chile" },
            { id: 2, nombre: "Banco Santander Chile" },
            { id: 3, nombre: "Banco Estado" },
            { id: 4, nombre: "Scotiabank Chile" },
            { id: 5, nombre: "Banco BCI" },
            { id: 6, nombre: "Banco Itaú Chile" },
            { id: 7, nombre: "Banco Security" },
            { id: 8, nombre: "Banco Falabella" },
            { id: 9, nombre: "Banco Ripley" },
            { id: 10, nombre: "Banco Consorcio" },
            { id: 11, nombre: "Banco Internacional" },
            { id: 12, nombre: "Banco Edwards Citi" },
            { id: 13, nombre: "Banco de Crédito e Inversiones" },
            { id: 14, nombre: "Banco Paris" },
            { id: 15, nombre: "Banco Corpbanca" },
            { id: 16, nombre: "Banco BICE" },
            // Agrega más bancos según sea necesario
        ]
    }

    tiposDeCuenta() {
        return {
            "Cuenta Corriente": "Cuenta Corriente",
            "Cuenta de Ahorro": "Cuenta de Ahorro",
            "Cuenta Vista": "Cuenta Vista",
            "Cuenta Rut": "Cuenta Rut",
            "Cuenta de Depósito a Plazo (CDP)": "Cuenta de Depósito a Plazo (CDP)",
            "Cuenta de Inversión": "Cuenta de Inversión",
        }
    }

    //fechaactual con formato: 2024-05-12T02:06:22.000Z
    getDateForServer() {
        return (dayjs().format('YYYY-MM-DD HH:mm:ss') + ".000Z").replace(" ", "T")
    }

    en2Decimales(valor) {
        return Math.round(parseFloat(valor) * 100) / 100
    }

    typeIntFloat(value) {
        if ((value + "").indexOf(".") > -1) {
            return parseFloat(value + "")
        } else {
            return parseInt(value + "")
        }
    }

    static clone(obj) {
        return JSON.parse(JSON.stringify(obj))
    }

    static getUrlVars() {
        var allStr = window.location.href
        if (allStr.indexOf("?") == -1) {
            return {}
        }
        var [location, allLast] = allStr.split("?")
        var vars = {}
        allLast.split("&").forEach((nameValue) => {
            const [name, value] = nameValue.split("=")
            vars[name] = value
        })
        return vars
    }

    static addInObj(setFunction, fieldName, fieldValue) {
        setFunction((oldProduct) => {
            const newProduct = { ...oldProduct };
            newProduct[fieldName] = fieldValue
            return newProduct;
        });
    }

    static addAllInObj(setFunction, objValues) {
        setFunction((oldProduct) => {
            const newProduct = { ...oldProduct, ...objValues };
            return newProduct;
        });
    }

    static addAllInArr(setFunction, arrayOriginal, index, objValues) {
        const newArr = [...arrayOriginal]
        newArr[index] = objValues
        setFunction(newArr)
    }

    static allValidationOk = (validators, showMessageFunction) => {
        // console.log("allValidationOk:", validators)
        var allOk = true
        // const keys = Object.keys(validators)
        Object.values(validators).forEach((validation: any, ix) => {
            // console.log("validation de  " + keys[ix] + " :", validation)

            if (validation[0] && validation[0].message != "" && allOk) {
                showMessageFunction(validation[0].message)
                allOk = false
            }
        })
        return allOk
    }

    static prepareStates = (states) => {
        const statesValues = {}
        // console.log("clearStates:", states)
        const keys = Object.keys(states)
        keys.forEach((stateKey: any, ix) => {
            // console.log("state:", stateKey)
            var state = states[stateKey]
            statesValues[stateKey] = state[0]
        })
        return statesValues
    }

    static clearStates = (states) => {
        // console.log("clearStates:", states)
        const keys = Object.keys(states)
        keys.forEach((stateKey: any, ix) => {
            // console.log("state:", stateKey)
            var state = states[stateKey]
            // console.log(typeof(state[0]))
            if (typeof (state[0]) == "number") {
                state[1](0)
            } else if (typeof (state[0]) == "string") {
                state[1]("")
            } else {
                state[1](null)
            }
        })
    }

    static intentarFoco(textInfoRef) {
        // console.log("..intentarFoco",textInfoRef)
        // console.log(textInfoRef)
        if (!textInfoRef || textInfoRef.current == null) {
            // console.log("no tiene valor ref")
            setTimeout(() => {
                this.intentarFoco(textInfoRef)
            }, 300);
        } else {
            //   console.log("ya tiene no es null")
            const contInput = textInfoRef.current
            // console.log("input encontrado:")
            // console.log(contInput.querySelector("input"))
            const inp = contInput.querySelector("input")
            if (inp) {
                if (contInput.querySelector("input")) contInput.querySelector("input").focus()
            } else {
                if (textInfoRef.current) textInfoRef.current.focus()
            }
        }
    }

    static formatDateServer(dateServer) {
        const v1 = dateServer.split("T")
        const dt = v1[0]
        const hrs = v1[1]

        const [year, month, day] = dt.split("-")
        const [hr, mn] = hrs.split(":")

        return day + "/" + month + "/" + year + " " + hr + ":" + mn
    }

    static maxStr(str, max, completarConPuntos = true) {
        var txt = str
        // console.log("original largo", txt.length)

        //max = 10..str=carambolazo..11 deberia quedar asi 'carambo...'
        if (str.length > max) {
            if (completarConPuntos) {
                txt = txt.substring(0, max - 3) + "..."
            } else {
                txt = txt.substring(0, max)
            }
        }
        // console.log("devuelve cortado", txt)
        // console.log("largo cortado", txt.length)
        return txt
    }

    static camelToUnderscore(key) {
        return key.replace(/([A-Z])/g, "_$1").toLowerCase();
    }

    static onlyTime(datetime) {
        const arrAll = datetime.split(" ")
        return arrAll[1]
    }

    // ej 152000.157 ----> 152.000,15
    static formatMonedaLocal(valorMoneda, conDecimales = true) {
        if (isNaN(valorMoneda)) return "0,00"
        // console.log("formatMonedaLocal", valorMoneda)
        var monedaStr = valorMoneda + ""
        var parteEntera = monedaStr
        var parteDecimal = "00"
        if (monedaStr.indexOf(".") > -1) {
            const partes = monedaStr.split(".")
            parteEntera = partes[0]
            parteDecimal = partes[1]
        }

        if (parteDecimal.length < 2) parteDecimal += "0"
        if (parteDecimal.length > 2) {
            const x = parseFloat("0." + parteDecimal).toFixed(2)
            parteDecimal = x.split(".")[1]
        }

        if (parteEntera.length > 3) {
            // console.log("parteEntera.length>3")
            var parteEntera2 = ""
            for (let index = parteEntera.length; index > 0; index--) {
                const current = parteEntera.length - index + 1
                // console.log("current", current)
                const digitoEntero = parteEntera[index - 1];
                parteEntera2 = digitoEntero + parteEntera2
                // console.log("digitoEntero", digitoEntero)
                // console.log("index", index)
                if ((current) % 3 === 0) {
                    // console.log(index + " es divisor de 3")
                    parteEntera2 = "." + parteEntera2
                }
            }

            if (parteEntera2.substr(0, 1) === ".") {
                parteEntera2 = parteEntera2.substr(1)
            }

            parteEntera = parteEntera2
        }

        // console.log("formatMonedaLocal devuelve", parteEntera + "," + parteDecimal)
        if (conDecimales) {
            return parteEntera + "," + parteDecimal
        } else {
            return parteEntera
        }
    }


    static getPaginaActual() {
        var urlActual = window.location.href + ""
        urlActual = urlActual.replace("https", "")
        urlActual = urlActual.replace("http", "")
        urlActual = urlActual.replace("://", "")

        var pagina = ""
        if (urlActual.indexOf("/") > -1) {
            const urlArr = urlActual.split("/")
            pagina = urlArr[urlArr.length - 1]
        }

        return pagina
    }

    static armarStringDesdeArrayObjetos(arrObjetos, propiedad, separacion = ", ") {

        console.log("armarStringDesdeArrayObjetos..arrObjetos", arrObjetos)
        console.log("armarStringDesdeArrayObjetos..propiedad", propiedad)

        var resu = ""

        if (arrObjetos) {
            arrObjetos.forEach(element => {
                if (resu != "")
                    resu += separacion
                resu += element[propiedad]
            });
        }

        return resu
    }

}


export default System;