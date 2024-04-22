
import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";



export default class VectorCSTS extends Instruccion{
    private tipo1 :Tipo
    private id: string
    private modifica:string


    constructor(tipo1:Tipo,id:string,modifica:string,linea:number,col:number){
        super(tipo1, linea, col)
        this.tipo1 = tipo1
        this.id = id
        this.modifica = modifica

    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        console.log("holaaa")
        //modificar  = var1
        let dato = tabla.getVariable(this.modifica.toLocaleLowerCase());
        console.log(dato)
        console.log("esto el this ",this.id)
        console.log("aqui estoy")
        if (dato == null) {
            console.log("VARIABLE NO EXISTE");
            arbol.Print("--> Error Semantico:"+"VARIABLE NO EXISTE" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICA", "VARIABLE NO EXISTE", this.linea, this.col);
        }

        if(dato.getTipo().getTipo() != tipoDato.CADENA){
            arbol.Print("--> Error Semantico:"+"La modificación del vector debe ser una cadena de texto" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "La modificación del vector debe ser una cadena de texto", this.linea, this.col);
        }
        let arry: any = [];
        

            for(let i=0;i<dato.getValor().length;i++){
                console.log(dato.getValor().charAt(i))
                arry[i] = dato.getValor().charAt(i);            
            }
            console.log(arry)
            
            
            if (!tabla.setVariable(new Simbolo(this.tipoDato, this.id, arry))){
                arbol.Print("--> Error Semantico:"+"No se puede declarar variable porque ya existia" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")

                return new Errores("SEMANTICO", "No se puede declarar variable porque ya existia", this.linea, this.col)
            }
        
    }

    ArbolAST(anterior: string): string {
        return ''
    }
}

