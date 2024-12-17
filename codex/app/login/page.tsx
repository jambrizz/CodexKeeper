"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setError(null);
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || 'Login failed.');
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-4xl mb-4">Login</h1>
            <input
                type="email"
                placeholder="Email"
                className="border border-gray-400 rounded p-2 w-64 mb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="border border-gray-400 rounded p-2 w-64 mb-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Login
            </button>
        </div>
    );
}