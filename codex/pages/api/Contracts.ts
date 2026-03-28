// Contract API
import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import { contractSchema } from "@/app/model/contractValidation"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const validatedFields = contractSchema.safeParse(req.body);

        if (!validatedFields.success) {
            return res.status(400).json({
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Validation failed. Please check you inputs. This error is from the API",
            });
        }

        const {
            contractName,
            contractTotal,
            contractStart,
            contractEnd,
            tierAmount,
            tier1Rate,
            tier2Rate,
            tier3Rate,
            tier4Rate,
            tier5Rate,
            tier6Rate,
            supportAmount,
            translationRate,
            interpretationRate,
            fpRate,
            eoiAmount,
            eoiRate,
            eoeAmount,
            eoeRate,
        } = validatedFields.data;

        try {
            const result = await sql`
                INSERT INTO contracts (
                contractname,
                contracttotal,
                contractstart,
                contractend,
                tieramount,
                tier1rate,
                tier2rate,
                tier3rate,
                tier4rate,
                tier5rate,
                tier6rate,
                supportamount,
                translationrate,
                interpretationrate,
                fprate,
                eoiamount,
                eoirate,
                eoeamount,
                eoerate
            )
            VALUES (
                ${contractName},
                ${contractTotal},
                ${contractStart},
                ${contractEnd},
                ${tierAmount},
                ${tier1Rate},
                ${tier2Rate},
                ${tier3Rate},
                ${tier4Rate},
                ${tier5Rate},
                ${tier6Rate},
                ${supportAmount},
                ${translationRate},
                ${interpretationRate},
                ${fpRate},
                ${eoiAmount},
                ${eoiRate},
                ${eoeAmount},
                ${eoeRate}
            )
            RETURNING *;
            `;

            return res.status(201).json(result.rows[0]);
        } catch (err: unknown) {
            console.error("Error during database operation:", err);
            return res.status(500).json({
                message: "Database insertion failed.",
                details: err,
            });
        }

    } else if (req.method === "GET") {
        const { id } = req.query;

        try {
            if (id) {
                const contractId = Array.isArray(id) ? Number(id[0]) : Number(id);

                if (isNaN(contractId)) {
                    return res.status(400).json({ message: "Invalid contract ID" });
                }

                const result = await sql`
                SELECT *
                FROM contracts
                WHERE id = ${contractId};
            `;

                if (result.rowCount === 0) {
                    return res.status(404).json({ message: "Contract not found" });
                }

                return res.status(200).json(result.rows[0]);
            } else {
                const result = await sql`
                SELECT *
                FROM contracts
                ORDER BY id DESC;
            `;

                return res.status(200).json(result.rows);
            }
        } catch (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ error: "Error fetching contracts" });
        }
    } else if (req.method === "PUT") {
        const { id } = req.query;

        const contractId = Array.isArray(id) ? Number(id[0]) : Number(id);

        if (!contractId || isNaN(contractId)) {
            return res.status(400).json({ message: "Invalid or missing contract ID" });
        }

        const validatedFields = contractSchema.safeParse(req.body);

        if (!validatedFields.success) {
            return res.status(400).json({
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Validation failed. Please check your inputs. This error is from the API",
            });
        }

        const {
            contractName,
            contractTotal,
            contractStart,
            contractEnd,
            tierAmount,
            tier1Rate,
            tier2Rate,
            tier3Rate,
            tier4Rate,
            tier5Rate,
            tier6Rate,
            supportAmount,
            translationRate,
            interpretationRate,
            fpRate,
            eoiAmount,
            eoiRate,
            eoeAmount,
            eoeRate,
        } = validatedFields.data;

        try {
            const result = await sql`
                UPDATE contracts
                SET
                    contractname = ${contractName},
                    contracttotal = ${contractTotal},
                    contractstart = ${contractStart},
                    contractend = ${contractEnd},
                    tieramount = ${tierAmount},
                    tier1rate = ${tier1Rate},
                    tier2rate = ${tier2Rate},
                    tier3rate = ${tier3Rate},
                    tier4rate = ${tier4Rate},
                    tier5rate = ${tier5Rate},
                    tier6rate = ${tier6Rate},
                    supportamount = ${supportAmount},
                    translationrate = ${translationRate},
                    interpretationrate = ${interpretationRate},
                    fprate = ${fpRate},
                    eoiamount = ${eoiAmount},
                    eoirate = ${eoiRate},
                    eoeamount = ${eoeAmount},
                    eoerate = ${eoeRate}
                WHERE id = ${contractId}
                RETURNING *;  
            `;

            if (result.rowCount === 0) {
                return res.status(404).json({ message: "Contract not found" });
            }

            return res.status(200).json(result.rows[0]);
        } catch (err: unknown) {
            console.error("Error during Database operation:", err);
            return res.status(500).json({
                message: "Database update failed.",
                details: err,
            })
        }

    } else if (req.method === "DELETE") {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: "Contract ID is required for deletion" });
        }

        try {
            const result = await sql`
                DELETE FROM contracts
                WHERE id = ${id}
                RETURNING *;
            `;

            if (result.rowCount === 0) {
                return res.status(404).json({ message: "Contract not found" });
            }

            return res.status(200).json({
                message: "Contract deleted successfully",
                contract: result.rows[0],
            })
        } catch (error) {
            console.error("Database query error", error)
            return res.status(500).json({ error: "Error deleting contract" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }

}