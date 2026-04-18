const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Phục vụ tệp tĩnh: Ưu tiên các file ở gốc (HTML), sau đó là thư mục public (CSS/JS)
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

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