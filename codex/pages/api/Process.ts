//import { z } from "zod";
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
                    grantreferenceno, reported, datetimestamp, createdby,
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

    } else if (req.method === "PUT") {

    } else if (req.method === "DELETE") {

    }
////////////////////////
}