import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepcicones/Errores";
import Arbol from "../simbolo/Arbol";
import Ast from "../simbolo/AST";
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


    constructor(deca:Instruccion,condiciones: Instruccion,actua: Instruccion, ins: Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.declaracion = deca
        this.codicion = condiciones
        this.actualizacion =actua
        this.instrucciones = ins
        
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {

        const nuevaTabla1 = new tablaSimbolo(tabla);
            nuevaTabla1.setNombre("intrucciones del  For");
        // Ejecutar inicialización
        const resultadoInicializacion = this.declaracion.interpretar(arbol, nuevaTabla1);
        if (resultadoInicializacion instanceof Errores) return resultadoInicializacion;

        let condiciones = this.codicion.interpretar(arbol, nuevaTabla1)
        if (condiciones instanceof Errores) return condiciones

        // validaciones
        if (this.codicion.tipoDato.getTipo() !== tipoDato.BOOL) {
            arbol.Print("--> Error Semantico:"+"La condicion debe ser bool" + "linea: " + this.linea + "columna:" + (this.col+1)+"\n")
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

    ArbolAST(anterior: string): string {
        let bandera = Ast.getInstancia();
        let datoOb = "";
        let Intruccion = [];

        let cabeza = `n${bandera.get()}`;
        let For = `n${bandera.get()}`;
        let PAR1 = `n${bandera.get()}`;
        let DECLA = `n${bandera.get()}`;
        let condiciones = `n${bandera.get()}`;
        let actua = `n${bandera.get()}`;
        let PAR2 = `n${bandera.get()}`;
        let LLAVE = `n${bandera.get()}`;
        let CabezaIns = `n${bandera.get()}`;

        for(let i = 0; i < this.instrucciones.length; i++){
            Intruccion.push(`n${bandera.get()}`);
        }

        let llav2 = `n${bandera.get()}`;

        datoOb += `${cabeza}[label="CICLOS"];\n`;
        datoOb += `${For}[label="FOR"];\n`;
        datoOb += `${PAR1}[label="("];\n`;
        datoOb += `${DECLA}[label="EXPRESION"];\n`;
        datoOb += `${condiciones}[label="CONDICION"];\n`; 
        datoOb += `${actua}[label="EXPRESION"];\n`;
        datoOb += `${PAR2}[label=")"];\n`;
        datoOb += `${LLAVE}[label="{"];\n`;
        datoOb += `${CabezaIns}[label="INTRUCCIONES"];\n`;

        for(let i = 0; i < Intruccion.length; i++){
            datoOb += ` ${Intruccion[i]}[label="INTRUCCIONES"];\n`;
        }

        datoOb += `${llav2}[label="}"];\n`;

        datoOb += `${anterior} -> ${cabeza};\n`;
        datoOb += `${cabeza} -> ${For};\n`;
        datoOb += `${cabeza} -> ${PAR1};\n`;
        datoOb += `${cabeza} -> ${DECLA};\n`;
        datoOb += `${cabeza} -> ${condiciones};\n`;
        datoOb += `${cabeza} -> ${actua};\n`;
        datoOb += `${cabeza} -> ${PAR2};\n`;
        datoOb += `${cabeza} -> ${LLAVE};\n`;
        datoOb += `${cabeza} -> ${CabezaIns};\n`;

        for(let i = 0; i < Intruccion.length; i++){
            datoOb += `${CabezaIns} -> ${Intruccion[i]};\n`;
        }

        datoOb += `${cabeza} -> ${llav2};\n`;

        datoOb += this.declaracion.ArbolAST(DECLA);
        datoOb += this.codicion.ArbolAST(condiciones);
        datoOb += this.actualizacion.ArbolAST(actua);

        for(let i = 0; i < Intruccion.length; i++){
            datoOb += this.instrucciones[i].ArbolAST(Intruccion[i]);
        }

        return datoOb;
    }
}