import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from '../simbolo/Arbol';
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'

export default class AccesoVector extends Instruccion {
    private posicion: Instruccion;
    private id: string;

    constructor(id: string, posicion: Instruccion, linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col);
        this.id = id;
        this.posicion = posicion;
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valorVariable= tabla.getVariable(this.id);
        let pos = this.posicion.interpretar(arbol,tabla)

        if (valorVariable === null) {
            arbol.Print("\n Error Semantico: "+"La variable no está definida " + "linea: " + this.linea + "columna:" + (this.col+1))
            return new Errores("SEMANTICO", "La variable no está definida", this.linea, this.col);
        }

        const valorVector = valorVariable.getValor();
        this.tipoDato = valorVariable.getTipo()

        if (!Array.isArray(valorVector)) {
            arbol.Print("---> Error Semantico: "+"La variable no es un vector " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "La variable no es un vector", this.linea, this.col);
        }

        if (pos < 0 || pos >= valorVector.length) {
            arbol.Print("---> Error Semantico: "+"Índice de vector fuera de rango " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "Índice de vector fuera de rango", this.linea, this.col);
        }

        return valorVector[pos];
    }
}
