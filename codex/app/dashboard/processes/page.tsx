"use client";

import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { useRouter } from 'next/navigation';

/*
export const metadata: Metadata = {
    title: 'Processes',
};

export default async function Page() {

    return (
        <>
            <h1 >Processes</h1>

        </>
    );
}
*/

const ProcessesPage = () => {
    const router = useRouter();

    const handleAddProcessClick = () => {
        router.push('/dashboard/processes/addProcess');
    };

    return (
        <>
            <div className="flex flex-col items-center">
                <h1>Process Portal</h1>
                <div>
                    <button
                        onClick={handleAddProcessClick}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Process
                    </button>
                </div>
            </div>
        </>
    );

};

export default ProcessesPage;