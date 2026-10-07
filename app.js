const express = require('express');
const app = express();
const port = Number(process.argv[2]) || 40300;
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const conexion = require('./database');

// Identificador de sesión
const { v4: uuidv4 } = require('uuid');
const sessions = new Map();

app.use(cors());
app.use(express.json());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'img', 'preguntes'));
  },

  filename: (req, file, cb) => {
    const nombre = Date.now() + '-' + file.originalname;
    cb(null, nombre);
  }
});

const upload = multer({ storage });
// ======================================================
// Archivos estáticos
// ======================================================

app.use(express.static(path.join(__dirname, 'public')));

// ======================================================
// GET /json1
// Obtener 10 preguntas aleatorias para una partida
// ======================================================

app.get('/json1', (req, res) => {
  const sql = 'SELECT * FROM preguntes';

  conexion.query(sql, (err, data) => {
    if (err) {
      console.error('Error consultando MySQL:', err);

      return res.status(500).json({
        error: 'Error al consultar la base de datos'
      });
    }

    const sessioId = uuidv4();

    // Mezclar las preguntas
    data.sort(() => Math.random() - 0.5);

    // Quedarnos solo con 10 preguntas
    const preguntasSeleccionadas = data.slice(0, 10);

    // Crear las preguntas que enviaremos al cliente
    const preguntasCliente = preguntasSeleccionadas.map(pregunta => ({
      id: pregunta.id,
      pregunta: pregunta.pregunta,
      respostes: [
        pregunta.resposta1,
        pregunta.resposta2,
        pregunta.resposta3,
        pregunta.resposta4
      ],
      imatge: pregunta.imatge
    }));

    // Guardar los IDs de las preguntas de la partida
    sessions.set(sessioId, []);

    for (let i = 0; i < preguntasCliente.length; i++) {
      sessions.get(sessioId).push(preguntasCliente[i].id);
    }

    const ret = {
      sessioId: sessioId,
      preguntes: preguntasCliente
    };

    res.json(ret);
  });
});

// ======================================================
// GET /preguntes
// Obtener todas las preguntas
// ======================================================

app.get('/preguntes', (req, res) => {
  const sql = 'SELECT * FROM preguntes';

  conexion.query(sql, (err, data) => {
    if (err) {
      console.error('Error consultando las preguntas:', err);

      return res.status(500).json({
        error: 'Error al consultar las preguntas'
      });
    }

    res.json(data);
  });
});

// ======================================================
// POST /preguntes
// Crear una nueva pregunta
// ======================================================

app.post('/preguntes', upload.single('imatge'), (req, res) => {

  const pregunta = req.body;

  const rutaImagen = req.file
    ? `/img/preguntes/${req.file.filename}`
    : null;

  const sql = `
    INSERT INTO preguntes
    (
      pregunta,
      resposta1,
      resposta2,
      resposta3,
      resposta4,
      resposta_correcta,
      imatge
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    pregunta.pregunta,
    pregunta.resposta1,
    pregunta.resposta2,
    pregunta.resposta3,
    pregunta.resposta4,
    pregunta.resposta_correcta,
    rutaImagen
];

  conexion.query(sql, valores, (err, resultado) => {

    if (err) {
      console.error('Error insertando la pregunta:', err);

      return res.status(500).json({
        error: 'Error al insertar la pregunta'
      });
    }

    res.status(201).json({
      mensaje: 'Pregunta creada correctamente',
      id: resultado.insertId,
      imatge: rutaImagen
    });

  });
});

// ======================================================
// PUT /preguntes/:id
// ======================================================

app.put('/preguntes/:id', upload.single('imatge'), (req, res) => {

    const id = req.params.id;

    const pregunta = req.body;

    // Si se sube una imagen nueva, usamos esa.
    // Si no, mantenemos la imagen que ya tenía.
    let sql;
    let valores;

    if (req.file) {

        sql = `
            UPDATE preguntes
            SET
                pregunta = ?,
                resposta1 = ?,
                resposta2 = ?,
                resposta3 = ?,
                resposta4 = ?,
                resposta_correcta = ?,
                imatge = ?
            WHERE id = ?
        `;

        valores = [
            pregunta.pregunta,
            pregunta.resposta1,
            pregunta.resposta2,
            pregunta.resposta3,
            pregunta.resposta4,
            pregunta.resposta_correcta,
            `/img/preguntes/${req.file.filename}`,
            id
        ];

    } else {

        sql = `
            UPDATE preguntes
            SET
                pregunta = ?,
                resposta1 = ?,
                resposta2 = ?,
                resposta3 = ?,
                resposta4 = ?,
                resposta_correcta = ?
            WHERE id = ?
        `;

        valores = [
            pregunta.pregunta,
            pregunta.resposta1,
            pregunta.resposta2,
            pregunta.resposta3,
            pregunta.resposta4,
            pregunta.resposta_correcta,
            id
        ];
    }


    conexion.query(sql, valores, (err, resultado) => {

        if (err) {

            console.error(
                'Error modificando la pregunta:',
                err
            );

            return res.status(500).json({
                error: 'Error al modificar la pregunta'
            });
        }


        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                error: 'No existe una pregunta con ese id'
            });
        }


        res.json({
            mensaje: 'Pregunta modificada correctamente',
            id: id
        });

    });

});

// ======================================================
// DELETE /preguntes/:id
// ======================================================

app.delete('/preguntes/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM preguntes WHERE id = ?';

  conexion.query(sql, [id], (err, resultado) => {
    if (err) {
      console.error('Error eliminando la pregunta:', err);

      return res.status(500).json({
        error: 'Error al eliminar la pregunta'
      });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        error: 'No existe una pregunta con ese id'
      });
    }

    res.json({
      mensaje: 'Pregunta eliminada correctamente',
      id: id
    });
  });
});

// ======================================================
// POST /resultats
// Comprobar respuestas de una partida
// ======================================================

app.post('/resultats', (req, res) => {

  const { sessioId, respostes } = req.body;

  // Comprobar que la sesión existe
  if (!sessions.has(sessioId)) {
    return res.status(404).json({
      error: 'Sessió no trobada'
    });
  }

  const idsPreguntes = sessions.get(sessioId);

  if (!respostes) {
    return res.status(400).json({
      error: 'No s\'han enviat les respostes'
    });
  }

  // Crear ?, ?, ?, ... según el número de preguntas
  const interrogants = idsPreguntes.map(() => '?').join(',');

  const sql = `
    SELECT id, resposta_correcta
    FROM preguntes
    WHERE id IN (${interrogants})
  `;

  conexion.query(sql, idsPreguntes, (err, data) => {

    if (err) {
      console.error('Error comprobant les respostes:', err);

      return res.status(500).json({
        error: 'Error al comprobar las respuestas'
      });
    }

    let correctes = 0;

    data.forEach(pregunta => {

      const respostaUsuari = respostes[pregunta.id];

      if (respostaUsuari === pregunta.resposta_correcta) {
        correctes++;
      }

    });

    res.json({
      correctes: correctes,
      total: idsPreguntes.length
    });

  });
});


// ======================================================
// Iniciar servidor
// ======================================================

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
