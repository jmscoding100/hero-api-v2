const mysql = require('mysql2')
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'herodb'
})

module.exports = pool