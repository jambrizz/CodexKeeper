import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@vercel/postgres";
import bcrypt from 'bcrypt';

//This checks the credentials and sets a session cookie
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const result = await db.query('SELECT id, firstname, lastname, email, password, auth_level FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    // Create session
    const sessionData = {
        firstname: user.firstname,
        lastname: user.lastname,
        auth_level: user.auth_level,
        lastActivity: Date.now()
    };

    // Set session cookie
    res.setHeader('Set-Cookie', `session=${JSON.stringify(sessionData)}; HttpOnly; Secure; Path=/; Max-Age=86400; SameSite=Strict`);
    return res.status(200).json({ message: "Login successful" });
}