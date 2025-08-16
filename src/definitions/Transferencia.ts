
type Transferencia = {
    idCuentaCorrientePago: number;
    nombre: string;
    rut: string | number;
    banco: string
    tipoCuenta: string
    nroCuenta: string
    fecha: string
    nroOperacion: string
}


export const transferenciaDefault:Transferencia = {
    idCuentaCorrientePago: 0,
    nombre: "",
    rut: "",
    banco: "",
    tipoCuenta: "",
    nroCuenta: "",
    fecha: "",
    nroOperacion: "",
}

export default Transferencia