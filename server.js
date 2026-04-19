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

// 2. Phục vụ các file HTML
app.use(express.static(root, { extensions: ['html'], index: false }));

// --- MOCK API ROUTES (Dùng cho bản không MongoDB) ---

// Dữ liệu sản phẩm mẫu (Bạn có thể copy toàn bộ DEFAULT_PRODUCTS từ script.js vào đây)
let mockProducts = [
    {
        _id: "p1",
        name: '[NEW DEW] Son Tint Bóng Merzy Dạng Thạch',
        brand: 'Merzy',
        category: 'trang-diem-son-moi',
        price: 179000,
        oldPrice: 309000,
        discount: '42%',
        image: 'https://product.hstatic.net/1000006063/product/wd23_c168ab0ee2c24edda27693a18de15bb5_1024x1024.jpg',
        images: [
            'https://product.hstatic.net/1000006063/product/wd23_c168ab0ee2c24edda27693a18de15bb5_1024x1024.jpg',
            'https://cdn.hstatic.net/products/1000006063/36_3232d9509c31426c9ea371625b3fc168_1024x1024.png',
            'https://product.hstatic.net/1000006063/product/m13_1f176b01a3ef42f1ba6e7566e23a0ae5_1024x1024.jpg'
        ],
        sold: 25200,
        stock: 100
    },
    {
        _id: "p2",
        name: 'Serum Chống Nắng B.O.M Dưỡng Ẩm',
        brand: 'B.O.M',
        category: 'cham-soc-da',
        price: 438000,
        oldPrice: 548000,
        discount: '20%',
        image: 'https://cdn.hstatic.net/products/1000006063/bt_770a3fcae16d4350ad40ad252a1805fb_1024x1024.jpg',
        images: [
            'https://cdn.hstatic.net/products/1000006063/bt_770a3fcae16d4350ad40ad252a1805fb_1024x1024.jpg',
            'https://cdn.hstatic.net/products/1000006063/download_761a7597092b4c799c8d06e2f284d44c_1024x1024.jpg',
            'https://cdn.hstatic.net/products/1000006063/h9_f28910f385f74ac697b04ac151da657b_1024x1024.jpg'
        ],
        sold: 1500,
        stock: 50
    },
    {
        _id: "p3",
        name: 'Kem Chống Nắng La Roche-Posay Anthelios',
        brand: 'La Roche-Posay',
        category: 'cham-soc-da',
        price: 449000,
        oldPrice: 640000,
        discount: '30%',
        image: 'https://product.hstatic.net/1000006063/product/bth_b1850e1e326b4a60ab803afca16b55af_1024x1024.jpg',
        images: [
            'https://product.hstatic.net/1000006063/product/bth_b1850e1e326b4a60ab803afca16b55af_1024x1024.jpg',
            'https://cdn.hstatic.net/products/1000006063/22_2d9c2cc106af4ff5a8b76a5eabf5a099_1024x1024.png',
            'https://product.hstatic.net/1000006063/product/download__9__copy_0db1ec89680a4115ab3a2719df116552_1024x1024.jpg'
        ],
        sold: 3200,
        stock: 80
    },
    {
        _id: "p4",
        name: 'Kem Chống Nắng CLINICOS Truth Sunscreen',
        brand: 'CLINICOS',
        category: 'cham-soc-da',
        price: 129000,
        oldPrice: 219000,
        discount: '41%',
        image: 'https://cdn.hstatic.net/products/1000006063/clinicos_1_01852f0e66eb4f66a1868e5d5c336d03_1024x1024.jpg',
        images: [
            'https://cdn.hstatic.net/products/1000006063/clinicos_1_01852f0e66eb4f66a1868e5d5c336d03_1024x1024.jpg',
            'https://cdn.hstatic.net/products/1000006063/download__9__af2f0acce36047ca8221217379bc5092_1024x1024.jpg',
            'https://cdn.hstatic.net/products/1000006063/download__11__31e86468b1e6423587aaae76e74ab00d_1024x1024.jpg'
        ],
        sold: 33,
        stock: 200
    },
    {
        _id: "p10",
        name: 'Nước Dưỡng Tóc Tinh Dầu Bưởi Cocoon',
        brand: 'Cocoon',
        category: 'cham-soc-toc',
        price: 158000,
        oldPrice: 185000,
        discount: '15%',
        image: 'https://product.hstatic.net/1000006063/product/dai_dien_dce04d99812b47ada407478149e79841_1024x1024.jpg',
        images: [
            'https://product.hstatic.net/1000006063/product/dai_dien_dce04d99812b47ada407478149e79841_1024x1024.jpg',
            'https://product.hstatic.net/1000006063/product/vn-11134207-7qukw-lgghts6etzze18_4e025266eb46464381ed1214c2a30f95.jfif',
            'https://product.hstatic.net/1000006063/product/vn-11134207-7r98o-lwqnel1sckih70_594a1032dac54224bc4c246808d12d51_1024x1024.jpg'
        ],
        sold: 1250,
        stock: 200
    },
    { _id: "p23", name: 'Mặt Nạ Giấy Klairs Sáng Da Mờ Thâm Freshly Vitamin Skin Prep Pads', brand: 'Klairs', category: 'skincare', price: 350000, oldPrice: 450000, discount: '22%', image: 'https://cdn.hstatic.net/products/1000006063/hdd_1_19407937876b40abb537d599e97ed2e5_1024x1024.jpg', images: ['https://cdn.hstatic.net/products/1000006063/hdd_1_19407937876b40abb537d599e97ed2e5_1024x1024.jpg', 'https://cdn.hstatic.net/products/1000006063/565653434_1201546382071482_33934_7767e302a3414875a2d3ceb64efa4ba2_1024x1024.jpg', 'https://cdn.hstatic.net/products/1000006063/vn-11134207-820l4-mejscv7w6arr0e_copy_d84ea3ac9d984b81b9398575df276790_1024x1024.jpg'], sold: 1200, stock: 150 },
    { _id: "p24", name: 'Mặt Nạ Đất Sét Aperire Spa Relief Pore Mask', brand: 'Aperire', category: 'skincare', price: 259000, oldPrice: 380000, discount: '32%', image: 'https://product.hstatic.net/1000006063/product/hdd_1f4c7fa0b34347dabc855ce0707df457_1024x1024.jpg', images: ['https://product.hstatic.net/1000006063/product/hdd_1f4c7fa0b34347dabc855ce0707df457_1024x1024.jpg', 'https://product.hstatic.net/1000006063/product/download__1__474e48abd34b478f8931ed2c0ac11559_1024x1024.jpg', 'https://product.hstatic.net/1000006063/product/download__1__3a6994f183234e49a694db18e42c2c31_1024x1024.jpeg'], sold: 850, stock: 120 }
]; // Thêm nhiều sản phẩm hơn nếu cần

let mockCategories = [
    { id: 1, name: 'Trang điểm', slug: 'trang-diem' },
    { id: 2, name: 'Chăm sóc da', slug: 'skincare' },
    { id: 3, name: 'Dưỡng thể', slug: 'bodycare' },
    { id: 4, name: 'Tóc & Da đầu', slug: 'haircare' }
];

// API Sản phẩm
app.get(['/api/products', '/products'], (req, res) => res.json(mockProducts));

app.post(['/api/products', '/products'], (req, res) => {
    const newProd = { ...req.body, _id: "P-" + Date.now() };
    mockProducts.push(newProd);
    res.status(201).json(newProd);
});

app.put(['/api/products/:id', '/products/:id'], (req, res) => {
    const index = mockProducts.findIndex(p => p._id === req.params.id);
    if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...req.body };
        res.json(mockProducts[index]);
    } else {
        res.status(404).json({ message: "Không tìm thấy SP" });
    }
});

app.delete(['/api/products/:id', '/products/:id'], (req, res) => {
    mockProducts = mockProducts.filter(p => p._id !== req.params.id);
    res.json({ message: "Đã xóa" });
});

// API Danh mục
app.get(['/api/categories', '/categories'], (req, res) => res.json(mockCategories));
app.post(['/api/categories', '/categories'], (req, res) => {
    const newCat = { ...req.body };
    mockCategories.push(newCat);
    res.status(201).json(newCat);
});
app.delete('/api/categories/:id', (req, res) => {
    mockCategories = mockCategories.filter(c => c.id != req.params.id);
    res.json({ message: "Đã xóa danh mục" });
});

// Mock Data cho Bài viết & Người dùng
let mockOrders = [];
let mockMagazine = [];
let mockUsers = [
    { _id: "u1", name: "Nguyễn Văn A", email: "customer@example.com", role: "Khách hàng", createdAt: new Date() },
    { _id: "u2", name: "Admin", email: "admin@qh.com", role: "Quản trị viên", createdAt: new Date() }
];
let mockConfig = {
    hotline: "1900 636 510", email: "contact@qhskinlab.com", banners: []
};

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

// Quản lý Người dùng (Chỉ xem)
app.get('/api/users', (req, res) => res.json(mockUsers));

// Quản lý Bài viết (Magazine)
app.get(['/api/magazine', '/magazine'], (req, res) => res.json(mockMagazine));
app.post('/api/magazine', (req, res) => {
    const post = { ...req.body, _id: "MAG-" + Date.now(), createdAt: new Date() };
    mockMagazine.push(post);
    res.status(201).json(post);
});
app.delete('/api/magazine/:id', (req, res) => {
    mockMagazine = mockMagazine.filter(m => m._id !== req.params.id);
    res.json({ message: "Đã xóa bài viết" });
});

// Quản lý Cấu hình
app.get('/api/config', (req, res) => res.json(mockConfig));
app.post('/api/config', (req, res) => {
    mockConfig = { ...mockConfig, ...req.body };
    res.json(mockConfig);
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

// Lấy danh sách đơn hàng (Cho Admin)
app.get(['/api/orders', '/orders'], (req, res) => res.json(mockOrders));

// Route đặt hàng
app.post(['/api/orders', '/orders'], (req, res) => {
    const { customerInfo, items, paymentMethod, totalPrice: clientTotal } = req.body;
    
    const newOrder = {
        _id: "ORDER-" + Date.now() + Math.floor(Math.random() * 1000),
        customerInfo,
        items,
        paymentMethod,
        totalPrice: clientTotal || items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0),
        status: "Chờ xác nhận",
        isPaid: false,
        createdAt: new Date()
    };

    mockOrders.push(newOrder);
    res.status(201).json(newOrder);
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