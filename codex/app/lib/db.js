import { Client } from 'pg';

export const connectDb = async () => {
    const client = new Client({
        connectionString: process.env.POSTGRES_URL,
        ssl: {rejectUnauthorized: false},
    });

    try {
        await client.connect();
        console.log("Connected to database successfully.");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw new Error("Database connection error");
    }

};