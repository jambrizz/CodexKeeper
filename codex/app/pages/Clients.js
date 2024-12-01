import { connectDb } from "../../lib/db";

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

async function createClient(req, res) {
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

    // Validate required fields
    if (!FirstName || !LastName || !DOB) {
        return res.status(400).json({ error: "Missing required fields" });
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
            FirstName, MiddleName || null, LastName, DOB, RaceEthnicIdentity, ServiceLanguage,
            CountryOfOrigin, Gender, SexualOrientation, Age, EducationLevel, CountyOfResidence,
            datetimeStamp, createdBy,
        ];

        const result = await client.query(query, values);

        // Send back the created client
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating client:", error);

        // Return a JSON error response
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    } finally {
        if (client) await client.end();
    }
}
