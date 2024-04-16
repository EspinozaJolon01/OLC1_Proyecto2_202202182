import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./funBreak";


export default class Case extends Instruccion {
    public expresion1: Instruccion;
    private instrucciones: Instruccion[];

    constructor(expresion1: Instruccion,instrucciones: Instruccion[],linea: number,col: number) {
        super(new Tipo(tipoDato.VOID), linea, col);
        this.expresion1 = expresion1;
        this.instrucciones = instrucciones;
    }

    

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        for (const instruccion of this.instrucciones) {
            const resultado = instruccion.interpretar(arbol, tabla);
            if (resultado instanceof Errores) return resultado;
            if (resultado instanceof Break) return resultado;
        }
    }
}