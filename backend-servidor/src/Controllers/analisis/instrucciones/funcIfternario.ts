import { Instruccion } from '../abstracto/Instruccion';
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";



export default class funcIfternario extends Instruccion {
    private condicion: Instruccion
    private instrucciones: Instruccion 
    private Instrucciones2: Instruccion

    constructor(cond: Instruccion, ins: Instruccion,ins2: Instruccion, linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = cond
        this.instrucciones = ins
        this.Instrucciones2 = ins2
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let cond = this.condicion.interpretar(arbol, tabla)
        if (cond instanceof Errores) return cond

        let instrucciones = this.instrucciones.interpretar(arbol,tabla)
        if(instrucciones instanceof Errores) return instrucciones


        let Instrucciones2 = this.Instrucciones2.interpretar(arbol,tabla)
        if(Instrucciones2 instanceof Errores) return Instrucciones2

        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOL) {
            arbol.Print("\n Error Semantico:"+"La condicion ser bool" + "linea: " + this.linea + "columna:" + (this.col+1))
            return new Errores("SEMANTICO", "La condicion debe ser bool", this.linea, this.col)
        }

        

        if (cond) {
            this.tipoDato = this.instrucciones.tipoDato
            return instrucciones
        }else{
            this.tipoDato = this.Instrucciones2.tipoDato
            return Instrucciones2
        }
    }
}