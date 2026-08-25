import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    try {
        console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

        await mongoose.connect(process.env.DATABASE_URL);

        console.log("MongoDB connected Successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;