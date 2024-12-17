import { redirect } from 'next/navigation';
import { db } from '@vercel/postgres';
import { checkSessionAndInactivityServerSide } from '@/app/lib/session';

export default async function EditUserPage({ searchParams }: { searchParams: { id?: string } }) {
    const session = checkSessionAndInactivityServerSide();

    if (!session.valid || session.auth_level < 1) {
        redirect('/login');
    }

    const userId = Number(searchParams?.id);
    if (isNaN(userId)) {
        redirect('/dashboard/users');
    }

    const { rows } = await db.query('SELECT id, firstname, lastname, email, auth_level FROM users WHERE id = $1', [userId]);
    if (rows.length === 0) {
        redirect('/dashboard/users');
    }

    const user = rows[0];

    // Correct the relative import path to match the actual file location
    const EditUserForm = (await import('./EditUserForm')).default;

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-4xl mb-4">Edit User</h1>
            <EditUserForm
                userId={user.id}
                initialFirstname={user.firstname}
                initialLastname={user.lastname}
                initialEmail={user.email}
                initialAuthLevel={user.auth_level}
            />
        </div>
    );
}
