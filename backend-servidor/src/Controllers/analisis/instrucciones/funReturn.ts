import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Ast from "../simbolo/AST";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class funReturn extends Instruccion {
    private expresiones?: Instruccion
    public valor = null

    constructor(linea: number, columna: number, expresiones?: Instruccion) {
        super(new Tipo(tipoDato.ENTERO), linea, columna)
        this.expresiones = expresiones
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        if(this.expresiones) {
            let dato = this.expresiones.interpretar(arbol, tabla)
            this.valor = dato
            if(dato instanceof Errores) return dato
            this.tipoDato.setTipo(this.expresiones.tipoDato.getTipo())
        }
        return this
    }


    ArbolAST(anterior: string): string {
        let bandera = Ast.getInstancia();
        let result = "";

        let RETU = `n${bandera.get()}`;
        let EXPRESION = `n${bandera.get()}`;

        let puntCon = `n${bandera.get()}`;

        result += `${RETU}[label="RETURN"];\n`;
        if(this.expresiones != undefined){
            result += `${EXPRESION}[label="EXPRSIONES"];\n`;
        }

        result += `${puntCon}[label=";"];\n`;

        result += `${anterior} -> ${RETU};\n`;
        if(this.expresiones != undefined){
            result += `${anterior} -> ${EXPRESION};\n`;
        }

        result += `${anterior} -> ${puntCon};\n`;

        if(this.expresiones != undefined){
            result += this.expresiones.ArbolAST(EXPRESION);
        }
        

        return result;

    }
}
