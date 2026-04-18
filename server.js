const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Phục vụ các tệp tĩnh từ thư mục public (HTML, CSS, Client JS)
app.use(express.static('public'));

// Routes
const productRoutes = require('./public/productRoutes'); 
const userRoutes = require('./userRoutes'); 
const orderRoutes = require('./orderRoutes');
const categoryRoutes = require('./categoryRoutes');

// API Endpoints
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

const MONGO_URI = process.env.MONGO_URI;

// TỐI ƯU KẾT NỐI MONGODB CHO SERVERLESS
let cachedDb = null;
const connectDB = async () => {
    if (cachedDb) return cachedDb;
    const db = await mongoose.connect(MONGO_URI);
    cachedDb = db;
    return db;
};

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    connectDB().then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }).catch(err => {
        console.error("Database connection failed", err);
    });
}

module.exports = app;