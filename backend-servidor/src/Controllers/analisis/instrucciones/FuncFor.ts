import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./funBreak";
import funContinue from "./funContinue";


/*
for(declaracion ; logico ; declaracion){
    intrucciones
}
*/

export default class FuncFor extends Instruccion{
    private declaracion: Instruccion
    private codicion:Instruccion
    private actualizacion:Instruccion
    private instrucciones :Instruccion[]


    constructor(deca:Instruccion,cond: Instruccion,actua: Instruccion, ins: Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.declaracion = deca
        this.codicion = cond
        this.actualizacion =actua
        this.instrucciones = ins
        
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {

        const nuevaTabla1 = new tablaSimbolo(tabla);
            nuevaTabla1.setNombre("intrucciones del  For");
        // Ejecutar inicialización
        const resultadoInicializacion = this.declaracion.interpretar(arbol, nuevaTabla1);
        if (resultadoInicializacion instanceof Errores) return resultadoInicializacion;

        let cond = this.codicion.interpretar(arbol, nuevaTabla1)
        if (cond instanceof Errores) return cond

        // validaciones
        if (this.codicion.tipoDato.getTipo() !== tipoDato.BOOL) {
            arbol.Print("\n Error Semantico:"+"La condicion ser bool, " + "linea: " + this.linea + "columna:" + (this.col+1))
            return new Errores("SEMANTICO", "La condicion debe ser bool", this.linea, this.col)
        }
            // Verificar si la condición es falsa
        while (this.codicion.interpretar(arbol, nuevaTabla1)) {
            // Evaluar condición
            // Crear nuevo ámbito para el cuerpo del bucle
            const nuevaTabla = new tablaSimbolo(nuevaTabla1);
            nuevaTabla.setNombre("intrucciones del  For");

            // Ejecutar cuerpo del bucle
            for (const instruccion of this.instrucciones) {
                const resultado = instruccion.interpretar(arbol, nuevaTabla);
                if (resultado instanceof Errores) return resultado;
                if (resultado instanceof Break) return; // Manejar 'break'
                if (resultado instanceof funContinue) break; // Manejar 'break'
            }

            // Ejecutar actualización
            const resultadoActualizacion = this.actualizacion.interpretar(arbol, nuevaTabla1);
            if (resultadoActualizacion instanceof Errores) return resultadoActualizacion;
            
        }
        
    }
}