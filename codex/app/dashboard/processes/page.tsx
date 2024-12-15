"use client";

import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/*
export const metadata: Metadata = {
    title: 'Processes',
};
*/

interface Process {
    id: number;
    firstname: string;
    middlename: string;
    lastname: string;
    dob: string;
    clientid: number;
    contractyear: string;
    processtype: string;
    tier: string;
    [key: string]: any; // Add other fields as needed
}

const ProcessesPage = () => {
    const [processes, setProcesses] = useState<Process[]>([]); // Typed state
    const router = useRouter();

    const handleAddProcessClick = () => {
        router.push('/dashboard/processes/addProcess');
    };

    const handleView = (id: number) => {
        console.log("Process id :", id);
    };

    const handleEdit = (id: number) => {
        console.log("Edit process with ID:", id);
    };

    const handleDelete = async (id: number) => {
        console.log("Delete process with ID:", id)
    };

    const getProcessesFromAPI = async (): Promise<Process[]> => {
        const response = await fetch("/api/Process");
        if (!response.ok) {
            throw new Error("Failed to fetch processes");
        }
        return await response.json();
    };

    const getAllProcesses = async () => {
        try {
            const processes = await getProcessesFromAPI();
            console.log("Processes:", processes);
            setProcesses(processes);
        } catch (error) {
            console.error("Failed to fetch processes:", error);
        }
    };

    useEffect(() => {
        getAllProcesses();
    }, []);

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
                <div id="Processes" className="flex flex-col items-center">
                    {processes.length > 0 ? (
                        processes.map((process, index) => (
                            <div
                                key={process.id}
                                className="flex flex-row border p-3 m-2 w-[600px] space-x-4 items-center"
                            >
                                <div className="flex-grow">
                                    <p>
                                        <strong>Name:</strong> {process.firstname} {process.middlename} {process.lastname}
                                        <strong>DOB:</strong> {process.dob ? new Date(process.dob).toLocaleDateString("en-US", {
                                            month: "2-digit",
                                            day: "2-digit",
                                            year: "numeric",
                                        }) : "N/A"}
                                        <strong>Contract Year:</strong> {process.contractyear}
                                        <strong>Process Type:</strong> {process.processtype}
                                        <strong>Tier:</strong> {process.tier}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                        onClick={() => handleView(process.id)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                        onClick={() => handleEdit(process.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        onClick={() => handleDelete(process.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No processes found.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProcessesPage;
