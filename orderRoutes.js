const express = require('express');
const router = express.Router();
const Order = require('./public/Order'); 
const Product = require('./public/Product'); 
const { protect, admin } = require('./public/auth'); // Khớp chính xác tên file auth.js

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

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
router.post('/', async (req, res) => {
    try {
        const { customerInfo, items, paymentMethod } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng không có sản phẩm' });
        }

        // 1. TÍNH TOÁN LẠI GIÁ Ở BACKEND ĐỂ TRÁNH SỬA GIÁ TỪ FRONTEND
        let serverSideTotalPrice = 0;
        const validatedItems = [];

        for (const item of items) {
            // Tìm sản phẩm thật trong DB dựa trên ID
            const dbProduct = await Product.findById(item.product);
            if (!dbProduct) {
                return res.status(404).json({ message: `Sản phẩm với ID ${item.product} không tồn tại` });
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