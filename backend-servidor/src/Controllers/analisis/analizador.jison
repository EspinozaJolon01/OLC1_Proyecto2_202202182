%{
// codigo de JS si fuese necesario
const Tipo = require('./simbolo/Tipo')
const Nativo = require('./expresiones/Nativo')
const Aritmeticas = require('./expresiones/Aritmeticas')
const AccesoVar = require('./expresiones/AccesoVar')
const OpeRelacionales = require('./expresiones/OpeRelacionales')
const Print = require('./instrucciones/Print')
const Declaracion = require('./instrucciones/Declaracion')
const AsignacionVar = require('./instrucciones/AsignacionVar')
%}

// analizador lexico

%lex
%options case-insensitive

%%

"//".*     //comentario de una linea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]    //multilinea

//palabras reservadas
"imprimir"              return 'IMPRIMIR'
"int"                   return 'INT'
"double"                return 'DOUBLE'
"string"                return 'STRING'
"true"                  return 'TRUE'
"false"                 return 'FALSE'
"char"                  return 'CHAR'
"bool"                  return 'BOOLEAN'
"pow"                   return 'POW'


// simbolos del sistema
";"                     return "PUNTOCOMA"
","                     return "COMA"
"+"                     return "MAS"
"-"                     return "MENOS"
"%"                     return "MODULO"
"*"                     return "MULTI"
"/"                     return "DIV"
"("                     return "PAR1"
")"                     return "PAR2"
">="                     return "MAYORIGUAL"
">"                     return "MAYOR"
"'"                     return "COMILLAS"
"<="                     return "MENORIGUAL"
"=="                     return "IGUALRE"
"!="                    return "DIFERENTE"
"<"                     return "MENORQUE"
"="                     return "IGUAL"

[0-9]+"."[0-9]+         return "DECIMAL"
[0-9]+                  return "ENTERO"
[a-z][a-z0-9_]*         return "ID"
^[a-zA-Z]$              return 'LETRA';



[\"][^\"]*[\"]          {yytext=yytext.substr(1,yyleng-2); return 'CADENA'}


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

INSTRUCCION : IMPRESION PUNTOCOMA            {$$=$1;}
            | DECLARACION PUNTOCOMA          {$$=$1;}
            | ASIGNACION PUNTOCOMA           {$$=$1;}
;

IMPRESION : IMPRIMIR PAR1 EXPRESION PAR2    {$$= new Print.default($3, @1.first_line, @1.first_column);}
;

DECLARACION : TIPOS DECLA IGUAL EXPRESION      {$$ = new Declaracion.default($1, @1.first_line, @1.first_column, $2, $4);}
;

ASIGNACION : ID IGUAL EXPRESION             {$$ = new AsignacionVar.default($1, $3, @1.first_line, @1.first_column);}
;


DECLA: DECLA COMA ID   {$1.push($3); $$=$1;}
                        | ID {$$=[$1];}
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
            | POW PAR1 EXPRESION COMA EXPRESION PAR2       {$$ = new Aritmeticas.default(Aritmeticas.Operadores.POT, @1.first_line, @1.first_column, $3, $5);}
            | PAR1  EXPRESION PAR2              {$$ = $2;}
            | MENOS EXPRESION %prec UMENOS     {$$ = new Aritmeticas.default(Aritmeticas.Operadores.NEG, @1.first_line, @1.first_column, $2);}
            | ENTERO                           {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.ENTERO), $1, @1.first_line, @1.first_column );}
            | DECIMAL                          {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.DECIMAL), $1, @1.first_line, @1.first_column );}
            | CADENA                           {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.CADENA), $1, @1.first_line, @1.first_column );}
            |TRUE                              {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOL), $1, @1.first_line, @1.first_column );}
            |FALSE                             {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOL), $1, @1.first_line, @1.first_column );}
            |ID                               {$$ = new AccesoVar.default($1, @1.first_line, @1.first_column);} 
            |CHARCOMILLAS                              {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.CARACTER), $1, @1.first_line, @1.first_column );}
;

CHARCOMILLAS : COMILLAS ID COMILLAS {$$ = $2;}

;

TIPOS : INT             {$$ = new Tipo.default(Tipo.tipoDato.ENTERO);}
        | DOUBLE          {$$ = new Tipo.default(Tipo.tipoDato.DECIMAL);}
        | STRING          {$$ = new Tipo.default(Tipo.tipoDato.CADENA);}
        | CHAR          {$$ = new Tipo.default(Tipo.tipoDato.CARACTER);}
        | BOOLEAN          {$$ = new Tipo.default(Tipo.tipoDato.BOOL);}
;