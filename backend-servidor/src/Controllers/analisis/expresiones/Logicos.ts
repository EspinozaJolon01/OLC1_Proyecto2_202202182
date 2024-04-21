

import { Instruccion } from "../abstracto/Instruccion";

import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";



export default class Logicos extends Instruccion{
    private operando1: Instruccion | undefined
    private operando2: Instruccion | undefined
    private operacion: Operadores
    private operandoUnico: Instruccion | undefined

    constructor(operador: Operadores, fila:number, col:number,op1: Instruccion, op2?: Instruccion){
        super(new Tipo(tipoDato.ENTERO), fila, col)
        this.operacion = operador
        if (!op2) this.operandoUnico = op1
        else {
            this.operando1 = op1
            this.operando2 = op2
        }
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo){
        let opIzq, opDer, Unico = null
        if (this.operandoUnico != null) {
            Unico = this.operandoUnico.interpretar(arbol, tabla)
            if (Unico instanceof Errores) return Unico
        } else {
            opIzq = this.operando1?.interpretar(arbol, tabla)
            if (opIzq instanceof Errores) return opIzq
            opDer = this.operando2?.interpretar(arbol, tabla)
            if (opDer instanceof Errores) return opDer
        }

        switch (this.operacion) {
            case Operadores.AND:
                return this.and(opIzq, opDer)
            case Operadores.NOT:
                return this.not(Unico)
            case Operadores.OR:
                return  this.or(opIzq, opDer)
            default:
                return new Errores("Semantico", "Operador logicos Invalido", this.linea, this.col)
        }

    }

    or(op1: any, op2: any){
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.BOOL:
                switch (tipo2) {
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 || op2
                    default:
                        return new Errores("Semantico", "OR Invalida", this.linea, this.col)
                }
            
            default:
                return new Errores("Semantico", "OR Invalida", this.linea, this.col)
        }

    }

    and(op1: any, op2: any){
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.BOOL:
                switch (tipo2) {
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 && op2
                    default:
                        return new Errores("Semantico", "AND Invalida", this.linea, this.col)
                }
            
            default:
                return new Errores("Semantico", "AND Invalida", this.linea, this.col)
        }
        
    }

    not(op1: any){

        let opU = this.operandoUnico?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.BOOL:
                this.tipoDato = new Tipo(tipoDato.BOOL)
                return !op1
                
            default:
                return new Errores("Semantico", "NOT invalida", this.linea, this.col)
        }
        
    }

    ArbolAST(anterior: string): string {
        return ''
    }


}


export enum Operadores{
    OR,
    AND,
    NOT
}

