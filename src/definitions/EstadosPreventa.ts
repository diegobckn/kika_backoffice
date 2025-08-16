const EstadosPreventa = {
    Usadas: 1,
    Descartadas: 2,
}



export const EstadosPreventaFiltrar = {
    ...EstadosPreventa, ...{
        Todas: -1,
    }
}

export default EstadosPreventa