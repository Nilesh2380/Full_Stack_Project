const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        minlength: [3, 'Product name must be at least 3 characters long'],
        maxlength: [100, 'Product name cannot exceed 100 characters'],
        index: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [1, 'Price must be at least 1'],
        validate: {
            validator: Number.isInteger,
            message: 'Price must be an integer'
        },
        index: true
    },
    image: {
        type: [String],
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'At least one image URL is required'
        }
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        index: true
    },
    subCategory: {
        type: String,
        required: [true, 'Subcategory is required'],
        index: true
    },
    sizes: {
        type: [String],
        required: [true, 'Sizes are required'],
        enum: ['S', 'M', 'L', 'XL', 'XXL'],
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'At least one size must be specified'
        }
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity must be at least 0'],  // Allow 0 for out of stock items
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be an integer'
        }
    },
    date: {
        type: Number,
        default: Date.now,
        index: true,
    },
    bestseller: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    timestamps: true
});

productSchema.index({ category: 1, subCategory: 1, price: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
