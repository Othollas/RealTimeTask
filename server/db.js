import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "taskApp";

let db;

export async function connectDB() {
    await client.connect();
    db = client.db(dbName);
    console.log("MongoDB connected", dbName);
};

export function getDB(){
    return db;
};