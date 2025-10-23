import mongoose from "mongoose";

// Reconnection configuration
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds
let retryCount = 0;

const connectDb = async (DbUrl) => {
  // Mongoose connection options for better stability
  const options = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  };

  try {
    await mongoose.connect(DbUrl, options);
    console.log("✅ Connected to MongoDB Database");
    retryCount = 0; // Reset retry count on successful connection
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    handleReconnection(DbUrl);
  }
};

// Handle reconnection logic
const handleReconnection = (DbUrl) => {
  if (retryCount < MAX_RETRIES) {
    retryCount++;
    console.log(
      `🔄 Attempting to reconnect to MongoDB... (Attempt ${retryCount}/${MAX_RETRIES})`
    );
    setTimeout(() => connectDb(DbUrl), RETRY_INTERVAL);
  } else {
    console.error(
      `❌ Failed to connect to MongoDB after ${MAX_RETRIES} attempts. Please check your connection.`
    );
    // In production, you might want to exit the process or send an alert
    process.exit(1);
  }
};

// MongoDB event listeners for connection monitoring
mongoose.connection.on("connected", () => {
  console.log("📡 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err.message);
  // Don't reconnect here - let the initial connection handler deal with it
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  Mongoose disconnected from MongoDB");
  // Attempt to reconnect when disconnected
  if (retryCount === 0) {
    // Only start reconnection if not already trying
    console.log("🔄 Attempting to reconnect...");
    handleReconnection(process.env.DB_URL);
  }
});

// Handle application termination
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed through app termination");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
    process.exit(1);
  }
});

export default connectDb;
