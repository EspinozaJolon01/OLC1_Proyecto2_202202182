%{
// codigo de JS si fuese necesario
const Tipo = require('./simbolo/Tipo')
const Logicos = require('./expresiones/Logicos')
const Nativo = require('./expresiones/Nativo')
const FuncUtilidades = require('./expresiones/FuncUtilidades')
const Aritmeticas = require('./expresiones/Aritmeticas')
const IncreDecre = require('./expresiones/IncreDecre')
const AccesoVar = require('./expresiones/AccesoVar')
const OpeRelacionales = require('./expresiones/OpeRelacionales')
const Print = require('./instrucciones/Print')
const Declaracion = require('./instrucciones/Declaracion')
const AsignacionVar = require('./instrucciones/AsignacionVar')
const funcIf = require('./instrucciones/funcIf')
const funcWhile = require('./instrucciones/funcWhile')
const funDoWhile = require('./instrucciones/funDoWhile')
const FuncFor = require('./instrucciones/FuncFor')
const Break = require('./instrucciones/funBreak')
const Switch = require('./instrucciones/FuncSwitch')
const Case = require('./instrucciones/FuncCase')
const Default = require('./instrucciones/FuncDefault')
const funContinue = require('./instrucciones/funContinue')
const Defecto = require('./instrucciones/DeclaDefecto')
const Metodo = require('./instrucciones/Metodo')
const Execute = require('./instrucciones/Excute')
const Casteos = require('./expresiones/Casteos')
const funcIfternario = require('./instrucciones/funcIfternario')
const Vectores = require('./instrucciones/VectorUna')
const AccesoVector  = require('./expresiones/AccesoVarU')
const ModVector  = require('./expresiones/ModVector')
const ModVector2 =  require('./expresiones/ModVector2')

const Llamada = require('./instrucciones/Llamada')
const funReturn = require('./instrucciones/funReturn')

const VectoresDOS = require('./instrucciones/VectorDos')
const AccesoVector2  = require('./expresiones/AccesoVec2')
const Vector_cstr = require('./instrucciones/Vector_cstr')
const Funcion = require('./instrucciones/Funciones')


const Errores = require('./excepcicones/Errores')

const indexController =  require('../indexController')


var cadena = '';
%}

// analizador lexico

%lex
%options case-insensitive
%x string

%%

"//".*     //comentario de una linea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]    //multilinea

//palabras reservadas
"cout"              return 'IMPRIMIR'
"int"                   return 'INT'
"double"                return 'DOUBLE'
"std::String"                return 'STRING'
"true"                  return 'TRUE'
"false"                 return 'FALSE'
"char"                  return 'CHAR'
"bool"                  return 'BOOLEAN'
"pow"                   return 'POW'
"tolower"               return 'TOLOWER'
"toupper"               return 'TOUPPER'
"round"                 return 'ROUND'
"std::toString"              return 'TOSTRING'
"if"                    return 'IF'
"while"                 return 'WHILE'
"break"                 return 'BREAK'
"typeof"                return 'TYPEOF'
"length"                return 'LENGTH'
"else"                  return 'ELSE'
"do"                    return 'DO'
"for"                   return 'FOR'
"continue"              return 'CONTINUE'
"switch"                return 'SWITCH'
"case"                  return 'CASE'
"default"               return 'DEFAULT'
"new"                   return 'NEW'
"execute"                   return 'EXECUTE'
"void"                  return 'VOID'
"c_str"                 return 'CSTR'
"return"                return 'RETURN'



// simbolos del sistema
";"                     return "PUNTOCOMA"
"?"                     return "INTERROGACION"
":"                     return "PUNTOS"
","                     return "COMA"
"++"                    return "INCREMENTO"
"+"                     return "MAS"

"--"                    return "DECREMIENTO"
"-"                     return "MENOS"
"::"                    return "DOSPUNTOS"
"%"                     return "MODULO"
"||"                    return "OR"
"endl"                  return "ENDL"
"&&"                    return "AND"
"!="                    return "DIFERENTE"
"!"                     return "NOT"
"*"                     return "MULTI"
"<<"                    return "DOBLEMAYOR"
"/"                     return "DIV"
"("                     return "PAR1"
")"                     return "PAR2"
"{"                     return "LLAVE1"
"}"                     return "LLAVE2"
">="                     return "MAYORIGUAL"
">"                     return "MAYOR"
"<="                     return "MENORIGUAL"
"=="                     return "IGUALRE"
"["                     return "CORCHETE1"
"]"                     return "CORCHETE2"
"<"                     return "MENORQUE"
"="                     return "IGUAL"
"."                     return "PUNTO"

[0-9]+"."[0-9]+         return "DECIMAL"
[0-9]+                  return "ENTERO"
[a-z][a-z0-9_]*         return "ID"
^[a-zA-Z]$              return 'LETRA';
[']\\\\[']|[']\\\"[']|[']\\\'[']|[']\\n[']|[']\\t[']|[']\\r[']|['].?['] return 'CHARACTER'


["]						{ cadena = ''; this.begin("string"); }
<string>[^"\\]+			{ cadena += yytext; }
<string>"\\\""			{ cadena += "\""; }
<string>"\\n"			{ cadena += "\n"; }
<string>\s				{ cadena += " ";  }
<string>"\\t"			{ cadena += "\t"; }
<string>"\\\\"			{ cadena += "\\"; }
<string>"\\\'"			{ cadena += "\'"; }
<string>"\\r"			{ cadena += "\r"; }
<string>["]				{ yytext = cadena; this.popState(); return 'CADENA'; }




//blancos
[\ \r\t\f\t]+           {}
[\ \n]                  {}

// simbolo de fin de cadena
<<EOF>>                 return "EOF";
.                       { let errores = new Errores.default("lexico",("token no reconocido: "+yytext),yylloc.first_line,yylloc.first_column);
                        indexController.errores_list.push(errores);}


%{
    // CODIGO JS SI FUESE NECESARIO
%}

/lex

//precedencias
%left 'INTERROGACION'
%left 'AND'
%left 'OR'
%left 'NOT'
%left 'IGUALRE', 'DIFERENTE','MENORQUE','MENORIGUAL','MAYOR','MAYORIGUAL'
%left 'INCREMENTO' , 'DECREMIENTO'
%left 'MAS' 'MENOS' 
%left 'MULTI' 'DIV' 'MODULO'
%right 'UMENOS'
%left   'PAR1'
%left 'PUNTO'


// simbolo inicial
%start INICIO

%%

INICIO : INSTRUCCIONES EOF                  {return $1;}
;

INSTRUCCIONES : INSTRUCCIONES INSTRUCCION   {$1.push($2); $$=$1;}
            | INSTRUCCION                 {$$=[$1];}
;

INSTRUCCION : IMPRESION             {$$=$1;}
            | DECLARACION PUNTOCOMA          {$$=$1;}
            | ASIGNACION PUNTOCOMA           {$$=$1;}
            | FUNIF                         {$$=$1;}
            | FUNWHILE                       {$$=$1;}
            | FUNBREAK                       {$$=$1;}
            | FUNCONTINUE                       {$$=$1;}
            | FUNDOWHILE    PUNTOCOMA                   {$$=$1;}
            | FUNFOR                             {$$=$1;}
            |FUNSWITCH                          {$$=$1;}
            |DECARREGLO   PUNTOCOMA             {$$=$1;}
            |MODFVECTOR PUNTOCOMA             {$$=$1;}
            |MOFVECTOR2 PUNTOCOMA             {$$=$1;}
            |DECARRELGO2DIMEN  PUNTOCOMA {$$=$1;}
            |METODO  {$$=$1;}
            |FUNCION {$$ =$1;}
            |EXECUTEN PUNTOCOMA  {$$=$1;}
            |LLAMADA  PUNTOCOMA  {$$=$1;}
            |FUNRETURN PUNTOCOMA {$$=$1;}
            
;

IMPRESION : IMPRIMIR DOBLEMAYOR EXPRESION VERIFAR   { if($4 == true){
                                                        $$= new Print.default($3, @1.first_line, @1.first_column);
                                                        }
                                                        $$= new Print.default($3, @1.first_line, @1.first_column,"\n");
                                                }
;

VERIFAR : PUNTOCOMA     {$$ = true;}
        | DOBLEMAYOR ENDL PUNTOCOMA {$$ = false;}
;

DECLARACION : TIPOS DECLA VERIFICARDECLARACION    {
        if($3 == true){
                $$ = new Defecto.default($1, @1.first_line, @1.first_column, $2);
        }else{
                $$ = new Declaracion.default($1, @1.first_line, @1.first_column, $2, $3);

        }      
}
        
;

VERIFICARDECLARACION:IGUAL EXPRESION  {$$ = $2;}
                | {$$ = true;}
;

ASIGNACION : ID IGUAL EXPRESION             {$$ = new AsignacionVar.default($1, $3, @1.first_line, @1.first_column);}
        | INCRE {$$ = $1}
;


DECLA: DECLA COMA ID   {$1.push($3); $$=$1;}
                        | ID {$$=[$1];}
                        ;

FUNIFTERNARIO: EXPRESION INTERROGACION EXPRESION PUNTOS EXPRESION {$$ = new funcIfternario.default($1, $3,$5, @1.first_line, @1.first_column);}

;

FUNIF : IF PAR1 EXPRESION PAR2  OTROIFBLOQUE {$$ = new funcIf.default($3, $5, @1.first_line, @1.first_column, undefined,undefined);}
        |IF PAR1 EXPRESION PAR2 OTROIFBLOQUE ELSE OTROIFBLOQUE {$$ = new funcIf.default($3, $5, @1.first_line, @1.first_column, undefined,$7);}
        |IF PAR1 EXPRESION PAR2 OTROIFBLOQUE ELSE FUNIF {$$ = new funcIf.default($3, $5, @1.first_line, @1.first_column, $7,undefined);}
;


OTROIFBLOQUE : LLAVE1 INSTRUCCIONES LLAVE2 {$$ = $2}
        |    LLAVE1  LLAVE2 {$$=[]}
;

FUNWHILE : WHILE PAR1 EXPRESION PAR2 LLAVE1 INSTRUCCIONES LLAVE2  {$$ = new funcWhile.default($3,$6, @1.first_line, @1.first_column);}
;

FUNDOWHILE : DO LLAVE1 INSTRUCCIONES LLAVE2 WHILE PAR1 EXPRESION PAR2 {$$ = new funDoWhile.default($7,$3, @1.first_line, @1.first_column);}

;

VEFICACION:     DECLARACION {$$ = $1}
        |       ASIGNACION  {$$ = $1}
;

FUNFOR : FOR PAR1 VEFICACION PUNTOCOMA EXPRESION PUNTOCOMA ASIGNACION PAR2 LLAVE1 INSTRUCCIONES LLAVE2 {
        $$ = new FuncFor.default($3,$5,$7,$10, @1.first_line, @1.first_column);}

;

DECARREGLO: TIPOS ID CORCHETE1 CORCHETE2 IGUAL NEW TIPOS CORCHETE1 EXPRESION CORCHETE2 {$$ = new Vectores.default($1,$2,@1.first_line, @1.first_column,$7,$9,undefined);}
        | TIPOS ID  CORCHETE1 CORCHETE2 IGUAL CORCHETE1 LISTAVALORES CORCHETE2  {$$ = new Vectores.default($1,$2,@1.first_line, @1.first_column,undefined,undefined,$7);}
        | TIPOS CORCHETE1 CORCHETE2 EXPRESION IGUAL ID PUNTO CSTR PAR1 PAR2  {$$ = new Vector_cstr.default($1,$4,$6,@1.first_line, @1.first_column,undefined,undefined,$7);}
        
;

LISTAVALORES : LISTAVALORES COMA EXPRESION {$1.push($3); $$=$1;}
        | EXPRESION     {$$=[$1];}
;

DECARRELGO2DIMEN: TIPOS ID CORCHETE1 CORCHETE2 CORCHETE1 CORCHETE2 IGUAL NEW TIPOS CORCHETE1 EXPRESION CORCHETE2 CORCHETE1 EXPRESION CORCHETE2
        {$$ = new VectoresDOS.default($1,$2,@1.first_line, @1.first_column,$9,$11,$14,undefined);}
        |TIPOS ID CORCHETE1 CORCHETE2 CORCHETE1 CORCHETE2 IGUAL CORCHETE1 LISTARECURSIVA CORCHETE2
        {$$ = new VectoresDOS.default($1,$2,@1.first_line, @1.first_column,undefined,undefined,undefined,$9);}

        
;

LISTARECURSIVA: LISTARECURSIVA COMA LISTADIMENSIOENS {$1.push($3); $$=$1;}
                | LISTADIMENSIOENS  {$$=[$1];}

;

LISTADIMENSIOENS: CORCHETE1 DATODENTRO CORCHETE2   {$$ = $2}
        
;

DATODENTRO: DATODENTRO COMA EXPRESION {$1.push($3); $$=$1;}
        |EXPRESION   {$$=[$1];}
;

FUNBREAK : BREAK PUNTOCOMA {$$ = new Break.default(@1.first_line, @1.first_column);}
;

//constructor(linea: number, columna: number, expresiones?: Instruccion) {

FUNRETURN : RETURN EXPRESION {$$ = new funReturn.default(@1.first_line, @1.first_column,$2);}
        | RETURN  {$$ = new funReturn.default(@1.first_line, @1.first_column,undefined);}

;

FUNCONTINUE : CONTINUE PUNTOCOMA {$$ = new funContinue.default(@1.first_line, @1.first_column);}
;

FUNCASTEO : PAR1 TIPOS PAR2 EXPRESION {$$ = new Casteos.default($2,@1.first_line, @1.first_column,$4);}

;


FUNSWITCH : SWITCH PAR1 EXPRESION PAR2 LLAVE1 LISTADOCASE DEFULTO LLAVE2 {$$ = new Switch.default($3, @1.first_line, @1.first_column,$6,$7);}
        |   SWITCH PAR1 EXPRESION PAR2 LLAVE1 LISTADOCASE LLAVE2 {$$ = new Switch.default($3, @1.first_line, @1.first_column,$6,undefined);}
        |   SWITCH PAR1 EXPRESION PAR2 LLAVE1 DEFULTO LLAVE2 {$$ = new Switch.default($3, @1.first_line, @1.first_column,undefined,$7);}

;

LISTADOCASE :  LISTADOCASE CASO {$1.push($2); $$=$1;}
                        | CASO {$$=[$1];}
                        

;

CASO: CASE EXPRESION PUNTOS INSTRUCCIONES {$$ = new Case.default($2,$4 ,@1.first_line, @1.first_column);}
;

DEFULTO : DEFAULTSWICH {$$ = $1}
;

DEFAULTSWICH: DEFAULT PUNTOS INSTRUCCIONES {$$ = new Default.default($3, @1.first_line, @1.first_column);}

;




EXPRESION : EXPRESION MAS EXPRESION          {$$ = new Aritmeticas.default(Aritmeticas.Operadores.SUMA, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION MENOS EXPRESION        {$$ = new Aritmeticas.default(Aritmeticas.Operadores.RESTA, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION DIV EXPRESION        {$$ = new Aritmeticas.default(Aritmeticas.Operadores.DIVI, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION MULTI EXPRESION        {$$ = new Aritmeticas.default(Aritmeticas.Operadores.MULT, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION IGUALRE EXPRESION        {$$ = new OpeRelacionales.default(OpeRelacionales.OpRelacional.IGUAL, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION DIFERENTE EXPRESION        {$$ = new OpeRelacionales.default(OpeRelacionales.OpRelacional.DISTINTO, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION MENORQUE EXPRESION        {$$ = new OpeRelacionales.default(OpeRelacionales.OpRelacional.MENOR, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION MENORIGUAL EXPRESION        {$$ = new OpeRelacionales.default(OpeRelacionales.OpRelacional.MENORIGUALES, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION MAYOR EXPRESION        {$$ = new OpeRelacionales.default(OpeRelacionales.OpRelacional.MAYOR, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION MAYORIGUAL EXPRESION        {$$ = new OpeRelacionales.default(OpeRelacionales.OpRelacional.MAYORIGUAL, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION MODULO EXPRESION        {$$ = new Aritmeticas.default(Aritmeticas.Operadores.MODUL, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION OR EXPRESION        {$$ = new Logicos.default(Logicos.Operadores.OR, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION AND EXPRESION        {$$ = new Logicos.default(Logicos.Operadores.AND, @1.first_line, @1.first_column, $1, $3);}
            | POW PAR1 EXPRESION COMA EXPRESION PAR2       {$$ = new Aritmeticas.default(Aritmeticas.Operadores.POT, @1.first_line, @1.first_column, $3, $5);}
            | PAR1  EXPRESION PAR2              {$$ = $2;}
            | MENOS EXPRESION %prec UMENOS     {$$ = new Aritmeticas.default(Aritmeticas.Operadores.NEG, @1.first_line, @1.first_column, $2);}
            | NOT EXPRESION      {$$ = new Logicos.default(Logicos.Operadores.NOT, @1.first_line, @1.first_column, $2);}
            | ENTERO                           {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.ENTERO), $1, @1.first_line, @1.first_column );}
            | DECIMAL                          {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.DECIMAL), $1, @1.first_line, @1.first_column );}
            | CADENA                           {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.CADENA), $1, @1.first_line, @1.first_column );}
            |TRUE                              {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOL), true, @1.first_line, @1.first_column );}
            |FALSE                             {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOL), false, @1.first_line, @1.first_column );}
            |ID                               {$$ = new AccesoVar.default($1, @1.first_line, @1.first_column);} 
            |CHARACTER                          {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.CARACTER), $1, @1.first_line, @1.first_column );}
            | FUNCIONUTIL       {$$=$1;}
            | FUNCASTEO         {$$=$1;}
            | FUNIFTERNARIO   {$$=$1;}
            | EXPRESION PUNTO LENGTH PAR1 PAR2  {$$ = new FuncUtilidades.default(FuncUtilidades.Operadores.Length, @1.first_line, @1.first_column, $1);}
            | BUSCARVECTOR {$$ = $1;}
            | BUSCARVECTOR2 {$$ = $1;}
            |LLAMADA    {$$=$1;}
;

BUSCARVECTOR :  ID CORCHETE1  EXPRESION CORCHETE2 {$$ = new AccesoVector.default($1,$3,@1.first_line, @1.first_column);}
;

BUSCARVECTOR2 :  ID CORCHETE1  EXPRESION CORCHETE2 CORCHETE1  EXPRESION CORCHETE2 
                {$$ = new AccesoVector2.default($1,$3,$6,@1.first_line, @1.first_column);}
;

MODFVECTOR : ID CORCHETE1  EXPRESION CORCHETE2 IGUAL EXPRESION {$$ =  new ModVector.default($1,$3,$6,@1.first_line, @1.first_column);}

;

MOFVECTOR2: ID CORCHETE1  EXPRESION CORCHETE2 CORCHETE1  EXPRESION CORCHETE2 IGUAL EXPRESION
                        {$$ =  new ModVector2.default($1,$3,$6,$9,@1.first_line, @1.first_column);}
;

INCRE : ID VALIDARINCRE              {$$ = new IncreDecre.default( @1.first_line, @1.first_column, $1,$2);}

;


VALIDARINCRE:   INCREMENTO {$$ = true;}
        |DECREMIENTO {$$ = false;}

;


//constructor(id:string, tipo: Tipo, instrucciones: Instruccion[], linea:number, columna: number, parametros: any[]) {

METODO: VOID  ID PAR1 PARAMETROS  LLAVE1 INSTRUCCIONES LLAVE2
        {$$ =  new Metodo.default($2,new Tipo.default(Tipo.tipoDato.VOID),$6,@1.first_line, @1.first_column,$4);}
        | VOID ID PAR1   LLAVE1 INSTRUCCIONES LLAVE2
        {$$ =  new Metodo.default($2,new Tipo.default(Tipo.tipoDato.VOID),$5,@1.first_line, @1.first_column,[]);}

;

//constructor(id:string, tipo: Tipo, instrucciones: Instruccion[], linea:number, columna: number, parametros: any[]) {

FUNCION : TIPOS ID PAR1 PARAMETROS  LLAVE1 INSTRUCCIONES LLAVE2 
        {$$ =  new Funcion.default($2,$1,$6,@1.first_line, @1.first_column,$4);}
        | TIPOS ID PAR1   LLAVE1 INSTRUCCIONES LLAVE2
        {$$ =  new Funcion.default($2,$1,$5,@1.first_line, @1.first_column,[]);}
;

PARAMETROS: TODOPARAMS PAR2  { $$ = $1 }
        |PAR2 { $$ = [] }

;

TODOPARAMS: TODOPARAMS COMA CONTENIDO { $1.push($3); $$ = $1 }
        | CONTENIDO { $$ = [$1] }
;

CONTENIDO :TIPOS ID { $$ = {tipo: $1, id: [$2], accion: 1} }
;


EXECUTEN : EXECUTE ID PAR1 PARANS PAR2   {$$ =  new Execute.default($2,@1.first_line, @1.first_column,$4);}
        | EXECUTE ID PAR1 PAR2  {$$ =  new Execute.default($2,@1.first_line, @1.first_column,[]);}
;

LLAMADA: ID PAR1 PARANS PAR2            {$$ =  new Llamada.default($1,@1.first_line, @1.first_column,$3);}
        | ID PAR1 PAR2                  {$$ =  new Llamada.default($1,@1.first_line, @1.first_column,[]);}

;
PARANS: PARANS COMA EXPRESION   {$1.push($3); $$=$1;}
        |EXPRESION     {$$ = [$1];}
;




FUNCIONUTIL : TOLOWER PAR1 EXPRESION PAR2 {$$ = new FuncUtilidades.default(FuncUtilidades.Operadores.tolower, @1.first_line, @1.first_column, $3);}
            | TOUPPER PAR1 EXPRESION PAR2 {$$ = new FuncUtilidades.default(FuncUtilidades.Operadores.toupper, @1.first_line, @1.first_column, $3);}
            | ROUND PAR1 EXPRESION PAR2 {$$ = new FuncUtilidades.default(FuncUtilidades.Operadores.round, @1.first_line, @1.first_column, $3);}
            | TOSTRING PAR1 EXPRESION PAR2 {$$ = new FuncUtilidades.default(FuncUtilidades.Operadores.ToString, @1.first_line, @1.first_column, $3);}
            | TYPEOF PAR1 EXPRESION PAR2  {$$ = new FuncUtilidades.default(FuncUtilidades.Operadores.Typeof, @1.first_line, @1.first_column, $3);}

;

TIPOS : INT             {$$ = new Tipo.default(Tipo.tipoDato.ENTERO);}
        | DOUBLE          {$$ = new Tipo.default(Tipo.tipoDato.DECIMAL);}
        | STRING          {$$ = new Tipo.default(Tipo.tipoDato.CADENA);}
        | CHAR          {$$ = new Tipo.default(Tipo.tipoDato.CARACTER);}
        | BOOLEAN          {$$ = new Tipo.default(Tipo.tipoDato.BOOL);}
        
        

;