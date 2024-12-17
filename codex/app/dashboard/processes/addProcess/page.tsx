"use client";

import React, { useState, useEffect } from "react";
import { processSchema } from "@/app/model/processValidation";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
    //[key: string]: any; // Add other fields as needed
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
};

const AddProcess: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]); // Typed state

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
        datetimestamp: new Date().toISOString(),
        createdby: "Jovani Ambriz",
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleBackClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        router.push("/dashboard/processes");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();    


        const setTier = (processtype: string): void => {
            const process = formData.processtype;

            if (
                process === "Legal Consultation" ||
                process === "App. For Perm. Res. Card" ||
                process === "RFE" ||
                process === "NOID" ||
                process === "Initial Application" ||
                process === "Renewal Application"
            ) {
                formData.tier = "Tier 1";
            } else if (
                process === "Naturalization Certificate" ||
                process === "Citizenship Certificate" ||
                process === "FOIA Request" ||
                process === "Criminal Record Reeview" ||
                process === "Refugee Relative" ||
                process === "Asylee Relative"
            ) {
                formData.tier = "Tier 2";
            } else if (
                process === "Application for Certificate of Naturalization" ||
                process === "Legal Rep. at USCIS Interview"
            ) {
                formData.tier = "Tier 3";
            } else if (
                process === "DACA" ||
                process === "Naturalization" ||
                process === "Removal of Conditions" ||
                process === "Advance Parole" ||
                process === "Parole in Place" ||
                process === "Humanitarian Parole" ||
                process === "TPS w/ EAD" ||
                process === "Petition by US Citizen" ||
                process === "Petition by LPR in CA"
            ) {
                formData.tier = "Tier 4";
            } else if (
                process === "DACA w/ Criminal History" ||
                process === "DACA w/ appeal(s)" ||
                process === "Natz w/ Criminal History" ||
                process === "Natz w/ Appeal(s)" ||
                process === "Natz w/ Medical Waiver"
            ) {
                formData.tier = "Tier 5";
            } else if (
                process === "Asylum" ||
                process === "U-VISA" ||
                process === "T-VISA" ||
                process === "VAWA" ||
                process === "SIJS" ||
                process === "AOS" ||
                process === "One-Step AOS" ||
                process === "Provisional Unlawful"
            ) {
                formData.tier = "Tier 6";
            }
        };

        // Set the tier when the form is submitted based on selected process type
        setTier(formData.processtype);
        console.log(formData);
        
        try {
            const parsedData = processSchema.parse(formData);
            const response = await fetch("/api/Process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsedData),
            });
            if (!response.ok) {
                throw new Error(`Failed to submit process: ${response.statusText}`);
            }
            setSuccessMessage("Process added successfully!");
            setTimeout(() => router.push("/dashboard/processes"), 2000);
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Map through the issues and construct a detailed message
                const errorMessages = error.issues.map(
                    (issue) => `Field "${issue.path.join(".")}": ${issue.message}`
                );
                alert(`Validation failed. Please review your inputs:\n\n${errorMessages.join("\n")}`);
            } else {
                alert("An error occurred during submission.");
            }
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
            //console.log("Fetched clients from API", clientsData);
            setClients(clientsData);
        } catch (error) {
            console.error("Error fetching clients", error);
        }
    };

    const onInputChangeDate = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: (name === "dataentrycompletion" || name === "dateofpickup")
                ? (value === "" ? null : value)
                : value,
        }));
    };

    const onInputChangeNum = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]:
                name === "clientid" ? Number(value) : // Convert to number if 'clientid'
                    name === "income" ? Number(value) : // Convert to float if 'income'
                        name === "householdsize" ? Number(value) : // Convert to number if 'householdsize'
                            name === "translations" ? Number(value) : // Convert to number if 'translations'
                                value, // Default to string for other fields
        }));
    };

    useEffect(() => {
        getAllClients();
    }, []);  

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl mb-4">Add Process</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                { /* client name */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Client Name</label>
                    {clients.length > 0 ? (
                        <select
                            name="clientid"
                            className="border border-gray-400 rounded p-2 w-64"
                            onChange={onInputChangeNum} // Use the renamed function
                            value={formData.clientid} // Ensure this matches the correct value type
                            required
                        >
                            <option value="" disabled>Select Client</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.firstname} {client.middlename || ""} {client.lastname} {new Date(client.dob).toLocaleDateString("en-US")}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p>No clients available</p>
                    )}
                </div>


                { /* client case number */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Client Case Number</label>
                    <input
                        type="number"
                        name="clientcasenumber"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.clientcasenumber}
                        required
                    />
                </div>

                { /* contract year */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Contract Year</label>
                    <input
                        type="text"
                        name="contractyear"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.contractyear}
                        required
                    />
                </div>

                { /* process type */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Process Type</label>
                    <select
                        name="processtype"
                        className="border border-gray-400 rounded p-2 w-64"
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
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Staff Drop Off</label>
                    <select
                        name="staffdropoff"
                        className="border border-gray-400 rounded p-2 w-64"
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
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Date of Drop Off</label>
                    <input
                        type="date"
                        name="dateofdropoff"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.dateofdropoff}
                        required
                    />
                </div>

                { /* data entry assignment */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Data Entry Assignment</label>
                    <select
                        name="dataentryassignment"
                        className="border border-gray-400 rounded p-2 w-64"
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
                    className="border border-gray-400 rounded p-2 w-64"
                    onChange={onInputChangeDate}
                    value={formData.dataentrycompletion ?? ""} // Convert null to empty string for display
                />


                { /* staff pick up */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Staff Pick Up</label>
                    <select
                        name="staffpickup"
                        className="border border-gray-400 rounded p-2 w-64"
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
                    className="border border-gray-400 rounded p-2 w-64"
                    onChange={onInputChangeDate}
                    value={formData.dateofpickup ?? ""} // Convert null to empty string for display
                />


                { /* grant eligibility */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Grant Eligibility</label>
                    <select
                        name="granteligibility"
                        className="border border-gray-400 rounded p-2 w-64"
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
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Household Size</label>
                    <select
                        name="householdsize"
                        className="border border-gray-400 rounded p-2 w-64"
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
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Client Income</label>
                    <input
                        type="number"
                        name="income"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={onInputChangeNum} // use onInputChange to handle the event
                        value={formData.income} // Display the value from formData
                    />
                </div>

                { /* translations */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Translations</label>
                    <input
                        type="number"
                        name="translations"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={onInputChangeNum} // use onInputChange to handle the event
                        value={formData.translations} // Display the value from formData
                    />
                </div>


                { /* additional forms */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Additional Forms</label>
                    <select
                        name="additionalforms"
                        className="border border-gray-400 rounded p-2 w-64"
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
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Case Notes</label>
                    <textarea
                        name="casenotes"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.casenotes}
                    />
                </div>

                { /* grant reference number */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Grant Reference Number</label>
                    <input
                        type="text"
                        name="grantreferenceno"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.grantreferenceno}
                    />
                </div>

                { /* reported */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Reported</label>
                    <select
                        name="reported"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.reported}
                    >
                        <option value="">Select Reported</option>
                        <option value="false">false</option>
                        <option value="true">true</option>
                    </select>
                </div>
                <div className="flex flex-row m-3 gap-4">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                        Submit
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                        onClick={handleBackClick}
                    >
                        Back to Processes
                    </button>
                </div>
            </form>
            {successMessage && (
                <div className="mt-4 text-center">
                    <p className="text-green-500 font-bold">{successMessage}</p>
                </div>
            )}
        </div>
    );
};

export default AddProcess;