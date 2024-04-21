import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import funReturn from "./funReturn";


export default class Metodo extends Instruccion{
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
        if(this.tipoDato.getTipo() != tipoDato.VOID) return new Errores("SEMANTICO", "El método debe tener un tipo void", this.linea, this.col)
            
            for(let i of this.instrucciones) {
                if( i instanceof Errores) {
                }

                let resultado = i.interpretar(arbol, tabla)
                if( resultado instanceof Errores) {
                    
                }
                    if(resultado instanceof funReturn) {
                        if(resultado.valor != null) {
                            return new Errores("SEMANTICO", "No se puede devolver un valor dentro de un método.", this.linea, this.col)
                        }
                        break
                    }
            }

    }


    ArbolAST(anterior: string): string {
        return ''
    }
}