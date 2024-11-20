import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { users, clients } from '../lib/placeholder-data';

async function seedUsers() {
    const client = await db.connect();

    try {
        await client.sql`BEGIN`;

        // Ensure the `uuid-ossp` extension exists
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        // Create `users` table if it doesn't exist
        await client.sql`
            CREATE TABLE IF NOT EXISTS users (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                firstname VARCHAR(255) NOT NULL,
                lastname VARCHAR(255) NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                position TEXT NOT NULL,
                auth_level INT NOT NULL
            );
        `;

        // Insert users into the table
        const insertedUsers = await Promise.all(
            users.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return client.sql`
                    INSERT INTO users (id, firstname, lastname, email, password, position, auth_level)
                    VALUES (${user.id}, ${user.firstname}, ${user.lastname}, ${user.email}, 
                        ${hashedPassword}, ${user.position}, ${user.auth_level})
                    ON CONFLICT (id) DO NOTHING;
                `;
            })
        );

        await client.sql`COMMIT`;
        console.log('Seed data successfully:', insertedUsers);
        return { message: 'Seed data successfully' };
    } catch (error) {
        await client.sql`ROLLBACK`;
        handleError(error, 'Error seeding users');
    } finally {
        client.release();
    }
}

async function seedClients() {
    const client = await db.connect();

    try {
        await client.sql`BEGIN`;

        // Ensure the `uuid-ossp` extension exists
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        // Create `clients` table if it doesn't exist
        await client.sql`
            CREATE TABLE IF NOT EXISTS clients (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                firstname VARCHAR(255) NOT NULL,
                middlename VARCHAR(255),
                lastname VARCHAR(255) NOT NULL,
                dob DATE NOT NULL,
                race_ethnic_identity VARCHAR(255) NOT NULL,
                service_language VARCHAR(255) NOT NULL,
                country_of_origin VARCHAR(255) NOT NULL,
                gender VARCHAR(255) NOT NULL,
                sexual_orientation VARCHAR(255) NOT NULL,
                age VARCHAR(255) NOT NULL,
                education_level VARCHAR(255) NOT NULL,
                county_of_residence VARCHAR(255) NOT NULL
            );
        `;

        // Insert clients into the table
        const insertedClients = await Promise.all(
            clients.map(async (clientData) =>
                client.sql`
                    INSERT INTO clients (
                        id, FirstName, MiddleName, LastName, DOB, RaceEthnicIdentity, 
                        ServiceLanguage, CountryOfOrigin, Gender, SexualOrientation, 
                        Age, EducationLevel, CountyOfResidence
                    )
                    VALUES (
                        ${clientData.id}, ${clientData.FirstName}, ${clientData.MiddleName}, 
                        ${clientData.LastName}, ${clientData.DOB}, ${clientData.RaceEthnicIdentity}, 
                        ${clientData.ServiceLanguage}, ${clientData.CountryOfOrigin}, 
                        ${clientData.Gender}, ${clientData.SexualOrientation}, 
                        ${clientData.Age}, ${clientData.EducationLevel}, 
                        ${clientData.CountyOfResidence}
                    )
                    ON CONFLICT (id) DO NOTHING;
                `
            )
        );

        await client.sql`COMMIT`;
        console.log('Seed data successfully:', insertedClients);
        return { message: 'Seed data successfully' };
    } catch (error) {
        await client.sql`ROLLBACK`;
        handleError(error, 'Error seeding clients');
    } finally {
        client.release();
    }
}


export async function POST() {
    try {
        // Call both seed functions
        const userSeedResult = await seedUsers();
        const clientSeedResult = await seedClients();

        return new Response(
            JSON.stringify({ userSeedResult, clientSeedResult }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Helper function for error handling
function handleError(error: unknown, context: string): never {
    if (error instanceof Error) {
        console.error(`${context}:`, error.message);
        throw new Error(`${context}: ${error.message}`);
    } else {
        console.error(`${context}: Unknown error`, error);
        throw new Error(`${context}: Unknown error occurred`);
    }
}
