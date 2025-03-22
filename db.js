const mysql = require('mysql2');
require('dotenv').config();

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '232921_Sa',
    database: process.env.DB_NAME || 'noodle_shop'
});

// ตรวจสอบการเชื่อมต่อ
connection.connect(err => {
    if (err) {
        console.error('❌ ไม่สามารถเชื่อมต่อฐานข้อมูล:', err);
        return;
    }
    console.log('✅ เชื่อมต่อฐานข้อมูล MySQL สำเร็จ!');
});

module.exports = connection;
