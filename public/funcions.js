// ======================================================
// USUARIO - localStorage
// ======================================================

const contenedorUsuario = document.getElementById("usuario");

mostrarUsuario();

function mostrarUsuario() {

  const nombre = localStorage.getItem("nombre");

  if (nombre) {

    contenedorUsuario.innerHTML = `
      <h2>Hola, ${nombre}!</h2>

      <button id="btn-borrar-nombre">
        Esborrar nom
      </button>
    `;

    document
      .getElementById("btn-borrar-nombre")
      .addEventListener("click", borrarNombre);

  } else {

    contenedorUsuario.innerHTML = `
      <form id="form-nombre">

        <div>

          <input
            type="text"
            id="nombre"
            class="form-control"
            placeholder="Introduiex el teu nom"
            required
          >
        </div>

        <button type="submit">
          Guardar nom
        </button>

      </form>
    `;

    const formulario = document.getElementById("form-nombre");

    formulario.addEventListener("submit", guardarNombre);
  }
}


function guardarNombre(event) {

  event.preventDefault();

  const inputNombre = document.getElementById("nombre");

  const nombre = inputNombre.value.trim();

  if (nombre === "") {
    return;
  }

  localStorage.setItem("nombre", nombre);

  mostrarUsuario();
}


function borrarNombre() {

  localStorage.removeItem("nombre");

  mostrarUsuario();
}

// PREGUNTAS
fetch('http://a25guerodmar.daw.inspedralbes.cat:40300/json1')
  .then(response => response.json())
  .then(data => {
    console.log("Dades carregades!", data);
    sessioId = data.sessioId;

    const contenedor = document.getElementById("ficha");
    const longitud = 10;

    function iniciarPartida(preguntes) {
      for (let i = 0; i < longitud; i++) {
        let respuestasHTML = '';

        for (let j = 0; j < preguntes[i].respostes.length; j++) {
          respuestasHTML += `
            <li>
              <button class="boton_opcion">
                ${preguntes[i].respostes[j]}
              </button>
            </li>`;
        }

        contenedor.innerHTML += `
          <div class="pregunta">
            <h1>${preguntes[i].pregunta}</h1>
            <img width="100px" src="${preguntes[i].imatge}">
            <ul>
              ${respuestasHTML}
            </ul>
          </div>`;
      }

      // BOTONES OPCIONES
      // Buscamos todos los botones que acabamos de crear
      const botones = document.querySelectorAll(".boton_opcion");

      // Añadimos el evento a cada botón
      botones.forEach((boton, index) => {
        const preguntaIndex = Math.floor(index / 4);
        const respuestaIndex = index % 4;
        switch (respuestaIndex) {
          case 0 :
            boton.classList.add(`opcion0`)
            break;
          case 1 :
            boton.classList.add(`opcion1`)
            break;
          case 2 :
            boton.classList.add(`opcion2`)
            break;
          case 3 :
            boton.classList.add(`opcion3`)
            break;
        }
        boton.addEventListener("click", () => {
          marcarRespuesta(
            preguntes[preguntaIndex].id,
            preguntes[preguntaIndex].respostes[respuestaIndex],
            longitud,
            boton,
          );
        });
      });

      marcador.innerHTML =
        `<img src="https://cdn-icons-png.flaticon.com/512/727/727581.png" alt="Imagen de bandera amarilla">
        <p>Pregunta: <br> <span>${estatDeLaPartida.contadorPreguntes} / ${longitud}</span></p>`;
    }

    iniciarPartida(data.preguntes);
    iniciarTemporizador();
  });

// GLOBAL

let estatDeLaPartida = {
  contadorPreguntes: 0,
  respostesUsuari: new Map()
};
let sessioId = null;
const marcador = document.getElementById("marcador");
const btn_enviar = document.getElementById("btn_enviar");
const contenedor = document.getElementById("ficha");
const btn_siguiente = document.getElementById("btn-siguiente");
const btn_anterior = document.getElementById("btn-anterior");
const elementoTiempo = document.getElementById("tiempo");
let tiempo = 0;
let intervaloTiempo = null;

// FUNCIONES
btn_enviar.addEventListener("click", enviarResultados);

function enviarResultados() {

  const respostes = Object.fromEntries(
    estatDeLaPartida.respostesUsuari
  );

  fetch('http://a25guerodmar.daw.inspedralbes.cat:40300/resultats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sessioId: sessioId,
      respostes: respostes
    })
  })
  .then(response => response.json())
  .then(data => {

    console.log("Resultat:", data);

    alert(
      `Has encertat ${data.correctes} de ${data.total} preguntes`
    );

  })
  .catch(error => {
    console.error("Error enviant els resultats:", error);
  });
}

function marcarRespuesta(preg, resp, longitud, botonPulsado) {
  console.log(`En la pregunta ${preg} has marcado ${resp}`);

  if (!estatDeLaPartida.respostesUsuari.has(preg)) {
    estatDeLaPartida.contadorPreguntes += 1;
  }

  estatDeLaPartida.respostesUsuari.set(preg, resp);

  renderitzarMarcador(
    estatDeLaPartida.contadorPreguntes,
    longitud
  );

  // Quitar selección anterior de esta pregunta
  const botonesPregunta = botonPulsado.parentElement.parentElement.querySelectorAll(".boton_opcion");

  botonesPregunta.forEach(boton => {
    boton.classList.remove("estado_seleccionado");
  });

  // Seleccionar el botón actual
  botonPulsado.classList.add("estado_seleccionado");

  if (estatDeLaPartida.contadorPreguntes == longitud) {
    btn_enviar.classList.remove("hidden");
    clearInterval(intervaloTiempo);
    contenedor.style.paddingBottom = "35px";
  }
}

function renderitzarMarcador(contador, longitud) {
  marcador.innerHTML =
    `<img src="https://cdn-icons-png.flaticon.com/512/727/727581.png" alt="Imagen de bandera amarilla">
    <p>Pregunta: <br> <span>${contador} / ${longitud}</span></p>`;;
}

// TEMPORIZADOR 

function iniciarTemporizador() {

  intervaloTiempo = setInterval(() => {

    tiempo++;

    elementoTiempo.textContent = tiempo;

  }, 1000);
}


// BOTONES DE ANTERIOR Y SIGUIENTE

let posicion = 0;

btn_siguiente.addEventListener("click", () => {
  if(posicion > -900) {
    posicion -= 100;
    contenedor.style.marginLeft = `${posicion}%`;
  }
});

btn_anterior.addEventListener("click", () => {
  if(posicion < 0) {
    posicion += 100;
    contenedor.style.marginLeft = `${posicion}%`;
  }
});
