import { connectDb } from '../../lib/db';

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            return getClients(req, res);
        case 'POST':
            return createClient(req, res);
        case 'PUT':
            return updateClient(req, res);
        case 'DELETE':
            return deleteClient(req, res);
        default:
            return res.status(405).json({ error: `Method ${method} not allowed` });
    }
}

async function getClients(req, res) {
    let client;
    try {
        client = await connectDb();
        const result = await client.query('SELECT * FROM clients ORDER BY firstname;');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (client) {
            await client.end();
        }
    }
}

async function createClient(req, res) {
    const { firstname, middlename, lastname, dob, race_ethnic_identity, service_language, country_of_origin, gender, sexual_orientation, age, education_level, county_of_residence } = req.body;

    if (!firstname || !lastname || !dob) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    let client;
    try {
        client = await connectDb();
        const query = `
      INSERT INTO clients (firstname, middlename, lastname, dob, race_ethnic_identity, service_language, country_of_origin, gender, sexual_orientation, age, education_level, county_of_residence)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
        const values = [firstname, middlename, lastname, dob, race_ethnic_identity, service_language, country_of_origin, gender, sexual_orientation, age, education_level, county_of_residence];
        const result = await client.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (client) {
            await client.end();
        }
    }
}

async function updateClient(req, res) {
    const { id } = req.query;
    const { firstname, middlename, lastname, dob, race_ethnic_identity, service_language, country_of_origin, gender, sexual_orientation, age, education_level, county_of_residence } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Client ID is required' });
    }

    let client;
    try {
        client = await connectDb();
        const query = `
      UPDATE clients
      SET firstname = $1, middlename = $2, lastname = $3, dob = $4, race_ethnic_identity = $5, service_language = $6, country_of_origin = $7, gender = $8, sexual_orientation = $9, age = $10, education_level = $11, county_of_residence = $12
      WHERE id = $13
      RETURNING *;
    `;
        const values = [firstname, middlename, lastname, dob, race_ethnic_identity, service_language, country_of_origin, gender, sexual_orientation, age, education_level, county_of_residence, id];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (client) {
            await client.end();
        }
    }
}

async function deleteClient(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Client ID is required' });
    }

    let client;
    try {
        client = await connectDb();
        const query = 'DELETE FROM clients WHERE id = $1 RETURNING *;';
        const result = await client.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.status(200).json({ message: 'Client deleted successfully', client: result.rows[0] });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (client) {
            await client.end();
        }
    }
}
