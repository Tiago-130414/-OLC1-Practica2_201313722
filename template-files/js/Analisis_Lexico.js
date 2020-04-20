var contador = 0;
var fila = 1;
var columna = 0;
var estado = 0;
var posArr = 0;
var tk = "";
var vectorChar = [];
var TablaSimbolos = [];
var TablaErrores = [];
function A_Lexico() {
  //buscando elementos
  var pestanaAct = document.getElementsByClassName("tab-pane fade in active");
  var cajatxt = pestanaAct[0].getAttribute("id");

  //obteniendo texto
  var txt = document.getElementById("text" + cajatxt).value + "\n";
  vectorChar = txt.split("");
  while (contador < vectorChar.length) {
    //console.log(vectorChar[contador]);
    automata(vectorChar[contador]);
    contador++;
  }
  var p = 0;
  while (p < TablaSimbolos.length) {
    console.log(TablaSimbolos[p]);
    p++;
  }
  console.log("ERRORES------------------------------------");
  var K = 0;
  while (K < TablaErrores.length) {
    console.log(TablaErrores[K]);
    K++;
  }
}

function automata(caracter) {
  switch (estado) {
    case 0:
      if (isLetter(caracter)) {
        //IDENTIFICADOR
        tk += caracter;
        columna++;
        estado = 1;
      } else if (isNumber(caracter)) {
        //Numero
        tk += caracter;
        columna++;
        estado = 2;
      } else if (caracter == "\n") {
        //SALTO DE LINEA
        fila++;
        columna = 0;
        estado = 0;
      } else if (caracter == " ") {
        //ESPACIO EN BLANCO
        columna++;
        estado = 0;
      } else if (caracter == '"') {
        //TEXTO
        tk += caracter;
        estado = 5;
        columna++;
      } else if (caracter == "/") {
        //COMENTARIOS
        tk += caracter;
        estado = 5;
        columna++;
        var sig = vectorChar[contador + 1];
        if (sig == "/") {
          //SIMPLE
          estado = 8;
        } else if (sig == "*") {
          //MULTILINEA
          estado = 10;
        } else {
          tk = caracter;
          columna++;
          var tok = new Token("Tk_Division", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
        }
      } else if (caracter == "'") {
        tk += caracter;
        columna++;
        estado = 14;
      }
      //VALIDACION DE SIMBOLOS PERTENECIENTES AL LENGUAJE
      else if (caracter == ";") {
        tk = caracter;
        columna++;
        var tok = new Token("Tk_PuntoYComa", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else if (caracter == "=") {
        tk = caracter;
        columna++;
        estado = 22;
      } else if (caracter == ",") {
        tk = caracter;
        columna++;
        var tok = new Token("Tk_Coma", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else if (caracter == "+") {
        tk = caracter;
        columna++;
        var tok = new Token("Tk_Mas", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else if (caracter == "-") {
        tk = caracter;
        columna++;
        var tok = new Token("Tk_Menos", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else if (caracter == "*") {
        tk = caracter;
        columna++;
        var tok = new Token("Tk_Multiplicacion", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else if (caracter == "(") {
        tk = caracter;
        columna++;
        var tok = new Token("Tk_ParentesisAbre", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else if (caracter == ")") {
        tk = caracter;
        columna++;
        var tok = new Token("Tk_ParentesisCierra", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else if (caracter == "{") {
        tk = caracter;
        columna++;
        var tok = new Token("Tk_LlaveAbre", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else if (caracter == "}") {
        tk = caracter;
        columna++;
        var tok = new Token("Tk_LlaveCierra", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else if (caracter == ".") {
        tk = caracter;
        columna++;
        var tok = new Token("Tk_Punto", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else if (caracter == ":") {
        tk = caracter;
        columna++;
        var tok = new Token("Tk_DosPuntos", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else if (caracter == "&") {
        //SIMBOLOS RELACIONALES
        //AND
        tk += caracter;
        columna++;
        estado = 17;
      } else if (caracter == "|") {
        //SIMBOLOS RELACIONALES
        //OR
        tk = caracter;
        columna++;
        estado = 18;
      } else if (caracter == "!") {
        //SIMBOLOS RELACIONALES
        //NOT
        tk = caracter;
        columna++;
        estado = 21;
      } else if (caracter == ">") {
        //SIMBOLOS RELACIONALES
        //Mayor Que
        tk += caracter;
        columna++;
        estado = 19;
      } else if (caracter == "<") {
        //SIMBOLOS RELACIONALES
        //Menor Que
        tk += caracter;
        columna++;
        estado = 20;
      } else {
        //Errores
        tk += caracter;
        columna++;
        var err = new ErroresLexico_Sintacticos(
          "Error Lexico",
          fila,
          columna,
          "El caracter " + tk + " No pertenece al lenguaje"
        );
        TablaErrores.push(err);
        estado = 0;
        tk = "";
      }
      break;

    case 1:
      if (isLetter(caracter) || isNumber(caracter) || caracter == "_") {
        tk += caracter;
        columna++;
        estado = 1;
      } else {
        if (tk == "int") {
          var tok = new Token("Tk_Tint", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "double") {
          var tok = new Token("Tk_Tdouble", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "string") {
          var tok = new Token("Tk_Tstring", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "char") {
          var tok = new Token("Tk_Tchar", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "bool") {
          var tok = new Token("Tk_Tbool", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "void") {
          var tok = new Token("Tk_Tvoid", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "main") {
          var tok = new Token("Tk_Tmain", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "if") {
          var tok = new Token("Tk_Tif", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "else") {
          var tok = new Token("Tk_Telse", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        }else if (tk == "switch") {
          var tok = new Token("Tk_Tswitch", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "case") {
          var tok = new Token("Tk_Tcase", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        }else if (tk == "default") {
          var tok = new Token("Tk_Tdefault", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        }else if (tk == "while") {
          var tok = new Token("Tk_Twhile", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "for") {
          var tok = new Token("Tk_Tfor", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "do") {
          var tok = new Token("Tk_Tdo", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "Console") {
          var tok = new Token("Tk_TConsole", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "Write") {
          var tok = new Token("Tk_TWrite", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "return") {
          var tok = new Token("Tk_Treturn", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "break") {
          var tok = new Token("Tk_Tbreak", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "continue") {
          var tok = new Token("Tk_Tcontinue", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "true") {
          var tok = new Token("Tk_Ttrue", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else if (tk == "false") {
          var tok = new Token("Tk_Tfalse", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        } else {
          var tok = new Token("Tk_Identificador", tk, fila, columna);
          TablaSimbolos.push(tok);
          tk = "";
          estado = 0;
          contador--;
        }
      }
      break;

    case 2:
      if (isNumber(caracter)) {
        tk += caracter;
        columna++;
        estado = 2;
      } else if (caracter == ".") {
        tk += caracter;
        columna++;
        estado = 3;
      } else {
        var tok = new Token("Tk_Numero", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
        contador--;
      }
      break;

    case 3:
      if (isNumber(caracter)) {
        tk += caracter;
        columna++;
        estado = 4;
      } else {
        //error
        var err = new ErroresLexico_Sintacticos(
          "Error Lexico",
          fila,
          columna,
          "Token Numero mal formado " + tk
        );
        TablaErrores.push(err);
        tk = "";
        contador--;
        estado = 0;
      }
      break;

    case 4:
      if (isNumber(caracter)) {
        tk += caracter;
        columna++;
        estado = 4;
      } else {
        var tok = new Token("Tk_Numero", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
        contador--;
      }
      break;

    case 5:
      tk += caracter;
      columna++;
      estado = 5;
      if (caracter == "\\") {
        estado = 6;
      } else if (caracter == '"') {
        estado = 7;
      }
      break;

    case 6:
      tk += caracter;
      columna++;
      estado = 5;
      break;

    case 7:
      var tok = new Token("Tk_Texto", tk, fila, columna);
      TablaSimbolos.push(tok);
      tk = "";
      estado = 0;
      contador--;
      break;

    case 8:
      //comentario simple
      if (caracter == "/") {
        tk += caracter;
        columna++;
        estado = 9;
      }
      break;
    case 9:
      //comentario simple
      tk += caracter;
      columna++;
      estado = 9;
      if (caracter == "\n") {
        var tok = new Token("Tk_ComentarioSimple", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
        contador--;
      }
      break;

    case 10:
      if (caracter == "*") {
        tk += caracter;
        columna++;
        estado = 11;
      }
      break;
    case 11:
      tk += caracter;
      columna++;
      estado = 11;
      var sig = vectorChar[contador + 1];
      if (caracter == "*" && sig == "/") {
        estado = 12;
      }
      break;

    case 12:
      if (caracter == "/") {
        tk += caracter;
        columna++;
        estado = 13;
      }
      break;
    case 13:
      var tok = new Token("Tk_ComentarioMultilinea", tk, fila, columna);
      TablaSimbolos.push(tok);
      tk = "";
      estado = 0;
      contador--;
      break;

    case 14:
      tk += caracter;
      columna++;
      estado = 14;
      if (caracter == "\\") {
        estado = 15;
      } else if (caracter == "'") {
        estado = 16;
      }
      break;
    case 15:
      tk += caracter;
      columna++;
      estado = 14;
      break;
    case 16:
      if (tk == "'\\n'" || tk == "'\\r'" || tk == "'\\t'") {
        var tok = new Token("Tk_char", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
        contador--;
      } else if (tk.length == 3) {
        var tok = new Token("Tk_char", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
        contador--;
      } else {
        var tok = new Token("Tk_CodHTML", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
        contador--;
      }
      break;
    case 17:
      if (caracter == "&") {
        tk += caracter;
        columna++;
        var tok = new Token("Tk_And", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else {
        var err = new ErroresLexico_Sintacticos(
          "Error Lexico",
          fila,
          columna,
          "El caracter " + tk + " No pertenece al lenguaje"
        );
        TablaErrores.push(err);
        estado = 0;
        contador--;
      }
      break;
    case 18:
      if (caracter == "|") {
        tk += caracter;
        columna++;
        var tok = new Token("Tk_Or", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else {
        var err = new ErroresLexico_Sintacticos(
          "Error Lexico",
          fila,
          columna,
          "El caracter " + tk + " No pertenece al lenguaje"
        );
        TablaErrores.push(err);
        estado = 0;
        contador--;
      }
      break;
    case 19:
      if (caracter == "=") {
        tk += caracter;
        columna++;
        var tok = new Token("Tk_MayorOIgual", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else {
        var tok = new Token("Tk_Mayor", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
        contador--;
      }
      break;
    case 20:
      if (caracter == "=") {
        tk += caracter;
        columna++;
        var tok = new Token("Tk_MenorOIgual", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else {
        var tok = new Token("Tk_Menor", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
        contador--;
      }
      break;
    case 21:
      if (caracter == "=") {
        tk += caracter;
        columna++;
        var tok = new Token("Tk_Distinto", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else {
        var tok = new Token("Tk_Not", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
        contador--;
      }
      break;

    case 22:
      if (caracter == "=") {
        tk += caracter;
        columna++;
        var tok = new Token("Tk_IgualIgual", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
      } else {
        var tok = new Token("Tk_Igual", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
        contador--;
      }
      break;
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

function returnAscii(caracter) {
  return caracter.charCodeAt(0);
}
