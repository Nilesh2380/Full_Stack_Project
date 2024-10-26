const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const cookieOptions = {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
    sameSite: 'Lax',   
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists!',
            });
        };

        // Create new user
        const newUser = await userModel.create({ name, email, password });

        // Generate JWT token for the user
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.cookie('user_token', token, cookieOptions);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            data: newUser
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed.',
                error,
            });
        };

        if (error.code && err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'User already exists!',
            });
        };

        res.status(500).json({
            success: false,
            message: 'error occured while register the user!',
            error,
        });
    };
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect email or password.'
            });
        };

        // Check if password matches
        const isPasswordCorrect = await user.correctPassword(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect email or password.'
            });
        };

        // Generate JWT token for the user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.cookie('user_token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            data: user
        });

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            success: false,
            message: 'error occured while logging the user!',
            error,
        });
    };
};

exports.logoutUser = (req, res) => {
    try {
        const userToken = req.cookies.user_token;
                
        if (userToken) {
            res.clearCookie('user_token', cookieOptions);
            return res.status(200).json({
                success: true,
                message: 'User logged out successfully.',
                userToken,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'User already logged out!',
            });
        };

    } catch (error) {
        console.log(error);
    
        console.error('Error logging out:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to log out. Please try again.'
        });
    };
};