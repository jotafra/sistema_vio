// Carregando variáveis de ambiente (opcional, se necessário)
// require('dotenv').config();

// Importando o módulo 'mysql2' para interagir com o banco de dados MySQL
const mysql = require('mysql2');

// Criando um pool de conexões com o banco de dados MySQL
const pool = mysql.createPool({
    connectionLimit: 10, // Define o número máximo de conexões simultâneas no pool
    host: process.env.DB_HOST, // Host do banco de dados, deve estar configurado nas variáveis de ambiente
    user: process.env.DB_USER, // Usuário do banco de dados, também configurado nas variáveis de ambiente
    password: process.env.DB_PASSWORD, // Senha do banco de dados, configurada nas variáveis de ambiente
    database: process.env.DB_NAME // Nome do banco de dados, configurado nas variáveis de ambiente
});

// Exportando o pool para que ele possa ser utilizado em outras partes da aplicação
module.exports = pool;
