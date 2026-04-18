const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const productRoutes = require('./public/productRoutes'); // Giữ nguyên nếu file này vẫn ở trong public
const userRoutes = require('./userRoutes'); // Sửa lại nếu file này ở thư mục gốc
const orderRoutes = require('./orderRoutes'); // Sửa lại nếu file này ở thư mục gốc

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

const MONGO_URI = process.env.MONGO_URI;

// TỐI ƯU KẾT NỐI MONGODB CHO SERVERLESS
let cachedDb = null;
const connectDB = async () => {
    if (cachedDb) return cachedDb;
    const db = await mongoose.connect(MONGO_URI);
    cachedDb = db;
    return db;
};

// Middleware kết nối DB cho mỗi request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;