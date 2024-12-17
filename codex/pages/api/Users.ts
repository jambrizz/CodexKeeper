// pages/api/Users.ts
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@vercel/postgres";
import { usersValidation } from "@/app/model/usersValidation";
import bcrypt from 'bcrypt';

function generateTemporaryPassword(): string {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const special = "!@#$%?";
    const allChars = upper + lower + digits + special;

    let password = "";
    // Ensure at least one of each required type
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill the rest to 12 characters
    for (let i = 4; i < 12; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            const { firstname, lastname, email, position, auth_level } = req.body;

            // We only have firstname, lastname, email, position, auth_level here
            // The password will be generated.
            const tempPassword = generateTemporaryPassword();

            // Validate including password
            const validateData = { firstname, lastname, email, password: tempPassword, position, auth_level };
            const validated = usersValidation.safeParse(validateData);

            if (!validated.success) {
                return res.status(400).json({
                    errors: validated.error.flatten().fieldErrors,
                    message: "Validation failed",
                });
            }

            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            const result = await db.query(`
                INSERT INTO users (firstname, lastname, email, password, position, auth_level)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `, [firstname, lastname, email, hashedPassword, position, auth_level]);

            return res.status(201).json({ ...result.rows[0], temporaryPassword: tempPassword });
        } else if (req.method === "GET") {
            const { id } = req.query;
            if (id) {
                const userId = Array.isArray(id) ? Number(id[0]) : Number(id);
                if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
                const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
                if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
                return res.status(200).json(result.rows[0]);
            } else {
                const result = await db.query('SELECT * FROM users');
                return res.status(200).json(result.rows);
            }
        } else if (req.method === "PUT") {
            const { id, ...rest } = req.body;
            if (!id) return res.status(400).json({ error: "User ID is required for updating" });

            if (rest.password) {
                const passCheck = usersValidation.shape.password.safeParse(rest.password);
                if (!passCheck.success) {
                    return res.status(400).json({ error: "Invalid password format" });
                }
                rest.password = await bcrypt.hash(rest.password, 10);
            }

            const setClauses: string[] = [];
            const values: any[] = [];
            let i = 1;

            for (const key in rest) {
                setClauses.push(`${key} = $${i++}`);
                values.push(rest[key]);
            }
            values.push(id);

            const result = await db.query(`
                UPDATE users SET ${setClauses.join(", ")} WHERE id = $${i} RETURNING *;
            `, values);

            if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
            return res.status(200).json(result.rows[0]);
        } else if (req.method === "DELETE") {
            const { id } = req.body;
            if (!id) return res.status(400).json({ error: "User ID is required for deletion" });

            const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *;', [id]);
            if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
            return res.status(200).json({ message: "User deleted successfully", user: result.rows[0] });
        } else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error: any) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
