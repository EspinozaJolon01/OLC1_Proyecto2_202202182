import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Ast from "../simbolo/AST";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";


export default class Aritmeticas extends Instruccion {
    private operando1: Instruccion | undefined
    private operando2: Instruccion | undefined
    private operacion: Operadores
    private operandoUnico: Instruccion | undefined

    constructor(operador: Operadores, fila: number, col: number, op1: Instruccion, op2?: Instruccion) {
        super(new Tipo(tipoDato.ENTERO), fila, col)
        this.operacion = operador
        if (!op2) this.operandoUnico = op1
        else {
            this.operando1 = op1
            this.operando2 = op2
        }
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
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
            case Operadores.SUMA:
                return this.suma(opIzq, opDer)
            case Operadores.RESTA:
                return this.resta(opIzq, opDer)
            case Operadores.MULT:
                return this.mult(opIzq, opDer)
            case Operadores.DIVI:
                return this.div(opIzq, opDer)
            case Operadores.POT:
                return this.potencia(opIzq, opDer)
            case Operadores.NEG:
                return this.negacion(Unico)
            case Operadores.MODUL:
                return this.modulo(opIzq, opDer)
            default:
                arbol.Print("--> Error Semantico:"+"Operador Aritmetico Invalido" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
                return new Errores("Semantico", "Operador Aritmetico Invalido", this.linea, this.col)
        }
    }

    suma(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1) + parseInt(op2)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) + parseFloat(op2)
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return op1 + op2;
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        console.log(op2.charCodeAt(1))
                        return parseInt(op1) + parseInt(op2.charCodeAt(1))
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        if(op2 == true){
                            return parseInt(op1) + 1;
                        }else{
                            return parseInt(op1) + 0;
                        }
                        
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) + parseFloat(op2)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        
                        return parseFloat(op1) + parseFloat(op2)
                    case tipoDato.BOOL:
                            this.tipoDato = new Tipo(tipoDato.DECIMAL)
                            if(op2 == true){
                                return parseFloat(op1) + 1
                            }else{
                                return parseFloat(op1) + 0
                            }
                    case tipoDato.CARACTER:
                                this.tipoDato = new Tipo(tipoDato.ENTERO)
                                console.log(op2.charCodeAt(1))
                                return parseFloat(op1) + parseFloat(op2.charCodeAt(1))
                    case tipoDato.CADENA:
                            this.tipoDato = new Tipo(tipoDato.CADENA)
                            return op1 + op2;
                            
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                }
            case tipoDato.BOOL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        if(op1 == true){
                            return 1 + parseInt(op2)
                        }else{
                            return 0 + parseInt(op2)
                        }
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        if(op1 == true){
                            return 1 + parseFloat(op2)
                        }else{
                            return 0 + parseFloat(op2)
                        } 
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)   
                    case tipoDato.CARACTER:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                            this.tipoDato = new Tipo(tipoDato.CADENA)
                            if(op1 == true){
                                return 1 + op2
                            }else{
                                return 0 + op2
                            }
                            
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1.charCodeAt(1)) + parseInt(op2)
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1.charCodeAt(1)) + parseFloat(op2)
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:    
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return op1 + op2
                    case tipoDato.CADENA:
                            this.tipoDato = new Tipo(tipoDato.CADENA)
                            return op1 + op2
                            
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                }
            case tipoDato.CADENA:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return op1 + op2
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return op1 + op2
                    case tipoDato.BOOL:    
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return op1 + op2
                    case tipoDato.CARACTER:    
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return op1 + op2
                    case tipoDato.CADENA:
                            this.tipoDato = new Tipo(tipoDato.CADENA)
                            return op1 + op2
                            
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
        }

    }

    resta(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1) - parseInt(op2)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) - parseFloat(op2)
                    case tipoDato.BOOL:
                        this.tipoDato =  new Tipo(tipoDato.ENTERO)
                        if(op2 == true){
                            return parseInt(op1) - 1
                        }else{
                            return parseInt(op1) - 0
                        }
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseFloat(op1) - parseInt(op2.charCodeAt(1))
                    case tipoDato.CADENA:
                        console.log("ERROR SEMANTICO")
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) - parseFloat(op2)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) - parseFloat(op2)
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        if(op2 == true){
                            return parseFloat(op1) - 1
                        }else{
                            return parseFloat(op1) - 0
                        }
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) - parseFloat(op2.charCodeAt(1))
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
            case tipoDato.BOOL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        if(op1 == true){
                            return 1 - parseInt(op2)
                        }else{
                            return 0 - parseInt(op2)
                        }    
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        if(op1 == true){
                            return 1 - parseFloat(op2)
                        }else{
                            return 0 - parseFloat(op2)
                        }   
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1.charCodeAt(1)) - parseInt(op2)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1.charCodeAt(1)) - parseFloat(op2)   
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
                    switch (tipo2) {
                        case tipoDato.ENTERO:
                            this.tipoDato = new Tipo(tipoDato.ENTERO)
                            return parseInt(op1.charCodeAt(1)) - parseInt(op2)
                        case tipoDato.DECIMAL:
                            this.tipoDato = new Tipo(tipoDato.DECIMAL)
                            return parseFloat(op1.charCodeAt(1)) - parseFloat(op2)   
                        case tipoDato.BOOL:
                            return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                        case tipoDato.CARACTER:
                            return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                        case tipoDato.CADENA:
                            return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                        default:
                            return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    }
            case tipoDato.CADENA:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.DECIMAL:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
        }

    }


    mult(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1) * parseInt(op2)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) * parseFloat(op2)
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseFloat(op1) * parseInt(op2.charCodeAt(1))
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) * parseFloat(op2)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) * parseFloat(op2)
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) * parseFloat(op2.charCodeAt(1))
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                }
            case tipoDato.BOOL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)  
                    case tipoDato.DECIMAL:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col) 
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1.charCodeAt(1)) * parseInt(op2)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1.charCodeAt(1)) * parseFloat(op2)   
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
                    switch (tipo2) {
                        case tipoDato.ENTERO:
                            return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                        case tipoDato.DECIMAL:
                            return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                        case tipoDato.BOOL:
                            return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                        case tipoDato.CARACTER:
                            return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                        case tipoDato.CADENA:
                            return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                        default:
                            return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    }
            case tipoDato.CADENA:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.DECIMAL:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "MULTIPLICACION Invalida", this.linea, this.col)
        }

    }


    div(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1) / parseInt(op2)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) / parseFloat(op2)
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) / parseInt(op2.charCodeAt(1))
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) / parseFloat(op2)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) / parseFloat(op2)
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) / parseFloat(op2.charCodeAt(1))
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                }
            case tipoDato.BOOL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)  
                    case tipoDato.DECIMAL:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col) 
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1.charCodeAt(1)) / parseInt(op2)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1.charCodeAt(1)) / parseFloat(op2)   
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
                    switch (tipo2) {
                        case tipoDato.ENTERO:
                            return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                        case tipoDato.DECIMAL:
                            return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                        case tipoDato.BOOL:
                            return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                        case tipoDato.CARACTER:
                            return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                        case tipoDato.CADENA:
                            return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                        default:
                            return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    }
            case tipoDato.CADENA:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.DECIMAL:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.BOOL:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.CARACTER:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    case tipoDato.CADENA:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "DIVISION Invalida", this.linea, this.col)
        }

    }
    modulo(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1) % parseInt(op2)
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) % parseFloat(op2)
                    default:
                        return new Errores("Semantico", "Modulo Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) % parseFloat(op2)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op1) % parseFloat(op2)
                    default:
                        return new Errores("Semantico", "Modulo Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Modulo Invalida", this.linea, this.col)
        }

    }


    potencia(op1: any, op2: any) {
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return Math.pow(parseInt(op1),parseInt(op2))
                        
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return Math.pow(parseFloat(op1),parseFloat(op2)) 
                    default:
                        return new Errores("Semantico", "POTENCIA Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return Math.pow(parseFloat(op1),parseFloat(op2)) 
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return Math.pow(parseFloat(op1),parseFloat(op2)) 
                    default:
                        return new Errores("Semantico", "POTENCIA Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "POTENCIA Invalida", this.linea, this.col)
        }

    }

    negacion(op1: any) {
        let opU = this.operandoUnico?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                return parseInt(op1) * -1
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.DECIMAL)
                return parseFloat(op1) * -1
            default:
                return new Errores("Semantico", "Negacion Unaria invalida", this.linea, this.col)
        }
    }


    ArbolAST(anterior: string): string {
        let contador = Ast.getInstancia()
        let datoObtenido = ""
        if (this.operacion == Operadores.NEG) {
            let Neg = `n${contador.get()}`
            let nodoExp = `n${contador.get()}`
            datoObtenido += `${Neg}[label=\"+\"];\n`
            datoObtenido += `${nodoExp}[label=\"EXPRESIONNEG\"];\n`
            datoObtenido += `${anterior}->${Neg};\n`
            datoObtenido += `${anterior}->${nodoExp};\n`
            datoObtenido += this.operandoUnico?.ArbolAST(nodoExp)
            return datoObtenido
        }else if(this.operacion == Operadores.SUMA){
            let Dato1 = `n${contador.get()}`
            let Operacion = `n${contador.get()}`
            let Dato2 = `n${contador.get()}`

            datoObtenido += `${Dato1}[label= \"EXPRESION1\"];\n`
            datoObtenido += `${Operacion}[label=\"-\"];\n`
            datoObtenido += `${Dato2}[label=\"EXPRESION1\"];\n`
            datoObtenido += `${anterior} -> ${Dato1};\n`
            datoObtenido += `${anterior} -> ${Operacion};\n`
            datoObtenido += `${anterior} -> ${Dato2};\n`
            datoObtenido += this.operando1?.ArbolAST(Dato1)
            datoObtenido += this.operando2?.ArbolAST(Dato2)

        }else if(this.operacion == Operadores.RESTA){
            let Dato1 = `n${contador.get()}`
            let Operacion = `n${contador.get()}`
            let Dato2 = `n${contador.get()}`

            datoObtenido += `${Dato1}[label= \"EXPRESION1\"];\n`
            datoObtenido += `${Operacion}[label=\"-\"];\n`
            datoObtenido += `${Dato2}[label=\"EXPRESION2\"];\n`
            datoObtenido += `${anterior} -> ${Dato1};\n`
            datoObtenido += `${anterior} -> ${Operacion};\n`
            datoObtenido += `${anterior} -> ${Dato2};\n`
            datoObtenido += this.operando1?.ArbolAST(Dato1)
            datoObtenido += this.operando2?.ArbolAST(Dato2)

        }else if(this.operacion == Operadores.DIVI){
            let Dato1 = `n${contador.get()}`
            let Operacion = `n${contador.get()}`
            let Dato2 = `n${contador.get()}`

            datoObtenido += `${Dato1}[label= \"EXPRESION1\"];\n`
            datoObtenido += `${Operacion}[label=\"/\"];\n`
            datoObtenido += `${Dato2}[label=\"EXPRESION2\"];\n`
            datoObtenido += `${anterior} -> ${Dato1};\n`
            datoObtenido += `${anterior} -> ${Operacion};\n`
            datoObtenido += `${anterior} -> ${Dato2};\n`
            datoObtenido += this.operando1?.ArbolAST(Dato1)
            datoObtenido += this.operando2?.ArbolAST(Dato2)


        }else if(this.operacion == Operadores.MULT){
            let Dato1 = `n${contador.get()}`
            let Operacion = `n${contador.get()}`
            let Dato2 = `n${contador.get()}`

            datoObtenido += `${Dato1}[label= \"EXPRESION1\"];\n`
            datoObtenido += `${Operacion}[label=\"*\"];\n`
            datoObtenido += `${Dato2}[label=\"EXPRESION2\"];\n`
            datoObtenido += `${anterior} -> ${Dato1};\n`
            datoObtenido += `${anterior} -> ${Operacion};\n`
            datoObtenido += `${anterior} -> ${Dato2};\n`
            datoObtenido += this.operando1?.ArbolAST(Dato1)
            datoObtenido += this.operando2?.ArbolAST(Dato2)

        }else if(this.operacion ==  Operadores.POT){
            let Dato1 = `n${contador.get()}`
            let Dato2 = `n${contador.get()}`
            let par1 = `n${contador.get()}`
            let par2 = `n${contador.get()}`
            let nodoPow = `n${contador.get()}`
            let nodoComa = `n${contador.get()}`
            datoObtenido += `${nodoPow}[label="pow"];\n`
            datoObtenido += `${par1}[label="("];\n`
            datoObtenido += `${Dato1}[label="EXPRESION1"];\n`
            datoObtenido += `${nodoComa}[label=","];\n`
            datoObtenido += `${Dato2}[label="EXPRESION2"];\n`
            datoObtenido += `${par2}[label=")"];\n`
            datoObtenido += `${anterior} -> ${nodoPow};\n`
            datoObtenido += `${anterior} -> ${par1};\n`
            datoObtenido += `${anterior} -> ${Dato1};\n`
            datoObtenido += `${anterior} -> ${nodoComa};\n`
            datoObtenido += `${anterior} -> ${Dato2};\n`
            datoObtenido += `${anterior} -> ${par2};\n`

            datoObtenido += this.operando1?.ArbolAST(Dato1)
            datoObtenido += this.operando2?.ArbolAST(Dato2)

        }else if(this.operacion == Operadores.MODUL){
            let Dato1 = `n${contador.get()}`
            let Operacion = `n${contador.get()}`
            let Dato2 = `n${contador.get()}`

            datoObtenido += `${Dato1}[label= \"EXPRESION1\"];\n`
            datoObtenido += `${Operacion}[label=\"%\"];\n`
            datoObtenido += `${Dato2}[label=\"EXPRESION2\"];\n`
            datoObtenido += `${anterior} -> ${Dato1};\n`
            datoObtenido += `${anterior} -> ${Operacion};\n`
            datoObtenido += `${anterior} -> ${Dato2};\n`
            datoObtenido += this.operando1?.ArbolAST(Dato1)
            datoObtenido += this.operando2?.ArbolAST(Dato2)

        }
        
        return datoObtenido
    }

    

}

export enum Operadores {
    SUMA,
    RESTA,
    MULT,
    DIVI,
    MODUL,
    POT,
    NEG
}