/* Menentukan tema (terang/gelap) dan font sebelum halaman digambar, supaya tidak berkedip.
   Dimuat sinkron di <head>. Membaca preferensi dari localStorage, lalu ke pengaturan sistem. */
try{var d=JSON.parse(localStorage.getItem("finance-v1")||localStorage.getItem("duitku-v1"));document.documentElement.setAttribute("data-nx",d&&d.ts?(d.theme!=="dark"?"light":"dark"):(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));if(d&&d.ff==="system")document.documentElement.setAttribute("data-nxf","system")}catch(e){document.documentElement.setAttribute("data-nx","dark")}
