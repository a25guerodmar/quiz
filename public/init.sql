CREATE TABLE preguntes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL,
    resposta1 VARCHAR(255) NOT NULL,
    resposta2 VARCHAR(255) NOT NULL,
    resposta3 VARCHAR(255) NOT NULL,
    resposta4 VARCHAR(255) NOT NULL,
    resposta_correcta VARCHAR(255) NOT NULL,
    imatge VARCHAR(500)
);