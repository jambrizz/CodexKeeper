"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Process {
    id: number;
    clientid: number;
    clientcasenumber: string;
    contractyear: string;
    processtype: string;
    tier: string;
    staffdropoff: string;
    dateofdropoff: string;
    dataentryassignment: string | null;
    dataentrycompletion: string | null;
    staffpickup: string | null;
    dateofpickup: string | null;
    granteligibility: string;
    householdsize: number | null;
    income: number | null;
    translations: number | null;
    additionalforms: string | null;
    casenotes: string | null;
    grantreferenceno: string | null;
    reported: string | null;
    datetimestamp: string;
    createdby: string;
    firstname: string | null;
    middlename: string | null;
    lastname: string | null;
    dob: string | null;
    gender: string | null;
    servicelanguage: string | null;
    countyofresidence: string | null;
    [key: string]: any;
}

const safeDisplay = (value: any) => {
    if (value == null || value === "") {
        return "None";
    }
    return value;
};

const ProcessDetails = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [process, setProcess] = useState<Process | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchProcessDetails = async (id: number) => {
        try {
            const response = await fetch(`/api/Process?id=${id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch process details: ${response.statusText}`);
            }
            const data = await response.json();
            setProcess(data);
        } catch (err) {
            console.error(err);
            setError("Error fetching process details.");
        }
    };

    useEffect(() => {
        if (!searchParams) {
            setError("No search parameters available.");
            return;
        }

        const idParam = searchParams.get("id");
        if (idParam) {
            const processId = parseInt(idParam, 10);
            if (!isNaN(processId)) {
                fetchProcessDetails(processId);
            } else {
                setError("Invalid process ID.");
            }
        } else {
            setError("Process ID not found in URL.");
        }
    }, [searchParams]);

    const handleBackClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        router.push("/dashboard/processes");
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!process) {
        return <p>Loading process details...</p>;
    }

    return (
        <div id="ProcessDetailsDiv" className="flex flex-col items-center p-4">
            <h1 className="text-4xl mb-4">Process Details</h1>
            <div id="ProcessInfo" className="flex flex-col items-center">
                <div id="clientDetails" className="flex flex-col items-center m-5">
                    <h3 className="text-2xl mb-2">Client Details</h3>
                    <p><strong>First Name:</strong> {safeDisplay(process.firstname)}</p>
                    <p><strong>Middle Name:</strong> {safeDisplay(process.middlename)}</p>
                    <p><strong>Last Name:</strong> {safeDisplay(process.lastname)}</p>
                    <p><strong>Date of Birth:</strong> {process.dob ? new Date(process.dob).toLocaleDateString("en-US") : "None"}</p>
                    <p><strong>Gender:</strong> {safeDisplay(process.gender)}</p>
                    <p><strong>Service Language:</strong> {safeDisplay(process.servicelanguage)}</p>
                    <p><strong>County of Residence:</strong> {safeDisplay(process.countyofresidence)}</p>
                </div>
                <div id="processDetails" className="flex flex-col items-center m-5">
                    <h3 className="text-2xl mb-2">Case Details</h3>
                    <p><strong>Client Case Number:</strong> {safeDisplay(process.clientcasenumber)}</p>
                    <p><strong>Contract Year:</strong> {safeDisplay(process.contractyear)}</p>
                    <p><strong>Process Type:</strong> {safeDisplay(process.processtype)}</p>
                    <p><strong>Tier:</strong> {safeDisplay(process.tier)}</p>
                    <p><strong>Staff Dropoff:</strong> {safeDisplay(process.staffdropoff)}</p>
                    <p><strong>Date of Dropoff:</strong> {process.dateofdropoff ? new Date(process.dateofdropoff).toLocaleDateString("en-US") : "None"}</p>
                    <p><strong>Data Entry Assignment:</strong> {safeDisplay(process.dataentryassignment)}</p>
                    <p><strong>Data Entry Completion:</strong> {process.dataentrycompletion ? new Date(process.dataentrycompletion).toLocaleDateString("en-US") : "None"}</p>
                    <p><strong>Staff Pickup:</strong> {safeDisplay(process.staffpickup)}</p>
                    <p><strong>Date of Pickup:</strong> {process.dateofpickup ? new Date(process.dateofpickup).toLocaleDateString("en-US") : "None"}</p>
                    <p><strong>Grant Eligibility:</strong> {safeDisplay(process.granteligibility)}</p>
                    <p><strong>Household Size:</strong> {process.householdsize == null ? "None" : process.householdsize}</p>
                    <p><strong>Income:</strong> {process.income == null ? "None" : process.income}</p>
                    <p><strong>Translations:</strong> {process.translations == null ? "None" : process.translations}</p>
                    <p><strong>Additional Forms:</strong> {safeDisplay(process.additionalforms)}</p>
                    <p><strong>Case Notes:</strong> {safeDisplay(process.casenotes)}</p>
                    <p><strong>Grant Reference Number:</strong> {safeDisplay(process.grantreferenceno)}</p>
                    <p><strong>Reported:</strong> {safeDisplay(process.reported)}</p>
                    <p><strong>Date Timestamp:</strong> {process.datetimestamp ? new Date(process.datetimestamp).toLocaleDateString("en-US") : "None"}</p>
                    <p><strong>Created By:</strong> {safeDisplay(process.createdby)}</p>
                </div>
            </div>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                onClick={handleBackClick}
            >
                Back to Processes
            </button>
        </div>
    );
};

const ViewProcess = () => {
    return (
        <Suspense fallback={<p>Loading search parameters...</p>}>
            <ProcessDetails />
        </Suspense>
    );
};

export default ViewProcess;