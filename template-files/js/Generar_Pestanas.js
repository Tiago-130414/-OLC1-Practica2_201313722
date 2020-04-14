numeroPestana = 0;
function GenerarPestana() {
  numeroPestana++;
  //Agregar Etiqueta
  var contenedorPestana = document.getElementById("Contenedor_Pestanas");
  var pestanaNueva = document.createElement("li");
  var etqA = document.createElement("a");
  etqA.setAttribute("id", "pes" + numeroPestana);
  etqA.setAttribute("data-toggle", "tab");
  etqA.setAttribute("href", "#" + numeroPestana);
  etqA.innerHTML = "Pestaña " + numeroPestana;
  pestanaNueva.appendChild(etqA);
  contenedorPestana.appendChild(pestanaNueva);
  console.log(contenedorPestana);
  //Agregar contenido Etiqueta

  //creando pestana

  var contenidoTab = document.getElementById("Pes_Cont");
  var nuevoDiv = document.createElement("div");
  //agregando atributos div
  nuevoDiv.setAttribute("id", numeroPestana);
  nuevoDiv.setAttribute("class", "tab-pane fade");
  //creando caja de texto
  var nuevoTxt = document.createElement("textarea");
  nuevoTxt.setAttribute("name", "mensaje");
  nuevoTxt.setAttribute("id", "text" + numeroPestana);
  nuevoTxt.setAttribute("cols", 80);
  nuevoTxt.setAttribute("rows", 20);
  nuevoTxt.setAttribute("placeholder", "Agregue texto");

  nuevoDiv.appendChild(nuevoTxt);
  contenidoTab.appendChild(nuevoDiv);
}

