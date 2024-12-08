import { z } from "zod";
import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

const ClientSchema = z.object({
    firstname: z.string().nonempty({ message: "First name is required" }),
    middlename: z.string().nullable(),
    lastname: z.string().nonempty({ message: "Last name is required" }),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth needs to be formatted as YYYY-MM-DD"),
    raceethnicidentity: z.string().min(1, "Race/Ethnic Identity is required"),
    servicelanguage: z.string().min(1, "Service Language is required"),
    countryoforigin: z.string().min(1, "Country of Origin is required"),
    gender: z.string().min(1, "Gender is required"),
    sexualorientation: z.string().min(1, "Sexual Orientation is required"),
    age: z.string().min(1, "Age is required"),
    educationlevel: z.string().min(1, "Education Level is required"),
    countyofresidence: z.string().min(1, "County of Residence is required"),
    datetimestamp: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid datetime format"),
    createdby: z.string().min(1, "Creator's name is required"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const validatedFields = ClientSchema.safeParse(req.body);
        if (!validatedFields.success) {
            return res.status(400).json({
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Validation failed. Please check your inputs.",
            });
        }

        const {
            firstname,
            middlename,
            lastname,
            dob,
            raceethnicidentity,
            servicelanguage,
            countryoforigin,
            gender,
            sexualorientation,
            age,
            educationlevel,
            countyofresidence,
            datetimestamp,
            createdby,
        } = validatedFields.data;

        try {
            const result = await sql`
                INSERT INTO clients (
                    firstname, middlename, lastname, dob, raceethnicidentity, servicelanguage,
                    countryoforigin, gender, sexualorientation, age, educationlevel, countyofresidence, datetimestamp, createdby
                )
                VALUES (${firstname}, ${middlename || null}, ${lastname}, ${dob}, ${raceethnicidentity}, ${servicelanguage},
                    ${countryoforigin}, ${gender}, ${sexualorientation}, ${age}, ${educationlevel}, ${countyofresidence}, ${datetimestamp}, ${createdby}
                )
                RETURNING *;
            `;
            return res.status(201).json(result.rows[0]);
        } catch (err: unknown) {
            console.error("Error during database operation:", err);
            return res.status(500).json({ message: "Database insertion failed.", details: err });
        }
    } else if (req.method === "GET") {
        const { id } = req.query;

        try {
            if (id) {
                const clientId = Array.isArray(id) ? Number(id[0]) : Number(id); // Convert `id` to a number
                if (isNaN(clientId)) {
                    return res.status(400).json({ message: "Invalid client ID" });
                }
                const result = await sql`SELECT * FROM clients WHERE id = ${clientId}`;
                if (result.rowCount === 0) {
                    return res.status(404).json({ message: "Client not found" });
                }
                return res.status(200).json(result.rows[0]);
            } else {
                const result = await sql`SELECT * FROM clients`;
                return res.status(200).json(result.rows);
            }
        } catch (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ error: "Error fetching clients" });
        }
    } else if (req.method === "PUT") {
        const validatedFields = ClientSchema.safeParse(req.body);

        if (!validatedFields.success) {
            return res.status(400).json({
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Validation failed. Please check your inputs.",
            });
        }

        const {
            firstname,
            middlename,
            lastname,
            dob,
            raceethnicidentity,
            servicelanguage,
            countryoforigin,
            gender,
            sexualorientation,
            age,
            educationlevel,
            countyofresidence,
            datetimestamp,
            createdby,
        } = validatedFields.data;

        const { id } = req.body; 

        if (!id) {
            return res.status(400).json({ error: "Client ID is required for updating" });
        }

        try {
            const result = await sql`
                UPDATE clients
                SET 
                    firstname = ${firstname},
                    middlename = ${middlename || null},
                    lastname = ${lastname},
                    dob = ${dob},
                    raceethnicidentity = ${raceethnicidentity},
                    servicelanguage = ${servicelanguage},
                    countryoforigin = ${countryoforigin},
                    gender = ${gender},
                    sexualorientation = ${sexualorientation},
                    age = ${age},
                    educationlevel = ${educationlevel},
                    countyofresidence = ${countyofresidence},
                    datetimestamp = ${datetimestamp},
                    createdby = ${createdby}
                WHERE id = ${id}
                RETURNING *;
            `;
            if (result.rowCount === 0) {
                return res.status(404).json({ message: "Client not found" });
            }
            return res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ error: "Error updating client" });
        }
    } else if (req.method === "DELETE") {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Client ID is required for deletion" });
        }

        try {
            const result = await sql`DELETE FROM clients WHERE id = ${id} RETURNING *`;
            if (result.rowCount === 0) {
                return res.status(404).json({ message: "Client not found" });
            }
            return res.status(200).json({ message: "Client deleted successfully", client: result.rows[0] });
        } catch (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ error: "Error deleting client" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
