import { redirect } from 'next/navigation';
import { checkSessionAndInactivityServerSide } from '@/app/lib/session';

export default async function AddUserPage() {
    const session = checkSessionAndInactivityServerSide();

    if (!session.valid || session.auth_level < 1) {
        redirect('/login');
    }

    // If authorized, render the client component for the form
    const AddUserForm = (await import('./AddUserForm')).default;

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-4xl mb-4">Add User</h1>
            <AddUserForm />
        </div>
    );
}
