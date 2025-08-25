import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "taskApp";

let db;

// export async function connectDB() {
//     await client.connect();
//     db = client.db(dbName);
//     console.log("MongoDB connected", dbName);
// };

export const connectDB = async () => {
  try {
   db = await mongoose.connect(`mongodb://localhost:27017/taskApp`);
    console.log("MongoDB connecté avec Mongoose");
  } catch (err) {
    console.error("Erreur MongoDB :", err);
    process.exit(1);
  }
};



export function getDB(){
    return db;
};