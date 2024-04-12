%{
// codigo de JS si fuese necesario
const Tipo = require('./simbolo/Tipo')
const Logicos = require('./expresiones/Logicos')
const Nativo = require('./expresiones/Nativo')
const FuncUtilidades = require('./expresiones/FuncUtilidades')
const Aritmeticas = require('./expresiones/Aritmeticas')
const AccesoVar = require('./expresiones/AccesoVar')
const OpeRelacionales = require('./expresiones/OpeRelacionales')
const Print = require('./instrucciones/Print')
const Declaracion = require('./instrucciones/Declaracion')
const AsignacionVar = require('./instrucciones/AsignacionVar')
const funcIf = require('./instrucciones/funcIf')
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
"toString"              return 'TOSTRING'
"if"                    return 'IF'


// simbolos del sistema
";"                     return "PUNTOCOMA"
","                     return "COMA"
"+"                     return "MAS"
"-"                     return "MENOS"
"::"                    return "DOSPUNTOS"
"%"                     return "MODULO"
"||"                    return "OR"
"endl"                  return "ENDL"
"&&"                    return "AND"
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
"!="                    return "DIFERENTE"
"<"                     return "MENORQUE"
"="                     return "IGUAL"

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
<<EOF>>                 return "EOF"


%{
    // CODIGO JS SI FUESE NECESARIO
%}

/lex

//precedencias
%left 'AND'
%left 'OR'
%left 'NOT'
%left 'IGUALRE', 'DIFERENTE','MENORQUE','MENORIGUAL','MAYOR','MAYORIGUAL'
%left 'MAS' 'MENOS' 'MODULO'
%left 'MULTI' 'DIV'
%right 'UMENOS'


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

DECLARACION : TIPOS DECLA IGUAL EXPRESION      {$$ = new Declaracion.default($1, @1.first_line, @1.first_column, $2, $4);}
;

ASIGNACION : ID IGUAL EXPRESION             {$$ = new AsignacionVar.default($1, $3, @1.first_line, @1.first_column);}
;


DECLA: DECLA COMA ID   {$1.push($3); $$=$1;}
                        | ID {$$=[$1];}
                        ;

FUNIF :  IF PAR1 EXPRESION PAR2 LLAVE1 INSTRUCCIONES LLAVE2 {$$ = new funcIf.default($3,$6, @1.first_line, @1.first_column);}
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
            | EXPRESION MODULO EXPRESION        {$$ = new OpeRelacionales.default(OpeRelacionales.OpRelacional.MODUL, @1.first_line, @1.first_column, $1, $3);}
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
;


FUNCIONUTIL : TOLOWER PAR1 EXPRESION PAR2 {$$ = new FuncUtilidades.default(FuncUtilidades.Operadores.tolower, @1.first_line, @1.first_column, $3);}
            | TOUPPER PAR1 EXPRESION PAR2 {$$ = new FuncUtilidades.default(FuncUtilidades.Operadores.toupper, @1.first_line, @1.first_column, $3);}
            | ROUND PAR1 EXPRESION PAR2 {$$ = new FuncUtilidades.default(FuncUtilidades.Operadores.round, @1.first_line, @1.first_column, $3);}
            | TOSTRING PAR1 EXPRESION PAR2 {$$ = new FuncUtilidades.default(FuncUtilidades.Operadores.ToString, @1.first_line, @1.first_column, $3);}

;

TIPOS : INT             {$$ = new Tipo.default(Tipo.tipoDato.ENTERO);}
        | DOUBLE          {$$ = new Tipo.default(Tipo.tipoDato.DECIMAL);}
        | STRING          {$$ = new Tipo.default(Tipo.tipoDato.CADENA);}
        | CHAR          {$$ = new Tipo.default(Tipo.tipoDato.CARACTER);}
        | BOOLEAN          {$$ = new Tipo.default(Tipo.tipoDato.BOOL);}
;