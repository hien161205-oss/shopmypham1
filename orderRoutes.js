const express = require('express');
const router = express.Router();
const Order = require('./public/Order'); 
const Product = require('./public/Product'); 
const User = require('./public/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { protect, admin } = require('./public/auth');

// @desc    Lấy tất cả đơn hàng
// @route   GET /api/orders
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Lấy đơn hàng của người dùng hiện tại
// @route   GET /api/orders/myorders
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// Sử dụng decodeToken (nếu có) để gắn user, hoặc protect nếu bắt buộc đăng nhập
router.post('/', async (req, res, next) => {
    // Middleware nhẹ để kiểm tra token nếu có mà không chặn guest
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await User.findById(decoded.id);
        } catch (e) {}
    }
    
    try {
        const { customerInfo, items, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng không có sản phẩm' });
        }

        // 1. TÍNH TOÁN LẠI GIÁ Ở BACKEND ĐỂ TRÁNH SỬA GIÁ TỪ FRONTEND
        let serverSideTotalPrice = 0;
        const validatedItems = [];

        for (const item of items) {
            // Kiểm tra ID có phải là ObjectId hợp lệ không
            if (!mongoose.Types.ObjectId.isValid(item.product)) {
                return res.status(400).json({
                    message: `Sản phẩm "${item.name || item.product}" là dữ liệu mẫu. Vui lòng thêm sản phẩm thật từ trang Admin để thử nghiệm thanh toán.`
                });
            }

            // Tìm sản phẩm thật trong DB dựa trên ID
            const dbProduct = await Product.findById(item.product);
            if (!dbProduct) {
                return res.status(404).json({ message: `Sản phẩm "${item.name || 'không xác định'}" (ID: ${item.product}) hiện không còn tồn tại trong kho. Vui lòng cập nhật lại giỏ hàng.` });
            }

            // Kiểm tra tồn kho
            if (dbProduct.stock < item.quantity) {
                return res.status(400).json({ message: `Sản phẩm "${dbProduct.name}" không đủ số lượng trong kho (Còn lại: ${dbProduct.stock})` });
            }

            // Lấy giá từ Database, không lấy giá từ client gửi lên
            const price = dbProduct.price;
            serverSideTotalPrice += price * item.quantity;

            validatedItems.push({
                product: dbProduct._id,
                name: dbProduct.name,
                quantity: item.quantity,
                price: price, // Giá chuẩn từ DB
                image: dbProduct.image
            });
        }

        // 2. Tạo đơn hàng với dữ liệu đã xác thực
        const order = new Order({
            customerInfo,
            items: validatedItems,
            totalPrice: serverSideTotalPrice,
            paymentMethod,
            user: req.user ? req.user._id : null
        });

        // Nếu user đã đăng nhập, gắn ID user vào đơn hàng
        const createdOrder = await order.save();

        // 3. Cập nhật tồn kho và số lượng đã bán sau khi đặt hàng thành công
        for (const item of validatedItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity, sold: item.quantity }
            });
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Cập nhật trạng thái đơn hàng
// @route   PUT /api/orders/:id
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Xác nhận thanh toán đơn hàng
// @route   PUT /api/orders/:id/pay
router.put('/:id/pay', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            // Tự động cập nhật trạng thái nếu đơn hàng đang ở bước chờ
            if (order.status === 'Chờ xác nhận') {
                order.status = 'Đã thanh toán';
            }
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;