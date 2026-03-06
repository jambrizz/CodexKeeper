// Contract API
import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import { contractSchema } from "@/app/model/contractValidation"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        //TODO create POST method
    } else if (req.method === "GET") {
        //will need to create if statements to address the different types of GETs that will be used
    } else if (req.method === "PUT") {

    } else if (req.method === "DELETE") {

    } else {
        res.status(405).json({ error: "Method not allowed" });
    }

}