const express = require('express');
const router = express.Router();
const Category = require('./public/Category');
const { protect, admin } = require('./public/auth');

// Lấy tất cả danh mục
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm danh mục mới
router.post('/', protect, admin, async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Xóa danh mục
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const category = await Category.findOne({ id: req.params.id });
        if (category) {
            await category.deleteOne();
            res.json({ message: 'Đã xóa danh mục' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;