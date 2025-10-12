"use client"
//updateProcess Page

import React, { useState, useEffect, Suspense } from "react";
import { processSchema } from "@/app/model/processValidation";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { processes } from "@/app/demo/processes";
import { users } from "@/app/demo/users";
import { eligibility } from "@/app/demo/eligibility";
import { additionalForms } from "@/app/demo/tiers";

interface Client {
    firstname: string;
    middlename: string;
    lastname: string;
    id: number;
    dob: string;
}


const fieldDisplayNames: { [key: string]: string } = {
    clientid: "Client",
    clientcasenumber: "Client Case Number",
    contractyear: "Contract Year",
    processtype: "Process Type",
    staffdropoff: "Staff who picked up Client's Process",
    dateofdropoff: "Date client Dropped Off Process",
    dataentryassignment: "Staff Assigned for Data Entry",
    dataentrycompletion: "Data Entry Completed On",
    staffpickup: "Staff who turned in Client's Process",
    dateofpickup: "Date client signed for Process",
    granteligibility: "Grant Eligibility",
    householdsize: "Household Size",
    income: "Client Income",
    translations: "Translations Completed",
    additionalforms: "Additional Forms",
    casenotes: "Case Notes",
    grantreferenceno: "Grant Reference Number",
    reported: "Reported to DSS",
}

const UpdateProcessComponent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const processID = searchParams?.get("id") || null; 
    const datetimeStamp = searchParams?.get("datetimeStamp") || null;
    const createdBy = searchParams?.get("createdBy") || null;

    const [clients, setClients] = useState<Client[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        clientid: "",
        clientcasenumber: "",
        contractyear: "",
        processtype: "",
        tier: "",
        staffdropoff: "",
        dateofdropoff: "",
        dataentryassignment: "",
        dataentrycompletion: "",
        staffpickup: "",
        dateofpickup: "",
        granteligibility: "",
        householdsize: "",
        income: "",
        translations: "",
        additionalforms: "",
        casenotes: "",
        grantreferenceno: "",
        reported: "",
        datetimestamp: "",
        createdby: "",
        firstname: "",
        middlename: "",
        lastname: "",
        dob: "",
        raceethnicidentity: "",
        servicelanguage: "",
        countryoforigin: "",
        gender: "",
        sexualorientation: "",
        age: "",
        educationlevel: "",
        countyofresidence: ""
    });

    console.log("Form data:", formData);

    //Fetch the process data by ID
    useEffect(() => {
        if (!processID) return;
        const fetchProcess = async () => {
            try {
                const response = await fetch(`/api/Process?id=${processID}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch process");
                }
                const data = await response.json();
                const { dateofdropoff, ...visibleData } = data;
                // Fill formData with fetched record
                //setFormData((prev) => ({ ...prev, ...data }));

                const formattedDODO = dateofdropoff ? new Date(dateofdropoff).toISOString().split('T')[0] : '';
                setFormData({ ...visibleData, dateofdropoff: formattedDODO, })
            } catch (error) {
                console.error("Error fetching process", error);
            }
        };
        fetchProcess();
    }, [processID]);

    //Fetch clients for dropdown
    useEffect(() => {
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
                setClients(clientsData);
            } catch (error) {
                console.error("Error fetching clients", error);
            }
        };
        getAllClients();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onInputChangeDate = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: (name === "dataentrycompletion" || name === "dateofpickup")
                ? (value === "" ? null : value)
                : value,
        }));
    };

    const onInputChangeNum = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]:
                name === "clientid" ? Number(value) :
                    name === "income" ? Number(value) :
                        name === "householdsize" ? Number(value) :
                            name === "translations" ? Number(value) : value,
        }));
    };

    const handleBackClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        router.push("/dashboard/processes");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Form data:", formData);
        /*
        try {
            const parsedData = processSchema.parse(formData);
            const response = await fetch("/api/Process", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...parsedData, processID
                    }),
            });
            if (!response.ok) throw new Error(`Failed to update process: ${response.statusText}`);
            setSuccessMessage("Process updated successfully!");
            setTimeout(() => router.push("/dashboard/processes"), 2000);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.issues.map(
                    (issue) => `Field "${issue.path.join(".")}": ${issue.message}`
                );
                alert(`Validation failed:\n\n${errorMessages.join("\n")}`);
            } else {
                alert("An error occurred during submission.");
            }
        }
        */
    };

    return (
        <>
            <div className="flex flex-col items-center">
                <h1 className="mb-4 text-4xl">Update Process</h1>
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    { /* client name */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Client Name</label>
                        {clients.length > 0 ? (
                            <select
                                name="clientid"
                                className="w-64 rounded border border-gray-400 p-2"
                                onChange={onInputChangeNum} // Use the renamed function
                                value={formData.clientid} // Ensure this matches the correct value type
                                required
                            >
                                <option value="" disabled>Select Client</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.firstname} {client.middlename || ""} {client.lastname} 
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p>No clients available</p>
                        )}
                    </div>


                    { /* client case number */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Client Case Number</label>
                        <input
                            type="number"
                            name="clientcasenumber"
                            className="w-64 rounded border border-gray-400 p-2"
                            onChange={handleInputChange}
                            value={formData.clientcasenumber}
                            required
                        />
                    </div>

                    { /* contract year */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Contract Year</label>
                        <input
                            type="text"
                            name="contractyear"
                            className="w-64 rounded border border-gray-400 p-2"
                            onChange={handleInputChange}
                            value={formData.contractyear}
                            required
                        />
                    </div>

                    { /* process type */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Process Type</label>
                        <select
                            name="processtype"
                            className="w-64 rounded border border-gray-400 p-2"
                            onChange={handleInputChange}
                            value={formData.processtype}
                            required
                        >
                            <option value="" disabled>Select Process Type</option>
                            {processes.map((process) => (
                                <option key={process} value={process}>
                                    {process}
                                </option>
                            ))}
                        </select>
                    </div>

                    { /* staff drop off */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Staff Drop Off</label>
                        <select
                            name="staffdropoff"
                            className="w-64 rounded border border-gray-400 p-2"
                            onChange={handleInputChange}
                            value={formData.staffdropoff}
                            required
                        >
                            <option value="" disabled>Select Staff Drop Off</option>
                            {users.map((user) => (
                                <option key={user} value={user}>
                                    {user}
                                </option>
                            ))}
                        </select>
                    </div>

                    { /* date of drop off */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Date of Drop Off</label>
                        <input
                            type="date"
                            name="dateofdropoff"
                            className="w-64 rounded border border-gray-400 p-2"
                            onChange={handleInputChange}
                            value={formData.dateofdropoff || ""}
                            required
                        />
                    </div>

                    { /* data entry assignment */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Data Entry Assignment</label>
                        <select
                            name="dataentryassignment"
                            className="w-64 rounded border border-gray-400 p-2"
                            onChange={handleInputChange}
                            value={formData.dataentryassignment}
                        >
                            <option value="" disabled>Select Data Entry Assignment</option>
                            {users.map((user) => (
                                <option key={user} value={user}>
                                    {user}
                                </option>
                            ))}
                        </select>
                    </div>

                    { /* data entry completion */}
                    <input
                        type="date"
                        name="dataentrycompletion"
                        className="w-64 rounded border border-gray-400 p-2"
                        onChange={onInputChangeDate}
                        value={formData.dataentrycompletion ?? ""} // Convert null to empty string for display
                    />


                    { /* staff pick up */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Staff Pick Up</label>
                        <select
                            name="staffpickup"
                            className="w-64 rounded border border-gray-400 p-2"
                            onChange={handleInputChange}
                            value={formData.staffpickup}
                        >
                            <option value="" disabled>Select Staff Pick Up</option>
                            {users.map((user) => (
                                <option key={user} value={user}>
                                    {user}
                                </option>
                            ))}
                        </select>
                    </div>

                    { /* date of pick up */}
                    <input
                        type="date"
                        name="dateofpickup"
                        className="w-64 rounded border border-gray-400 p-2"
                        onChange={onInputChangeDate}
                        value={formData.dateofpickup ?? ""} // Convert null to empty string for display
                    />


                    { /* grant eligibility */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Grant Eligibility</label>
                        <select
                            name="granteligibility"
                            className="w-64 rounded border border-gray-400 p-2"
                            onChange={handleInputChange}
                            value={formData.granteligibility}
                        >
                            <option value="" disabled>Select Grant Eligibility</option>
                            {eligibility.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    { /* household size */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Household Size</label>
                        <select
                            name="householdsize"
                            className="w-64 rounded border border-gray-400 p-2"
                            onChange={onInputChangeNum} // use onInputChange to handle the event
                            value={Number(formData.householdsize)} // Ensure value is treated as a number
                        >
                            <option value="">Select Household Size</option>
                            {[...Array(10).keys()].map((num) => (
                                <option key={num + 1} value={num + 1}>
                                    {num + 1}
                                </option>
                            ))}
                        </select>
                    </div>


                    { /* income */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Client Income</label>
                        <input
                            type="number"
                            name="income"
                            className="w-64 rounded border border-gray-400 p-2"
                            onChange={onInputChangeNum} // use onInputChange to handle the event
                            value={formData.income} // Display the value from formData
                        />
                    </div>

                    { /* translations */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Translations</label>
                        <input
                            type="number"
                            name="translations"
                            className="w-64 rounded border border-gray-400 p-2"
                            onChange={onInputChangeNum} // use onInputChange to handle the event
                            value={formData.translations} // Display the value from formData
                        />
                    </div>


                    { /* additional forms */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Additional Forms</label>
                        <select
                            name="additionalforms"
                            className="w-64 rounded border border-gray-400 p-2"
                            onChange={handleInputChange}
                            value={formData.additionalforms}
                        >
                            <option value="" disabled>Select Additional Forms</option>
                            {additionalForms.map((form) => (
                                <option key={form} value={form}>
                                    {form}
                                </option>
                            ))}
                        </select>
                    </div>

                    { /* case notes */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Case Notes</label>
                        <textarea
                            name="casenotes"
                            className="w-64 rounded border border-gray-400 p-2"
                            onChange={handleInputChange}
                            value={formData.casenotes}
                        />
                    </div>

                    { /* grant reference number */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Grant Reference Number</label>
                        <input
                            type="text"
                            name="grantreferenceno"
                            className="w-64 rounded border border-gray-400 p-2"
                            onChange={handleInputChange}
                            value={formData.grantreferenceno}
                        />
                    </div>

                    { /* reported */}
                    <div className="mb-2 flex flex-col items-start">
                        <label className="mb-1 font-semibold">Reported</label>
                        <select
                            name="reported"
                            className="w-64 rounded border border-gray-400 p-2"
                            onChange={handleInputChange}
                            value={formData.reported}
                        >
                            <option value="">Select Reported</option>
                            <option value="false">false</option>
                            <option value="true">true</option>
                        </select>
                    </div>
                    <div className="m-3 flex flex-row gap-4">
                        <button
                            type="submit"
                            className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                        >
                            Submit
                        </button>
                        <button
                            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
                            onClick={handleBackClick}
                        >
                            Back to Processes
                        </button>
                    </div>
                </form>
                {successMessage && (
                    <div className="mt-4 text-center">
                        <p className="font-bold text-green-500">{successMessage}</p>
                    </div>
                )}
            </div>
        </>
    )

}

export default UpdateProcessComponent;