const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Phục vụ tệp tĩnh từ cả thư mục public VÀ thư mục gốc (nơi chứa các file HTML)
app.use(express.static('public'));
app.use(express.static(__dirname)); 

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