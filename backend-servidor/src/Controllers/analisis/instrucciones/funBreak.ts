import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Ast from "../simbolo/AST";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class Break extends Instruccion {
    constructor(linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        return;
    }

    ArbolAST(anterior: string): string {
        let bandera = Ast.getInstancia()
        let getDatos = "";

        let BREAK = `n${bandera.get()}`;
        let punCo = `n${bandera.get()}`;


        getDatos += `${BREAK}[label="Break"];\n`;
        getDatos += `${punCo}[label=";"];\n`;

        getDatos += `${anterior} -> ${BREAK};\n`;
        getDatos += `${anterior} -> ${punCo};\n`;

        return getDatos;
    }
}