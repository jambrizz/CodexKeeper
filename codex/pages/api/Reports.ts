import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@vercel/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed. Only GET is supported for reports." });
    }

    try {
        const {
            clientColumns = "",
            processColumns = "",
            startDate = "",
            endDate = "",
            processtype = "",
            name = "",
        } = req.query;

        // Convert comma-separated strings to arrays
        const clientCols = typeof clientColumns === 'string' && clientColumns ? clientColumns.split(",") : [];
        const processCols = typeof processColumns === 'string' && processColumns ? processColumns.split(",") : [];

        // Build the SELECT clause
        let selectClause = "";
        if (clientCols.length === 0 && processCols.length === 0) {
            // Default to client id = c.id if no columns selected
            selectClause = "c.id";
        } else {
            const cCols = clientCols.map(c => `c.${c}`).join(", ");
            const pCols = processCols.map(c => `p.${c}`).join(", ");
            if (cCols && pCols) {
                selectClause = cCols + ", " + pCols;
            } else if (cCols) {
                selectClause = cCols;
            } else if (pCols) {
                selectClause = pCols;
            }
        }

        // Query joining clients and process
        let baseQuery = `
            SELECT ${selectClause}
            FROM clients c
            JOIN process p ON p.clientid = c.id
        `;

        const conditions: string[] = [];

        // Date range filter
        if (startDate && endDate) {
            // Assuming p.dateofdropoff as the date field
            conditions.push(`p.dateofdropoff BETWEEN '${startDate}' AND '${endDate}'`);
        }

        // Process type filter
        if (processtype && processtype !== "All") {
            conditions.push(`p.processtype = '${processtype}'`);
        }

        // Name filter
        if (name) {
            conditions.push(`(c.firstname ILIKE '%${name}%' OR c.lastname ILIKE '%${name}%')`);
        }

        if (conditions.length > 0) {
            baseQuery += " WHERE " + conditions.join(" AND ");
        }

        const result = await db.query(baseQuery);

        // Return the result rows
        return res.status(200).json(result.rows);
    } catch (error: any) {
        console.error("Error generating report:", error);
        return res.status(500).json({ error: "Failed to generate report" });
    }
}
