import Arbol from "../simbolo/Arbol";
import tablaSimbolos from "../simbolo/tablaSimbolos";
import TipoRelacionales from "../simbolo/TipoRelacionales";

export abstract class IntruccionesRela {
    public tipoDato: TipoRelacionales
    public linea: number
    public col: number

    constructor(tipo: TipoRelacionales, linea: number, col: number) {
        this.tipoDato = tipo
        this.linea = linea
        this.col = col
    }
    

    abstract interpretar(arbol: Arbol, tabla: tablaSimbolos): any

}