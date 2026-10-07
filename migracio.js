const fs = require('node:fs');
const conexion = require('./database');

const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

conexion.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }

    console.log('Conectado a MySQL');

    insertarPregunta(0);
});

function insertarPregunta(indice) {
    if (indice >= data.preguntes.length) {
        console.log('Migración terminada correctamente.');
        conexion.end();
        return;
    }

    const pregunta = data.preguntes[indice];

    const sql = `
        INSERT INTO preguntes
        (
            id,
            pregunta,
            resposta1,
            resposta2,
            resposta3,
            resposta4,
            resposta_correcta,
            imatge
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        pregunta.id,
        pregunta.pregunta,
        pregunta.respostes[0],
        pregunta.respostes[1],
        pregunta.respostes[2],
        pregunta.respostes[3],
        pregunta.resposta_correcta,
        pregunta.imatge
    ];

    conexion.query(sql, valores, (err, resultado) => {
        if (err) {
            console.error(
                `Error insertando la pregunta ${pregunta.id}:`,
                err
            );

            conexion.end();
            return;
        }

        console.log(`Pregunta ${pregunta.id} insertada correctamente`);

        insertarPregunta(indice + 1);
    });
}