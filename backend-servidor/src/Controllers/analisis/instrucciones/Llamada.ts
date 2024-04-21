import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Declaracion from "./Declaracion";
import Metodo from "./Metodo";
import Funcion from "./Funciones";
import Ast from "../simbolo/AST";
export default class Llamada extends Instruccion {

    private id: string
    private params: Instruccion[]

    constructor(id: string, linea:number, columna: number, params: Instruccion[]){
        super(new Tipo(tipoDato.VOID), linea,columna)
        this.id = id
        this.params = params
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let Bandera = arbol.getFuncion(this.id)

        if(Bandera == null) return new Errores("SEMANTICO", "La func  con id: "+this.id+" no existe.", this.linea, this.col)

        this.tipoDato = Bandera.tipoDato
        
        if(Bandera instanceof Metodo) {
        
            let met = <Metodo>Bandera
            let nuevaTbala = new tablaSimbolo(tabla)
            nuevaTbala.setNombre("Llamada met: "+this.id)

            if(met.parametros.length < this.params.length) new Errores("SEMANTICO", "Se han recibido más parámetros de los que se esperaban", this.linea, this.col)
            if(met.parametros.length > this.params.length) new Errores("SEMANTICO", "Se han recibido menos parámetros de los que se esperaban", this.linea, this.col)
                
            for (let i = 0; i < met.parametros.length; i++) {
                let decla
                
                    decla = new Declaracion(met.parametros[i].tipo, this.linea, this.col, met.parametros[i].id, this.params[i])
                
                
                let resultado = decla.interpretar(arbol, nuevaTbala)
                if(resultado instanceof Errores) return resultado

                
                
            }
            
            let resultadoM: any = met.interpretar(arbol, nuevaTbala)
            if(resultadoM instanceof Errores) return resultadoM

        }else if(Bandera instanceof Funcion) {
            let func  = <Funcion>Bandera
            let nuevaTbala = new tablaSimbolo(tabla)
            nuevaTbala.setNombre("Llamada func : "+this.id)
            
            if(func .parametros.length < this.params.length) new Errores("SEMANTICO", "Se recibieron mas parametros de los que se esperaban", this.linea, this.col)
            if(func .parametros.length > this.params.length) new Errores("SEMANTICO", "Se recibieron menos parametros de los que se esperaban", this.linea, this.col)
                    
            for (let i = 0; i < func .parametros.length; i++) {
                
                let dat = this.params[i].interpretar(arbol, tabla)
            
                if(dat instanceof Errores) return dat
                let decla

                
                    decla = new Declaracion(func .parametros[i].tipo, this.linea, this.col, func .parametros[i].id, this.params[i])
                

                let resultado = decla.interpretar(arbol, nuevaTbala)
                if(resultado instanceof Errores) return resultado


                let variable = nuevaTbala.getVariable(func .parametros[i].id[0])

                if(variable != null) {
                    if(variable.getTipo().getTipo() != this.params[i].tipoDato.getTipo()) {
                        return new Errores("SEMANTICO", "Parametro "+i+" es de diferente tipo al que se esperaba", this.linea, this.col) 
                    }else{
                        variable.setValor(dat)
                    }
                }else {
                    return new Errores("SEMANTICO", "Varible con ID "+func .parametros[i].id[0]+" no existe", this.linea, this.col)
                }
                
            }
            
            let resultadoF: any = func .interpretar(arbol, nuevaTbala)
            if(resultadoF instanceof Errores) return resultadoF
            return resultadoF
        }
        
    }


    ArbolAST(anterior: string): string {
        let bandera = Ast.getInstancia();
        let obtenido = "";

        let LLAM = `n${bandera.get()}`;
        let INDEN = `n${bandera.get()}`;
        let PAR = `n${bandera.get()}`;
        let puntCom = `n${bandera.get()}`;

        let listaParams = [];

        for (let i = 0; i < this.params.length; i++) {
            listaParams.push(`n${bandera.get()}`);
        }

        let LLAM2 = `n${bandera.get()}`;

        obtenido += `${LLAM}[label="LLAMADA"];\n`;
        obtenido += `${INDEN}[label="${this.id}"];\n`;
        obtenido += `${PAR}[label="("];\n`;

        for(let i = 0; i < this.params.length; i++){
            obtenido += `${listaParams[i]}[label="PARAMS"];\n`;
        }

        obtenido += `${LLAM2}[label=")"];\n`;
        obtenido += `${puntCom}[label=";"];\n`


        obtenido += `${anterior} -> ${LLAM};\n`;
        obtenido += `${LLAM} -> ${INDEN};\n`;
        obtenido += `${LLAM} -> ${PAR};\n`;

        for(let i = 0; i < this.params.length; i++){
            obtenido += `${LLAM} -> ${listaParams[i]};\n`;
        }

        obtenido += `${LLAM} -> ${LLAM2};\n`;
        obtenido += `${LLAM} -> ${puntCom};\n`;
        
        for(let i = 0; i < this.params.length; i++){
            obtenido += this.params[i].ArbolAST(listaParams[i]);
        }

        return obtenido;
    }
}