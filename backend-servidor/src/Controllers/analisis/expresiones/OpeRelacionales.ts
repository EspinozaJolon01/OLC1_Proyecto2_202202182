

import { Instruccion } from "../abstracto/Instruccion";

import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class OpeRelacionales extends Instruccion {
    private operando1: Instruccion | undefined
    private operando2: Instruccion | undefined
    private operacion: OpRelacional
    

    constructor(operador: OpRelacional, fila: number, col: number, op1: Instruccion, op2?: Instruccion) {
        super(new Tipo(tipoDato.BOOL), fila, col)
        this.operacion = operador
        this.operando1 = op1
        this.operando2 = op2
        
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let opIzq, opDer = null
        opIzq = this.operando1?.interpretar(arbol, tabla)
        if(opIzq instanceof Errores) return opIzq
        
        opDer = this.operando2?.interpretar(arbol, tabla)
        if(opDer instanceof Errores) return opDer
            
        

        switch (this.operacion) {
            case OpRelacional.IGUAL:
                return this.igual(opIzq, opDer)
            case OpRelacional.DISTINTO:
                return this.distinto(opIzq, opDer)
            case OpRelacional.MAYOR:
                return this.mayor(opIzq, opDer)
            case OpRelacional.MENORIGUALES:
                return this.menorigual(opIzq, opDer)
            case OpRelacional.MENOR:
                return this.menor(opIzq, opDer)
            case OpRelacional.MAYORIGUAL:
                return this.mayorigual(opIzq, opDer)
            default:
                return new Errores("Semantico", "Operador Relacional Invalido", this.linea, this.col)
        }
    }

    igual(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 == op2
                        
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 == op2
                        
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Igualación Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 == op2.charCodeAt(1)
                        
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "Igualación Invalida", this.linea, this.col)
                        
                    default:
                        return new Errores("Semantico", "Igualación Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 == op2
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 == op2
                        
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 == op2
                        
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 == op2.charCodeAt(1)
                        
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Igualación Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "Igualación Invalida", this.linea, this.col)
                }
            case tipoDato.BOOL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 == op2
                        
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 == op2
                        
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 == op2
                        
                    case tipoDato.CARACTER:
                        return new Errores("Semantico", "Igualación Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 == op2.charCodeAt(1)
                        
                            
                    default:
                        return new Errores("Semantico", "Igualación Invalida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1.charCodeAt(1) == op2
                        
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1.charCodeAt(1) == op2
                        
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1.charCodeAt(1) == op2
                        
                    case tipoDato.CARACTER:    
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1.charCodeAt(1) == op2.charCodeAt(1)
                        
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Igualación Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "Igualación Invalida", this.linea, this.col)
                }
            case tipoDato.CADENA:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        return new Errores("Semantico", "Igualación Invalida", this.linea, this.col)
                        
                    case tipoDato.DECIMAL:
                        return new Errores("Semantico", "Igualación Invalida", this.linea, this.col)
                    case tipoDato.BOOL:    
                        return new Errores("Semantico", "Igualación Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:    
                        return new Errores("Semantico", "Igualación Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 == op2
                        
                            
                    default:
                        return new Errores("Semantico", "Igualación Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Igualación Invalida", this.linea, this.col)
        }

    }

    distinto(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 != op2
                        
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 != op2
                        
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Distinto Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 != op2.charCodeAt(1)
                        
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 != op2
                        
                        
                    default:
                        return new Errores("Semantico", "Distinto Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 != op2
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 != op2
                        
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 != op2 
                        
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 != op2.charCodeAt(1)
                        
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Distinto Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "Distinto Invalida", this.linea, this.col)
                }
            case tipoDato.BOOL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 != op2
                        
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 != op2
                        
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 != op2
                        
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 != op2.charCodeAt(1)
                        
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Distinto Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "Distinto Invalida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1.charCodeAt(1) != op2
                        
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1.charCodeAt(1) != op2
                        
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1.charCodeAt(1) != op2
                        
                    case tipoDato.CARACTER:    
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1.charCodeAt(1) != op2.charCodeAt(1)
                        
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Distinto Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "Distinto Invalida", this.linea, this.col)
                }
            case tipoDato.CADENA:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        return new Errores("Semantico", "Distinto Invalida", this.linea, this.col)
                        
                    case tipoDato.DECIMAL:
                        return new Errores("Semantico", "Distinto Invalida", this.linea, this.col)
                    case tipoDato.BOOL:    
                        return new Errores("Semantico", "Distinto Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:    
                        return new Errores("Semantico", "Distinto Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if(op1 != op2){
                            return true
                        }else{
                            return false
                        }
                            
                    default:
                        return new Errores("Semantico", "Distinto Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Distinto Invalida", this.linea, this.col)
        }

    }

    menor(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1) < parseInt(op2)
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1)  < parseFloat(op2)
                        
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 < op2.charCodeAt(1)
                        
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                        
                    default:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1) < parseFloat(op2)
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1) < parseFloat(op2)
                        
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1) < parseInt(op2.charCodeAt(1))
                            
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                }
            case tipoDato.BOOL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.DECIMAL:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1.charCodeAt(1)) < parseInt(op2)
                        
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1.charCodeAt(1)) < parseFloat(op2)
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:    
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1.charCodeAt(1)) < parseInt(op2)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                }
            case tipoDato.CADENA:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                        
                    case tipoDato.DECIMAL:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.BOOL:    
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:    
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)

                            
                    default:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
        }

    }

    menorigual(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1) <= parseInt(op2)  
                            
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1) <= parseFloat(op2)  
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1) <= parseInt(op2.charCodeAt(1)) 
                            
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                        
                    default:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1) <= parseFloat(op2)
                            
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1) <= parseFloat(op2) 
                        
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1) <= parseInt(op2.charCodeAt(1))
                            
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                }
            case tipoDato.BOOL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.DECIMAL:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1.charCodeAt(1)) <= parseInt(op2) 
                            
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1.charCodeAt(1)) <= parseFloat(op2) 
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)

                        
                    case tipoDato.CARACTER:    
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1.charCodeAt(1)) <= parseInt(op2.charCodeAt(1))
                            
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                }
            case tipoDato.CADENA:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                        
                    case tipoDato.DECIMAL:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.BOOL:    
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:    
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return op1 <= op2
                                    
                    default:
                        return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "MENOR QUE Invalida", this.linea, this.col)
        }

    }


    mayor(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1) > parseInt(op2)
                        
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1) > parseFloat(op2)
                        
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1) > parseInt(op2.charCodeAt(1))
                        
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                        
                    default:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:  
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1) > parseFloat(op2)
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1) > parseFloat(op2)
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)

                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1) > parseInt(op2.charCodeAt(1))
                            
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                }
            case tipoDato.BOOL:
                switch (tipo2) {      
                    case tipoDato.ENTERO:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                        
                    case tipoDato.DECIMAL:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)

                    case tipoDato.BOOL:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1.charCodeAt(1)) > parseInt(op2)
                        
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1.charCodeAt(1)) > (op2)
                        
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:    
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1.charCodeAt(1)) > parseInt(op2.charCodeAt(1))
                        
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                }
            case tipoDato.CADENA:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                        
                    case tipoDato.DECIMAL:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                    case tipoDato.BOOL:    
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:    
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col) 
                    default:
                        return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "mayor Invalida", this.linea, this.col)
        }

    }


    mayorigual(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1) >= parseInt(op2)
                        
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1) >= parseFloat(op2)
                        
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1) >= parseInt(op2.charCodeAt(1))
                        
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                        
                    default:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1) >= parseInt(op2)
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1) >= parseFloat(op2)
                        
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)

                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(op1) >= parseInt(op2.charCodeAt(1))
                        
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                }
            case tipoDato.BOOL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                        
                    case tipoDato.DECIMAL:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)

                    case tipoDato.BOOL:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1.charCodeAt(1)) >= parseInt(op2)
                        
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1.charCodeAt(1)) >= parseFloat(op2)
                        
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:    
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(op1.charCodeAt(1)) >= parseInt(op2.charCodeAt(1))
                        
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                            
                    default:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                }
            case tipoDato.CADENA:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                        
                    case tipoDato.DECIMAL:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                    case tipoDato.BOOL:    
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:    
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col) 
                    default:
                        return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Mayor Igual Invalida", this.linea, this.col)
        }

    }



}

export enum OpRelacional {
    IGUAL,
    DISTINTO,
    MENOR,
    MENORIGUALES,
    MAYOR,
    MAYORIGUAL,
    VOID
}