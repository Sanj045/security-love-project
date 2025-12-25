const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Bypass cảnh báo Ngrok và lấy IP thật
app.use((req, res, next) => {
    res.setHeader('bypass-tunnel-reminder', 'true');
    // Khi dùng Ngrok, IP thật nằm trong header 'x-forwarded-for'
    req.realIp = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
    next();
});

// 2. Cấu hình kết nối Database
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root_password',
    database: process.env.DB_NAME || 'security_lab'
};

let db;
function handleDisconnect() {
    db = mysql.createConnection(dbConfig);
    db.connect((err) => {
        if (err) {
            console.error('Lỗi kết nối DB, đang thử lại sau 5s...', err.message);
            setTimeout(handleDisconnect, 5000);
        } else {
            console.log('--- [HỆ THỐNG] Đã kết nối Database thành công ---');
        }
    });
    db.on('error', (err) => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') handleDisconnect();
        else throw err;
    });
}
handleDisconnect();

// 3. Hàm ghi Log
async function recordLog(ip, username, status) {
    const query = 'INSERT INTO login_logs (ip_address, username, status) VALUES (?, ?, ?)';
    try {
        await db.promise().query(query, [ip, username, status]);
    } catch (err) {
        console.error('Lỗi ghi log:', err.message);
    }
}

// 4. API đặc biệt cho love.html (PHẢI ĐẶT TRƯỚC express.static)
app.get('/love.html', async (req, res, next) => {
    console.log(`--- [THEO DÕI] Người yêu vừa vào trang tỏ tình từ IP: ${req.realIp} ---`);
    await recordLog(req.realIp, "Người Yêu (Đang xem tỏ tình ❤️)", 'success');
    next(); // Sau khi ghi log xong mới cho phép đi tiếp để hiện file
});

// 5. Phục vụ file tĩnh
app.use(express.static('.'));

// 6. MIDDLEWARE: Phát hiện Brute Force
const bruteForceChecker = async (req, res, next) => {
    try {
        const [rows] = await db.promise().query(
            "SELECT COUNT(*) as failed_attempts FROM login_logs WHERE ip_address = ? AND status = 'failed' AND attempt_time > NOW() - INTERVAL 1 MINUTE", 
            [req.realIp]
        );
        if (rows[0].failed_attempts >= 5) {
            return res.status(429).json({ message: "CẢNH BÁO: Thử sai quá nhiều lần!" });
        }
        next(); 
    } catch (error) { next(); }
};

// --- CÁC API HỆ THỐNG ---

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Thiếu thông tin" });
    try {
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) return res.status(400).json({ message: "Tài khoản đã tồn tại!" });
        await db.promise().query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, password]);
        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) { res.status(500).json({ message: "Lỗi hệ thống" }); }
});

app.post('/login', bruteForceChecker, async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length > 0 && users[0].password_hash === password) {
            await recordLog(req.realIp, username, 'success');
            return res.status(200).json({ message: "Thành công" });
        }
        await recordLog(req.realIp, username, 'failed');
        res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    } catch (error) { res.status(500).json({ message: "Lỗi hệ thống" }); }
});

app.get('/api/logs', async (req, res) => {
    try {
        const [rows] = await db.promise().query("SELECT * FROM login_logs ORDER BY attempt_time DESC LIMIT 10");
        res.json(rows);
    } catch (error) { res.status(500).send("Lỗi lấy dữ liệu log"); }
});

app.delete('/api/logs', async (req, res) => {
    try {
        await db.promise().query("DELETE FROM login_logs");
        res.json({ message: "Đã dọn dẹp nhật ký thành công!" });
    } catch (error) { res.status(500).json({ error: "Lỗi xóa log" }); }
});

app.listen(3000, '0.0.0.0', () => console.log("Hệ thống ATTT đang chạy tại port 3000"));