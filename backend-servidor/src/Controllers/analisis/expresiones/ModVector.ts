
import { Instruccion } from "../abstracto/Instruccion";

import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";


export default class  ModVector extends Instruccion{
    private posicion: Instruccion;
    private id: string;
    private Actualizar:Instruccion;

    constructor(id:string,posicion:Instruccion,Actualizar:Instruccion,linea:number,col:number){
        super(new Tipo(tipoDato.VOID), linea, col);
        this.id = id;
        this.posicion = posicion
        this.Actualizar = Actualizar
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {

        let valorVariable= tabla.getVariable(this.id);
        let pos = this.posicion.interpretar(arbol,tabla)

        if (valorVariable === null) {
            arbol.Print("---> Error Semantico: "+"La variable no está definida " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "La variable no está definida", this.linea, this.col);
        }

        const valorVector = valorVariable.getValor();
        this.tipoDato = valorVariable.getTipo()

        let nuevoValor = this.Actualizar.interpretar(arbol,tabla)

        if (!Array.isArray(valorVector)) {
            arbol.Print("---> Error Semantico: "+"La variable no es un vector " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "La variable no es un vector", this.linea, this.col);
        }

        if (pos < 0 || pos >= valorVector.length) {
            arbol.Print("---> Error Semantico: "+"indice de vector fuera de rango " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "indice de vector fuera de rango", this.linea, this.col);
        }


        valorVector[pos] = nuevoValor;
    }
}
