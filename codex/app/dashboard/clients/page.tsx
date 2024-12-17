"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Client {
    firstname: string;
    middlename?: string;
    lastname: string;
    dob: string;
    countyofresidence?: string;
    id: number;
    [key: string]: any; // Add other fields as needed
}

const ClientsPage = () => {
    const [clients, setClients] = useState<Client[]>([]); // All clients fetched from API
    const [searchTerm, setSearchTerm] = useState<string>(""); // For filtering clients by name
    const [limit, setLimit] = useState<number>(25); // How many clients per page (0 will mean 'All')
    const [currentPage, setCurrentPage] = useState<number>(1); // Current page for pagination

    const router = useRouter();

    const handleAddClientClick = () => {
        router.push("/dashboard/clients/addClient");
    };

    const handleView = (id: number) => {
        if (!id) {
            console.error("No client ID available for viewing");
            return;
        }
        router.push(`/dashboard/clients/viewClient?id=${id}`);
    };

    const handleEdit = (id: number) => {
        if (!id) {
            console.error("No client ID available for editing");
            return;
        }
        router.push(`/dashboard/clients/updateClient?id=${id}`);
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this client?");
        if (!confirmed) {
            return; // Exit if the user cancels
        }

        try {
            const response = await fetch(`/api/Clients`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error(`Failed to delete client: ${response.statusText}`);
            }

            alert("Client deleted successfully.");

            // Remove the deleted client from the local state
            setClients((prevClients) => prevClients.filter((client) => client.id !== id));
        } catch (error) {
            console.error("Error deleting client:", error);
            alert("Failed to delete client. Please try again.");
        }
    };

    const getClientsFromAPI = async (): Promise<Client[]> => {
        const response = await fetch("/api/Clients");
        if (!response.ok) {
            throw new Error("Failed to fetch clients");
        }
        return await response.json();
    };

    const getAllClients = async () => {
        try {
            const clientsData = await getClientsFromAPI();
            console.log("Fetched clients from API", clientsData);
            setClients(clientsData);
        } catch (error) {
            console.error("Error fetching clients", error);
        }
    };

    // Fetch clients when the component mounts
    useEffect(() => {
        getAllClients();
    }, []);

    // Filter clients based on search term
    const filteredClients = clients.filter((client) => {
        const fullName = `${client.firstname} ${client.middlename || ""} ${client.lastname}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    // Calculate pagination
    const totalClients = filteredClients.length;
    const effectiveLimit = limit === 0 ? totalClients : limit; // If limit=0, treat as 'All' (show all)
    const totalPages = effectiveLimit > 0 ? Math.ceil(totalClients / effectiveLimit) : 1;

    // Ensure current page is within valid range if clients or limit changes
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    // Determine which clients to display based on current page and limit
    const startIndex = (currentPage - 1) * effectiveLimit;
    const displayedClients = filteredClients.slice(startIndex, startIndex + effectiveLimit);

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

    return (
        <>
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4">Client Portal</h1>
                <div className="mb-4">
                    <button
                        onClick={handleAddClientClick}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Client
                    </button>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center m-3 gap-4">
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
                <div className="flex flex-row items-center mb-4 gap-2">
                    <label className="mb-2 font-semibold">Show clients per page:</label>
                    <select
                        value={limit === 0 ? "All" : limit}
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
            <div id="displayClients" className="flex flex-col items-center">
                {displayedClients.length > 0 ? (
                    displayedClients.map((client) => (
                        <div
                            key={client.id}
                            className="flex flex-row border p-3 m-2 w-[600px] space-x-4 items-center"
                        >
                            <div className="flex-grow">
                                <p>
                                    <strong>Name:</strong> {client.firstname} {client.middlename || ""} {client.lastname}
                                </p>
                                <p>
                                    <strong>DOB:</strong>{" "}
                                    {client.dob
                                        ? new Date(client.dob).toLocaleDateString("en-US", {
                                            month: "2-digit",
                                            day: "2-digit",
                                            year: "numeric",
                                        })
                                        : "N/A"}
                                </p>
                                <p>
                                    <strong>County:</strong> {client.countyofresidence || "N/A"}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                    onClick={() => handleView(client.id)}
                                >
                                    View
                                </button>
                                <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                    onClick={() => handleEdit(client.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    onClick={() => handleDelete(client.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No clients found</p>
                )}
            </div>
            {/* Pagination Controls need to seperate this to another file in UI */}
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

export default ClientsPage;
