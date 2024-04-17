import { Request, Response } from 'express';
import Arbol from './analisis/simbolo/Arbol';
import tablaSimbolo from './analisis/simbolo/tablaSimbolos';
import Errores from './analisis/excepcicones/Errores';

//errores
export let errores_list: Array<Errores> = []


class controller {
    public prueba(req: Request, res: Response) {
        res.json({ "funciona": "la api" });
    }

    public interpretar(req: Request, res: Response) {

        errores_list =  new Array<Errores>
        try {
            let parser = require('./analisis/analizador')
            let ast = new Arbol(parser.parse(req.body.entrada))
            let tabla = new tablaSimbolo()
            tabla.setNombre("Ejemplo1")
            ast.setTablaGlobal(tabla)
            ast.setConsola("")
            for (let i of errores_list) {
                ast.Print("\n"+i.getTipoError()+ ":" + i.getDescp() +" Fila: "+ i.getFila()+" Columna: "+ i.getColumna() )
            }

            for (let i of ast.getInstrucciones()) {

                if(i instanceof Errores){
                    errores_list.push(i)
                }
                //console.log(i)
                var resultado = i.interpretar(ast, tabla)

                if(resultado instanceof Errores){
                    errores_list.push(resultado)
                }
                console.log(resultado)

            }
            console.log(tabla)
            res.send({ "Respuesta": ast.getConsola() })

            console.log("la lista de errores", errores_list.length);
            for(let tip of errores_list){
                console.log(tip.getTipoError())
                console.log(tip.getDescp)
            }
        } catch (err: any) {
            
            res.send({ "Error": "Ya no sale compi1" })
            console.log(err)
        }
    }

}


export const indexController = new controller();