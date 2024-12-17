import { redirect } from 'next/navigation';
import { checkSessionAndInactivityServerSide } from '@/app/lib/session';
import { db } from '@vercel/postgres';
import UsersTable from './UsersTable'; // Client Component

export default async function UsersPage() {
    const session = checkSessionAndInactivityServerSide();

    if (!session.valid || session.auth_level < 1) {
        redirect('/login');
    }

    // Fetch users from DB
    const result = await db.query('SELECT id, firstname, lastname, email, position, auth_level FROM users');
    const users = result.rows;

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-4xl mb-4">Users</h1>
            <a
                href="/dashboard/users/addUser"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
                Add User
            </a>
            <UsersTable users={users} />
        </div>
    );
}
