import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./funBreak";


export default class Default extends Instruccion {
    private instrucciones: Instruccion[];

    constructor(instrucciones: Instruccion[],linea: number,col: number) {
        super(new Tipo(tipoDato.VOID), linea, col);
        this.instrucciones = instrucciones;
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {

        let nuevaTabla = new tablaSimbolo(tabla)
        nuevaTabla.setNombre("tabla Default")
        Arbol.listSimbolo.push(nuevaTabla)

        for (const instruccion of this.instrucciones) {
            const resultado = instruccion.interpretar(arbol, nuevaTabla);
            if (resultado instanceof Errores) return resultado;
            if (resultado instanceof Break) return resultado;
        }
    }

    ArbolAST(anterior: string): string {
        return ''
    }
}