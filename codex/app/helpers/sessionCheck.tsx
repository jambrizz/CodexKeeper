"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

type Props = {
    children: ReactNode;
};

export default function SessionCheck({ children }: Props) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login")
        }
    }, [status, router]);

    if (status === "loading") {
        return <div>Loading...</div>
    }

    return <>{children}</>;
}

/*
export function checkSessionAndInactivity() {
    const cookies = document.cookie.split('; ').map(c => c.trim());
    const sessionCookie = cookies.find(c => c.startsWith('session='));

    if (!sessionCookie) {
        return { loggedIn: false, auth_level: 0, firstname: '', lastname: '' };
    }

    try {
        const jsonStr = decodeURIComponent(sessionCookie.split('=')[1]);
        const sessionData = JSON.parse(jsonStr);

        const now = Date.now();
        const INACTIVITY_LIMIT = 5400000; // 1hr30m
        if ((now - sessionData.lastActivity) > INACTIVITY_LIMIT) {
            // Invalidate session
            document.cookie = 'session=; Path=/; Max-Age=0;';
            return { loggedIn: false, auth_level: 0, firstname: '', lastname: '' };
        }

        // Refresh activity timestamp on the client
        sessionData.lastActivity = now;
        document.cookie = `session=${encodeURIComponent(JSON.stringify(sessionData))}; Path=/; Max-Age=86400;`;

        return {
            loggedIn: true,
            auth_level: sessionData.auth_level,
            firstname: sessionData.firstname,
            lastname: sessionData.lastname
        };
    } catch (err) {
        document.cookie = 'session=; Path=/; Max-Age=0;';
        return { loggedIn: false, auth_level: 0, firstname: '', lastname: '' };
    }
}
*/