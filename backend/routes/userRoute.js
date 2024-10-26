const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userCtrl');

const { checkRequiredFields } = require('../validation/validate');

userRouter.post(
    '/register',
    checkRequiredFields(['name', 'email', 'password']),
    userController.createUser
);
userRouter.post(
    '/login',
    checkRequiredFields(['email', 'password']),
    userController.loginUser
);
userRouter.post(
    '/logout',
    userController.logoutUser
);

module.exports = userRouter;