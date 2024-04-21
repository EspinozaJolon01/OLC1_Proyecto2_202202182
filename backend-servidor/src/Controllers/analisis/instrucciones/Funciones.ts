import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Ast from "../simbolo/AST";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import funReturn from "./funReturn";

export default class Funcion extends Instruccion {
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
        
        //console.log("aqui tio",this.instrucciones)
        for (let i = 0; i < this.instrucciones.length; i++) {
            let nuevoDato = this.instrucciones[i].interpretar(arbol, tabla)

            if(nuevoDato instanceof Errores) return nuevoDato
            
            if(nuevoDato instanceof funReturn) {
                if(nuevoDato.valor != null){
                    if(this.tipoDato.getTipo() != nuevoDato.tipoDato.getTipo()) return new Errores("SEMANTICO", "El tipo de la función y el tipo del valor de retorno son diferentes.", this.linea, this.col)
                    return nuevoDato.valor
                }
            } 
            
            if(i == this.instrucciones.length - 1) return new Errores("SEMANTICO", "Debe devolver un valor.", this.linea, this.col)

            
        }

        
    }
    
    ArbolAST(anterior: string): string {
        let contenido = Ast.getInstancia()
        let obtenido = ""

        let instrucciones = []
        let params1 = []
        let params2 = []
        

        let NODOFUN = `n${contenido.get()}`
        let type = `n${contenido.get()}`
        let ind = `n${contenido.get()}`
        let nodoID = `n${contenido.get()}`
        let par1 = `n${contenido.get()}`
        let par2 = `n${contenido.get()}`

        let nodoparent = `n${contenido.get()}`
        let llav1 = `n${contenido.get()}`
        let llav2 = `n${contenido.get()}`
        let parametoIns = `n${contenido.get()}`

        for(let i = 0; i < this.parametros.length; i++){
            params1.push(`n${contenido.get()}`)
            params2.push(`n${contenido.get()}`)
        }

        for(let i= 0; i< this.instrucciones.length; i++){
            instrucciones.push(`n${contenido.get()}`)
        }

        obtenido += `${NODOFUN}[label="FUNCION"]\n`
        switch (this.tipoDato.getTipo()) {
            
            case tipoDato.CARACTER:
                
                obtenido += `${type}[label="CHAR"]\n`
                break
            case tipoDato.BOOL:
                
                obtenido += `${type}[label="BOOL"]\n`
                break
            case tipoDato.ENTERO:
                
                obtenido += `${type}[label="ENTERO"]\n`
                break
            
            case tipoDato.CADENA:
                
                obtenido += `${type}[label="STD::STRING"]\n`
                break
            case tipoDato.DECIMAL:
                
                obtenido += `${type}[label="DOUBLE"]\n`
                break
        }

        obtenido += `${ind}[label="IDENTIFICADOR"]\n`
        obtenido += `${nodoID}[label="${this.id}"]\n`
        obtenido += `${par1}[label="("]\n`
        obtenido += `${par2}[label="PARAMETROS"]\n`

        for(let i = 0; i < this.parametros.length; i++){
            if(this.parametros[i].tipo.getTipo() == tipoDato.ENTERO){
                obtenido += `${params1[i]}[label="INT"]\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.CARACTER){
                obtenido += `${params1[i]}[label="CHAR"]\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.DECIMAL){
                obtenido += `${params1[i]}[label="DOUBLE"]\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.VOID){
                obtenido += `${params1[i]}[label="VOID"]\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.CADENA){
                obtenido += `${params1[i]}[label="std::string"]\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.BOOL){
                obtenido += `${params1[i]}[label="BOOL"]\n`
            }
            
            obtenido += `${params2[i]}[label="${this.parametros[i].id}"]\n`
        }

        obtenido += `${nodoparent}[label=")"]\n`
        obtenido += `${llav1}[label="{"]\n`
        obtenido += `${parametoIns}[label="INSTRUCCIONES"]\n`
        for(let i = 0; i < this.instrucciones.length; i++){
            obtenido += `${instrucciones[i]}[label="INSTRUCCION"]\n`
        }
        obtenido += `${llav2}[label="}"]\n`

        obtenido += `${NODOFUN} -> ${type}\n`
        obtenido += `${NODOFUN} -> ${ind}\n`
        obtenido += `${ind} -> ${nodoID}\n`
        obtenido += `${NODOFUN} -> ${par1}\n`
        obtenido += `${NODOFUN} -> ${par2}\n`

        for(let i = 0; i < this.parametros.length; i++){
            obtenido += `${par2} -> ${params1[i]}\n`
            obtenido += `${par2} -> ${params2[i]}\n`
        }

        obtenido += `${NODOFUN} -> ${nodoparent}\n`

        obtenido += `${NODOFUN} -> ${llav1}\n`

        obtenido += `${NODOFUN} -> ${parametoIns}\n`

        for(let i = 0; i < this.instrucciones.length; i++){
            obtenido += `${parametoIns} -> ${instrucciones[i]}\n`
        }

        obtenido += `${NODOFUN} -> ${llav2}\n`

        obtenido += `${anterior} -> ${NODOFUN}\n`

        for(let i = 0; i < this.instrucciones.length; i++){
            obtenido += this.instrucciones[i].ArbolAST(instrucciones[i])
        }


        return obtenido
    }

}