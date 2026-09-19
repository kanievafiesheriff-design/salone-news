import dns from "node:dns";
import mongoose from "mongoose";

export async function connectDB() {
  const connectionString = process.env.MONGODB_URI;

  // The local resolver intermittently refuses Atlas SRV lookups.
  dns.setServers(["8.8.8.8"]);

  if (!connectionString) {
    throw new Error(
      "MONGODB_URI is missing. Add your MongoDB connection string to backend/.env."
    );
  }

  if (
    connectionString.includes("<db_username>") ||
    connectionString.includes("<db_password>")
  ) {
    throw new Error(
      "MONGODB_URI still contains an Atlas placeholder. Replace <db_username> and <db_password> with your database user credentials."
    );
  }

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const connection = await mongoose.connect(connectionString, {
        serverSelectionTimeoutMS: 10000,
        family: 4,
      });

      console.log(`MongoDB connected: ${connection.connection.host}`);
      return;
    } catch (error) {
      await mongoose.disconnect();

      if (attempt === 3) {
        console.error("MongoDB connection failed:");
        console.error(error.message);
        console.error(
          "Check that the Atlas username/password are correct, your current IP is in Network Access, and the cluster is running."
        );
        process.exit(1);
      }

      console.error(`MongoDB connection attempt ${attempt} failed. Retrying...`);
    }
  }
}