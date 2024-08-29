// /api/db.js
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
// MongoDB connection URI
const URI = process.env.ATLAS_URI || "";

// MongoDB client setup
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

// Function to connect to the database and return the db instance
async function connectToDB() {
  if (!db) {
    try {
      // Connect the client to the server
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Successfully connected to MongoDB!");
      db = client.db("claidDB");
    } catch (err) {
      console.error("Failed to connect to MongoDB:", err);
      throw err;
    }
  }
  return db;
}

export { connectToDB };
