const express = require('express');
const cors = require('cors');
const session = require('express-session');
const app = express();
const db = require('./db'); // ✅ นำเข้า db.js
const path = require('path');

app.use('/font', express.static(path.join(__dirname, 'font'))); // ✅ เสิร์ฟไฟล์จาก /font
app.use('/scripts', express.static(path.join(__dirname, 'scripts'))); // ✅ เสิร์ฟไฟล์จาก /scripts
app.use('/images', express.static(path.join(__dirname, 'images'))); // ✅ เสิร์ฟรูปภาพ


// ✅ แก้ไข CORS Policy ให้รองรับ Cookies & Sessions
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // ✅ ต้องกำหนด Origin ให้ตรงกับ Frontend
    credentials: true
}));

app.use('/font', express.static(path.join(__dirname, 'font')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ ตั้งค่า Express Session ให้รองรับการล็อกอิน
app.use(session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // ✅ ถ้าใช้ HTTPS ต้องเปลี่ยนเป็น `true`
}));

// ทดสอบ API
app.get('/', (req, res) => {
    res.send('🚀 API กำลังทำงาน!');
});

// ✅ API สมัครสมาชิก
app.post('/register', (req, res) => {
    const { fullname, email, password, phone } = req.body;
    const sql = 'INSERT INTO customers (name, email, password, phone) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [fullname, email, password, phone], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: '✅ สมัครสมาชิกสำเร็จ!', userId: results.insertId });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM customers WHERE email = ? AND password = ?';

    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            req.session.user = results[0]; // ✅ บันทึกข้อมูลผู้ใช้ลงใน session
            res.json({ message: '✅ เข้าสู่ระบบสำเร็จ!', user: results[0] });
        } else {
            res.status(401).json({ message: '❌ อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }
    });
});


// ✅ API ดึงเมนูสินค้า
app.get('/menu', (req, res) => {
    db.query('SELECT * FROM menu', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ✅ API สร้างคำสั่งซื้อ
app.post('/order', (req, res) => {
    const { customer_id, items, total, payment_method } = req.body;
    const sql = 'INSERT INTO orders (customer_id, total, payment_method, status) VALUES (?, ?, ?, "pending")';
    
    db.query(sql, [customer_id, total, payment_method], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const orderId = results.insertId;
        const orderItemsSQL = 'INSERT INTO order_items (order_id, menu_id, quantity) VALUES ?';
        const values = items.map(item => [orderId, item.menu_id, item.quantity]);

        db.query(orderItemsSQL, [values], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: '✅ คำสั่งซื้อถูกบันทึก!', orderId });
        });
    });
});

// ✅ API อัปเดตการชำระเงิน
app.put('/update-payment/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const { status } = req.body;
    const sql = 'UPDATE orders SET status = ? WHERE order_id = ?';

    db.query(sql, [status, orderId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: '✅ อัปเดตสถานะการชำระเงินแล้ว' });
    });
});



app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: '✅ ออกจากระบบแล้ว' });
    });
});



app.post('/add-to-cart', (req, res) => {
    const { userId, menuId, name, price, quantity, noodleType } = req.body;

    if (!userId || !menuId) {
        return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
    }

    const sql = `INSERT INTO cart (customer_id, menu_id, quantity, noodle_type) 
                 VALUES (?, ?, ?, ?) 
                 ON DUPLICATE KEY UPDATE quantity = quantity + ?`;

    db.query(sql, [userId, menuId, quantity, noodleType, quantity], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "✅ เพิ่มลงตะกร้าสำเร็จ!" });
    });
});



app.get('/check-login', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: { name: req.session.user.name } }); // ✅ ส่งค่าชื่อผู้ใช้กลับไป
    } else {
        res.json({ loggedIn: false });
    }
});


// ✅ API ออกจากระบบ
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: '✅ ออกจากระบบแล้ว' });
    });
});

app.listen(3300, () => {
    console.log('🚀 Server running at http://localhost:3300');
});
