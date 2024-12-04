"use client";

import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { useRouter } from 'next/navigation';

/*
export const metadata: Metadata = {
    title: 'Clients',
};
*/

const ClientsPage = () => {
    const router = useRouter();

    const handleAddClientClick = () => {
        router.push('/dashboard/clients/addClient');
    };


    return (
        <>
            <div className="flex flex-col items-center">
                <h1 >Client Portal</h1>

                <div>
                    <button
                        onClick={handleAddClientClick}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Client
                    </button>
                </div>
            </div>
            <div id="searchFeature" className="flex flex-col items-center">

            </div>
            <div id="displayClients" className="flex flex-col items-center">
                
            </div>
        </>
    );
};

export default ClientsPage;