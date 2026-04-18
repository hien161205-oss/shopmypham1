const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./public/Product'); // Trỏ đúng đến model Product của bạn

dotenv.config();

const products = [
    {
        _id: new mongoose.Types.ObjectId('65f1a2b3c4d5e6f7a8b9c001'),
        name: '[NEW DEW] Son Tint Bóng Merzy Dạng Thạch...',
        brand: 'Merzy',
        category: 'trang-diem-son-moi',
        price: 179000,
        oldPrice: 309000,
        discount: '42%',
        image: 'https://product.hstatic.net/1000006063/product/wd23_c168ab0ee2c24edda27693a18de15bb5_1024x1024.jpg',
        description: 'Son Tint Bóng Dạng Thạch, Bền Màu, Lâu Trôi Merzy The Watery Dew Tint...',
        stock: 100,
        sold: 25200
    },
    {
        _id: new mongoose.Types.ObjectId('65f1a2b3c4d5e6f7a8b9c002'),
        name: 'Serum Chống Nắng B.O.M Dưỡng Ẩm Water Glow Sun Serum...',
        brand: 'B.O.M',
        category: 'cham-soc-da',
        price: 438000,
        oldPrice: 548000,
        image: 'https://cdn.hstatic.net/products/1000006063/bt_770a3fcae16d4350ad40ad252a1805fb_1024x1024.jpg',
        stock: 100,
        sold: 1500
    },
    // Tôi đã tạo sẵn các ID mẫu cho các sản phẩm ID số của bạn
    {
        _id: new mongoose.Types.ObjectId('65f1a2b3c4d5e6f7a8b9c010'),
        name: 'Gel Chống Nắng Anessa Dưỡng Ẩm...',
        brand: 'Anessa',
        category: 'cham-soc-da',
        price: 488000,
        image: 'https://product.hstatic.net/1000006063/product/8_38fdbb4cd52541b58537b5136a144bea_1024x1024.jpg',
        stock: 50,
        sold: 517
    },
    {
        _id: new mongoose.Types.ObjectId('65f1a2b3c4d5e6f7a8b9c011'),
        name: 'Miếng Pad Dưỡng Ẩm Emmié by HappySkin...',
        brand: 'Emmié by HappySkin',
        category: 'cham-soc-da',
        price: 315000,
        image: 'https://cdn.hstatic.net/products/1000006063/emmie_copy_28ed3a4f9ae3421db56ff99742a1599f_1024x1024.jpg',
        stock: 30,
        sold: 850
    },
    {
        _id: new mongoose.Types.ObjectId('65f1a2b3c4d5e6f7a8b9c012'),
        name: 'Nước Dưỡng Tóc Tinh Dầu Bưởi Cocoon Pomelo Hair Tonic 140ml',
        brand: 'Cocoon',
        category: 'cham-soc-toc',
        price: 158000,
        image: 'https://product.hstatic.net/1000006063/product/dai_dien_dce04d99812b47ada407478149e79841_1024x1024.jpg',
        stock: 200,
        sold: 1250
    }
    // Bạn có thể thêm tiếp các sản phẩm khác vào đây theo mẫu trên
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Đã kết nối MongoDB để nạp dữ liệu...');

        // Xóa sản phẩm cũ để tránh trùng lặp khi chạy lại file này
        await Product.deleteMany({ _id: { $in: products.map(p => p._id) } });
        
        // Nạp dữ liệu mới
        await Product.insertMany(products);

        console.log('Thành công: Đã chuyển các sản phẩm JS vào Database!');
        process.exit();
    } catch (error) {
        console.error('Lỗi khi nạp dữ liệu:', error);
        process.exit(1);
    }
};

seedDatabase();