import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Declaracion from "./Declaracion";
import Break from "./funBreak";
import funContinue from "./funContinue";
import Metodo from "./Metodo";


export default class Execute extends Instruccion{
    private id:string
    private parametros:Instruccion[]


    constructor(id:string,linea:number, col: number, parametros:Instruccion[]){
        super(new Tipo(tipoDato.VOID),linea,col)
        this.id = id
        this.parametros = parametros
    }


    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let buscar = arbol.getFuncion(this.id)
        if(buscar == null){       
            arbol.Print("--> Error Semantico:"+"Funciones no existe" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")

            return new Errores("Semantico", "Funciones no existe", this.linea,this.col)
        } 
        if(buscar instanceof Metodo){
            let nuevaTabla =  new tablaSimbolo(arbol.getTablaGlobal())
            nuevaTabla.setNombre("LLAMADA")
            
            if(buscar.parametros.length != this.parametros.length){
                arbol.Print("--> Error Semantico:"+"Los paramaetros de la llamada son invalidos" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")

                return new Errores("Semantico","Los paramaetros de la llamada son invalidos", this.linea,this.col)
            }

            //parametros
            for(let i =0;i < buscar.parametros.length;i++){
                let declaracionParame =  new Declaracion(
                    buscar.parametros[i].tipo,this.linea,this.col,
                    [buscar.parametros[i].id], this.parametros[i])
                    
                let reslt = declaracionParame.interpretar(arbol,nuevaTabla)
                if(reslt instanceof Errores) return reslt
            }
            let resultFuncion:any =  buscar.interpretar(arbol,nuevaTabla)
            if(resultFuncion instanceof Errores) return resultFuncion

        }
    }
}