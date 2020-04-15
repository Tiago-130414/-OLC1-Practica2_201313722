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
        //IDENTIFICADOR
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
        }
      } else if (caracter == "'") {
        tk += caracter;
        columna++;
        estado = 14;
      }

      break;

    case 1:
      if (isLetter(caracter) || isNumber(caracter) || caracter == "_") {
        tk += caracter;
        columna++;
        estado = 1;
      } else {
        var tok = new Token("Tk_Identificador", tk, fila, columna);
        TablaSimbolos.push(tok);
        tk = "";
        estado = 0;
        contador--;
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
          "El caracter" + caracter + "No pertenece al lenguaje"
        );
        columna++;
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
      }else {
        var tok = new Token("Tk_CodHTML", tk, fila, columna);
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
