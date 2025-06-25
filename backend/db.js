const mongoose = require('mongoose');
require('dotenv').config();

const connectionString = process.env.MONGO_URI;

const connectToDatabase = async () => {
    try {
        const conn = await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectToDatabase;
