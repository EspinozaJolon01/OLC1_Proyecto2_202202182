import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class funReturn extends Instruccion {
    private valor: Instruccion | undefined;

    constructor(linea: number, col: number, valor?: Instruccion) {
        super(new Tipo(tipoDato.VOID), linea, col);
        this.valor = valor;
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        if (this.valor !== undefined) {
            return this.valor.interpretar(arbol, tabla); // Devuelve el valor interpretado del retorno
        } else {
            return null; // Devuelve null si no hay valor definido en el return
        }
    }
}
