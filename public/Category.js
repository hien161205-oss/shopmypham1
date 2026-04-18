const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    id: Number // Để tương thích với logic ID cũ nếu cần
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);