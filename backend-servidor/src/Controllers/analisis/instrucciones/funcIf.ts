import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepcicones/Errores";


export default class funcIf extends Instruccion {
    private condicion: Instruccion
    private intrucciones:Instruccion[]


    constructor(condi:Instruccion, instru:Instruccion[],linea:number, col:number){
        super(new Tipo(tipoDato.VOID),linea,col)
        this.condicion = condi
        this.intrucciones = instru
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let categoria = this.condicion.interpretar(arbol,tabla)
        if(categoria instanceof Errores) return categoria

        if(this.condicion.tipoDato.getTipo() != tipoDato.BOOL){
            return new Errores("Semantico", "Debe de ser un bool",this.linea,this.col)
        }

        let nuevaTabla =  new tablaSimbolo(tabla)
        nuevaTabla.setNombre("FUNCION IF")

        if(categoria){
            for(let i of this.intrucciones){
                let result = i.interpretar(arbol,nuevaTabla)
            }
        }

    }
}