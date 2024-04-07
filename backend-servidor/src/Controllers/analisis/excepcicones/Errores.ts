export default class Errores {
    private tipoError: string
    private descp: string
    private fila: number
    private columna:number

    constructor(tipo:string, desc:string,fila:number,columna:number){
        this.tipoError = tipo
        this.descp = desc
        this.fila = fila
        this.columna = columna
    }
}