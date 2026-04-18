const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: Number,
    discount: String,
    image: { type: String, required: true },
    images: [String],
    description: String,
    details: String,
    specs: mongoose.Schema.Types.Mixed,
    stock: { type: Number, default: 100 },
    sold: { type: Number, default: 0 },
    isNewProduct: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);