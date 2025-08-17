import { Height } from "@mui/icons-material";
import CONSTANTS from "../definitions/Constants";
import dayjs from "dayjs";


class Validator {
    static instance: Validator | null = null;

    static getInstance(): Validator {
        if (Validator.instance == null) {
            Validator.instance = new Validator();
        }

        return Validator.instance;
    }

    static getCount(sub, fullstring) {
        var count = 0;
        for (let index = 0; index < fullstring.length; index++) {
            const letra = fullstring[index];
            if (letra == sub) count++
        }
        return count;
    }

    static isNumericOAlpha(newValuex) {
        var newValue = newValuex + ""
        var rex = /^[A-Za-z0-9]+$/g
        return newValue.match(rex)
    }

    static isNumericOAlphaConEspacio(newValuex) {
        var newValue = newValuex + ""
        var rex = /^[A-Za-z 0-9]+$/g
        return newValue.match(rex)
    }

    static isNombre(newValuex) {
        var newValue = newValuex + ""

        if (!newValue) {
            // console.log("es tecla especial??")
            return true//caracter especial, ej: borrar, supr,etc
        }
        // var rex = /^[A-Za-z\s\-]+$/g
        var rex = rex = /^[A-Za-z0-9\s\-]+$/g
        return newValue.match(rex)
    }

    static isUrl(newValuex) {
        var newValue = newValuex + ""
        if (!newValue) return true//caracter especial, ej: borrar, supr,etc
        var rex = /^[A-Za-z0-9\:\/\.\s\-]+$/g
        return newValue.match(rex)
    }

    static isRutChileno = (rut) => {
        if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) {
            // Si el formato del RUT no es válido, retorna false
            return false;
        }

        // Separar el número del RUT y el dígito verificador
        const partesRut = rut.split("-");
        const digitoVerificador = partesRut[1].toUpperCase();
        const numeroRut = partesRut[0];

        // Función para calcular el dígito verificador
        const calcularDigitoVerificador = (T) => {
            let M = 0;
            let S = 1;
            for (; T; T = Math.floor(T / 10)) {
                S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
            }
            return S ? String(S - 1) : "K";
        };

        // Validar el dígito verificador
        return calcularDigitoVerificador(numeroRut) === digitoVerificador;
    }

    static isTelefono(newValuex) {
        var newValue = newValuex + ""
        if (!newValue) return true//caracter especial, ej: borrar, supr,etc
        var rex = /^[0-9]+$/g
        return newValue.match(rex)
    }

    static isPreEmail(email) {
        console.log("is pre email")
        var newValue = email + ""

        if (!newValue) return true//caracter especial, ej: borrar, supr,etc

        // Expresión regular para validar el formato de correo electrónico
        const emailPattern = /^[A-Za-z\-\@\.0-9]+$/g;
        if (Validator.getCount("@", newValue) > 1) return false
        return emailPattern.test(newValue)
    };

    static isEmail(email) {
        var newValue = email + ""
        console.log("is email")

        if (!newValue) return true//caracter especial, ej: borrar, supr,etc

        // Expresión regular para validar el formato de correo electrónico
        const emailPattern = /^[^\s@\-]+@[^\s@]+\.[^\s@]+$/;

        if (newValue.trim() == "") {
            return false;
        }
        return emailPattern.test(newValue.trim())
    };

    static isDireccion(newValuex) {
        var newValue = newValuex + ""
        if (!newValue) return true//caracter especial, ej: borrar, supr,etc
        var rex = /^[A-Za-z\s\-]+$/g
        return newValue.match(rex)
    }

    static isNumeric(newValuex, maxDigits = 10) {
        var newValue = newValuex + ""
        if (!newValue) return true//caracter especial, ej: borrar, supr,etc
        var rex = /^[0-9]+$/g
        const newValueNoMinus = newValue.replace("-", "")
        return (newValue.match(rex) || newValueNoMinus.match(rex)) && newValue.length <= maxDigits
    }

    static isRut(newValuex) {
        var newValue = newValuex + ""
        if (!newValue) return true//caracter especial, ej: borrar, supr,etc
        var canGuiones = Validator.getCount("-", newValue)
        if (canGuiones > 1) return false
        var canK = Validator.getCount("k", newValue.toLowerCase())
        if (canK > 1) return false
        if (canK == 1) {
            var pos = newValue.indexOf("k")
            if (pos < newValue.length - 1) return false
        }

        if (canGuiones == 1) {
            var pos = newValue.indexOf("-")
            if (pos < newValue.length - 2) return false
        }

        if (canGuiones == 1 || canK == 1) {
            var cmb = newValue + ""
            cmb = cmb.replace("-", "")
            cmb = cmb.replace("k", "")
            return Validator.isNumeric(cmb)
        }


        return Validator.isNumeric(newValue)
    }

    static isSearch(newValuex) {
        var newValue = newValuex + ""
        var rex = /^[A-Za-z0-9\s\-]+$/g
        return !newValue //caracter especial, ej: borrar, supr,etc
            || newValue.match(rex)
    }

    static isPhone(newValuex) {
        var newValue = newValuex + ""
        var rex = /^[0-9\-]+$/g
        return !newValue //caracter especial, ej: borrar, supr,etc
            || newValue.match(rex)
    }

    static isPassword(newValuex) {
        var newValue = newValuex + ""
        var rex = /^[A-Za-z0-9\-\s\#\-!\%\&\*\$\^\|]+$/g
        return !newValue //caracter especial, ej: borrar, supr,etc
            || newValue.match(rex)
    }


    static isDecimal(newValuex) {
        var newValue = newValuex + ""
        if (newValue.indexOf("e") >= 0) return false
        if (newValue.indexOf("-") >= 0) return false
        if (newValue.indexOf(",") >= 0) return false
        if (Validator.getCount(".", newValue) == 1) {
            var cmb = (newValue + "").replace(".", "")
            return Validator.isNumeric(cmb)
        }

        return Validator.isNumeric(newValue)
    }

    static isPeso(newValuex) {
        var newValue = newValuex + ""
        if (newValue.indexOf("e") >= 0) return false
        if (newValue.indexOf("-") >= 0) return false
        if (newValue.indexOf(",") >= 0) return false
        if (Validator.getCount(".", newValue) == 1) {
            var cmb = (newValue + "").replace(".", "")
            return Validator.isNumeric(cmb)
        }

        return Validator.isNumeric(newValue)
    }

    static isMonto(newValuex) {
        var newValue = newValuex + ""
        if (newValue.indexOf("e") >= 0) return false
        if (newValue.indexOf("-") >= 0) return false
        return Validator.isNumeric(newValue)
    }

    static isCantidad(newValuex) {
        var newValue = newValuex + ""
        if (newValue.indexOf("e") >= 0) return false
        if (newValue.indexOf("-") >= 0) return false
        if (newValue.indexOf(".") >= 0) return false
        return Validator.isNumeric(newValue) && newValue.length <= 5
    }

    static isTeclaControl(event) {
        var key = event.key

        switch (key) {
            case "Tab":
            case "Backspace":
            case "Delete":
            case "ArrowLeft":
            case "ArrowRight":
            case "ArrowUp":
            case "ArrowDown":
            case "Unidentified":
                return true
                break;

            default:
                return false
                break;
        }
    }

    static isKeyEmail(event) {
        var key = event.key
        var all = event.target.value

        if (
            Validator.isTeclaControl(event)
            || Validator.isNumericOAlpha(key)
            || (key == "-" && all.length > 0)
            || (key == "_" && all.length > 0)
            || (key == "@" && all.indexOf("@") === -1)
            || key == "."
        ) {
            return true
        }

        return false
    }

    static isKeyPhone(event) {
        var key = event.key
        var all = event.target.value

        const len = all.length
        const cGuion = Validator.getCount("-", all)
        if (Validator.isTeclaControl(event)) return true

        if (
            (
                Validator.isNumeric(key)
                || (key == "-" && all.length > 0 && (cGuion == 0 || cGuion == 1))
            )
            && len < 15
        ) {
            return true
        }

        return false
    }

    static isKeyPassword(event) {
        var key = event.key
        var all = event.target.value

        const len = all.length
        const cGuion = Validator.getCount("-", all)
        if (Validator.isTeclaControl(event)) return true

        if (
            (
                Validator.isPassword(key)
            )
        ) {
            return true
        }

        return false
    }

    static isFile(newValuex, extensions = "*") {
        var newValue = newValuex + ""
        // console.log("validando extensiones", extensions)
        if (!newValue) {
            console.log("es tecla especial??")
            return true//caracter especial, ej: borrar, supr,etc
        }

        if (newValue.trim().length <= 0) return false

        if (extensions == "*") {
            return true
        }

        var tiene = false
        if (extensions.indexOf(",") > -1) {
            extensions.split(",").forEach((extension) => {
                if (newValue.toLocaleLowerCase().indexOf(extension.toLocaleLowerCase()) > -1) {
                    tiene = true
                }
            })
        } else if (extensions.length > 0) {
            if (newValue.toLocaleLowerCase().indexOf(extensions.toLocaleLowerCase()) > -1) {
                tiene = true
            }
        }

        return tiene
    }


}


export default Validator;