const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'auth_db',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Gagal terkoneksi ke database:', err.message);
        return;
    }
    console.log('auth database terhubung');
});

module.exports = db; 