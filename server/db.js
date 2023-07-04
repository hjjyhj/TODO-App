const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: 'todoapp',
    waitForConnections: true,
})

module.exports = pool;
