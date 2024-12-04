import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

// Define schema for validation
const ClientSchema = z.object({
    FirstName: z.string().nonempty({ message: "First name is required" }),
    MiddleName: z.string().nullable(),
    LastName: z.string().nonempty({ message: "Last name is required" }),
    DOB: z.string().nonempty({ message: "Date of birth is required" }),
    RaceEthnicIdentity: z.string().min(1, "Race/Ethnic Identity is required"),
    ServiceLanguage: z.string().min(1, "Service Language is required"),
    CountryOfOrigin: z.string().min(1, "Country of Origin is required"),
    Gender: z.string().min(1, "Gender is required"),
    SexualOrientation: z.string().min(1, "Sexual Orientation is required"),
    Age: z.string().min(1, "Age is required"),
    EducationLevel: z.string().min(1, "Education Level is required"),
    CountyOfResidence: z.string().min(1, "County of Residence is required"),
    datetimeStamp: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid datetime format"),
    createdBy: z.string().min(1, "Creator's name is required"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log("Attempting to connect to the database...");
    try {
        await sql`SELECT 1`; // Quick test query
        console.log("Database connection established successfully.");
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown database error";
        console.error("Error connecting to the database:", errorMessage);
        return res.status(500).json({ message: "Database connection failed.", details: errorMessage });
    }

    console.log("Received form data:", req.body);

    const validatedFields = ClientSchema.safeParse(req.body);

    if (!validatedFields.success) {
        console.error("Validation errors:", validatedFields.error.flatten().fieldErrors);
        return res.status(400).json({
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed. Please check your inputs.",
        });
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
    } = validatedFields.data;

    console.log("Validated data:", validatedFields.data);

    try {
        const result = await sql`
            INSERT INTO clients (
                firstname, middlename, lastname, dob, raceethnicidentity, servicelanguage,
                countryoforigin, gender, sexualorientation, age, educationlevel, countyofresidence, datetimestamp, createdby
            )
            VALUES (${FirstName}, ${MiddleName || null}, ${LastName}, ${DOB}, ${RaceEthnicIdentity}, ${ServiceLanguage},
                ${CountryOfOrigin}, ${Gender}, ${SexualOrientation}, ${Age}, ${EducationLevel}, ${CountyOfResidence}, ${datetimeStamp}, ${createdBy}
            )
            RETURNING *;
        `;

        console.log("Database insertion result:", result);

        // Respond with the inserted record
        return res.status(201).json(result.rows[0]);
    } catch (err: unknown) {
        console.error("Error during database operation:", err);
        return res.status(500).json({ message: "Database insertion failed.", details: err });
    }
}


/*
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';
import { NextApiRequest, NextApiResponse } from 'next';

// Define schema for validation
const ClientSchema = z.object({
    FirstName: z.string().nonempty({ message: "First name is required" }),
    MiddleName: z.string().nullable(),
    LastName: z.string().nonempty({ message: "Last name is required" }),
    DOB: z.string().nonempty({ message: "Date of birth is required" }),
    RaceEthnicIdentity: z.string().min(1, "Race/Ethnic Identity is required"),
    ServiceLanguage: z.string().min(1, "Service Language is required"),
    CountryOfOrigin: z.string().min(1, "Country of Origin is required"),
    Gender: z.string().min(1, "Gender is required"),
    SexualOrientation: z.string().min(1, "Sexual Orientation is required"),
    Age: z.string().min(1, "Age is required"),
    EducationLevel: z.string().min(1, "Education Level is required"),
    CountyOfResidence: z.string().min(1, "County of Residence is required"),
    datetimeStamp: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid datetime format"),
    createdBy: z.string().min(1, "Creator's name is required"),
});

// Default function export for API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log("Attempting to connect to the database...");
    try {
        await sql`SELECT 1`; // Quick test query
        console.log("Database connection established successfully.");
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown database error";
        console.error("Error connecting to the database:", errorMessage);
        return res.status(500).json({ message: "Database connection failed.", details: errorMessage });
    }

    console.log("Received form data:", req.body);

    // Validate and process the form data
    const validatedFields = ClientSchema.safeParse(req.body);

    if (!validatedFields.success) {
        console.error("Validation errors:", validatedFields.error.flatten().fieldErrors);
        return res.status(400).json({
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed. Please check your inputs.",
        });
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
    } = validatedFields.data;

    console.log("Validated data:", validatedFields.data);

    try {
        const result = await sql`
            INSERT INTO clients (
                firstname, middlename, lastname, dob, raceethnicidentity, servicelanguage,
                countryoforigin, gender, sexualorientation, age, educationlevel, countyofresidence, datetimestamp, createdby
            )
            VALUES (${FirstName}, ${MiddleName || null}, ${LastName}, ${DOB}, ${RaceEthnicIdentity || null},
                    ${ServiceLanguage || null}, ${CountryOfOrigin || null}, ${Gender || null}, 
                    ${SexualOrientation || null}, ${Age}, ${EducationLevel || null}, 
                    ${CountyOfResidence || null}, ${datetimeStamp}, ${createdBy})
            RETURNING *;
        `;

        console.log("Database insertion result:", result);

        // Instead of revalidating, redirect to the clients dashboard page after successful insert
        return redirect('/dashboard/clients');
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown database operation error";
        const errorStack = err instanceof Error ? err.stack : undefined;

        console.error("Error during database operation:", { message: errorMessage, stack: errorStack });

        return res.status(500).json({
            message: "Database Error: Failed to create client.",
            details: errorMessage,
        });
    }
}
*/
