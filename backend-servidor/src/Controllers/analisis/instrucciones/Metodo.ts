import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Ast from "../simbolo/AST";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import funReturn from "./funReturn";


export default class Metodo extends Instruccion{
    public id: string
    public parametros: any[]
    public instrucciones: Instruccion[]

    constructor(id:string, tipo: Tipo, instrucciones: Instruccion[], linea:number, columna: number, parametros: any[]) {
        super(tipo, linea, columna)
        this.id = id
        this.parametros = parametros
        this.instrucciones = instrucciones
        
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        if(this.tipoDato.getTipo() != tipoDato.VOID) return new Errores("SEMANTICO", "El método debe tener un tipo void", this.linea, this.col)
            
            for(let i of this.instrucciones) {
                if( i instanceof Errores) {
                }

                let resultado = i.interpretar(arbol, tabla)
                if( resultado instanceof Errores) {
                    
                }
                    if(resultado instanceof funReturn) {
                        if(resultado.valor != null) {
                            return new Errores("SEMANTICO", "No se puede devolver un valor dentro de un método.", this.linea, this.col)
                        }
                        break
                    }
            }

    }


    ArbolAST(anterior: string): string {
        let  contenido = Ast.getInstancia()
        let obtenido = ""

        let paramaT1 = []
        let paramaT2 = []
        let instruccion = []

        let Par = `n${ contenido.get()}`
        let VOI = `n${ contenido.get()}`
        let INDEN = `n${ contenido.get()}`
        let LLAV2 = `n${ contenido.get()}`
        let NODOLLAV1 = `n${ contenido.get()}`
        let NODOLLAV2 = `n${ contenido.get()}`
        let nodoP1 = `n${ contenido.get()}`
        let PARAM = `n${ contenido.get()}`
        let NODOIDEND = `n${ contenido.get()}`
        let NODOINSTU = `n${ contenido.get()}`

        for(let i = 0; i < this.parametros.length; i++){
            paramaT1.push(`n${ contenido.get()}`)
            paramaT2.push(`n${ contenido.get()}`)
        }

        for(let i= 0; i< this.instrucciones.length; i++){
            instruccion.push(`n${ contenido.get()}`)
        }

        obtenido += `${Par}[label="METODO"]\n`
        obtenido += `${VOI}[label="VOID"]\n`

        obtenido += `${INDEN}[label="ID"]\n`
        obtenido += `${NODOIDEND}[label="${this.id}"]\n`
        obtenido += `${nodoP1}[label="("]\n`
        obtenido += `${PARAM}[label="PARAMS"]\n`

        for(let i = 0; i < this.parametros.length; i++){
            if(this.parametros[i].tipo.getTipo() == tipoDato.ENTERO){
                obtenido += `${paramaT1[i]}[label="INT"]\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.CARACTER){
                obtenido += `${paramaT1[i]}[label="CHAR"]\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.VOID){
                obtenido += `${paramaT1[i]}[label="VOID"]\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.DECIMAL){
                obtenido += `${paramaT1[i]}[label="DOUBLE"]\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.CADENA){
                obtenido += `${paramaT1[i]}[label="std::string"]\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.BOOL){
                obtenido += `${paramaT1[i]}[label="BOOL"]\n`
            }
            
            obtenido += `${paramaT2[i]}[label="${this.parametros[i].id}"]\n`
        }

        obtenido += `${LLAV2}[label=")"]\n`
        obtenido += `${NODOLLAV1}[label="{"]\n`
        obtenido += `${NODOINSTU}[label="INSTRUCCIONES"]\n`
        for(let i = 0; i < this.instrucciones.length; i++){
            obtenido += `${instruccion[i]}[label="INSTRUCCION"]\n`
        }
        obtenido += `${NODOLLAV2}[label="}"]\n`

        obtenido += `${Par} -> ${VOI}\n`
        obtenido += `${Par} -> ${INDEN}\n`
        obtenido += `${INDEN} -> ${NODOIDEND}\n`
        obtenido += `${Par} -> ${nodoP1}\n`
        obtenido += `${Par} -> ${PARAM}\n`

        for(let i = 0; i < this.parametros.length; i++){
            obtenido += `${PARAM} -> ${paramaT1[i]}\n`
            obtenido += `${PARAM} -> ${paramaT2[i]}\n`
        }

        obtenido += `${Par} -> ${LLAV2}\n`

        obtenido += `${Par} -> ${NODOLLAV1}\n`

        obtenido += `${Par} -> ${NODOINSTU}\n`

        for(let i = 0; i < this.instrucciones.length; i++){
            obtenido += `${NODOINSTU} -> ${instruccion[i]}\n`
        }

        obtenido += `${Par} -> ${NODOLLAV2}\n`

        obtenido += `${anterior} -> ${Par}\n`

        for(let i = 0; i < this.instrucciones.length; i++){
            obtenido += this.instrucciones[i].ArbolAST(instruccion[i])
        }


        return obtenido
    }
}