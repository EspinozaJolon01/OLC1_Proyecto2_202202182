import { Request, Response } from 'express'
import Arbol from './analisis/simbolo/Arbol'
import tablaSimbolo from './analisis/simbolo/tablaSimbolos'


class controller {
    public prueba(req: Request, res: Response) {
        res.json({ message: 'Hola mundo' })
    }

    public interpretar(req: Request, res: Response) {
        try {
            let parser = require('./analisis/analizador')
            let ast = new Arbol(parser.parse(req.body.entrada))
            let tabla = new tablaSimbolo()
            tabla.setNombre("Ejemplo1")
            ast.setTablaGlobal(tabla)
            ast.setConsola("")
            for (let i of ast.getInstrucciones()) {
                console.log(i)
                var resultado = i.interpretar(ast, tabla)
                console.log(resultado)
            }
            res.send({ "Respuesta": "Si sale compi1" })
        } catch (err: any) {
            console.log(err)
            res.send({ "Error": "Ya no sale compi1" })
        }
    }
}

export const indexController = new controller();