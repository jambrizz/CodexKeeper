import { redirect } from 'next/navigation';
import { checkSessionAndInactivityServerSide } from '../../lib/session'; 
import UserForm from './UserForm'; // Client Component
import { db } from '@vercel/postgres'; 

export default async function UserPage() {
    const session = checkSessionAndInactivityServerSide();

    if (!session.valid) {
        redirect('/login');
    }

    const result = await db.query(
        'SELECT email FROM users WHERE firstname = $1 AND lastname = $2 LIMIT 1',
        [session.firstname, session.lastname]
    );

    let email = '';
    if (result.rows.length > 0) {
        email = result.rows[0].email;
    } else {
        // If no user found, either redirect or handle error
        // For now, let's just redirect to login or show a default value
        redirect('/login');
    }

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-4xl mb-4">Update Profile</h1>
            <UserForm
                initialFirstname={session.firstname}
                initialLastname={session.lastname}
                initialEmail={email}
            />
        </div>
    );
}
