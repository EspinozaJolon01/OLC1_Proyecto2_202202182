import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Ast from "../simbolo/AST";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class AccesoVar extends Instruccion {
    private id: string
    private dato: any | null = null

    constructor(id: string, linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.id = id
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valorVariable: Simbolo = <Simbolo> tabla.getVariable(this.id)
        
        if (valorVariable == null){
            arbol.Print("--> Error Semantico:"+"Acceso invalido" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "Acceso invalido ", this.linea, this.col)
        }
            
        this.tipoDato = valorVariable.getTipo()
        this.dato = valorVariable.getValor()
        return valorVariable.getValor()
    }

    ArbolAST(anterior: string): string {
        let result = "";
        let bandera = Ast.getInstancia();

        let declareciones = `n${bandera.get()}`;

        result += ` ${declareciones}[label="${this.dato}"];\n`;

        result += ` ${anterior} -> ${declareciones};\n`;

        return result;
    }
}