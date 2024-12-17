"use client";

import { useState } from 'react';

interface UserFormProps {
    initialFirstname: string;
    initialLastname: string;
    initialEmail: string;
}

export default function UserForm({ initialFirstname, initialLastname, initialEmail }: UserFormProps) {
    const [firstname, setFirstname] = useState(initialFirstname);
    const [lastname, setLastname] = useState(initialLastname);
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');

    const handleUpdate = async () => {
        const res = await fetch('/api/Users', {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstname, lastname, email, password })
        });

        if (res.ok) {
            alert("Profile updated.");
        } else {
            alert("Failed to update profile.");
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
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-400 rounded p-2 w-64 mb-2"
            />
            <button
                onClick={handleUpdate}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Update
            </button>
        </div>
    );
}
