
function abrir_archivo() {
  var abrirAr = document.createElement('input');
   abrirAr.setAttribute('type','file');
   abrirAr.setAttribute('a','file');
   abrirAr.setAttribute('accept',".cs");
   abrirAr.click();
   abrirAr.addEventListener('change',leerArchivo,false);
  
}

function leerArchivo(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
      return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
      var contenido = e.target.result;
      mostrarContenido(contenido);
      var nombreAr = archivo.name;
      cambiarNombre(nombreAr);
    };
    lector.readAsText(archivo);
  }

  function cambiarNombre(nombre){
    var pestanaAct = document.getElementsByClassName('tab-pane fade in active');
    var cajatxt = pestanaAct[0].getAttribute('id');
    var titulo = document.getElementById('pes'+ cajatxt);
    titulo.innerHTML  = nombre;
  }

  
  function mostrarContenido(contenido) {
    var pestanaAct = document.getElementsByClassName('tab-pane fade in active');
    var cajatxt = pestanaAct[0].getAttribute('id');
    var txt = document.getElementById('text'+ cajatxt);
    txt.innerHTML = contenido;
   
  }

         //obtener valor de caja de texto
          //var txt = document.getElementById('text'+ cajatxt).value;
          
          //obtener titulo de pestana
          //var titulo = document.getElementById('pes'+ cajatxt).innerHTML;