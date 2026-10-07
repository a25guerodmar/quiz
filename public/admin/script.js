
// ======================================================
// VARIABLES
// ======================================================

let modoEdicion = false;
let idPreguntaEditando = null;

// ======================================================
// CARGAR PREGUNTAS AL INICIAR
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
    cargarPreguntas();

    document
        .getElementById('formPregunta')
        .addEventListener('submit', guardarPregunta);
});


// ======================================================
// GET /preguntes
// Cargar todas las preguntas
// ======================================================

function cargarPreguntas() {

    fetch('/preguntes')
        .then(res => res.json())
        .then(preguntas => {

            const tabla = document.getElementById('tablaPreguntas');

            tabla.innerHTML = '';

            if (preguntas.length === 0) {

                tabla.innerHTML = `
                    <tr>
                        <td colspan="8" class="text-center text-muted py-4">
                            No hay preguntas.
                        </td>
                    </tr>
                `;

                return;
            }


            preguntas.forEach(pregunta => {

                const fila = document.createElement('tr');

                fila.innerHTML = `
                    <td>${pregunta.id}</td>

                    <td>
                        ${pregunta.pregunta}
                    </td>

                    <td>
                        ${pregunta.resposta1}
                    </td>

                    <td>
                        ${pregunta.resposta2}
                    </td>

                    <td>
                        ${pregunta.resposta3}
                    </td>

                    <td>
                        ${pregunta.resposta4}
                    </td>

                    <td>
                        <span class="badge bg-success">
                            ${pregunta.resposta_correcta}
                        </span>
                    </td>

                    <td>

                        <div class="btn-group">

                            <button
                                class="btn btn-sm btn-warning"
                                onclick="editarPregunta(${pregunta.id})"
                            >
                                Editar
                            </button>

                            <button
                                class="btn btn-sm btn-danger"
                                onclick="eliminarPregunta(${pregunta.id})"
                            >
                                Eliminar
                            </button>

                        </div>

                    </td>
                `;

                tabla.appendChild(fila);
            });

        })
        .catch(error => {

            console.error('Error cargando las preguntas:', error);

            document.getElementById('tablaPreguntas').innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-danger py-4">
                        Error al cargar las preguntas.
                    </td>
                </tr>
            `;
        });
}


// ======================================================
// NUEVA PREGUNTA
// ======================================================

function nuevaPregunta() {

    modoEdicion = false;

    idPreguntaEditando = null;

    document.getElementById('modalPreguntaLabel').textContent =
        'Nueva pregunta';

    document.getElementById('formPregunta').reset();
}


// ======================================================
// EDITAR PREGUNTA
// ======================================================

function editarPregunta(id) {

    fetch('/preguntes')
        .then(res => res.json())
        .then(preguntas => {

            const pregunta = preguntas.find(p => p.id == id);

            if (!pregunta) {
                alert('No se encontró la pregunta.');
                return;
            }

            modoEdicion = true;

            idPreguntaEditando = id;

            document.getElementById('modalPreguntaLabel').textContent =
                'Editar pregunta';

            document.getElementById('pregunta').value =
                pregunta.pregunta;

            document.getElementById('resposta1').value =
                pregunta.resposta1;

            document.getElementById('resposta2').value =
                pregunta.resposta2;

            document.getElementById('resposta3').value =
                pregunta.resposta3;

            document.getElementById('resposta4').value =
                pregunta.resposta4;

            document.getElementById('resposta_correcta').value =
                pregunta.resposta_correcta;

            // Limpiar el input de archivo
            document.getElementById('imatge').value = '';

            const modalElement =
                document.getElementById('modalPregunta');

            const modal =
                bootstrap.Modal.getOrCreateInstance(modalElement);

            modal.show();

        })
        .catch(error => {

            console.error(
                'Error obteniendo la pregunta:',
                error
            );

            alert('Error al obtener la pregunta.');

        });
}


// ======================================================
// GUARDAR PREGUNTA
// POST / PUT
// ======================================================

function guardarPregunta(event) {

    event.preventDefault();

    const id = idPreguntaEditando;
    const datos = new FormData();

    datos.append(
        'pregunta',
        document.getElementById('pregunta').value
    );

    datos.append(
        'resposta1',
        document.getElementById('resposta1').value
    );

    datos.append(
        'resposta2',
        document.getElementById('resposta2').value
    );

    datos.append(
        'resposta3',
        document.getElementById('resposta3').value
    );

    datos.append(
        'resposta4',
        document.getElementById('resposta4').value
    );

    datos.append(
        'resposta_correcta',
        document.getElementById('resposta_correcta').value
    );


    // Imagen
    const imagen =
        document.getElementById('imatge').files[0];

    if (imagen) {
        datos.append('imatge', imagen);
    }


    // ==================================================
    // EDITAR
    // ==================================================

    if (modoEdicion) {

        fetch(`/preguntes/${id}`, {

            method: 'PUT',

            body: datos

        })
        .then(res => res.json())
        .then(data => {
    if (data.error) {
        alert(data.error);
        return;
    }

    alert('Pregunta modificada correctamente.');

    try {
        cerrarModal();
        cargarPreguntas();
    } catch (error) {
        console.error('Error después de crear la pregunta:', error);
        alert('La pregunta se creó, pero hubo un error al actualizar la pantalla.');
    }
})
.catch(error => {
    console.error('Error en el fetch:', error);
    alert('Error al crear la pregunta.');
});

        return;
    }


    // ==================================================
    // CREAR
    // ==================================================

    fetch('/preguntes', {

        method: 'POST',

        body: datos

    })
    .then(res => res.json())
    .then(data => {

        if (data.error) {
            alert(data.error);
            return;
        }

        alert('Pregunta creada correctamente.');

        cerrarModal();

        cargarPreguntas();

    })
    .catch(error => {

        console.error(
            'Error creando la pregunta:',
            error
        );

        alert('Error al crear la pregunta.');

    });
}


// ======================================================
// ELIMINAR PREGUNTA
// DELETE /preguntes/:id
// ======================================================

function eliminarPregunta(id) {

    const confirmar = confirm(
        `¿Seguro que quieres eliminar la pregunta ${id}?`
    );

    if (!confirmar) {
        return;
    }


    fetch(`/preguntes/${id}`, {

        method: 'DELETE'

    })
    .then(res => res.json())
    .then(data => {

        if (data.error) {
            alert(data.error);
            return;
        }

        alert('Pregunta eliminada correctamente.');

        cargarPreguntas();

    })
    .catch(error => {

        console.error('Error eliminando:', error);

        alert('Error al eliminar la pregunta.');

    });
}


// ======================================================
// CERRAR MODAL
// ======================================================

function cerrarModal() {

    const modalElement =
        document.getElementById('modalPregunta');

    const modal =
        bootstrap.Modal.getOrCreateInstance(modalElement);

    modal.hide();

    document.getElementById('formPregunta').reset();
}
