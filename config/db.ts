import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log("🚀 Connecting to MongoDB...");

    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is not defined in environment variables.");
    }

    const connection = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "lighter",
    });

    if (connection?.connection?.db) {
      console.log("✅ MongoDB Connected");
    } else {
      console.error("❌ Database connection is undefined");
      process.exit(1);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("🔍 Checking if database 'lighter' exists...");
    const dbAdmin = connection.connection.db.admin();
    const { databases } = await dbAdmin.listDatabases();
    const dbExists = databases.some((db) => db.name === "lighter");

    if (dbExists) {
      console.log("✅ Database 'lighter' already exists.");
      connection.connection.useDb("lighter");
    } else {
      console.log("⚠️ Database 'lighter' not found. Creating...");

      const lighterDB = connection.connection.useDb("lighter");
      await lighterDB.collection("init").insertOne({ createdAt: new Date() });
      console.log("✅ Database 'lighter' created successfully.");
    }
  } catch (error) {
    console.error("❌ Error connecting to MongoDB: ", error);
    process.exit(1);
  }
};

export default connectDB;
