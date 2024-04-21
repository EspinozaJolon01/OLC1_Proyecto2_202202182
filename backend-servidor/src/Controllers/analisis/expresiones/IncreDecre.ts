import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Ast from "../simbolo/AST";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class IncreDecre extends Instruccion {
    private operando1: string
    private operando2: boolean
    

    constructor(fila: number, col: number, op1: string, op2: boolean) {
        super(new Tipo(tipoDato.VOID), fila, col)
        this.operando1 = op1
        this.operando2 = op2
        
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let dato = tabla.getVariable(this.operando1.toLocaleLowerCase());

        if (dato == null) {
            console.log("VARIABLE NO EXISTE");
            arbol.Print("--> Error Semantico:"+"VARIABLE NO EXISTEa" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores("SEMANTICA", "VARIABLE NO EXISTE", this.linea, this.col);
        }
        
        if (dato.getTipo().getTipo() != tipoDato.ENTERO && dato.getTipo().getTipo() != tipoDato.DECIMAL) {
            console.log("NO SE PUEDE");
            arbol.Print("--> Error Semantico:"+"NO es del mismo tipo" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
            return new Errores('SEMANTICO', 'NO SE PUEDE', this.linea, this.col);
        }
        
        if (this.operando2 == true) {
            if (dato.getTipo().getTipo() == tipoDato.ENTERO) {
                dato.setValor(parseInt(dato.getValor()) + 1);
            } else {
                dato.setValor(parseFloat(dato.getValor()) + 1);
            }
        } else {
            if (dato.getTipo().getTipo() == tipoDato.ENTERO) {
                dato.setValor(parseInt(dato.getValor()) - 1);
            } else {
                dato.setValor(parseFloat(dato.getValor()) - 1);
            }
        }
        
        
        
    }

    ArbolAST(anterior: string): string {
        let bandera = Ast.getInstancia();
        let datoObt = "";

        let ident = `n${bandera.get()}`;
        let nombre = `n${bandera.get()}`;
        let mas1 = `n${bandera.get()}`;
        let mas2 = `n${bandera.get()}`;

        datoObt += ` ${ident}[label="IDENTIFICADOR"];\n`;
        datoObt += ` ${nombre}[label="${this.operando1}"];\n`;

        if(this.operando2 == true){
            datoObt += ` ${mas1}[label="+"];\n`;
            datoObt += ` ${mas2}[label="+"];\n`;
        }else{
            datoObt += ` ${mas1}[label="-"];\n`;
            datoObt += ` ${mas2}[label="-"];\n`;
        }

        datoObt += ` ${anterior} -> ${ident};\n`;
        datoObt += ` ${ident} -> ${nombre};\n`;
        datoObt += `${anterior} -> ${mas1};\n`;
        datoObt += `${anterior} -> ${mas2};\n`;

        return datoObt;

    }

}

