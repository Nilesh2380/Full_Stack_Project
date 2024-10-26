const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        validate: {
            validator: mongoose.Types.ObjectId.isValid,
            message: 'Invalid user ID format'
        }
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required'],
        validate: {
            validator: mongoose.Types.ObjectId.isValid,
            message: 'Invalid product ID format'
        }
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be an integer'
        }
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive value']
    },
    totalPrice: {
        type: Number,
        required: true,
        min: [0, 'Total price must be a positive value']
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

cartItemSchema.pre('save', function (next) {
    this.totalPrice = this.quantity * this.price;
    next();
});

cartItemSchema.index({ userId: 1 });
cartItemSchema.index({ productId: 1 });

const Cart = mongoose.model('Cart', cartItemSchema);

module.exports = Cart;
