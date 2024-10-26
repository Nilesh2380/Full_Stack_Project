const mongoose = require('mongoose');

exports.checkRequiredFields = (requiredFields) => {
    return (req, res, next) => {

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `The following fields are required: ${missingFields.join(', ')}`
            });
        };
        next();
    };
};

exports.validateObjectIds = (params) => {
    return (req, res, next) => {
        for (let param of params) {
            const id = req.params[param] || req.query[param] || req.body[param];
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid ObjectId format for ${param}: ${id}`,
                });
            }
        }
        next();
    };
};