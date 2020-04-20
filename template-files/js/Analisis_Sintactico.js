var contadorSintax = 0;
var token = "";
var tokenSig = "";
var nomVariable = "";
var tipVariable = "";
var filVariable = 0;
var TablaDeVariables = [];
var codHT = "";
/*Traduccion*/
var variablesPython = "";
var variablesPyParametros = "";
var estoyEnM = false;
var variableMetodo = "";
var variableFuncion = "";
var variableConsole = "";
var contenidoImpresion = "";
var voyAImprimir = false;
function Analizar_Sintacticamente() {
  contadorSintax = 0;
  if (!TablaSimbolos.empty) {
    token = TablaSimbolos[contadorSintax].Token;
    INICIO();
    alert("termine analisis");
    removeTableBody();
  }
}

function INICIO() {
  LISTADO_CONTENIDO_CS();
}

function LISTADO_CONTENIDO_CS() {
  if (contadorSintax < TablaSimbolos.length) {
    if (
      token == "Tk_Tvoid" ||
      token == "Tk_Tint" ||
      token == "Tk_Tstring" ||
      token == "Tk_Tdouble" ||
      token == "Tk_Tchar" ||
      token == "Tk_Tbool" ||
      token == "Tk_ComentarioSimple" ||
      token == "Tk_ComentarioMultilinea" ||
      token == "Tk_Identificador"
    ) {
      CONTENIDO_CS();
      LISTADO_CONTENIDO_CS();
    }
  }
}

function CONTENIDO_CS() {
  if (contadorSintax + 2 < TablaSimbolos.length) {
    tokenSig = TablaSimbolos[contadorSintax + 2].Token;
  }
  if (token == "Tk_Tvoid") {
    variableMetodo = "";
    parea("Tk_Tvoid");
    variableMetodo += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    TIPO_METODO();
  } else if (
    (token == "Tk_Tint" ||
      token == "Tk_Tstring" ||
      token == "Tk_Tdouble" ||
      token == "Tk_Tchar" ||
      token == "Tk_Tbool") &&
    tokenSig == "Tk_ParentesisAbre"
  ) {
    parea(token);
    variableFuncion += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    parea("Tk_Identificador");
    variableFuncion += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    parea("Tk_ParentesisAbre");
    variableFuncion += TablaSimbolos[contadorSintax - 1].Lexema;
    PARAMETROS();
    variableFuncion += variablesPyParametros;
    parea("Tk_ParentesisCierra");
    variableFuncion += TablaSimbolos[contadorSintax - 1].Lexema + ": \n";
    parea("Tk_LlaveAbre");
    metodoFuncion(variableFuncion);
    estoyEnM = true;
    LISTA_CODIGO_METODO();
    parea("Tk_LlaveCierra");
    estoyEnM = false;
    variableFuncion = "";
  } else if (
    token == "Tk_ComentarioSimple" ||
    token == "Tk_ComentarioMultilinea" ||
    token == "Tk_Tint" ||
    token == "Tk_Tstring" ||
    token == "Tk_Tdouble" ||
    token == "Tk_Tchar" ||
    token == "Tk_Tbool" ||
    token == "Tk_Identificador"
  ) {
    VARIABLES_COMENTARIOS();
  }
}

function TIPO_METODO() {
  if (token == "Tk_Tmain") {
    parea("Tk_Tmain");
    variableMetodo += TablaSimbolos[contadorSintax - 1].Lexema;
    parea("Tk_ParentesisAbre");
    variableMetodo += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    parea("Tk_ParentesisCierra");
    variableMetodo += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    variableMetodo += ": \n";
    metodo(variableMetodo);
    parea("Tk_LlaveAbre");
    estoyEnM = true;
    LISTA_CODIGO_METODO();
    parea("Tk_LlaveCierra");
    finMain();
    variableMetodo = "";
    estoyEnM = false;
  } else if (token == "Tk_Identificador") {
    parea("Tk_Identificador");
    variableMetodo += TablaSimbolos[contadorSintax - 1].Lexema;
    parea("Tk_ParentesisAbre");
    variableMetodo += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    PARAMETROS();
    variableMetodo += variablesPyParametros;
    parea("Tk_ParentesisCierra");
    variableMetodo += TablaSimbolos[contadorSintax - 1].Lexema + ": \n";
    metodo(variableMetodo);
    estoyEnM = true;
    parea("Tk_LlaveAbre");
    LISTA_CODIGO_METODO();
    parea("Tk_LlaveCierra");
    variableMetodo = "";
    variablesPyParametros = "";
    estoyEnM = false;
  }
}

function VARIABLES_COMENTARIOS() {
  if (token == "Tk_ComentarioSimple") {
    parea("Tk_ComentarioSimple");
    append(comS(TablaSimbolos[contadorSintax - 1].Lexema));
  } else if (token == "Tk_ComentarioMultilinea") {
    parea("Tk_ComentarioMultilinea");
    append(comM(TablaSimbolos[contadorSintax - 1].Lexema));
  } else if (
    token == "Tk_Tint" ||
    token == "Tk_Tstring" ||
    token == "Tk_Tdouble" ||
    token == "Tk_Tchar" ||
    token == "Tk_Tbool"
  ) {
    VARIABLES();
    append(varT(variablesPython));
    variablesPython = "";
  } else if (token == "Tk_Identificador") {
    variablesPython = "";
    parea("Tk_Identificador");
    variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    parea("Tk_Igual");
    variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    EXPRESION();
    asigT(variablesPython);
    variablesPython = "";
    parea("Tk_PuntoYComa");
  }
}

function VARIABLES() {
  tipVariable = TablaSimbolos[contadorSintax].Lexema;
  parea(token);
  variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
  LISTADO_ID();

  parea("Tk_PuntoYComa");
  variablesPython += "\n";
}

function LISTADO_ID() {
  if (token == "Tk_Identificador") {
    CONTENIDO_VARIABLE();
    if (token == "Tk_Coma") {
      parea("Tk_Coma");
      variablesPython += TablaSimbolos[contadorSintax - 1].Lexema;
      LISTADO_ID();
    }
  }
}

function CONTENIDO_VARIABLE() {
  nomVariable = TablaSimbolos[contadorSintax].Lexema;
  filVariable = TablaSimbolos[contadorSintax].Fila;
  var NV = new Variables(nomVariable, tipVariable, filVariable);
  TablaDeVariables.push(NV);
  parea("Tk_Identificador");
  variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
  if (token == "Tk_Igual") {
    parea("Tk_Igual");
    variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    EXPRESION();
  }
}

function EXPRESION() {
  EXPRESION_SIG();
  if (token == "Tk_Mas") {
    parea("Tk_Mas");
    variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    EXPRESION();
  }
  if (token == "Tk_Menos") {
    parea("Tk_Menos");
    variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    EXPRESION();
  }
}

function EXPRESION_SIG() {
  TERMINAL();
  if (token == "Tk_Multiplicacion") {
    parea("Tk_Multiplicacion");
    variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    EXPRESION_SIG();
  }
  if (token == "Tk_Division") {
    parea("Tk_Division");
    variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    EXPRESION_SIG();
  }
}

function TERMINAL() {
  if (token == "Tk_Identificador") {
    parea("Tk_Identificador");
    variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
  } else if (token == "Tk_Texto") {
    parea("Tk_Texto");
    variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
  } else if (token == "Tk_char") {
    parea("Tk_char");
    variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
  } else if (token == "Tk_Numero") {
    parea("Tk_Numero");
    variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
  } else if (token == "Tk_CodHTML") {
    codHT += SubCadena(TablaSimbolos[contadorSintax].Lexema) + "\n";
    parea("Tk_CodHTML");
    //variablesPython += TablaSimbolos[contadorSintax-1].Lexema + " ";
  } else if (token == "Tk_Ttrue") {
    parea("Tk_Ttrue");
    variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
  } else if (token == "Tk_Tfalse") {
    parea("Tk_Tfalse");
    variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
  } else if (token == "Tk_ParentesisAbre") {
    parea("Tk_ParentesisAbre");
    variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    EXPRESION();
    parea("Tk_ParentesisCierra");
    variablesPython += TablaSimbolos[contadorSintax - 1].Lexema + " ";
  } else {
    modo_panico_expre(token);
  }
}

function modo_panico_expre(preanalisis) {
  if (
    preanalisis != "Tk_Identificador" &&
    preanalisis != "Tk_Texto" &&
    preanalisis != "Tk_char" &&
    preanalisis != "Tk_Numero" &&
    preanalisis != "Tk_CodHTML" &&
    preanalisis != "Tk_Ttrue" &&
    preanalisis != "Tk_Tfalse" &&
    preanalisis != "Tk_ParentesisAbre"
  ) {
    //console.log(token);
    contadorSintax++;
    if (contadorSintax < TablaSimbolos.length) {
      token = TablaSimbolos[contadorSintax].Token;
    }
    modo_panico_expre(token);
  } else {
    if (contadorSintax < TablaSimbolos.length) {
      console.log(token);
      contadorSintax++;
      if (contadorSintax < TablaSimbolos.length) {
        token = TablaSimbolos[contadorSintax].Token;
      }
    }
  }
}

function PARAMETROS() {
  if (
    token == "Tk_Tint" ||
    token == "Tk_Tstring" ||
    token == "Tk_Tdouble" ||
    token == "Tk_Tchar" ||
    token == "Tk_Tbool"
  ) {
    parea(token);
    //variablesPyParametros += TablaSimbolos[contadorSintax].Lexema + " ";
    parea("Tk_Identificador");
    variablesPyParametros += TablaSimbolos[contadorSintax - 1].Lexema;
    LISTA_PARAMETROS();
  }
}

function LISTA_PARAMETROS() {
  if (token == "Tk_Coma") {
    parea("Tk_Coma");
    variablesPyParametros += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    PARAMETROS();
  }
}

function LISTA_CODIGO_METODO() {
  if (
    token == "Tk_ComentarioSimple" ||
    token == "Tk_ComentarioMultilinea" ||
    token == "Tk_Tint" ||
    token == "Tk_Tstring" ||
    token == "Tk_Tdouble" ||
    token == "Tk_Tchar" ||
    token == "Tk_Tbool" ||
    token == "Tk_Tif" ||
    token == "Tk_Tswitch" ||
    token == "Tk_Tfor" ||
    token == "Tk_Twhile" ||
    token == "Tk_Tdo" ||
    token == "Tk_TConsole" ||
    token == "Tk_Identificador" ||
    token == "Tk_Treturn"
  ) {
    LISTA_CONTENIDO_METODO();
    LISTA_CODIGO_METODO();
  }
}

function LISTA_CONTENIDO_METODO() {
  if (
    token == "Tk_ComentarioSimple" ||
    token == "Tk_ComentarioMultilinea" ||
    token == "Tk_Tint" ||
    token == "Tk_Tstring" ||
    token == "Tk_Tdouble" ||
    token == "Tk_Tchar" ||
    token == "Tk_Tbool" ||
    token == "Tk_Identificador"
  ) {
    VARIABLES_COMENTARIOS();
  } else if (token == "Tk_Tif") {
    parea("Tk_Tif");
    parea("Tk_ParentesisAbre");
    LISTA_CONTENIDO();
    parea("Tk_ParentesisCierra");
    parea("Tk_LlaveAbre");
    LISTA_CODIGO_METODO();
    parea("Tk_LlaveCierra");
    LISTA_ELSE();
  } else if (token == "Tk_Tswitch") {
    parea("Tk_Tswitch");
    parea("Tk_ParentesisAbre");
    parea("Tk_Identificador");
    parea("Tk_ParentesisCierra");
    parea("Tk_LlaveAbre");
    DEFINE_CASE();
    parea("Tk_LlaveCierra");
  } else if (token == "Tk_Tfor") {
    parea("Tk_Tfor");
    parea("Tk_ParentesisAbre");
    DEFINE_FOR();
    parea("Tk_PuntoYComa");
    LISTA_CONTENIDO();
    parea("Tk_PuntoYComa");
    parea("Tk_Identificador");
    FOR_AD();
    parea("Tk_ParentesisCierra");
    parea("Tk_LlaveAbre");
    LISTADO_C();
    parea("Tk_LlaveCierra");
  } else if (token == "Tk_Twhile") {
    parea("Tk_Twhile");
    parea("Tk_ParentesisAbre");
    LISTA_CONTENIDO();
    parea("Tk_ParentesisCierra");
    parea("Tk_LlaveAbre");
    LISTADO_C();
    parea("Tk_LlaveCierra");
  } else if (token == "Tk_Tdo") {
    parea("Tk_Tdo");
    parea("Tk_LlaveAbre");
    LISTADO_C();
    parea("Tk_LlaveCierra");
    parea("Tk_Twhile");
    parea("Tk_ParentesisAbre");
    LISTA_CONTENIDO();
    parea("Tk_ParentesisCierra");
    parea("Tk_PuntoYComa");
  } else if (token == "Tk_Treturn") {
    parea("Tk_Treturn");
    if (token != "Tk_PuntoYComa") {
      EXPRESION();
    }
    parea("Tk_PuntoYComa");
  } else if (token == "Tk_TConsole") {
    parea("Tk_TConsole");
    parea("Tk_Punto");
    parea("Tk_TWrite");
    variableConsole += "print";
    parea("Tk_ParentesisAbre");
    variableConsole += TablaSimbolos[contadorSintax - 1].Lexema + " ";
    voyAImprimir = true;
    LISTA_CONTENIDO();
    variableConsole += contenidoImpresion;
    parea("Tk_ParentesisCierra");
    variableConsole += TablaSimbolos[contadorSintax - 1].Lexema + "\n";
    parea("Tk_PuntoYComa");
    arreglarConsole(variableConsole);
    variableConsole = "";
    contenidoImpresion = "";
    variablesPython = "";
    voyAImprimir = false;
  }
}

function LISTA_CONTENIDO() {
  if (
    token == "Tk_Identificador" ||
    token == "Tk_Texto" ||
    token == "Tk_char" ||
    token == "Tk_Numero" ||
    token == "Tk_CodHTML" ||
    token == "Tk_Ttrue" ||
    token == "Tk_Not" ||
    token == "Tk_Tfalse" ||
    token == "Tk_ParentesisAbre"
  ) {
    CONTENIDO();
    if (token == "Tk_Or") {
      parea("Tk_Or");
      if (voyAImprimir == true) {
        contenidoImpresion += TablaSimbolos[contadorSintax - 1].Lexema;
      }
      LISTA_CONTENIDO();
    }
  }
}

function CONTENIDO() {
  if (
    token == "Tk_Identificador" ||
    token == "Tk_Texto" ||
    token == "Tk_char" ||
    token == "Tk_Numero" ||
    token == "Tk_CodHTML" ||
    token == "Tk_Ttrue" ||
    token == "Tk_Tfalse" ||
    token == "Tk_Not" ||
    token == "Tk_ParentesisAbre"
  ) {
    O_CONTENIDO();
    if (token == "Tk_And") {
      parea("Tk_And");
      if (voyAImprimir == true) {
        contenidoImpresion += TablaSimbolos[contadorSintax - 1].Lexema;
      }
      CONTENIDO();
    }
  }
}

function O_CONTENIDO() {
  if (
    token == "Tk_Identificador" ||
    token == "Tk_Texto" ||
    token == "Tk_char" ||
    token == "Tk_Numero" ||
    token == "Tk_CodHTML" ||
    token == "Tk_Ttrue" ||
    token == "Tk_Tfalse" ||
    token == "Tk_ParentesisAbre"
  ) {
    RELACIONALES();
  } else if (token == "Tk_Not") {
    parea("Tk_Not");
    if (voyAImprimir == true) {
      contenidoImpresion += TablaSimbolos[contadorSintax - 1].Lexema;
    }
    LISTA_CONTENIDO();
  } else if (token == "Tk_Ttrue") {
    parea("Tk_Ttrue");
    if (voyAImprimir == true) {
      contenidoImpresion += TablaSimbolos[contadorSintax - 1].Lexema;
    }
    LISTA_CONTENIDO();
  } else if (token == "Tk_Tfalse") {
    parea("Tk_Tfalse");
    if (voyAImprimir == true) {
      contenidoImpresion += TablaSimbolos[contadorSintax - 1].Lexema;
    }
    LISTA_CONTENIDO();
  } else if (token == "Tk_ParentesisAbre") {
    parea("Tk_ParentesisAbre");
    if (voyAImprimir == true) {
      contenidoImpresion += TablaSimbolos[contadorSintax - 1].Lexema;
    }
    LISTA_CONTENIDO();
    parea("Tk_ParentesisCierra");
    if (voyAImprimir == true) {
      contenidoImpresion += TablaSimbolos[contadorSintax - 1].Lexema;
    }
  }
}

function RELACIONALES() {
  if (
    token == "Tk_Identificador" ||
    token == "Tk_Texto" ||
    token == "Tk_char" ||
    token == "Tk_Numero" ||
    token == "Tk_CodHTML" ||
    token == "Tk_Ttrue" ||
    token == "Tk_Tfalse" ||
    token == "Tk_ParentesisAbre"
  ) {
    JUNTE();
    if (
      token == "Tk_Mayor" ||
      token == "Tk_Menor" ||
      token == "Tk_MayorOIgual" ||
      token == "Tk_MenorOIgual" ||
      token == "Tk_IgualIgual" ||
      token == "Tk_Distinto"
    ) {
      parea(token);
      if (voyAImprimir == true) {
        contenidoImpresion += TablaSimbolos[contadorSintax - 1].Lexema;
      }
      RELACIONALES();
    }
  }
}

function JUNTE() {
  if (
    token == "Tk_Identificador" ||
    token == "Tk_Texto" ||
    token == "Tk_char" ||
    token == "Tk_Numero" ||
    token == "Tk_Ttrue" ||
    token == "Tk_Tfalse" ||
    token == "Tk_CodHTML"
  ) {
    EXPRESION();
    if (voyAImprimir == true) {
      contenidoImpresion += variablesPython;
    }
  } else if (token == "Tk_ParentesisAbre") {
    parea("Tk_ParentesisAbre");
    if (voyAImprimir == true) {
      contenidoImpresion += TablaSimbolos[contadorSintax - 1].Lexema;
    }
    LISTA_CONTENIDO();
    /*concatenar las variables si se va a imprimir*/
    parea("Tk_ParentesisCierra");
    if (voyAImprimir == true) {
      contenidoImpresion += TablaSimbolos[contadorSintax - 1].Lexema;
    }
  }
}

function LISTA_ELSE() {
  if (token == "Tk_Telse") {
    parea("Tk_Telse");
    if (token == "Tk_Tif") {
      ELSE_IF();
      LISTA_ELSE();
    } else if (token == "Tk_LlaveAbre") {
      ELSE();
    }
  }
}

function ELSE_IF() {
  if (token == "Tk_Tif") {
    parea("Tk_Tif");
    parea("Tk_ParentesisAbre");
    LISTA_CONTENIDO();
    parea("Tk_ParentesisCierra");
    parea("Tk_LlaveAbre");
    LISTA_CODIGO_METODO();
    parea("Tk_LlaveCierra");
  }
}

function ELSE() {
  if (token == "Tk_LlaveAbre") {
    parea("Tk_LlaveAbre");
    LISTA_CODIGO_METODO();
    parea("Tk_LlaveCierra");
  }
}

function DEFINE_CASE() {
  if (token == "Tk_Tcase") {
    LISTA_CASE();
  } else if (token == "Tk_Tdefault") {
    CASE_DEFAULT();
  }
}

function LISTA_CASE() {
  if (token == "Tk_Tcase") {
    CASE();
    if (token == "Tk_Tcase") {
      LISTA_CASE();
    } else if (token == "Tk_Tdefault") {
      CASE_DEFAULT();
    }
  }
}

function CASE() {
  parea("Tk_Tcase");
  if (
    token == "Tk_Numero" ||
    token == "Tk_Texto" ||
    token == "Tk_char" ||
    token == "Tk_Ttrue" ||
    token == "Tk_Tfalse"
  ) {
    parea(token);
  }
  parea("Tk_DosPuntos");
  LISTADO_C();
}

function TIPO_DATO_CASE() {
  if (token == "Tk_Numero") {
    parea("Tk_Numero");
  } else if (token == "Tk_Texto") {
    parea("Tk_Texto");
  } else if (token == "Tk_char") {
    parea("Tk_char");
  } else if (token == "Tk_Ttrue") {
    parea("Tk_Ttrue");
  } else if (token == "Tk_Tfalse") {
    parea("Tk_Tfalse");
  }
}

function LISTADO_C() {
  if (
    token == "Tk_ComentarioSimple" ||
    token == "Tk_ComentarioMultilinea" ||
    token == "Tk_Identificador" ||
    token == "Tk_Tint" ||
    token == "Tk_Tstring" ||
    token == "Tk_Tdouble" ||
    token == "Tk_Tbool" ||
    token == "Tk_Tchar" ||
    token == "Tk_Tif" ||
    token == "Tk_Tswitch" ||
    token == "Tk_Tfor" ||
    token == "Tk_Twhile" ||
    token == "Tk_Tdo" ||
    token == "Tk_TConsole" ||
    token == "Tk_Treturn"
  ) {
    LISTA_CODIGO_METODO();
    LISTADO_C();
  } else if (token == "Tk_Tbreak") {
    parea("Tk_Tbreak");
    parea("Tk_PuntoYComa");
    LISTADO_C();
  } else if (token == "Tk_Tcontinue") {
    parea("Tk_Tcontinue");
    parea("Tk_PuntoYComa");
    LISTADO_C();
  }
}

function CASE_DEFAULT() {
  if (token == "Tk_Tdefault") {
    parea("Tk_Tdefault");
    parea("Tk_DosPuntos");
    LISTADO_C();
  }
}

function DEFINE_FOR() {
  if (
    token == "Tk_Tint" ||
    token == "Tk_Tstring" ||
    token == "Tk_Tdouble" ||
    token == "Tk_Tchar" ||
    token == "Tk_Tbool"
  ) {
    parea(token);
    parea("Tk_Identificador");
    parea("Tk_Igual");
    EXPRESION();
  } else if (token == "Tk_Identificador") {
    parea("Tk_Identificador");
    parea("Tk_Igual");
    EXPRESION();
  }
}

function FOR_AD() {
  if (token == "Tk_Mas") {
    parea("Tk_Mas");
    parea("Tk_Mas");
  } else if (token == "Tk_Menos") {
    parea("Tk_Menos");
    parea("Tk_Menos");
  }
}

function modo_panico(preanalisis) {
  if (preanalisis != TablaSimbolos[contadorSintax].Token) {
    contadorSintax++;
    if (contadorSintax < TablaSimbolos.length) {
      token = TablaSimbolos[contadorSintax].Token;
    }
    modo_panico(preanalisis);
  } else {
    if (contadorSintax < TablaSimbolos.length) {
      console.log(token);
      contadorSintax++;
      if (contadorSintax < TablaSimbolos.length) {
        token = TablaSimbolos[contadorSintax].Token;
      }
    }
  }
}

function parea(preanalisis) {
  if (preanalisis != TablaSimbolos[contadorSintax].Token) {
    console.log(
      "ERR: " + preanalisis + " LEXEMA " + TablaSimbolos[contadorSintax].Lexema
    );
    modo_panico(preanalisis);
  } else {
    if (contadorSintax < TablaSimbolos.length) {
      console.log(
        token + "\t LEXEMA \t" + TablaSimbolos[contadorSintax].Lexema
      );

      contadorSintax++;
      if (contadorSintax < TablaSimbolos.length) {
        token = TablaSimbolos[contadorSintax].Token;
      }
    }
  }
}

function removeTableBody() {
  $("#Tabla_Variables tbody").empty();
  LlenarVariables();
  var txtAreaHTML = document.getElementById("htmlTxt");
  txtAreaHTML.innerText = codHT;
}

function LlenarVariables() {
  var contarVar = 0;
  var nomVar = "";
  var tipVar = "";
  var fila = 0;
  while (contarVar < TablaDeVariables.length) {
    nomVar = TablaDeVariables[contarVar].Nombre;
    tipVar = TablaDeVariables[contarVar].Tipo;
    fila = TablaDeVariables[contarVar].Fila;
    var htmlTags =
      "<tr>" +
      "<td>" +
      (contarVar + 1) +
      "</td>" +
      "<td>" +
      nomVar +
      "</td>" +
      "<td>" +
      tipVar +
      "</td>" +
      "<td>" +
      fila +
      "</td>" +
      "</tr>";
    $("#Tabla_Variables tbody").append(htmlTags);
    contarVar++;
  }
}

function SubCadena(kd) {
  var txt = kd.substring(1, kd.length - 1);
  return txt;
}

function comS(com) {
  var st = com.substring(2, com.length);
  var comPy = "#" + st;
  append(comPy);
}

function comM(com) {
  var comPy = "";
  if (com != undefined) {
    var st = com.substring(2, com.length - 2);
    comPy += "'''" + st + "'''";
    /*if(estoyEnM == true){
    st = "\t"+ st;
    comPy = "\t'''"+ st+"\t'''";
    }else{
      comPy = "'''"+st+"'''";
    }*/
    return comPy;
  }
}

function varT(variable) {
  var txt = "";
  if (variable.includes("int")) {
    txt = variable.replace("int", "var");
  } else if (variable.includes("string")) {
    txt = variable.replace("string", "var");
  } else if (variable.includes("double")) {
    txt = variable.replace("double", "var");
  } else if (variable.includes("char")) {
    txt = variable.replace("char", "var");
  } else if (variable.includes("bool")) {
    txt = variable.replace("bool", "var");
  }
  return txt;
}

function metodoFuncion(variable) {
  var txt = "\n\n";
  if (variable.includes("int")) {
    txt += variable.replace("int", "def");
  } else if (variable.includes("string")) {
    txt += variable.replace("string", "def");
  } else if (variable.includes("double")) {
    txt += variable.replace("double", "def");
  } else if (variable.includes("char")) {
    txt += variable.replace("char", "def");
  } else if (variable.includes("bool")) {
    txt += variable.replace("bool", "def");
  }
  append(txt);
}

function asigT(txt) {
  append(txt);
}

function metodo(mtdo) {
  var txt = "\n";
  if (mtdo.includes("void") && mtdo != undefined) {
    txt += mtdo.replace("void", "\ndef");
    append(txt);
  }
}

function finMain() {
  var txt = '\n\nif __name__ = "__main__":\n';
  txt += "\t\tmain()";
  append(txt);
}

function arreglarConsole(cad) {
  var sub = cad.substring(6,cad.length);
  var txtV = sub.split("");
  var cadN = "";
  var cont = 0;
  var estoyEnParentesis = false;
  while (cont < txtV.length) {
    if (txtV[cont] == "+") {
      if (estoyEnParentesis == false) {
        cadN += ",";
      }
      if (estoyEnParentesis == true) {
        cadN += "+";
      }
    } else if (txtV[cont] == "(") {
      cadN += txtV[cont];
      console.log("por la gran puta aqui esta esa mierda");
      estoyEnParentesis = true;
    } else if (txtV[cont] == ")") {
      cadN += txtV[cont];
      estoyEnParentesis = false;
    } else if (txtV[cont] != "+" && txtV[cont] != "(" && txtV[cont] != ")") {
      cadN += txtV[cont];
    }
    cont++;
  }
  cadN += "\n";
  cadN = "print(" + cadN;
  append(cadN);
}

function append(nTraduccion) {
  if (nTraduccion != undefined) {
    var txtAreaT = document.getElementById("traduccionCPY");
    var textoEnTraduccion = document.getElementById("traduccionCPY").value;
    if (estoyEnM == true) {
      txtAreaT.value = textoEnTraduccion + "\t" + nTraduccion;
    } else {
      txtAreaT.value = textoEnTraduccion + nTraduccion;
    }
  }
}

function isLetter(caracter) {
  var as = returnAscii(caracter);
  if ((as > 64 && as < 91) || (as > 96 && as < 123)) {
    return true;
  } else {
    return false;
  }
}

function isNumber(caracter) {
  var as = returnAscii(caracter);
  if (as > 47 && as < 58) {
    return true;
  } else {
    return false;
  }
}
