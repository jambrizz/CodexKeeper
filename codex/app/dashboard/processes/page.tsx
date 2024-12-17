"use client";

import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { processes as processList } from "@/app/demo/processes"; // Import the list of processes for dropdown

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
    const [processes, setProcesses] = useState<Process[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedProcessType, setSelectedProcessType] = useState<string>("All");
    const [limit, setLimit] = useState<number>(25); // Default to 25
    const [currentPage, setCurrentPage] = useState<number>(1);

    const router = useRouter();

    const handleAddProcessClick = () => {
        router.push('/dashboard/processes/addProcess');
    };

    const handleView = (id: number) => {
        console.log("Process id :", id);
        if (!id) {
            console.error("No process ID available for viewing");
            return;
        }
        router.push(`/dashboard/processes/viewProcess?id=${id}`);
    };

    const handleEdit = (id: number) => {
        console.log("Edit process with ID:", id);
        // Implement edit logic here if needed
    };

    const handleDelete = async (id: number) => {
        console.log("Delete process with ID:", id);
        // Implement delete logic here if needed
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

    // Filter by name and process type
    const filteredProcesses = processes.filter((process) => {
        const fullName = `${process.firstname} ${process.middlename || ""} ${process.lastname}`.toLowerCase();
        const nameMatches = fullName.includes(searchTerm.toLowerCase());
        const processMatches = selectedProcessType === "All" || process.processtype === selectedProcessType;

        return nameMatches && processMatches;
    });

    // Calculate pagination
    const totalProcesses = filteredProcesses.length;
    const effectiveLimit = limit === 0 ? totalProcesses : limit; // If limit=0 (All), show all
    const totalPages = effectiveLimit > 0 ? Math.ceil(totalProcesses / effectiveLimit) : 1;

    // Ensure current page is valid if filters change
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    const startIndex = (currentPage - 1) * effectiveLimit;
    const displayedProcesses = filteredProcesses.slice(startIndex, startIndex + effectiveLimit);

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "All") {
            setLimit(0);
            setCurrentPage(1);
        } else {
            const num = parseInt(value, 10);
            if (!isNaN(num)) {
                setLimit(num);
                setCurrentPage(1);
            }
        }
    };

    const handleProcessFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProcessType(e.target.value);
        setCurrentPage(1);
    };

    return (
        <>
            <div className="flex flex-col items-center">
                <h1>Process Portal</h1>
                <div className="mb-4">
                    <button
                        onClick={handleAddProcessClick}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Process
                    </button>
                </div>
            </div>

            <div className="flex flex-row justify-center items-center m-3 gap-4">
                {/* Search Feature */}
                <div id="searchFeature" className="flex flex-row items-center mb-4 gap-2">
                    <label className="mb-2 font-semibold">Search clients:</label>
                    <input
                        type="text"
                        placeholder="Type clients name..."
                        className="border border-gray-400 rounded p-2 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Process Filter Dropdown */}
                <div className="flex flex-row items-center mb-4 gap-2">
                    <label className="mb-2 font-semibold">Filter by Process Type:</label>
                    <select
                        value={selectedProcessType}
                        onChange={handleProcessFilterChange}
                        className="border border-gray-400 rounded p-2 w-64"
                    >
                        <option value="All">All</option>
                        {processList.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Pagination Limit Dropdown */}
                <div className="flex flex-row items-center mb-4 gap-2">
                    <label className="mb-2 font-semibold">Show clients per page:</label>
                    <select
                        value={limit === 0 ? "All" : limit.toString()}
                        onChange={handleLimitChange}
                        className="border border-gray-400 rounded p-2 w-20"
                    >
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="All">All</option>
                    </select>
                </div>
            </div>

            <div id="Processes" className="flex flex-col items-center">
                {displayedProcesses.length > 0 ? (
                    displayedProcesses.map((process) => (
                        <div
                            key={process.id}
                            className="flex flex-row border p-3 m-2 w-[700px] space-x-4 items-center"
                        >
                            <div className="flex-grow">
                                <p>
                                    <strong>Name:</strong> {process.firstname} {process.middlename || ""} {process.lastname}{" "}
                                    <strong>DOB:</strong>{" "}
                                    {process.dob
                                        ? new Date(process.dob).toLocaleDateString("en-US", {
                                            month: "2-digit",
                                            day: "2-digit",
                                            year: "numeric",
                                        })
                                        : "N/A"}{" "}
                                    <strong>Contract Year:</strong> {process.contractyear}{" "}
                                    <strong>Process Type:</strong> {process.processtype}{" "}
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

            {/* Pagination Controls need to go back and make a seperate file for this in UI*/}
            {limit > 0 && totalPages > 1 && (
                <div className="flex flex-row justify-center items-center mt-4 space-x-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="bg-gray-300 text-black px-2 py-1 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="bg-gray-300 text-black px-2 py-1 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </>
    );
};

export default ProcessesPage;