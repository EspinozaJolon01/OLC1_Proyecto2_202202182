import { Instruccion } from "../abstracto/Instruccion";

import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";





export default class FuncUtilidades extends Instruccion{
    private operando1: Instruccion | undefined
    private operando2: Instruccion | undefined
    private operacion:Operadores
    private operandoUnido: Instruccion | undefined

    constructor(operador: Operadores, fila:number, col:number,op1: Instruccion, op2?: Instruccion){
        super(new Tipo(tipoDato.VOID), fila, col)
        this.operacion = operador
        if (!op2) this.operandoUnido = op1
        else {
            this.operando1 = op1
            this.operando2 = op2
        }
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let opIzq,opDer,unico = null
        if(this.operandoUnido != null){
            unico = this.operandoUnido.interpretar(arbol,tabla)
            if(unico instanceof Errores) return unico
        }else {
            opIzq = this.operando1?.interpretar(arbol,tabla)
            if(opIzq instanceof Errores) return opIzq
            opDer = this.operando2?.interpretar(arbol, tabla)
            if (opDer instanceof Errores) return opDer
        }

        switch(this.operacion){
            case Operadores.tolower:
                return this.TOLOWER(unico)
            case Operadores.ToString:
                return this.toSTRING(unico)
            case Operadores.toupper:
                return this.TOUPPER(unico)
            case Operadores.round:
                return this.ROUND(unico)
            case Operadores.Typeof:
                return this.typeof(unico)
            case Operadores.Length:
                if(Array.isArray(unico)){
                    return this.arreglo_log(unico);
                }
                return this.length1(unico)
            default:
                return new Errores("Semantico", "Funcion Invalido", this.linea, this.col)

        }
    }

    TOLOWER(op1: any){

        let opU = this.operandoUnido?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.CADENA:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return op1.toLowerCase()
                
            default:
                return new Errores("Semantico", "TOLOWER invalida", this.linea, this.col)
        }
        
    }

    TOUPPER(op1: any){

        let opU = this.operandoUnido?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.CADENA:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return op1.toUpperCase()
                
            default:
                return new Errores("Semantico", "TOUPPER invalida", this.linea, this.col)
        }
        
    }

    ROUND(op1: any){

        let opU = this.operandoUnido?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                return Math.round(op1)
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                return Math.round(op1)
                
            default:
                return new Errores("Semantico", "ROUND invalida", this.linea, this.col)
        }
        
    }

    toSTRING(op1: any){

        let opU = this.operandoUnido?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return op1.toString()
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return op1.toString()
            case tipoDato.BOOL:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return op1.toString()
                
            default:
                return new Errores("Semantico", "ROUND invalida", this.linea, this.col)
        }
        
    }


    typeof(op1: any){

        let opU = this.operandoUnido?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return "int"
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.DECIMAL)
                return "double"
            case tipoDato.BOOL:
                this.tipoDato = new Tipo(tipoDato.BOOL)
                return "bool"
            case tipoDato.CADENA:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return "cadena"
            case tipoDato.CARACTER:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return "char"
                
            default:
                return new Errores("Semantico", "typeof invalida", this.linea, this.col)
        }
        
    }

    

    arreglo_log(op1: any){

        // this.tipoDato =  new Tipo(tipoDato.ENTERO)
        
        // return op1.length

        let opU = this.operandoUnido?.tipoDato.getTipo()
        switch (opU) {
            
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                console.log(op1)
                console.log(opU)
                return op1.length
            case tipoDato.CADENA:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                console.log(op1)
                console.log(opU)
                return op1.length
            case tipoDato.CARACTER:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                console.log(op1)
                console.log(opU)
                return op1.length
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                console.log(op1)
                console.log(opU)
                return op1.length
            case tipoDato.BOOL:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                console.log(op1)
                console.log(opU)
                return op1.length
            
            
                
            default:
                
                return new Errores("Semantico", "length invalida", this.linea, this.col)
        }
            
    }
        
    


    length1(op1: any){

        let opU = this.operandoUnido?.tipoDato.getTipo()
        switch (opU) {
            
            case tipoDato.CADENA:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                console.log(op1)
                console.log(opU)
                return op1.length
            
            
                
            default:
                return new Errores("Semantico", "length invalida", this.linea, this.col)
        }
        
    }
    
    ArbolAST(anterior: string): string {
        return ''
    }
    

}

export enum Operadores{
    tolower,
    toupper,
    round,
    ToString,
    Typeof,
    Length

}