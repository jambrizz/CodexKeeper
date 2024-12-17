"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddUserForm() {
    const router = useRouter();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [position, setPosition] = useState('');
    const [auth_level, setAuthLevel] = useState(1);
    const [tempPassword, setTempPassword] = useState<string | null>(null);

    const handleAdd = async () => {
        const body = { firstname, lastname, email, position, auth_level };

        const res = await fetch('/api/Users', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            const data = await res.json();
            setTempPassword(data.temporaryPassword);
        } else {
            alert("Failed to add user.");
        }
    };

    if (tempPassword) {
        return (
            <div className="flex flex-col items-center p-4">
                <h1 className="text-4xl mb-4">User Created</h1>
                <p className="mb-4">Temporary Password: <strong>{tempPassword}</strong></p>
                <button
                    onClick={() => router.push('/dashboard/users')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Back to Users
                </button>
            </div>
        );
    }

    return (
        <>
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
                type="text"
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="border border-gray-400 rounded p-2 w-64 mb-2"
            />
            <select
                value={auth_level}
                onChange={(e) => setAuthLevel(parseInt(e.target.value))}
                className="border border-gray-400 rounded p-2 w-64 mb-2"
            >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={0}>0</option>
            </select>
            <button
                onClick={handleAdd}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Add User
            </button>
        </>
    );
}
