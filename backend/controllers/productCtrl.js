const Product = require('../models/productModel');
const LogoIconModel = require('../models/icon&logoModel');
const Cart = require('../models/addToCartModel');

// *************** logoIcons ****************

// create logo and icon
exports.createLogoAndIcon = async (req, res, next) => {
    try {
        const logo_iconData = new LogoIconModel(req.body);
        await logo_iconData.save();

        res.status(201).json({
            success: true,
            message: 'data inserted successfully...!',
            logo_iconData,
        });
    } catch (error) {
        next(error)
    };
};

// get all logo and icon
exports.getAllLogoAndIcons = async (req, res, next) => {
    try {
        const data = await LogoIconModel.find({});
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Logo and icon not found!',
            });
        };

        res.status(201).json({
            success: true,
            message: 'data fetched successfully...!',
            data,
        });
    } catch (error) {
        next(error)
    };
};

// ****************** product *********************

// create product
exports.createProduct = async (req, res, next) => {
    try {
        const savedProducts = await Product.insertMany(req.body);
        const totalProducts = await Product.countDocuments();

        res.status(201).json({
            success: true,
            message: 'Products inserted successfully!',
            totalProducts,
            data: savedProducts
        });
    } catch (error) {
        if(error.code === 11000){
            return res.status({
                success: false,
                message: 'data already exists!'
            });
        }
        res.status(500).json({
            success: false,
            message: 'error occrued while creating the products!'
        });
    };
};

// get all products
exports.getAllProcuts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        const totalProducts = await Product.countDocuments();
        res.status(200).json({
            success: true,
            totalProducts,
            data: products
        });
    } catch (error) {
        next(error)
    };
};

// get all products by category
exports.getAllProcutsByCategory = async (req, res, next) => {
    try {
        const { category } = req.query;
        const products = await Product.find({ category });

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No products found for category: ${category}`
            });
        };

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        next(error)
    };
};

// get all products by type
exports.getAllProcutsByType = async (req, res, next) => {
    try {
        const type = req.params.type;
        const products = await Product.find({ type });

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No products found for type: ${type}`
            });
        };

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        next(error)
    };
};

// get all products by price, e.g low to high/ high to low
exports.getAllProductsByPrice = async (req, res, next) => {
    try {
        const sortOption = req.query.sort === 'desc' ? -1 : 1; // Default is ascending (low to high)

        // Fetch all products and sort by price
        const products = await Product.find({}).sort({ price: sortOption });

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        next(error)
    };
};

// delete image and data
exports.deleteProduct = async (req, res, next) => {
    try {
        const { productId } = req.query;

        if (!productId) {
            return res.status(500).json({
                success: false,
                message: 'productId is required!',
            });
        };

        // Find the product by its ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        };

        // Delete the product from the database
        await Product.findByIdAndDelete(productId);

        res.status(200).json({
            success: true,
            message: 'Product and associated image deleted successfully',
            deleteDProducts,
        });
    } catch (error) {
        next(error)
    };
};

// ***************** add to cart  *********************

// add to cart product
exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity, price, totalPrice } = req.body;

        // Check if the product already exists in the user's cart
        const existingCartItem = await Cart.findOne({ userId, productId });

        if (existingCartItem) {
            return res.status(409).json({
                success: false,
                message: 'Product already in the cart. Update the quantity instead.'
            });
        };

        // Create new cart item
        const newCartItem = new Cart({
            userId,
            productId,
            quantity,
            price,
            totalPrice
        });

        // Save to the database
        await newCartItem.save();

        res.status(201).json({
            success: true,
            message: 'Product added to cart successfully!',
            cartItem: newCartItem
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors
            });
        };

        res.status(500).json({
            success: false,
            message: 'Server error. Unable to add product to cart.',
            error: error.message
        });
    };
};

// READ: Get all cart items for a user
exports.getCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        const cartItems = await Cart.find({ userId }).populate('productId');

        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No items in the cart.'
            });
        };

        res.status(200).json({
            success: true,
            message: 'Cart items fetched successfully!',
            cartItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Unable to retrieve cart items.',
            error: error.message
        });
    };
};

// UPDATE: Update the quantity of a cart item
exports.updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be greater than 0.'
            });
        }

        const updatedCartItem = await Cart.findByIdAndUpdate(
            productId,
            { $set: { quantity, price, totalPrice: quantity * price } },
            { new: true, runValidators: true }
        );

        if (!updatedCartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found.'
            });
        };

        res.status(200).json({
            success: true,
            message: 'Cart item updated successfully!',
            cartItem: updatedCartItem
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors
            });
        };

        res.status(500).json({
            success: false,
            message: 'Server error. Unable to update cart item.',
            error: error.message
        });
    };
};

// DELETE: Remove a product from the cart
exports.deleteCartItem = async (req, res) => {
    try {
        const { productId } = req.params;

        const deletedCartItem = await Cart.findByIdAndDelete(productId);

        if (!deletedCartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found.'
            });
        };

        res.status(200).json({
            success: true,
            message: 'Cart item removed successfully!',
            cartItem: deletedCartItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Unable to delete cart item.',
            error: error.message
        });
    };
};
