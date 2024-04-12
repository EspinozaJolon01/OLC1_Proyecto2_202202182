import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepcicones/Errores";

export default class Print extends Instruccion {
    private expresion: Instruccion
    private salto: string | undefined

    constructor(exp: Instruccion, linea: number, col: number, verSalto?:string) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.expresion = exp
        this.salto = verSalto

    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valor = this.expresion.interpretar(arbol, tabla)
        if (valor instanceof Errores) return valor
        arbol.Print(valor+this.salto)
    }
}