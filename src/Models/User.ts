import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.ts';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class User extends Model {

    static roles = []
    static buscandoRoles = false


    codigoUsuario: number;
    rut: string;
    clave: string;

    deudaIds: any
    idUsuario: number

    static instance: User | null = null;

    static getInstance(): User {
        if (User.instance == null) {
            User.instance = new User();
        }

        return User.instance;
    }

    static mostrarNombre(usuario) {
        return usuario.nombres + " " + usuario.apellidos
    }

    saveInSesion(data) {
        this.sesion.guardar(data)
        // localStorage.setItem('userData', JSON.stringify(data));
        return data;
    }

    getFromSesion() {
        return this.sesion.cargar(1)
        // var dt = localStorage.getItem('userData') || "{}";
        // return JSON.parse(dt);
    }

    setRutFrom = (input: string) => {
        if (input.indexOf("-") > -1) {
            this.rut = input;
        } else {
            this.rut = "";
        }
        return this.rut;
    }

    setUserCodeFrom = (input: string) => {
        if (input.indexOf("-") == -1) {
            this.codigoUsuario = parseInt(input);
        } else {
            this.codigoUsuario = 0;
        }
        return this.codigoUsuario;
    }

    async doLogoutInServer(callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/Usuarios/LoginUsuarioSetInactivo"

            const data = this.getFillables()
            data.puntoVenta = parseInt(data.puntoVenta) + ""

            const response = await axios.post(
                url,
                data
            );

            if (response.data.status == 200) {
                callbackOk(response)
            } else {
                callbackOk(response.data.descripcion)
            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                callbackWrong(
                    "Credenciales incorrectas. Por favor, verifica tu nombre de usuario y contraseña." +
                    error.message
                );
            } else if (error.response && error.response.status === 500) {
                callbackWrong(
                    "Error interno del servidor. Por favor, inténtalo de nuevo más tarde."
                );
            } else if (error.message != "") {
                callbackWrong(error.message)
            } else {
                callbackWrong(
                    "Error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde."
                );
            }
        }
    }

    async existRut({ rut }, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/Usuarios/GetUsuarioByRut?rutUsuario=" + rut
            const response = await axios.get(url);
            if (
                response.data.statusCode === 200
                || response.data.statusCode === 201
            ) {
                // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
                callbackOk(response.data.usuarios, response)
            } else {
                callbackWrong("Respuesta desconocida del servidor")
            }
        } catch (error) {
            callbackWrong(error)
        }
    }

    async add(data, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/Usuarios/AddUsuario"
            const response = await axios.post(url, data);
            if (
                response.status === 200
                || response.status === 201
            ) {
                // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
                callbackOk(response.data.usuarios, response)
            } else {
                callbackWrong("Respuesta desconocida del servidor")
            }
        } catch (error) {
            if (error.response && error.response.status && error.response.status === 409) {
                callbackWrong(error.response.descripcion)
            } else {
                callbackWrong(error.message)
            }


        }
    }

    async edit(data, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase
                + "/Usuarios/UpdateUsuario"
            const response = await axios.put(url, data);
            if (
                response.data.statusCode === 200
                || response.data.statusCode === 201
            ) {
                // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
                callbackOk(response.data, response)
            } else {
                callbackWrong("Respuesta desconocida del servidor")
            }
        } catch (error) {
            if (error.response && error.response.status && error.response.status === 409) {
                callbackWrong(error.response.descripcion)
            } else {
                callbackWrong(error.message)
            }


        }
    }

    static async getAll(callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/Usuarios/GetAllUsuarios"

        url += "?idEmpresa=" + configs.idEmpresa


        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.usuarios, response);
        }, callbackWrong)
    }

    async getAll(callbackOk, callbackWrong) {
        User.getAll(callbackOk, callbackWrong)
    }


    static async doLoginServer(data, callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/Usuarios/LoginUsuario"

        EndPoint.sendPost(url, data, (responseData, response) => {
            if (response.data.responseUsuario && response.data.responseUsuario.codigoUsuario !== -1) {
                callbackOk(responseData, response);
            } else {
                if (responseData.descripcion) {
                    callbackWrong(responseData.descripcion)
                } else {
                    callbackWrong("Usuario incorrecto")
                }
            }
        }, callbackWrong)
    }

    static async getActivos(callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/Usuarios/GetUsuariosActivos"

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.usuariosActivos, response);
        }, callbackWrong)
    }

    static async getRoles(callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/Usuarios/GetAllRolUsuario"

        if (User.buscandoRoles) return
        User.buscandoRoles = true
        await EndPoint.sendGet(url, (responseData, response) => {
            User.buscandoRoles = false
            User.roles = responseData.usuarios
            // console.log("callbackOk de getRoles")
            callbackOk(responseData.usuarios, response);
        }, (err) => {
            // console.log("callbackWrong de getRoles")
            callbackWrong(err)
            User.buscandoRoles = false
        })
    }

    //devuelve un numero id o id fijo default(cajero)
    static async findRolIdOrName(idOrName) {
        const idOrNameNumeric = parseInt(idOrName + "")
        const esNumero = !isNaN(idOrNameNumeric)

        if (esNumero) {
            return idOrNameNumeric
        }

        var rolEncontrado = 4//     4 -> cajero/usuario

        var rolesServidor = User.roles
        if (rolesServidor.length < 1) {
            return rolEncontrado
        }

        rolesServidor.forEach((rolServidor: any) => {
            if (esNumero && idOrNameNumeric == rolServidor.idRol) {
                rolEncontrado = rolServidor.idRol
            }

            if (!esNumero && idOrName == rolServidor.rol) {
                rolEncontrado = rolServidor.idRol
            }

        })

        // console.log("findRolIdOrName devuelve  ", rolEncontrado)
        return rolEncontrado
    }


    //devuelve un string del rol
    static async findRolNameById(idOrName) {
        // console.log("findRolNameById para ", idOrName)
        const idOrNameNumeric = parseInt(idOrName)

        var rolesServidor = User.roles
        var rolEncontrado = "Cajero"

        if (rolesServidor.length < 1) {
            // console.log("findRolIdOrName devuelvo ", rolEncontrado)
            return rolEncontrado
        }

        // console.log("rolesServidor", rolesServidor)

        const esNumero = !isNaN(idOrNameNumeric)

        rolesServidor.forEach((rolServidor: any) => {
            if (esNumero && idOrNameNumeric == rolServidor.idRol) {
                // console.log("encuentra por id", idOrNameNumeric)
                rolEncontrado = rolServidor.rol
            }
            if (!esNumero && idOrName == rolServidor.rol) {
                // console.log("encuentra por nombre ", idOrName)
                rolEncontrado = rolServidor.rol
            }
        })
        // console.log("findRolIdOrName devuelvo ", rolEncontrado)
        return rolEncontrado
    }


    static async intentarBuscarRolId(rolNumericOrString, onFind = (x) => { }) {
        if (User.roles.length < 1) {
            // console.log("search list item User.roles.length < 1", User.roles.length < 1)
            if (!User.buscandoRoles) {
                // console.log("search list item !User.buscandoRoles", !User.buscandoRoles)
                User.getRoles(() => {
                    // console.log("search list deberia volver a hacer buscarRolId del usuario ", user.nombres + ' ' +user.apellidos)
                    User.intentarBuscarRolId(rolNumericOrString, onFind)
                }, () => { })
                return
            } else {
                setTimeout(() => {
                    // console.log("search list deberia 2 volver a hacer buscarRolId del usuario ", user.nombres + ' ' +user.apellidos)
                    User.intentarBuscarRolId(rolNumericOrString, onFind)
                }, 200);
                return
            }
        }

        onFind(await User.findRolIdOrName(rolNumericOrString))
    }

    static async delete(codigoUsuario, callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/Usuarios/DeleteUsuarioByCodigo"// + "?CodigoUsuario=" + codigoUsuario

        EndPoint.sendDelete(url, {
            CodigoUsuario: codigoUsuario
        }, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong)
    }



};

export default User;