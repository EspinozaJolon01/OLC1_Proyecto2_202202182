import { Instruccion } from "../abstracto/Instruccion";

import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Ast from "../simbolo/AST";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";





export default class FuncUtilidades extends Instruccion{
    private operando1: Instruccion | undefined
    private operando2: Instruccion | undefined
    private operacion:Operadores
    private operandoUnido: Instruccion 

    constructor(operador: Operadores, fila:number, col:number,op1: Instruccion, op2?: Instruccion){
        super(new Tipo(tipoDato.VOID), fila, col)
        this.operacion = operador
        this.operandoUnido = op1
        
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let opIzq,opDer,unico = null
        
            unico = this.operandoUnido.interpretar(arbol,tabla)
            if(unico instanceof Errores) return unico
        
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
        
        let contador = Ast.getInstancia();
        let result = "";

        if(this.operacion == Operadores.Length){

            let cabeza = `n${contador.get()}`;
            let EXPRESI = `n${contador.get()}`;
            let PUNTO = `n${contador.get()}`;
            let unicos = `n${contador.get()}`;
            let par1 = `n${contador.get()}`;
            let par2 = `n${contador.get()}`;
            let puntCom = `n${contador.get()}`;
    
            result += `${cabeza}[label="NAT"];\n`;
            result += `${EXPRESI}[label="EXPRESION"];\n`;
            result += `${PUNTO}[label="."];\n`;
            result += `${unicos}[label="length"];\n`;
            result += `${par1}[label="("];\n`;
            result += `${par2}[label=")"];\n`;
            result += `${puntCom}[label=";"];\n`;

            result += `${anterior} -> ${cabeza};\n`;
            result += `${cabeza} -> ${EXPRESI}\n;`;
            result += `${cabeza} -> ${PUNTO}\n;`;
            result += `${cabeza} -> ${unicos};\n`;
            result += `${cabeza} -> ${par1}\n;`;
            result += `${cabeza} -> ${par2}\n;`;
            result += `${cabeza} -> ${puntCom};\n`;

            result += this.operandoUnido?.ArbolAST(EXPRESI);


        }else if(this.operacion == Operadores.Typeof){

            let cabeza = `n${contador.get()}`;
            let unicos = `n${contador.get()}`;
            let par1 = `n${contador.get()}`;
            let EXPRESI = `n${contador.get()}`;
            let par2 = `n${contador.get()}`;
            let puntCom = `n${contador.get()}`;

            result += `${cabeza}[label="NAT"];\n`;
            result += `${unicos}[label="typeof"];\n`;
            result += `${par1}[label="("];\n`;
            result += `${EXPRESI}[label="EXPRESION"];\n`;
            result += `${par2}[label=")"];\n`;
            result += `${puntCom}[label=";"];\n`;

            result += `${anterior} -> ${cabeza};\n`;
            result += `${cabeza} -> ${unicos};\n`;
            result += `${cabeza} -> ${par1};\n`;
            result += `${cabeza} -> ${EXPRESI};\n`;
            result += `${cabeza} -> ${par2};\n`;
            result += `${cabeza} -> ${puntCom};\n`;

            result += this.operandoUnido?.ArbolAST(EXPRESI);

        }else if(this.operacion == Operadores.toupper){

            let cabeza = `n${contador.get()}`;
            let unicos = `n${contador.get()}`;
            let par1 = `n${contador.get()}`;
            let EXPRESI = `n${contador.get()}`;
            let par2 = `n${contador.get()}`;
            let puntCom = `n${contador.get()}`;

            result += `${cabeza}[label="NAT"];\n`;
            result += `${unicos}[label="toUpper"];\n`;
            result += `${par1}[label="("];\n`;
            result += `${EXPRESI}[label="EXPRESION"];\n`;
            result += `${par2}[label=")"];\n`;
            result += `${puntCom}[label=";"];\n`;

            result += `${anterior} -> ${cabeza};\n`;
            result += `${cabeza} -> ${unicos};\n`;
            result += `${cabeza} -> ${par1};\n`;
            result += `${cabeza} -> ${EXPRESI};\n`;
            result += `${cabeza} -> ${par2};\n`;
            result += `${cabeza} -> ${puntCom};\n`;

            result += this.operandoUnido?.ArbolAST(EXPRESI);

        }else if(this.operacion == Operadores.tolower){

            let cabeza = `n${contador.get()}`;
            let unicos = `n${contador.get()}`;
            let par1 = `n${contador.get()}`;
            let EXPRESI = `n${contador.get()}`;
            let par2 = `n${contador.get()}`;
            let puntCom = `n${contador.get()}`;

            result += `${cabeza}[label="NAT"];\n`;
            result += `${unicos}[label="toLower"];\n`;
            result += `${par1}[label="("];\n`;
            result += `${EXPRESI}[label="EXPRESION"];\n`;
            result += `${par2}[label=")"];\n`;
            result += `${puntCom}[label=";"];\n`;

            result += `${anterior} -> ${cabeza};\n`;
            result += `${cabeza} -> ${unicos};\n`;
            result += `${cabeza} -> ${par1};\n`;
            result += `${cabeza} -> ${EXPRESI};\n`;
            result += `${cabeza} -> ${par2};\n`;
            result += `${cabeza} -> ${puntCom};\n`;

            result += this.operandoUnido?.ArbolAST(EXPRESI);

        }else if(this.operacion == Operadores.round){

            let cabeza = `n${contador.get()}`;
            let unicos = `n${contador.get()}`;
            let par1 = `n${contador.get()}`;
            let EXPRESI = `n${contador.get()}`;
            let par2 = `n${contador.get()}`;
            let puntCom = `n${contador.get()}`;

            result += `${cabeza}[label="NAT"];\n`;
            result += `${unicos}[label="round"];\n`;
            result += `${par1}[label="("];\n`;
            result += `${EXPRESI}[label="EXPRESION"];\n`;
            result += `${par2}[label=")"];\n`;
            result += `${puntCom}[label=";"];\n`;

            result += `${anterior} -> ${cabeza};\n`;
            result += `${cabeza} -> ${unicos};\n`;
            result += `${cabeza} -> ${par1};\n`;
            result += `${cabeza} -> ${EXPRESI};\n`;
            result += `${cabeza} -> ${par2};\n`;
            result += `${cabeza} -> ${puntCom};\n`;

            result += this.operandoUnido?.ArbolAST(EXPRESI);

        }else if(this.operacion == Operadores.ToString){

            let cabeza = `n${contador.get()}`;
            let std = `n${contador.get()}`;
            let dosp1 = `n${contador.get()}`;
            let dosp2 = `n${contador.get()}`;
            let unicos = `n${contador.get()}`;
            let par1 = `n${contador.get()}`;
            let EXPRESI = `n${contador.get()}`;
            let par2 = `n${contador.get()}`;
            let puntCom = `n${contador.get()}`;

            result += `${cabeza}[label="NAT"];\n`;
            result += `${std}[label="std"];\n`;
            result += `${dosp1}[label=":"];\n`;
            result += `${dosp2}[label=":"];\n`;
            result += `${unicos}[label="toString"];\n`;
            result += `${par1}[label="("];\n`;
            result += `${EXPRESI}[label="EXPRESION"];\n`;
            result += `${par2}[label=")"];\n`;
            result += `${puntCom}[label=";"];\n`;

            result += `${anterior} -> ${cabeza};\n`;
            result += `${cabeza} -> ${std};\n`;
            result += `${cabeza} -> ${dosp1};\n`;
            result += `${cabeza} -> ${dosp2};\n`;
            result += `${cabeza} -> ${unicos};\n`;
            result += `${cabeza} -> ${par1};\n`;
            result += `${cabeza} -> ${EXPRESI};\n`;
            result += `${cabeza} -> ${par2};\n`;
            result += `${cabeza} -> ${puntCom};\n`;

            result += this.operandoUnido?.ArbolAST(EXPRESI);

        }

        return result;
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