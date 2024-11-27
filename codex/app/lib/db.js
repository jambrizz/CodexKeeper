import { Client } from 'pg';

export const connectDb = async () => {
    const client = new Client({
        connectionString: process.env.POSTGRES_URL,
        ssl: {rejectUnauthorized: false},
    });

    try {
        await client.connect();
        return client;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};