"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface Client {
    id: number;
    firstname: string;
    middlename?: string;
    lastname: string;
    dob: string;
    raceethnicidentity: string;
    servicelanguage: string;
    countryoforigin: string;
    gender: string;
    sexualorientation: string;
    age: string;
    educationlevel: string;
    countyofresidence: string;
    datetimestamp: string;
    createdby: string;
    [key: string]: any;
}

const ClientDetails = () => {
    const searchParams = useSearchParams();
    const [client, setClient] = useState<Client | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchClientDetails = async (id: number) => {
        try {
            const response = await fetch(`/api/Clients?id=${id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch client details: ${response.statusText}`);
            }
            const data = await response.json();
            setClient(data);
        } catch (err) {
            console.error(err);
            setError("Error fetching client details.");
        }
    };

    useEffect(() => {
        if (!searchParams) {
            setError("No search parameters available.");
            return;
        }

        const idParam = searchParams.get("id");
        if (idParam) {
            const clientId = parseInt(idParam, 10);
            if (!isNaN(clientId)) {
                fetchClientDetails(clientId);
            } else {
                setError("Invalid client ID.");
            }
        } else {
            setError("Client ID not found in URL.");
        }
    }, [searchParams]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!client) {
        return <p>Loading client details...</p>;
    }

    return (
        <div id="ClientDetailsDiv" className="flex flex-col items-center">
            <h1 className="text-4xl mb-4">Client Details</h1>
            <div id="ClientInfo" className="flex flex-col items-center">
                <p>
                    <strong>Name:</strong> {client.firstname} {client.middlename} {client.lastname}
                </p>
                <p>
                    <strong>Date of Birth:</strong> {new Date(client.dob).toLocaleDateString("en-US")}
                </p>
                <p>
                    <strong>Race/Ethnic Identity:</strong> {client.raceethnicidentity}
                </p>
                <p>
                    <strong>Service Language:</strong> {client.servicelanguage}
                </p>
                <p>
                    <strong>Country of Origin:</strong> {client.countryoforigin}
                </p>
                <p>
                    <strong>Gender:</strong> {client.gender}
                </p>
                <p>
                    <strong>Sexual Orientation:</strong> {client.sexualorientation}
                </p>
                <p>
                    <strong>Age:</strong> {client.age}
                </p>
                <p>
                    <strong>Education Level:</strong> {client.educationlevel}
                </p>
                <p>
                    <strong>County of Residence:</strong> {client.countyofresidence}
                </p>
                <p>
                    <strong>Created By:</strong> {client.createdby}
                </p>
                <p>
                    <strong>Date Created:</strong>{" "}
                    {new Date(client.datetimestamp).toLocaleString("en-US")}
                </p>
            </div>
        </div>
    );
};

const ViewClientPage = () => {
    return (
        <Suspense fallback={<p>Loading search parameters...</p>}>
            <ClientDetails />
        </Suspense>
    );
};

export default ViewClientPage;
