const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./public/Product');

dotenv.config();

// Dữ liệu mẫu lấy từ DEFAULT_PRODUCTS trong script.js
const products = [
    {
        _id: new mongoose.Types.ObjectId('65f1a2b3c4d5e6f7a8b9c001'),
        name: '[NEW DEW] Son Tint Bóng Merzy Dạng Thạch...',
        brand: 'Merzy',
        category: 'trang-diem-son-moi',
        price: 179000,
        image: 'https://product.hstatic.net/1000006063/product/wd23_c168ab0ee2c24edda27693a18de15bb5_1024x1024.jpg',
        description: 'Son Tint Bóng Dạng Thạch...',
        stock: 100
    },
    // Thêm các sản phẩm khác vào đây...
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Đã kết nối MongoDB để nạp dữ liệu...');
        
        // Xóa sản phẩm cũ (tùy chọn) và nạp mới
        await Product.deleteMany({ _id: { $in: products.map(p => p._id) } });
        await Product.insertMany(products);
        
        console.log('Thành công! Các sản phẩm mẫu đã có mặt trong Database.');
        process.exit();
    } catch (error) {
        console.error('Lỗi khi nạp dữ liệu:', error);
        process.exit(1);
    }
};

seedDB();