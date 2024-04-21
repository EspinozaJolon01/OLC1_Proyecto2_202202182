import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import Ast from "../simbolo/AST";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

// enteros y decimales
export default class Nativo extends Instruccion {
    valor: any

    constructor(tipo: Tipo, valor: any, fila: number, col: number) {
        super(tipo, fila, col)
        this.valor = valor
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        return this.valor
    }

    ArbolAST(anterior: string): string {
        let count = Ast.getInstancia()
        let nodoN = `n${count.get()}`
        let ValorNodo = `n${count.get()}`
        let resultado = `${nodoN}[label=\"NUMERO\"];\n`
        resultado += `${ValorNodo}[label=\"${this.valor}\"];\n`
        resultado += `${nodoN}->${ValorNodo};\n`
        resultado += `${anterior}->${nodoN};\n`
        return resultado
    }
}