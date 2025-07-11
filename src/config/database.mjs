import mongoose from "mongoose";

const connectMongooDB = async() => {
    try {
        const uri = process.env.MONGO_URI;
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,          // Maximum number of connections in the pool
        serverSelectionTimeoutMS: 5000,  // Timeout for server selection
        socketTimeoutMS: 45000,   // Close sockets after inactivity
    });
    console.log("Kết nối đến MongoDB thành công");
    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    return mongoose.connection;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; // Rethrow the error to be handled by the caller
        process.exit(1); // Exit the process if connection fails
    }
};
 
export default connectMongooDB;