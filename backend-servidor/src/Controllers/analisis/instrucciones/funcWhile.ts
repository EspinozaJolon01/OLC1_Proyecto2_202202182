import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Ast from "../simbolo/AST";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./funBreak";
import funContinue from "./funContinue";
import funReturn from "./funReturn";

/*
while(exp){
    instrucciones
}
*/
export default class funcWhile extends Instruccion {
    private condicion: Instruccion
    private instrucciones: Instruccion[]

    constructor(condiciones: Instruccion, ins: Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = condiciones
        this.instrucciones = ins
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let condiciones = this.condicion.interpretar(arbol, tabla)
        if (condiciones instanceof Errores) return condiciones

        // validaciones
        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOL) {
            arbol.Print("--> Error Semantico:"+"La condicion debe ser bool" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "La condicion debe ser bool", this.linea, this.col)
        }

        while (this.condicion.interpretar(arbol, tabla)) {
            let newTabla = new tablaSimbolo(tabla)
            newTabla.setNombre("Sentencia While")
            Arbol.listSimbolo.push(newTabla)
            for (let i of this.instrucciones) {
                if (i instanceof Break) return;
                if (i instanceof funContinue) break;
                let resultado = i.interpretar(arbol, newTabla)
                if (resultado instanceof Break) return;
                if (resultado instanceof funContinue) break;
                if (resultado instanceof funReturn) return resultado;
                
                // los errores les quedan de tarea
            }
        }
    }

    ArbolAST(anterior: string): string {
        let result = "";
        let Bandera = Ast.getInstancia();
        let TodoInstrucc = [];

        let cabeza = `n${Bandera.get()}`;
        let WHILE = `n${Bandera.get()}`;
        let PAR1 = `n${Bandera.get()}`;
        let condiciones = `n${Bandera.get()}`;
        let par2 = `n${Bandera.get()}`;
        let LLAVE = `n${Bandera.get()}`;
        let cabezaIns = `n${Bandera.get()}`;

        for(let i = 0; i < this.instrucciones.length; i++){
            TodoInstrucc.push(`n${Bandera.get()}`);
        }

        let llav2 = `n${Bandera.get()}`;

        result += ` ${cabeza}[label="CICLO"];\n`;
        result += ` ${WHILE}[label="WHILE"];\n`;
        result += ` ${PAR1}[label="("];\n`;
        result += ` ${condiciones}[label="EXPRESION"];\n`;
        result += ` ${par2}[label=")"];\n`;
        result += ` ${LLAVE}[label="{"];\n`;
        result += ` ${cabezaIns}[label="INTRUCCIONES"];\n`;

        for(let i = 0; i < this.instrucciones.length; i++){
            result += ` ${TodoInstrucc[i]}[label="INTRUCCION"];\n`;
        }

        result += ` ${llav2}[label="}"];\n`;

        result += ` ${anterior} -> ${cabeza};\n`;
        result += ` ${cabeza} -> ${WHILE};\n`;
        result += ` ${cabeza} -> ${PAR1};\n`;
        result += ` ${cabeza} -> ${condiciones};\n`;
        result += ` ${cabeza} -> ${par2};\n`;
        result += ` ${cabeza} -> ${LLAVE};\n`;
        result += ` ${cabeza} -> ${cabezaIns};\n`;

        for(let i = 0; i < this.instrucciones.length; i++){
            result += ` ${cabezaIns} -> ${TodoInstrucc[i]};\n`;
        }

        result += ` ${cabeza} -> ${llav2};\n`;

        for(let i = 0; i < this.instrucciones.length; i++){
            result += this.instrucciones[i].ArbolAST(TodoInstrucc[i]);
        }

        result += this.condicion.ArbolAST(condiciones);
        

        return result;

    }
}