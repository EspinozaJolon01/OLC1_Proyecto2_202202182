import { Request, Response } from 'express';
import Arbol from './analisis/simbolo/Arbol';
import tablaSimbolo from './analisis/simbolo/tablaSimbolos';
import Errores from './analisis/excepcicones/Errores';
import Metodo from './analisis/instrucciones/Metodo';
import Declaracion from './analisis/instrucciones/Declaracion';
import Llamada from './analisis/instrucciones/Excute';
import Execute from './analisis/instrucciones/Excute';
import Funcion from './analisis/instrucciones/Funciones';
import Ast from './analisis/simbolo/AST';
import Reportes from './analisis/simbolo/Reportes';
import { tipoDato } from './analisis/simbolo/Tipo';
import VectoresDOS from './analisis/instrucciones/VectorDos';
import Vectores from './analisis/instrucciones/VectorUna';

//errores
export let errores_list: Array<Errores> = []
export let simbolos_tabla: Array<Reportes> = [];


var AstDot: string



class controller {
    public prueba(req: Request, res: Response) {
        res.json({ "funciona": "la api" });
    }

    public interpretar(req: Request, res: Response) {

        errores_list =  new Array<Errores>
        simbolos_tabla =  new Array<Reportes>
        Arbol.listSimbolo =  []
        
        try {
            let bandera = true
            AstDot = ""
            let parser = require('./analisis/analizador')
            let ast = new Arbol(parser.parse(req.body.entrada))
            let tabla = new tablaSimbolo()
            tabla.setNombre("Control")
            ast.setTablaGlobal(tabla)
            Arbol.listSimbolo.push(tabla)
            ast.setConsola("")

            let execute = null;

            //primer recorrdio
            for(let i of ast.getInstrucciones()){
                if(i instanceof Metodo || i instanceof Funcion){
                    i.id = i.id.toLocaleLowerCase()
                    ast.agregarFunciones(i)
                }
                if(i instanceof Declaracion ||i instanceof VectoresDOS || i instanceof Vectores){
                    i.interpretar(ast, tabla)
                    
                    // manejo de errores
                }
                
                if (i instanceof Execute){
                    if(!bandera){
                        ast.Print("Error Semantico: Solo se permite una instancia de Execute");
                        
                        break;

                    }
                    bandera = false
                    execute = i
                }

            }

            for (let i of errores_list) {
                ast.Print("---> "+i.getTipoError()+ ":" + i.getDescp() +" Fila: "+ i.getFila()+" Columna: "+ i.getColumna()+"\n" )
            }

            if(execute != null){
                execute.interpretar(ast,tabla)
                // manejo de errores
            }


            let contador = Ast.getInstancia()
            let cadena = "digraph ast{\n"
            cadena += "nINICIO[label=\"INICIO\"];\n"
            cadena += "nINSTRUCCIONES[label=\"INSTRUCCIONES\"];\n"
            cadena += "nINICIO->nINSTRUCCIONES;\n"

            for (let i of ast.getInstrucciones()) {
                if (i instanceof Errores) continue
                let nodo = `n${contador.get()}`
                cadena += `${nodo}[label=\"INSTRUCCION\"];\n`
                cadena += `nINSTRUCCIONES->${nodo};\n`
                cadena += i.ArbolAST(nodo)
            }
            cadena += "\n}"
            AstDot = cadena






            // for (let i of ast.getInstrucciones()) {

            //     if(i instanceof Errores){
            //         errores_list.push(i)
            //     }
            //     //console.log(i)
            //     var resultado = i.interpretar(ast, tabla)

            //     if(resultado instanceof Errores){
            //         errores_list.push(resultado)
            //     }
            //     console.log(resultado)

            // }
            console.log(tabla)
            res.send({ "Respuesta": ast.getConsola() })

            console.log("la lista de errores", errores_list.length);
            for(let tip of errores_list){
                console.log(tip.getTipoError())
                console.log(tip.getDescp)
            }


            for(let i of Arbol.listSimbolo){
                let nombreAmbito = i.getNombre();
                let ident:any = [];
                let tipoD: any = [];
                let valor: any =  [];
                
                i.getTabla().forEach((value, key) => {
                    ident.push(value.getId());
                    if(value.getTipo().getTipo() == tipoDato.BOOL){
                        tipoD.push("BOOL");
                    }else if(value.getTipo().getTipo() == tipoDato.DECIMAL){
                        tipoD.push("DOUBLE");
                    }else if(value.getTipo().getTipo() == tipoDato.CADENA){
                        tipoD.push("STD::STRING");
                    }else if(value.getTipo().getTipo() == tipoDato.ENTERO){
                        tipoD.push("ENTERO");
                    }

                    valor.push(value.getValor());
                        
                });

                for(let i =0; i<ident.length; i++){
                    simbolos_tabla.push(new Reportes(ident[i], "variable", tipoD[i], nombreAmbito));
                }
            }
        } catch (err: any) {
            
            res.send({ "Error": "Ya no sale compi1" })
            console.log(err)
        }
    }

    public ast(req: Request, res: Response) {
        res.json({ AST: AstDot })
    }

    public reporte(req: Request, res: Response) {
        res.json({ rep: simbolos_tabla })
    }

}


export const indexController = new controller();