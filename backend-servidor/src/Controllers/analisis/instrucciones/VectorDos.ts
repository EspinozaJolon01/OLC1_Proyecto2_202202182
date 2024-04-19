
import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class VectoresDOS extends Instruccion{
    private tipo1:Tipo;
    private tipo2?:Tipo |undefined;
    private id:string;
    private dimension1?:Instruccion |undefined;
    private dimension2?:Instruccion |undefined;
    private listavalores1?: Instruccion[] | undefined;
    private listavalores2?: Instruccion[] | undefined;

    constructor(tipo1:Tipo,id:string,linea:number,colum:number,tipo2?:Tipo | undefined,dimension1?:Instruccion,
        dimension2?:Instruccion,listavalores1?: Instruccion[],listavalores2?: Instruccion[]){
            super(tipo1, linea, colum)
            this.tipo1 =tipo1
            this.tipo2 = tipo2
            this.id = id
            this.dimension1 = dimension1
            this.dimension2 = dimension2
            this.listavalores1 = listavalores1
            this.listavalores2 = listavalores2
    }


    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let arreglo2d: any[][] = []
        if(this.listavalores1 && this.listavalores2){

            if(this.dimension1 && this.dimension2){
                const dim1 = this.dimension1.interpretar(arbol,tabla)
                const dim2 = this.dimension2.interpretar(arbol,tabla)
                
                //sea numero
                if(typeof dim1 !== "number" || typeof dim2 !== "number"){
                    return new Errores("SEMANTICO", "Las dimensiones deben ser números", this.linea, this.col);
                }

                if (dim1 !== this.listavalores1.length || dim2 !== this.listavalores2.length) {
                    return new Errores("SEMANTICO", "Las dimensiones no coinciden con la inicialización del arreglo", this.linea, this.col);
                }

            }
            for(let i = 0; i < this.listavalores1.length; i++){
                let fila: any[]=[]
                    for(let j = 0; j < this.listavalores1.length ; j++){
                        fila.push(this.listavalores1[j].interpretar(arbol,tabla))
                    }
                    arreglo2d.push(fila);
                }

        }else {
            
            if (this.dimension1 && this.dimension2) {
                const dim1 = this.dimension1.interpretar(arbol, tabla);
                const dim2 = this.dimension2.interpretar(arbol, tabla);
                console.log("num1: " , dim1)
                console.log("num2: " , dim2)

                if (this.dimension1.tipoDato.getTipo() !=  tipoDato.ENTERO && this.dimension2.tipoDato.getTipo() !=  tipoDato.ENTERO) {
                    return new Errores("SEMANTICO", "Las dimensiones deben ser números", this.linea, this.col);
                }

                if (dim1 <= 0 || dim2 <= 0) {
                    return new Errores("SEMANTICO", "Las dimensiones deben ser positivas", this.linea, this.col);
                }

                
                for (let i = 0; i < dim1; i++) {
                    let fila: any[] = [];
                    for (let j = 0; j < dim2; j++) {
                        fila.push(null);
                    }
                    arreglo2d.push(fila);
                }
            } else {
                return new Errores("SEMANTICO", "Dimensiones no especificadas", this.linea, this.col);
            }
        }

        // Agregar el arreglo 2D a la tabla de símbolos
        if (!tabla.setVariable(new Simbolo(this.tipoDato, this.id, arreglo2d))){
            arbol.Print("\n Error Semantico:"+"No se puede declarar variable porque ya existia" + "linea: " + this.linea + "columna:" + (this.col+1))
            return new Errores("SEMANTICO", "No se puede declarar variable porque ya existia", this.linea, this.col)
        }

        return null;
        
    }
}
    