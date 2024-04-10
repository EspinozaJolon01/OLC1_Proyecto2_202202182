export default class TipoRelacionales {
    private tipo: tipoDato
    

    constructor(tipo: tipoDato) {
        this.tipo = tipo
    }



    public setTipo(tipo: tipoDato) {
        this.tipo = tipo
    }

    public getTipo() {
        return this.tipo
    }

}

export enum tipoDato {
    IGUAL,
    DISTINTO,
    MENOR,
    MENORIGUAL,
    MAYOR,
    MAYORIGUAL,
    VOID
}

