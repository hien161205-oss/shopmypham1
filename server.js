const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Phục vụ tệp tĩnh từ cả thư mục public VÀ thư mục gốc (nơi chứa các file HTML)
// Sử dụng path.join để đảm bảo đường dẫn chính xác trên Linux (Vercel)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// --- MOCK API ROUTES (Dùng cho bản không MongoDB) ---
app.get('/api/products', (req, res) => {
    // Bạn có thể trả về mảng rỗng hoặc dữ liệu mẫu ở đây nếu muốn
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

// 3. Chuyển hướng mọi request không tìm thấy về index.html (SPA routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;

// 4. QUAN TRỌNG: Chỉ listen nếu không phải môi trường Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Local Server running on port ${PORT}`));
}

module.exports = app;