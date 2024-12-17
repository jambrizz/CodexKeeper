"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    position: string;
    auth_level: number;
}

interface UsersTableProps {
    users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
    const [localUsers, setLocalUsers] = useState(users);
    const router = useRouter();

    const refreshUsers = async () => {
        const res = await fetch('/api/Users');
        if (res.ok) {
            const data = await res.json();
            setLocalUsers(data);
        }
    };

    const handleMakeInactive = async (id: number) => {
        await fetch('/api/Users', {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, auth_level: 0 })
        });
        await refreshUsers();
    };

    const handleEdit = (id: number) => {
        // Use `router.push` for navigation
        router.push(`/dashboard/users/editUser?id=${id}`);
    };

    const handleDelete = async (id: number) => {
        await fetch('/api/Users', {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        await refreshUsers();
    };

    if (localUsers.length === 0) {
        return <p>No users found.</p>;
    }

    return (
        <div className="overflow-x-auto w-full max-w-4xl">
            <table className="border-collapse w-full">
                <thead>
                    <tr className="border-b">
                        <th className="p-2 border-b font-semibold text-left">First Name</th>
                        <th className="p-2 border-b font-semibold text-left">Last Name</th>
                        <th className="p-2 border-b font-semibold text-left">Email</th>
                        <th className="p-2 border-b font-semibold text-left">Position</th>
                        <th className="p-2 border-b font-semibold text-left">Auth Level</th>
                        <th className="p-2 border-b font-semibold text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {localUsers.map((u: User) => (
                        <tr key={u.id} className="border-b">
                            <td className="p-2 border-b">{u.firstname}</td>
                            <td className="p-2 border-b">{u.lastname}</td>
                            <td className="p-2 border-b">{u.email}</td>
                            <td className="p-2 border-b">{u.position}</td>
                            <td className="p-2 border-b">{u.auth_level}</td>
                            <td className="p-2 border-b space-x-2">
                                <button
                                    onClick={() => handleMakeInactive(u.id)}
                                    className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                                >
                                    Inactive
                                </button>
                                <button
                                    onClick={() => handleEdit(u.id)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(u.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
