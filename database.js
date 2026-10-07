const mysql = require('mysql2');

const conexion = mysql.createPool({
    host: '127.0.0.1',
    user: 'a25guerodmar_quiz',
    password: '2Daw2026_',
    database: 'a25guerodmar_quiz',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = conexion;