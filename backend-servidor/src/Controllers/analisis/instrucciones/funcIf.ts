import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from '../simbolo/Arbol';
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./funBreak";
import funContinue from "./funContinue";
import funReturn from "./funReturn";




export default class funcIf extends Instruccion {
    private condicion: Instruccion;
    private instrucciones: Instruccion[];
    private instruccioneselse: Instruccion[] | undefined;
    private condicion_ifelse : Instruccion | undefined;

    constructor(cond: Instruccion, ins: Instruccion[], linea: number, col: number,condielse: Instruccion | undefined, inelse?: Instruccion[] | undefined) {
        super(new Tipo(tipoDato.VOID), linea, col);
        this.condicion = cond;
        this.instrucciones = ins;
        this.instruccioneselse = inelse;
        this.condicion_ifelse = condielse
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let cond = this.condicion.interpretar(arbol, tabla);
        if (cond instanceof Errores) return cond;

        // Validación
        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOL) {
            arbol.Print("--> Error Semantico:"+"La condicion debe ser bool" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "La condición debe ser booleana", this.linea, this.col);
        }

        

        if (cond) {
            console.log("entre a este if")
            let newTabla = new tablaSimbolo(tabla);
            newTabla.setNombre("Sentencia IF");
            Arbol.listSimbolo.push(newTabla)
            for (let i of this.instrucciones) {
                // if (i instanceof Break) return i;
                // if (i instanceof funContinue) return i;
                // if(i instanceof funReturn) return i;
                // console.log("con el i", i)
                let resultado = i.interpretar(arbol, newTabla);
                if(resultado instanceof Errores) return resultado
                console.log(resultado)
                if(resultado instanceof funReturn) return resultado;
                if (resultado instanceof Break) return resultado;
                if (resultado instanceof funContinue) return resultado;
            }
        } else {
            if (this.instruccioneselse != undefined) {
                let newTabla1 = new tablaSimbolo(tabla);
                newTabla1.setNombre("Sentencia ELSE");
                Arbol.listSimbolo.push(newTabla1)
                for (let i of this.instruccioneselse) {
                    // if (i instanceof Break) return i;
                    // if (i instanceof funContinue) return i;
                    // if(i instanceof funReturn) return i;
                    let resultado1 = i.interpretar(arbol, newTabla1);
                    if(resultado1 instanceof Errores) return resultado1
                    if(resultado1 instanceof funReturn) return resultado1;
                    if (resultado1 instanceof Break) return resultado1;
                    if (resultado1 instanceof funContinue) return resultado1;
                    // Los errores quedan pendientes
                }
            }else if(this.condicion_ifelse != undefined){
                let ielsi = this.condicion_ifelse?.interpretar(arbol,tabla)
                if(ielsi instanceof Errores) return ielsi
                if (ielsi instanceof Break) return ielsi;
                if(ielsi instanceof funReturn) return ielsi;
                if (ielsi instanceof funContinue) return ielsi;

            }
        }
    }

    ArbolAST(anterior: string): string {
        return ''
    }
}


