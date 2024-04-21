import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'


export default class Defecto extends Instruccion{

    private identificador: string []
    
    constructor(tipo: Tipo, linea: number, columna: number, id: string []){
        super(tipo, linea, columna)
        this.identificador = id
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        
        let valorFinal: any;
    
        this.identificador.forEach(elemento => {

            switch(this.tipoDato.getTipo()){
                case tipoDato.ENTERO:
                    valorFinal = 0;
                    break;
                case tipoDato.CADENA:
                    valorFinal = "";
                    break;
                case tipoDato.BOOL:
                    valorFinal = true;
                    break;
                case tipoDato.CARACTER:
                    valorFinal = '0';
                    break;
                case tipoDato.DECIMAL:
                    valorFinal = 0.0;
                    break;
                default:
                    arbol.Print("--> Error Semantico:"+"No es posible declarar variable." + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
                    return new Errores("Error semántico", "No es posible declarar variable.", this.linea, this.col);
                
            }
    
            
            if (!tabla.setVariable(new Simbolo(this.tipoDato, elemento, valorFinal))){
                arbol.Print("--> Error Semantico:"+"No se puede declarar variable porque ya existia" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
                return new Errores("SEMANTICO", "No se puede declarar variable porque ya existia", this.linea, this.col)
            }   
        });

    }

    ArbolAST(anterior: string): string {
        return ''
    }

}