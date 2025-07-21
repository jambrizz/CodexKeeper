import '@/app/ui/global.css';
import { SessionProvider } from 'next-auth/react';
import SessionCheck from "@/app/helpers/sessionCheck";
import type { AppProps } from 'next/app';

export default function MyApp({
    Component,
    pageProps: { session, ...pageProps }
}: AppProps) {
    return (
        // 1) Provide the NextAuth session context
        <SessionProvider session={session}>
            {/* 
        2) Wrap *all* pages in the auth guard. 
           If you need truly public pages (like /login),
           you can enhance SessionCheck to skip those paths.
      */}
            <SessionCheck>
                <Component {...pageProps} />
            </SessionCheck>
        </SessionProvider>
    );
}