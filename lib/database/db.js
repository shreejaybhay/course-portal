import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export const connect = async () => {
    if (cached.conn) {
        return cached.conn;
    }
    if (!MONGODB_URL) {
        throw new Error("MONGODB_URL is not defined");
    }
    cached.promise =
        cached.promise ||
        mongoose.connect(MONGODB_URL, {
            dbName: "imaginify",
            bufferCommands: false,
        });
    cached.conn = await cached.promise;
    return cached.conn;
};
