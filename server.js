const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const root = path.resolve(__dirname);
const publicDir = path.resolve(__dirname, 'public');

// 1. Ánh xạ tài nguyên tĩnh (CSS/JS/Images)
app.get('/style.css', (req, res) => res.sendFile(path.join(publicDir, 'style.css')));
app.get('/script.js', (req, res) => res.sendFile(path.join(publicDir, 'script.js')));
app.use('/public', express.static(publicDir));

// 2. Phục vụ các file HTML ở thư mục gốc
app.use(express.static(root, { extensions: ['html'], index: false }));

// --- MOCK API ROUTES (Dùng cho bản không MongoDB) ---
app.get('/api/products', (req, res) => {
    res.json([]); // Trả về mảng rỗng để Frontend dùng DEFAULT_PRODUCTS
});

// Route đăng nhập (Mô phỏng)
app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    
    // Giả lập: admin@qh.com / 123456 là Admin
    const isAdmin = email === 'admin@qh.com' && password === '123456';
    const name = isAdmin ? 'Admin Hệ Thống' : (email ? email.split('@')[0] : 'Người dùng');

    // Tạo token giả (Base64) để Frontend có thể giải mã kiểm tra quyền
    const payload = Buffer.from(JSON.stringify({ id: "mock-id", name, isAdmin })).toString('base64');
    const token = `mockHeader.${payload}.mockSignature`;

    res.json({ token, name, email: email || 'user@example.com', isAdmin });
});

// Route đăng ký (Mô phỏng)
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    const payload = Buffer.from(JSON.stringify({ id: "mock-id", name, isAdmin: false })).toString('base64');
    const token = `mockHeader.${payload}.mockSignature`;

    res.status(201).json({ token, name, email, isAdmin: false });
});

// Route kiểm tra quyền Admin (Dùng cho admin.html)
app.get('/api/users/admin-check', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.includes('.')) {
        try {
            const token = authHeader.split(' ')[1];
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
            if (payload.isAdmin) return res.json({ isAdmin: true });
        } catch (e) {}
    }
    res.status(401).json({ message: "Không có quyền Admin" });
});

app.post('/api/orders', (req, res) => {
    const { items } = req.body;
    const totalPrice = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
    // Trả về một ID giả và thông tin để Frontend hiển thị thành công
    res.status(201).json({ _id: "ORDER-" + Date.now(), items, totalPrice });
});

// 3. ĐỊNH TUYẾN TRANG (Explicit Routing để tránh 404)
const pages = ['index', 'product-detail', 'admin', 'category', 'magazine', 'magazine-detail', 'policy', 'about', 'contact', 'support'];
pages.forEach(page => {
    const route = page === 'index' ? '/' : `/${page}`;
    app.get(route, (req, res) => res.sendFile(path.join(root, `${page}.html`)));
    // Hỗ trợ cả link có đuôi .html
    app.get(`/${page}.html`, (req, res) => res.sendFile(path.join(root, `${page}.html`)));
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Local Server running on port ${PORT}`));
}

module.exports = app;