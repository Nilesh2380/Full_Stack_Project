const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
exports.userAuthentication = (req, res, next) => {
    try {
        // Check token in headers or cookies
        const token = req.header('Authorization')?.split(' ')[1] || req.cookies.user_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorize, Please login...!',
            });
        };

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Token is not valid',
                });
            };

            // Attach user info to request object
            req.user = decoded;
            next(); // Proceed to the next middleware or route
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error while verifying token',
        });
    };
};
