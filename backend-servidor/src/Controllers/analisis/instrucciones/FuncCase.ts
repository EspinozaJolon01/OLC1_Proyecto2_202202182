import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Ast from "../simbolo/AST";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./funBreak";


export default class Case extends Instruccion {
    public expresion1: Instruccion;
    private instrucciones: Instruccion[];

    constructor(expresion1: Instruccion,instrucciones: Instruccion[],linea: number,col: number) {
        super(new Tipo(tipoDato.VOID), linea, col);
        this.expresion1 = expresion1;
        this.instrucciones = instrucciones;
    }

    

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {


        let nuevaTabla = new tablaSimbolo(tabla)
        nuevaTabla.setNombre("tabla case")
        Arbol.listSimbolo.push(nuevaTabla)
        
        for (const instruccion of this.instrucciones) {
            if (instruccion instanceof Break) return instruccion;
            const resultado = instruccion.interpretar(arbol, nuevaTabla);
            if (resultado instanceof Errores) return resultado;
            if (resultado instanceof Break) return resultado;
        }
    }

    ArbolAST(anterior: string): string {
        let bandera = Ast.getInstancia();
        let contenidos = "";

        let CONT = `n${bandera.get()}`;
        let puntCom = `n${bandera.get()}`;

        contenidos += `${CONT}[label="CONTINUO"];\n`;
        contenidos += `${puntCom}[label=";"];\n`;

        contenidos += `${anterior} -> ${CONT};\n`;
        contenidos += `${anterior} -> ${puntCom};\n`;

        return contenidos;

    }
}