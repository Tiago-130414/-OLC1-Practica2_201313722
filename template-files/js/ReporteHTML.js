function reporte_html() {
    //buscando elementos
    var pestanaAct = document.getElementsByClassName("tab-pane fade in active");
    var cajatxt = pestanaAct[0].getAttribute("id");
    
    //obteniendo texto
    var txt = document.getElementById("htmlCajaTxt").value;
    console.log("texto en caja: " + txt);
  
    //definiendo titulo
    var titulo = document.getElementById("pes" + cajatxt).innerHTML;
    
    //descargando texto
    download(titulo+".html",txt);
  }
  
  function download(filename, text) {
    var element = document.createElement("a");
    element.setAttribute(
      "href","data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  