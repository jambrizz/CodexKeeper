'use server';

import { connectDb } from "@/app/lib/db";

export const config = {
    api: {
        bodyParser: true, // Ensure body parsing middleware is enabled
    },
};

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            return getClients(req, res);
        case "POST":
            return createClient(req, res);
        case "PUT":
            return updateClient(req, res);
        case "DELETE":
            return deleteClient(req, res);
        default:
            return res.status(405).json({ error: `Method ${method} not allowed` });
    }
}

// Define the createClient function
async function createClient(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const {
        FirstName,
        MiddleName,
        LastName,
        DOB,
        RaceEthnicIdentity,
        ServiceLanguage,
        CountryOfOrigin,
        Gender,
        SexualOrientation,
        Age,
        EducationLevel,
        CountyOfResidence,
        datetimeStamp,
        createdBy,
    } = req.body;

    if (!FirstName || !LastName || !DOB || !datetimeStamp || !createdBy) {
        return res.status(400).json({
            error: "Missing required fields",
            requiredFields: ["FirstName", "LastName", "DOB", "datetimeStamp", "createdBy"],
        });
    }

    let client;
    try {
        client = await connectDb();

        const query = `
            INSERT INTO clients (
                firstname, middlename, lastname, dob, raceethnicidentity, servicelanguage, 
                countryoforigin, gender, sexualorientation, age, educationlevel, countyofresidence, datetimestamp, createdby
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *;
        `;
        const values = [
            FirstName, MiddleName || null, LastName, DOB, RaceEthnicIdentity || null,
            ServiceLanguage || null, CountryOfOrigin || null, Gender || null,
            SexualOrientation || null, Age || null, EducationLevel || null,
            CountyOfResidence || null, datetimeStamp, createdBy,
        ];

        const result = await client.query(query, values);

        res.status(201).json({ message: "Client created successfully", client: result.rows[0] });
    } catch (error) {
        console.error("Error creating client:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.stack });
    } finally {
        if (client) await client.end();
    }
}

// Define placeholders for missing methods
async function getClients(req, res) {
    res.status(200).json({ message: "Fetch clients not implemented yet." });
}

async function updateClient(req, res) {
    res.status(200).json({ message: "Update client not implemented yet." });
}

async function deleteClient(req, res) {
    res.status(200).json({ message: "Delete client not implemented yet." });
}
