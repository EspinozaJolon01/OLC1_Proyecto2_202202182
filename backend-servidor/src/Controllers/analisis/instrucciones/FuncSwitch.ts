import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

import  Case  from "./FuncCase";
import  Default  from "./FuncDefault";
import Break from "./funBreak";

export default class Switch extends Instruccion {
    private expresion: Instruccion;
    private casesList: Case[];
    private defaultCase: Default;

    constructor(expresion: Instruccion,casesList: Case[],defaultCase: Default,linea: number,col: number) {
        super(new Tipo(tipoDato.VOID), linea, col);
        this.expresion = expresion;
        this.casesList = casesList;
        this.defaultCase = defaultCase;
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        const valorExpresion = this.expresion.interpretar(arbol, tabla);
        if (valorExpresion instanceof Errores) return valorExpresion;

        let ejecutado = false;

        for (const caso of this.casesList) {
            const valorCaso = caso.expresion1.interpretar(arbol, tabla);
            if (valorCaso instanceof Errores) return valorCaso;

            if (valorCaso === valorExpresion) {
                const resultado = caso.interpretar(arbol, tabla);
                if (resultado instanceof Errores) return resultado;
                if (resultado instanceof Break) return ; // Manejar 'break'
                ejecutado = true;
                
            }
        }

        if (!ejecutado && this.defaultCase) {
            const resultadoDefault = this.defaultCase.interpretar(arbol, tabla);
            if (resultadoDefault instanceof Errores) return resultadoDefault;
            if (resultadoDefault instanceof Break) return ;
        }
    }
}

