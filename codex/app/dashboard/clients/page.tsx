"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Client {
    firstname: string;
    lastname: string;
    dob: string;
    id: number;
    [key: string]: any; // Add other fields as needed
}

const ClientsPage = () => {
    const [clients, setClients] = useState<Client[]>([]); // Typed state
    const router = useRouter();

    const handleAddClientClick = () => {
        router.push("/dashboard/clients/addClient");
    };

    const handleView = (id: number) => {
        if (!id) {
            console.error("No client ID available for viewing");
            return;
        }

        //console.log("View client with ID:", id);
        router.push(`/dashboard/clients/viewClient?id=${id}`);
    };

    const handleEdit = (id: number) => {
        if (!id) {
            console.error("No client ID available for editing");
            return;
        }

        //console.log("Edit client with ID:", id);
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

    return (
        <>
            <div className="flex flex-col items-center">
                <h1>Client Portal</h1>
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
                {/* Add search functionality here */}
            </div>
            <div id="displayClients" className="flex flex-col items-center">
                {clients.length > 0 ? (
                    clients.map((client, index) => (
                        <div
                            key={client.id}
                            className="flex flex-row border p-3 m-2 w-[600px] space-x-4 items-center"
                        >
                            <div className="flex-grow">
                                <p>
                                    <strong>Name:</strong> {client.firstname} {client.middlename} {client.lastname}
                                </p>
                                <p>
                                    <strong>DOB:</strong> {client.dob ? new Date(client.dob).toLocaleDateString("en-US", {
                                        month: "2-digit",
                                        day: "2-digit",
                                        year: "numeric",
                                    }) : "N/A"}
                                </p>

                                <p>
                                    <strong>County</strong> {client.countyofresidence }
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
        </>
    );
};

export default ClientsPage;