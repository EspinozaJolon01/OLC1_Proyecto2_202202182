
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
    private listavalores1?: Instruccion[][] | undefined;
    

    constructor(tipo1:Tipo,id:string,linea:number,colum:number,tipo2?:Tipo | undefined,dimension1?:Instruccion,
        dimension2?:Instruccion,listavalores1?: Instruccion[][]){
            super(tipo1, linea, colum)
            this.tipo1 =tipo1
            this.tipo2 = tipo2
            this.id = id
            this.dimension1 = dimension1
            this.dimension2 = dimension2
            this.listavalores1 = listavalores1
            
    }


    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let arreglo2d: any[][] = []
        if(this.listavalores1){

            let arreglo2 =  new Array(this.listavalores1.length)

            for(let i=0; i<this.listavalores1.length;i++){

                if(Array.isArray(this.listavalores1[i])){
                    arreglo2[i] = new Array(this.listavalores1[i].length)

                    for(let j=0; j< this.listavalores1.length;j++){
                        let dato = this.listavalores1[i][j].interpretar(arbol,tabla)
                        if(dato instanceof Errores) return dato
                        if(this.tipo1.getTipo() != this.listavalores1[i][j].tipoDato.getTipo()){
                            arbol.Print("--> Error Semantico:"+"Las dimensiones deben ser números" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
                            return new Errores("SEMANTICO", "Las dimensiones deben ser números", this.linea, this.col);
                        }
                        arreglo2[i][j] = dato
                    }

                }else{
                    arbol.Print("--> Error Semantico:"+"Debe de ser un vector" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
                    return new Errores("SEMANTICO", "Debe de ser un vector", this.linea, this.col);

                }
                

            }
            if (!tabla.setVariable(new Simbolo(this.tipoDato, this.id, arreglo2))){
                arbol.Print("--> Error Semantico:"+"No se puede declarar variable porque ya existia" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
                return new Errores("SEMANTICO", "No se puede declarar variable porque ya existia", this.linea, this.col)
            }
                

        }else {
            
            if (this.dimension1 && this.dimension2) {
                const dim1 = this.dimension1.interpretar(arbol, tabla);
                const dim2 = this.dimension2.interpretar(arbol, tabla);
                console.log("num1: " , dim1)
                console.log("num2: " , dim2)

                if (this.dimension1.tipoDato.getTipo() !=  tipoDato.ENTERO && this.dimension2.tipoDato.getTipo() !=  tipoDato.ENTERO) {
                    arbol.Print("--> Error Semantico:"+"Las dimensiones deben ser números" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
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
                arbol.Print("--> Error Semantico:"+"Dimensiones no especificadas" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
                return new Errores("SEMANTICO", "Dimensiones no especificadas", this.linea, this.col);
            }

            // Agregar el arreglo 2D a la tabla de símbolos
        if (!tabla.setVariable(new Simbolo(this.tipoDato, this.id, arreglo2d))){
            arbol.Print("--> Error Semantico:"+"No se puede declarar variable porque ya existia" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "No se puede declarar variable porque ya existia", this.linea, this.col)
        }

        return null;
        }

        
        
    }
}
    