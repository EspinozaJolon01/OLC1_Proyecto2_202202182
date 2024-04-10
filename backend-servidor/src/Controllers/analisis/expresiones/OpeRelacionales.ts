
import { IntruccionesRela } from "../abstracto/InstruccionesRela"; 
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import TipoRelacionales, {tipoDato} from "../simbolo/TipoRelacionales";

export default class OpeRelacionales extends IntruccionesRela {
    private operando1: IntruccionesRela | undefined
    private operando2: IntruccionesRela | undefined
    private operacion: OpRelacional
    

    constructor(operador: OpRelacional, fila: number, col: number, op1: IntruccionesRela, op2: IntruccionesRela) {
        
        super(new TipoRelacionales(tipoDato.VOID), fila, col)
        this.operacion = operador
        this.operando1 = op1
        this.operando2 = op2

    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let opIzq, opDer = null
        opIzq = this.operando1?.interpretar(arbol, tabla)
        opDer = this.operando2?.interpretar(arbol, tabla)


        switch (this.operacion) {
            case OpRelacional.IGUAL:
                return this.igual(opIzq, opDer)
            case OpRelacional.DISTINTO:
                //return this.resta(opIzq, opDer)
            
            default:
                return new Errores("Semantico", "Operador Aritmetico Invalido", this.linea, this.col)
        }
    }

    igual(op1: any, op2: any) {
        if(op1 == op2 ){
            this.tipoDato = new TipoRelacionales(tipoDato.IGUAL)
            return true
        }else{
            this.tipoDato = new TipoRelacionales(tipoDato.IGUAL)
            return false
        }

    }



}

export enum OpRelacional {
    IGUAL,
    DISTINTO,
    MENOR,
    MENORIGUAL,
    MAYOR,
    MAYORIGUAL,
    VOID
}