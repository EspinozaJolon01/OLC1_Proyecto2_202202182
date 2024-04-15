import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./funBreak";
import funContinue from "./funContinue";




export default class funcIf extends Instruccion {
    private condicion: Instruccion;
    private instrucciones: Instruccion[];
    private instruccioneselse: Instruccion[] | undefined;

    constructor(cond: Instruccion, ins: Instruccion[], linea: number, col: number, inelse?: Instruccion[]) {
        super(new Tipo(tipoDato.VOID), linea, col);
        this.condicion = cond;
        this.instrucciones = ins;
        this.instruccioneselse = inelse;
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let cond = this.condicion.interpretar(arbol, tabla);
        if (cond instanceof Errores) return cond;

        // Validación
        if (this.condicion.tipoDato.getTipo() !== tipoDato.BOOL) {
            return new Errores("SEMANTICO", "La condición debe ser booleana", this.linea, this.col);
        }

        let newTabla = new tablaSimbolo(tabla);
        newTabla.setNombre("Sentencia IF");

        if (cond) {
            for (let i of this.instrucciones) {
                if (i instanceof Break) return i;
                let resultado = i.interpretar(arbol, newTabla);
                // Los errores quedan pendientes
            }
        } else {
            if (this.instruccioneselse) {
                let newTabla1 = new tablaSimbolo(tabla);
                newTabla1.setNombre("Sentencia ELSE");
                for (let i of this.instruccioneselse) {
                    if (i instanceof Break) return i;
                    if (i instanceof funContinue) return i;
                    let resultado1 = i.interpretar(arbol, newTabla1);
                    if(resultado1 instanceof Errores) return resultado1
                    // Los errores quedan pendientes
                }
            }
        }
    }
}


