import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./funBreak";
import funContinue from "./funContinue";


export default class Metodo extends Instruccion{
    public id:string
    public parametros: any[]
    public insutrcciones : Instruccion[]


    constructor(id:string,tipo:Tipo,instrucciones:Instruccion[],linea:number,col:number,parametros:any[]){
        super(tipo,linea,col)
        this.id = id
        this.parametros =  parametros
        this.insutrcciones = instrucciones
    }


    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        for(let i of this.insutrcciones){
            let result = i.interpretar(arbol,tabla)
        }
        
    }
}