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

    // Métodos get
    getTipoError(): string {
        return this.tipoError;
    }

    getDescp(): string {
        return this.descp;
    }

    getFila(): number {
        return this.fila;
    }

    getColumna(): number {
        return this.columna;
    }

    // Métodos set
    setTipoError(tipo: string): void {
        this.tipoError = tipo;
    }

    setDescp(desc: string): void {
        this.descp = desc;
    }

    setFila(fila: number): void {
        this.fila = fila;
    }

    setColumna(columna: number): void {
        this.columna = columna;
    }
}
