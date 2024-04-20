import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./funBreak";
import funContinue from "./funContinue";

/*

do{
    intrucciones
}while(expresion);

*/


export default class funDoWhile extends Instruccion{
    private condicion:Instruccion
    private intrucciones: Instruccion[]


    constructor(cond: Instruccion, ins: Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = cond
        this.intrucciones = ins
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let cond = this.condicion.interpretar(arbol, tabla)
        if (cond instanceof Errores) return cond

        // validaciones
        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOL) {
            arbol.Print("--> Error Semantico:"+"La condicion debe ser bool" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "La condicion debe ser bool", this.linea, this.col)
        }

        //comienza hacer el do while

        do{
            let newTabla = new tablaSimbolo(tabla)
            newTabla.setNombre("Sentencia do while")
            for (let i of this.intrucciones) {
                if (i instanceof Break) return;
                if (i instanceof funContinue) break;

                let resultado = i.interpretar(arbol, newTabla)
                
                if (resultado instanceof Break) return;
                if (resultado instanceof funContinue) break;
                // los errores les quedan de tarea
            }

        }while(this.condicion.interpretar(arbol, tabla))

        
    }
}