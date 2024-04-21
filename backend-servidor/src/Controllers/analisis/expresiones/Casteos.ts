
import { Instruccion } from "../abstracto/Instruccion";

import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";



export default class Casteos extends Instruccion{
    private casteo1: Instruccion | undefined
    private casteo2: Instruccion | undefined
    private tipoCasteo : Tipo
    private unicoCasteo: Instruccion | undefined

    constructor(cat:Tipo, fila:number,colum:number, cat1: Instruccion, cat2?:Instruccion){
        super(new Tipo(tipoDato.VOID), fila, colum)
        this.tipoCasteo = cat
        if (!cat2) this.unicoCasteo =cat1
        else {
            this.casteo1 = cat1
            this.casteo2 = cat2
        }
    }
    interpretar(arbol: Arbol, tabla: tablaSimbolo) {

        let opIzq, opDer, Unico = null
        if (this.unicoCasteo != null) {
            Unico = this.unicoCasteo.interpretar(arbol, tabla)
            if (Unico instanceof Errores) return Unico
        } else {
            opIzq = this.casteo1?.interpretar(arbol, tabla)
            if (opIzq instanceof Errores) return opIzq
            opDer = this.casteo2?.interpretar(arbol, tabla)
            if (opDer instanceof Errores) return opDer
        }

        switch(this.tipoCasteo.getTipo()){
            case tipoDato.ENTERO:
                return this.casteoint(Unico)
            case tipoDato.CADENA:
                return this.casteostring(Unico)
            case tipoDato.DECIMAL:
                return this.casteosdecimal(Unico)
            case tipoDato.CARACTER:
                return this.casteoscaracter(Unico)

            default:
                arbol.Print("--> Error Semantico:"+"Casteo Invalido" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")

                return new Errores("Semantico", "Casteo Invalido", this.linea, this.col)

        }   
    }


    casteoint(op1: any){
        let opU = this.unicoCasteo?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                return parseInt(op1)
            case tipoDato.CARACTER:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                return parseInt(op1.charCodeAt(1))
            
            default:
                return new Errores("Semantico", "casteoint invalida", this.linea, this.col)
        }
        
    }


    casteostring(op1: any){
        let opU = this.unicoCasteo?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return op1.toString()
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return op1.toString()
            
            default:
                return new Errores("Semantico", "casteostring invalida", this.linea, this.col)
        }
        
    }


    casteosdecimal(op1: any){
        let opU = this.unicoCasteo?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.DECIMAL)
                return parseFloat(op1)
            case tipoDato.CARACTER:
                this.tipoDato = new Tipo(tipoDato.DECIMAL)
                return parseFloat(op1.charCodeAt(1))
            
            default:
                return new Errores("Semantico", "casteos decimal invalida", this.linea, this.col)
        }
        
    }

    casteoscaracter(op1: any){
        let opU = this.unicoCasteo?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.CARACTER)
                return String.fromCharCode(parseInt(op1))
            
            
            default:
                return new Errores("Semantico", "casteos caracter invalida", this.linea, this.col)
        }
        
    }

    ArbolAST(anterior: string): string {
        return ''
    }

}

export enum CasteosTipo{
    int,
    double,
    string,
    char

}