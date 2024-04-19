
import { Instruccion } from "../abstracto/Instruccion";

import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";


export default class  ModVector2 extends Instruccion{
    private posicion1: Instruccion;
    private posicion2: Instruccion;
    private id: string;
    private Actualizar1:Instruccion;
    

    constructor(id:string,posicion1:Instruccion,posicion2:Instruccion,Actualizar1:Instruccion,linea:number,col:number){
        super(new Tipo(tipoDato.VOID), linea, col);
        this.id = id;
        this.posicion1 = posicion1
        this.posicion2 = posicion2
        this.Actualizar1 = Actualizar1
        
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {

        let valorVariable= tabla.getVariable(this.id);
        let pos1 = this.posicion1.interpretar(arbol,tabla)
        let pos2 = this.posicion2.interpretar(arbol,tabla)

        if (valorVariable === null) {
            arbol.Print("---> Error Semantico: "+"La variable no está definida " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "La variable no está definida", this.linea, this.col);
        }

        const valorVector = valorVariable.getValor();
        this.tipoDato = valorVariable.getTipo()

        let nuevoValor = this.Actualizar1.interpretar(arbol,tabla)

        if (!Array.isArray(valorVector)) {
            arbol.Print("---> Error Semantico: "+"La variable no es un vector " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "La variable no es un vector", this.linea, this.col);
        }

        if (pos1 < 0 || pos1 >= valorVector.length) {
            arbol.Print("---> Error Semantico: "+"indice de vector fuera de rango " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "indice de vector fuera de rango", this.linea, this.col);
        }

        if (pos2 < 0 || pos2 >= valorVector.length) {
            arbol.Print("---> Error Semantico: "+"indice de vector fuera de rango " + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "indice de vector fuera de rango", this.linea, this.col);
        }


        valorVector[pos1][pos2] = nuevoValor;
    }
}
