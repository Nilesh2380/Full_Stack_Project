const mongoose = require('mongoose');

// MongoDB connection URI (replace with your actual connection string)

// Function to connect to MongoDB
exports.connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        // Connect to MongoDB
        const conn = await mongoose.connect(mongoURI);
        console.log('MongoDB connected to',conn.connection.host);

    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit process with failure
    };
};
