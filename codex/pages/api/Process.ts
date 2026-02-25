//Process api
import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import { processSchema } from "@/app/model/processValidation"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const validatedFields = processSchema.safeParse(req.body);
        if (!validatedFields.success) {
            return res.status(400).json({
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Validation failed. Please check your inputs. this error is from the API",
            });
        }

        const {
            clientid,
            clientcasenumber,
            contractyear,
            processtype,
            tier,
            staffdropoff,
            dateofdropoff,
            dataentryassignment,
            dataentrycompletion,
            staffpickup,
            dateofpickup,
            granteligibility,
            householdsize,
            income,
            translations,
            additionalforms,
            casenotes,
            grantreferenceno,
            reported,
            datetimestamp,
            createdby,
        } = validatedFields.data;

        try {
            const result = await sql`
                INSERT INTO process (
                    clientid, clientcasenumber, contractyear, processtype, tier, staffdropoff,
                    dateofdropoff, dataentryassignment, dataentrycompletion, staffpickup, dateofpickup,
                    granteligibility, householdsize, income, translations, additionalforms, casenotes,
                    grantreferenceno, reported, datetimestamp, createdby
                )
                VALUES (${clientid}, ${clientcasenumber}, ${contractyear}, ${processtype}, ${tier}, ${staffdropoff},
                    ${dateofdropoff}, ${dataentryassignment}, ${dataentrycompletion}, ${staffpickup}, ${dateofpickup},
                    ${granteligibility}, ${householdsize}, ${income}, ${translations}, ${additionalforms}, ${casenotes},
                    ${grantreferenceno}, ${reported}, ${datetimestamp}, ${createdby}
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
                const processId = Array.isArray(id) ? Number(id[0]) : Number(id);
                if (isNaN(processId)) {
                    return res.status(400).json({ message: "Invalid process ID" });
                }

                const result = await sql`
                    SELECT p.*, c.firstname, c.middlename, c.lastname, c.dob, c.servicelanguage, c.gender, c.countyofresidence
                    FROM process p
                    JOIN clients c ON p.clientid = c.id
                    WHERE p.id = ${processId}
                `;
                if (result.rowCount === 0) {
                    return res.status(404).json({ message: "Process not found" });
                }
                return res.status(200).json(result.rows[0]);
            } else if (req.method === "GET") {
                try {
                    const result = await sql`
                        SELECT p.*, c.firstname, c.middlename, c.lastname, c.dob
                        FROM process p
                        JOIN clients c ON p.clientid = c.id;
                    `;
                    return res.status(200).json(result.rows);
                } catch (error) {
                    console.error("Database query error:", error);
                    return res.status(500).json({ error: "Error fetching process" });
                }
            } else {
                const result = await sql`SELECT * FROM process`;
                return res.status(200).json(result.rows);
            }
        } catch (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ error: "Error fetching process" });
        }
    } else if (req.method === "PUT") {
        const { id } = req.query;

        const processId = Array.isArray(id) ? Number(id[0]) : Number(id);

        if (!processId || isNaN(processId)) {
            return res.status(400).json({ message: "Invalid or missing process ID" });
        }

        // Validate body against schema
        const validatedFields = processSchema.safeParse(req.body);

        if (!validatedFields.success) {
            return res.status(400).json({
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Validation failed. Please check your inputs. this error is from the API",
            });
        }

        const {
            clientid,
            clientcasenumber,
            contractyear,
            processtype,
            tier,
            staffdropoff,
            dateofdropoff,
            dataentryassignment,
            dataentrycompletion,
            staffpickup,
            dateofpickup,
            granteligibility,
            householdsize,
            income,
            translations,
            additionalforms,
            casenotes,
            grantreferenceno,
            reported,
            datetimestamp,
            createdby,
        } = validatedFields.data;

        try {
            const result = await sql`
          UPDATE process
          SET
            clientid = ${clientid},
            clientcasenumber = ${clientcasenumber},
            contractyear = ${contractyear},
            processtype = ${processtype},
            tier = ${tier},
            staffdropoff = ${staffdropoff},
            dateofdropoff = ${dateofdropoff},
            dataentryassignment = ${dataentryassignment},
            dataentrycompletion = ${dataentrycompletion},
            staffpickup = ${staffpickup},
            dateofpickup = ${dateofpickup},
            granteligibility = ${granteligibility},
            householdsize = ${householdsize},
            income = ${income},
            translations = ${translations},
            additionalforms = ${additionalforms},
            casenotes = ${casenotes},
            grantreferenceno = ${grantreferenceno},
            reported = ${reported},
            datetimestamp = ${datetimestamp},
            createdby = ${createdby}
          WHERE id = ${processId}
          RETURNING *;
        `;

            if (result.rowCount === 0) {
                return res.status(404).json({ message: "Process not found" });
            }

            return res.status(200).json(result.rows[0]);
        } catch (err: unknown) {
            console.error("Error during database operation:", err);
            return res.status(500).json({ message: "Database update failed.", details: err });
        }
    } else if (req.method === "DELETE") {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Process ID is required for deletion" });
        }

        try {
            const result = await sql`DELETE FROM process WHERE id = ${id} RETURNING *`;
            if (result.rowCount === 0) {
                return res.status(404).json({ message: "Process not found" });
            }
            return res.status(200).json({ message: "Process deleted Successfully", process: result.rows[0] });
        } catch (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ error: "Error deleting process" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
////////////////////////
}