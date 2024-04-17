
import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class Vectores extends Instruccion{
    private tipo1:Tipo;
    private tipo2?:Tipo |undefined;
    private id:string;
    private dimension?:Instruccion |undefined;
    private listavalores?: Instruccion[] | undefined;
    

    constructor(tipo1:Tipo,id:string,linea:number,colum:number,tipo2?:Tipo |undefined,dimension?:Instruccion |undefined,listavalores?:any[] |undefined){
        super(tipo1, linea, colum)
        this.tipo1 = tipo1
        this.tipo2 = tipo2
        this.id = id
        this.dimension = dimension
        this.listavalores = listavalores
    }


    interpretar(arbol: Arbol, tabla: tablaSimbolo) {

        
        if(this.listavalores){
            let arry: any= []

            for(let i =0; i < this.listavalores.length;i++){
                let valor = this.listavalores[i].interpretar(arbol,tabla)

                if(valor instanceof Errores) return valor
                if(this.tipo1.getTipo() != this.listavalores[i].tipoDato.getTipo()){
                    arbol.Print("\n Error Semantico:"+"Los tipos de datos no son iguales" + "linea: " + this.linea + "columna:" + (this.col+1))
                    return new Errores("SEMANTICA", "Los tipos de datos no son iguales", this.linea, this.col);
                }
                arry[i] = valor
            }
            if (!tabla.setVariable(new Simbolo(this.tipoDato, this.id, arry))){
                return new Errores("SEMANTICO", "No se puede declarar variable porque ya existia", this.linea, this.col)
            }


        }else if(this.dimension){
            if(this.tipo1.getTipo() != this.tipo2?.getTipo()){
                arbol.Print("\n Error Semantico:"+"Los tipos no son iguales " + "linea: " + this.linea + "columna:" + (this.col+1))
                return new Errores("SEMANTICA", "Los tipos no son iguales ", this.linea, this.col);
            }
            let tamanio = this.dimension.interpretar(arbol,tabla)
            if(this.dimension.tipoDato.getTipo() !=  tipoDato.ENTERO) return new Errores("SEMANTICA", "No es un entero", this.linea, this.col);
            let arry: any = [];
            for(let i=0;i < tamanio ;i++){
                arry[i] = []
            }
            if (!tabla.setVariable(new Simbolo(this.tipoDato, this.id, arry))){
                arbol.Print("\n Error Semantico:"+"No se puede declarar variable porque ya existia" + "linea: " + this.linea + "columna:" + (this.col+1))
                return new Errores("SEMANTICO", "No se puede declarar variable porque ya existia", this.linea, this.col)
            }

        }else{
            arbol.Print("\n Error Semantico:"+"falta datos" + "linea: " + this.linea + "columna:" + (this.col+1))
            return new Errores("SEMANTICA", "falta datos", this.linea, this.col);
        }
    }
}