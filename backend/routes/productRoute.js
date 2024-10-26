const express = require('express');
const productRouter = express.Router();
const productController = require('../controllers/productCtrl');

const { checkRequiredFields, validateObjectIds } = require('../validation/validate');

// ************ product route ******************

productRouter.post('/create', productController.createProduct);
productRouter.post('/create/logo-icon', productController.createLogoAndIcon);

productRouter.get('/all/logo-icon', productController.getAllLogoAndIcons);
productRouter.get('/all', productController.getAllProcuts);
productRouter.get('/all/category', productController.getAllProcutsByCategory);
productRouter.get('/all/type', productController.getAllProcutsByType);
productRouter.get('/all/price', productController.getAllProductsByPrice);

productRouter.delete('/delete', checkRequiredFields(['productId']), productController.deleteProduct);

// ***************** add to cart route *****************

// Add to cart
productRouter.post(
    '/cart',
    validateObjectIds(['userId', 'productId']),
    checkRequiredFields(['userId', 'productId', 'quantity', 'price', 'totalPrice']),
    productController.addToCart
);

// Get cart items for a user
productRouter.get('/cart/:userId', validateObjectIds(['userId']), productController.getCartItems);

// Update a cart item (quantity)
productRouter.put('/cart/:productId', validateObjectIds(['productId']), productController.updateCartItem);

// Delete a cart item
productRouter.delete('/cart/:productId', validateObjectIds(['productId']), productController.deleteCartItem);

module.exports = productRouter;