import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Ast from "../simbolo/AST";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'

export default class AsignacionVar extends Instruccion {
    private id: string
    private exp: Instruccion

    constructor(id: string, exp: Instruccion, linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.id = id
        this.exp = exp
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let NewValor = this.exp.interpretar(arbol, tabla)
        if (NewValor instanceof Errores) return NewValor

        let valor = tabla.getVariable(this.id.toLocaleLowerCase())
        if (valor == null){
            arbol.Print("--> Error Semantico:"+"varDAT no existente." + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "varDAT no existente", this.linea, this.col)
        } 

        if (this.exp.tipoDato.getTipo() != valor.getTipo().getTipo()){
            arbol.Print("--> Error Semantico:"+"Asignacion incorrecta" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICO", "Asignacion incorrecta", this.linea, this.col)
        } 

        this.tipoDato = valor.getTipo()
        valor.setValor(NewValor)


    }

    ArbolAST(anterior: string): string {
        let Bandera = Ast.getInstancia();
        let getDato = "";


        let Cabeza = `n${Bandera.get()}`;
        let varDAT = `n${Bandera.get()}`;
        let varNom = `n${Bandera.get()}`;
        let sigIgual = `n${Bandera.get()}`;
        let asignacion = `n${Bandera.get()}`;

        getDato += ` ${Cabeza}[label="ASIGNACION"];\n`;
        getDato += `${varDAT}[label="ID"];\n`;
        getDato += `${varNom}[label="${this.id}"];\n`;
        getDato += `${sigIgual}[label="="];\n`;
        getDato += `${asignacion}[label="EXPRESION"];\n`;

        getDato += ` ${anterior} -> ${Cabeza};\n`;
        getDato += `${Cabeza} -> ${varDAT};\n`;
        getDato += `${varDAT} -> ${varNom};\n`;
        getDato += `${Cabeza} -> ${sigIgual};\n`;
        getDato += `${Cabeza} -> ${asignacion};\n`;

        getDato += this.exp.ArbolAST(asignacion);

        return getDato;
    }
}