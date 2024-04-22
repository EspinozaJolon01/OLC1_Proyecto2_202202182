import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'
import Errores from "../excepcicones/Errores";
import Ast from "../simbolo/AST";

export default class Declaracion extends Instruccion {
    private identificador: string[]
    private valor: Instruccion

    constructor(tipo: Tipo, linea: number, col: number, id: string[], valor: Instruccion) {
        super(tipo, linea, col)
        this.identificador = id
        this.valor = valor
    }
    
    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        Arbol.listSimbolo.push(tabla)
        let valorFinal = this.valor.interpretar(arbol, tabla)
        if (valorFinal instanceof Errores) return valorFinal

        if(this.valor.tipoDato.getTipo() == tipoDato.ENTERO && this.tipoDato.getTipo() == tipoDato.DECIMAL){
            this.identificador.forEach(identificador => {
                valorFinal = parseFloat(valorFinal);
                if (!tabla.setVariable(new Simbolo(this.tipoDato, identificador, valorFinal))){
                    arbol.Print("--> Error Semantico:"+"No se puede declarar variable que ya existe" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
                    return new Errores("Semantico", "No se puede declarar variable que ya existe", this.linea, this.col)
                }   
            });
        }else{
            if (this.valor.tipoDato.getTipo() != this.tipoDato.getTipo()) {
                arbol.Print("--> Error Semantico:"+"No se puede declarar variable, son tipos diferentes" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
                return new Errores("SEMANTICO", "No se puede declarar variable, son tipos diferentes", this.linea, this.col)
            }


            // for(let elemento of this.identificador){
            //     if (!tabla.setVariable(new Simbolo(this.tipoDato, elemento, valorFinal))){
            //         arbol.Print("--> Error Semantico:"+"variable ya existe!" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            //         return new Errores("SEMANTICO", "variable ya existe!", this.linea, this.col)
            //     }  
            // }
            
            this.identificador.forEach(elemento => {
                if (!tabla.setVariable(new Simbolo(this.tipoDato, elemento, valorFinal))){
                    return new Errores("SEMANTICO", "No se puede declarar variable porque ya existia", this.linea, this.col)
                }   
            });
        }

        
    }

    ArbolAST(anterior: string): string {
        let result = "";
        let bandera = Ast.getInstancia()

        let DECLARACION = `n${bandera.get()}`;

        let TIPO = `n${bandera.get()}`;
        let identificador = `n${bandera.get()}`;

        let listaid = [];
        for(let i= 0; i < this.identificador.length; i++){
            listaid.push(`n${bandera.get()}`);

        }
        let igual = `n${bandera.get()}`;
        let valor = `n${bandera.get()}`;
        let puntocoma = `n${bandera.get()}`;

        result += `${DECLARACION}[label="DECLA"];\n`
        if(this.tipoDato.getTipo() == tipoDato.ENTERO){
            result += `${TIPO}[label="ENTERO"];\n`
        }else if(this.tipoDato.getTipo() == tipoDato.CADENA){
            result += `${TIPO}[label="STD::STRING"];\n`
        }else if(this.tipoDato.getTipo() == tipoDato.CARACTER){
            result += `${TIPO}[label="CHAR"];\n`
        }else if(this.tipoDato.getTipo() == tipoDato.BOOL){
            result += `${TIPO}[label="BOOL"];\n`
        }else if(this.tipoDato.getTipo() == tipoDato.DECIMAL){
            result += `${TIPO}[label="DOUBLE"];\n`
        }

        result += `${identificador}[label="ID"];\n`

        for(let i= 0; i < this.identificador.length; i++){
            result += `${listaid[i]} [label = "${this.identificador[i]}"];\n`
        }

        result += `${igual}[label="="];\n`
        result += `${valor}[label="EXPRESION"];\n`
        result += `${puntocoma}[label=";"];\n`

        result += `${anterior} -> ${DECLARACION};\n`
        result += `${DECLARACION} -> ${identificador};\n`
        result += `${DECLARACION} -> ${TIPO};\n`
        
        for(let i= 0; i < this.identificador.length; i++){
            result += `${identificador} -> ${listaid[i]};\n`
        }

        result += `${DECLARACION} -> ${igual};\n`
        result += `${DECLARACION} -> ${valor};\n`
        result += `${DECLARACION} -> ${puntocoma};\n`

        this.valor.ArbolAST(valor);

        return result;
    }

}