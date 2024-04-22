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
            Arbol.listSimbolo.push(newTabla)
            for (let i of this.intrucciones) {
                if (i instanceof Break) return;
                if (i instanceof funContinue) break;

                let resultado = i.interpretar(arbol, newTabla)
                
                if (resultado instanceof Break) return;
                if (resultado instanceof funContinue) break;
                if (resultado instanceof funReturn) return resultado;
                // los errores les quedan de tarea
            }

        }while(this.condicion.interpretar(arbol, tabla))

        
    }

    ArbolAST(anterior: string): string {
        let resultado = "";
        let bandera = Ast.getInstancia();
        let toditoIntruccion = [];

        let cabeza = `n${bandera.get()}`;
        let NumDO = `n${bandera.get()}`;
        let llav1 = `n${bandera.get()}`;
        let cabezaInstu = `n${bandera.get()}`;

        for(let i= 0; i < this.intrucciones.length; i++){
            toditoIntruccion.push(`n${bandera.get()}`);
        }

        let llav2 = `n${bandera.get()}`;
        let doWhile = `n${bandera.get()}`;
        let PAR1 = `n${bandera.get()}`;
        let cond = `n${bandera.get()}`;
        let PAR2 = `n${bandera.get()}`;
        let puntocoma = `n${bandera.get()}`;

        resultado += ` ${cabeza}[label="CICLO"];\n`;
        resultado += ` ${NumDO}[label="DO"];\n`;
        resultado += ` ${llav1}[label="{"];\n`;
        resultado += ` ${cabezaInstu}[label="INTRUCCIONES"];\n`;

        for(let i= 0; i < this.intrucciones.length; i++){
            resultado += ` ${toditoIntruccion[i]}[label="INSTRUCCION"];\n`;
        }

        resultado += ` ${llav2}[label="}"];\n`;
        resultado += ` ${doWhile}[label="WHILE"];\n`;
        resultado += ` ${PAR1}[label="("];\n`;
        resultado += ` ${cond}[label="EXPRESION"];\n`;
        resultado += ` ${PAR2}[label=")"];\n`;
        resultado += ` ${puntocoma}[label=";"];\n`;

        resultado += ` ${anterior} -> ${cabeza};\n`;
        resultado += ` ${cabeza} -> ${NumDO};\n`;
        resultado += ` ${cabeza} -> ${llav1};\n`;
        resultado += ` ${cabeza} -> ${cabezaInstu};\n`;

        for(let i= 0; i < this.intrucciones.length; i++){
            resultado += ` ${cabezaInstu} -> ${toditoIntruccion[i]};\n`;
        }

        resultado += ` ${cabeza} -> ${llav2};\n`;
        resultado += ` ${cabeza} -> ${doWhile};\n`;
        resultado += ` ${cabeza} -> ${PAR1};\n`;
        resultado += ` ${cabeza} -> ${cond};\n`;
        resultado += ` ${cabeza} -> ${PAR2};\n`;
        resultado += ` ${cabeza} -> ${puntocoma};\n`;

        for(let i= 0; i < this.intrucciones.length; i++){
            resultado += this.intrucciones[i].ArbolAST(toditoIntruccion[i]);
        }

        resultado += this.condicion.ArbolAST(cond);

        return resultado;


    }
}