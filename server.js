const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Cấu hình phục vụ tệp tĩnh thông minh
// - Ưu tiên tìm trong thư mục 'public' trước (cho style.css, script.js)
// - Sau đó tìm ở thư mục gốc (cho các file .html)
// - Tự động thêm đuôi .html nếu người dùng không gõ (ví dụ: /product-detail -> product-detail.html)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname, {
    extensions: ['html']
}));

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

// 2. Route mặc định trả về index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;

// 4. QUAN TRỌNG: Chỉ listen nếu không phải môi trường Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Local Server running on port ${PORT}`));
}

module.exports = app;