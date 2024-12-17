import { cookies } from 'next/headers';

interface SessionData {
    firstname: string;
    lastname: string;
    auth_level: number;
    lastActivity: number;
}

export function checkSessionAndInactivityServerSide(): { valid: boolean; auth_level: number; firstname: string; lastname: string } {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
        return { valid: false, auth_level: 0, firstname: '', lastname: '' };
    }

    try {
        const sessionData: SessionData = JSON.parse(sessionCookie.value);
        const now = Date.now();
        const INACTIVITY_LIMIT = 5400000; // 1hr30m in ms
        if ((now - sessionData.lastActivity) > INACTIVITY_LIMIT) {
            // Session expired
            return { valid: false, auth_level: 0, firstname: '', lastname: '' };
        }

        // No cookie update here, just validate and return the current session
        return {
            valid: true,
            auth_level: sessionData.auth_level,
            firstname: sessionData.firstname,
            lastname: sessionData.lastname
        };
    } catch (err) {
        return { valid: false, auth_level: 0, firstname: '', lastname: '' };
    }
}