const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerInfo: {
        name: String,
        phone: String,
        email: String,
        address: String,
        note: String
    },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        quantity: Number,
        price: Number,
        image: String
    }],
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, default: 'COD' },
    status: { type: String, default: 'Chờ xác nhận' },
    isPaid: { type: Boolean, default: false },
    paidAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);