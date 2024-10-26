exports.mongooseErrorHandler = (err, req, res, next) => {
    let errors = {};

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        Object.keys(err.errors).forEach((field) => {
            errors[field] = err.errors[field].message;
        });
        return res.status(400).json({
            success: false,
            message: 'Validation failed.',
            errors,
        });
    };

    // Handle duplicate key errors (MongoDB `E11000` error)
    if (err.code && err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        errors[field] = `${field} already exists.`;
        return res.status(409).json({
            success: false,
            message: 'Duplicate key error.',
            errors,
        });
    };

    // Handle CastError (e.g., invalid ObjectId in queries)
    if (err.name === 'CastError') {
        errors[err.path] = `Invalid value for field: ${err.path}`;
        return res.status(400).json({
            success: false,
            message: 'Invalid data provided.',
            errors,
        });
    };

    // Generic fallback for other Mongoose or database errors
    console.log(err);
    res.status(500).json({
        success: false,
        message: 'Database operation failed.',
        error: err.message || 'An unknown error occurred.',
    });
};
