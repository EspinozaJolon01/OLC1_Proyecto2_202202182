import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import funReturn from "./funReturn";

export default class Funcion extends Instruccion {
    public id: string
    public parametros: any[]
    public instrucciones: Instruccion[]

    constructor(id:string, tipo: Tipo, instrucciones: Instruccion[], linea:number, columna: number, parametros: any[]) {
        super(tipo, linea, columna)
        this.id = id
        this.parametros = parametros
        this.instrucciones = instrucciones
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        
        //console.log("aqui tio",this.instrucciones)
        for (let i = 0; i < this.instrucciones.length; i++) {
            let nuevoDato = this.instrucciones[i].interpretar(arbol, tabla)

            if(nuevoDato instanceof Errores) return nuevoDato
            
            if(nuevoDato instanceof funReturn) {
                if(nuevoDato.valor != null){
                    if(this.tipoDato.getTipo() != nuevoDato.tipoDato.getTipo()) return new Errores("SEMANTICO", "El tipo de la función y el tipo del valor de retorno son diferentes.", this.linea, this.col)
                    return nuevoDato.valor
                }
            } 
            
            if(i == this.instrucciones.length - 1) return new Errores("SEMANTICO", "Debe devolver un valor.", this.linea, this.col)

            
        }

        
    }
    
    ArbolAST(anterior: string): string {
        return ''
    }

}