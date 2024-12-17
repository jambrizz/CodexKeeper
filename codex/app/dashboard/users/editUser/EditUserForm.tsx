"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EditUserFormProps {
    userId: number;
    initialFirstname: string;
    initialLastname: string;
    initialEmail: string;
    initialAuthLevel: number;
}

export default function EditUserForm({
    userId,
    initialFirstname,
    initialLastname,
    initialEmail,
    initialAuthLevel,
}: EditUserFormProps) {
    const router = useRouter();
    const [firstname, setFirstname] = useState(initialFirstname);
    const [lastname, setLastname] = useState(initialLastname);
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [auth_level, setAuthLevel] = useState(initialAuthLevel);

    const handleUpdate = async () => {
        const body: any = { id: userId, firstname, lastname, email, auth_level };
        if (password.trim()) {
            body.password = password;
        }

        const res = await fetch('/api/Users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            alert('User updated successfully.');
            router.push('/dashboard/users');
        } else {
            alert('Failed to update user.');
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <input
                type="text"
                placeholder="First Name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="border border-gray-400 rounded p-2 w-64 mb-2"
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="border border-gray-400 rounded p-2 w-64 mb-2"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-400 rounded p-2 w-64 mb-2"
            />
            <input
                type="password"
                placeholder="New Password (leave blank if not changing)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-400 rounded p-2 w-64 mb-2"
            />
            <select
                value={auth_level}
                onChange={(e) => setAuthLevel(parseInt(e.target.value))}
                className="border border-gray-400 rounded p-2 w-64 mb-2"
            >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
            </select>
            <button
                onClick={handleUpdate}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Update User
            </button>
        </div>
    );
}
