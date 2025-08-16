
type Cheque = {
    idCuentaCorrientePago: number,
    rut: string
    banco: string
    nroDocumento: string
    nombre: string
    nroCheque: string
    fecha: string
    nroSerie: string
}


export const chequeDefault: Cheque = {
    idCuentaCorrientePago: 0,
    nombre: "",
    nroCheque: "",
    fecha: "",

    rut: "",
    banco: "",
    nroDocumento: "",
    nroSerie: ""
}

export default Cheque