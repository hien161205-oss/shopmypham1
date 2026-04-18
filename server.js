const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Ánh xạ trực tiếp các tài nguyên chính (CSS/JS)
// Giúp các file HTML gọi /style.css hay /script.js vẫn tìm đúng chỗ trong /public
app.get('/style.css', (req, res) => res.sendFile(path.join(__dirname, 'public', 'style.css')));
app.get('/script.js', (req, res) => res.sendFile(path.join(__dirname, 'public', 'script.js')));

// 2. Phục vụ thư mục public cho các tài nguyên khác (ảnh, icon...)
app.use('/public', express.static(path.join(__dirname, 'public')));

// 3. Phục vụ các file HTML ở thư mục gốc và tự động nhận diện đuôi .html
app.use(express.static(__dirname, { extensions: ['html'] }));

// --- MOCK API ROUTES (Dùng cho bản không MongoDB) ---
app.get('/api/products', (req, res) => {
    res.json([]); // Trả về mảng rỗng để Frontend dùng DEFAULT_PRODUCTS
});

app.post('/api/orders', (req, res) => {
    const { items } = req.body;
    const totalPrice = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
    // Trả về một ID giả và thông tin để Frontend hiển thị thành công
    res.status(201).json({ _id: "ORDER-" + Date.now(), items, totalPrice });
});

// Route mặc định cho trang chủ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;

// 4. QUAN TRỌNG: Chỉ listen nếu không phải môi trường Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Local Server running on port ${PORT}`));
}

module.exports = app;