import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'
import Errores from "../excepcicones/Errores";

export default class Declaracion extends Instruccion {
    private identificador: string[]
    private valor: Instruccion

    constructor(tipo: Tipo, linea: number, col: number, id: string[], valor: Instruccion) {
        super(tipo, linea, col)
        this.identificador = id
        this.valor = valor
    }
    
    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valorFinal = this.valor.interpretar(arbol, tabla)
        if (valorFinal instanceof Errores) return valorFinal

        if (this.valor.tipoDato.getTipo() != this.tipoDato.getTipo()) {
            return new Errores("SEMANTICO", "No se puede declarar variable", this.linea, this.col)
        }
        console.log("validacion1")
        this.identificador.forEach(elemento => {
            if (!tabla.setVariable(new Simbolo(this.tipoDato, elemento, valorFinal))){
                return new Errores("SEMANTICO", "No se puede declarar variable porque ya existia", this.linea, this.col)
            }   
        });
    }

}