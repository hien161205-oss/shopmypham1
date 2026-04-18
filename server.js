const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Phục vụ các tệp tĩnh từ thư mục public (HTML, CSS, Client JS)
app.use(express.static('public'));

// Chuyển hướng mọi request không tìm thấy về index.html để đảm bảo giao diện không lỗi
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Static Server running on port ${PORT}`));

module.exports = app;