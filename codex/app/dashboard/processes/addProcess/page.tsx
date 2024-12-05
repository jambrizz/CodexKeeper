"use client";

import React, { useState, useEffect } from 'react';
import { processes } from '@/app/demo/processes';
import { tiers } from '@/app/demo/tiers';

const fieldDisplayNames: { [key: string]: string } = {
    ClientName: "Client Name",
    CaseNumber: "Case Number",
    ContractYear: "DSS Contract Year",
    ProcessType: "Process Type",
    Tier: "Tier Level",
    StaffDropOff: "Staff Member who did Drop Off",
    DateOfDropOff: "Date Case Dropped Off",
    DataEntryAssignment: "Staff Member Assigned for Data Entry",
    DataEntryCompletion: "Data Entry Completion",
    StaffPickUp: "Staff Member who did Pick Up",
    DateOfPickUp: "Date of Pick Up",
    GrantEligibility: "Grant Eligibility",
    HouseholdSize: "Household Size",
    Income: "Client Income",
    Translations: "Translations Completed",
    AdditionalForms: "Additional Forms",
    CaseNotes: "Case Notes",
    GrantReferrenceNo: "Grant Reference No.",
    Reported: "Reported to DSS"
};

// Define the type of processData explicitly
type ProcessData = {
    ClientName: string;
    CaseNumber: string;
    ContractYear: string;
    ProcessType: string;
    Tier: string;
    StaffDropOff: string;
    DateOfDropOff: string;
    DataEntryAssignment: string;
    DataEntryCompletion: string;
    StaffPickUp: string;
    DateOfPickUp: string;
    GrantEligibility: string;
    HouseholdSize: string;
    Income: string;
    Translations: string[];
    AdditionalForms: string[];
    CaseNotes: string;
    GrantReferrenceNo: string;
    Reported: string;
};

const AddProcessPage = () => {
    const [processData, setProcessData] = useState<ProcessData>({
        ClientName: "",
        CaseNumber: "",
        ContractYear: "",
        ProcessType: "",
        Tier: "",
        StaffDropOff: "",
        DateOfDropOff: "",
        DataEntryAssignment: "",
        DataEntryCompletion: "",
        StaffPickUp: "",
        DateOfPickUp: "",
        GrantEligibility: "",
        HouseholdSize: "",
        Income: "",
        Translations: [],
        AdditionalForms: [],
        CaseNotes: "",
        GrantReferrenceNo: "",
        Reported: "false",
    });

    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            // Fetch clients here
        };

        const fetchUsers = async () => {
            // Fetch users here
        };

        fetchClients();
        fetchUsers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProcessData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ProcessData) => {
        const { value, checked } = e.target;
        setProcessData(prev => ({
            ...prev,
            [fieldName]: checked
                ? [...(prev[fieldName] as string[]), value] // Add to array if checked
                : (prev[fieldName] as string[]).filter((item) => item !== value) // Remove if unchecked
        }));
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl mb-4">Add Process</h1>
            <form className="flex flex-col items-start">
                {Object.keys(processData).map((field) => (
                    <div key={field} className="flex flex-col items-start mb-4">
                        <label className="font-semibold mb-2">
                            {fieldDisplayNames[field] || field}
                        </label>
                        {field === "ClientName" ? (
                            <select
                                name={field}
                                className="border border-gray-400 rounded p-2 w-64"
                                onChange={handleInputChange}
                                defaultValue=""
                                required
                            >
                                <option value="" disabled>
                                    Select {fieldDisplayNames[field]}
                                </option>
                            </select>
                        ) : field === "AdditionalForms" ? (
                            <div className="flex flex-col">
                                {["N-648", "I-912", "I-290B"].map((form) => (
                                    <label key={form} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            value={form}
                                            checked={(processData.AdditionalForms as string[]).includes(form)}
                                            onChange={(e) => handleCheckboxChange(e, "AdditionalForms")}
                                        />
                                        <span>{form}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <input
                                type="text"
                                name={field}
                                placeholder={fieldDisplayNames[field]}
                                className="border border-gray-400 rounded p-2 w-64"
                                onChange={handleInputChange}
                                required
                            />
                        )}
                    </div>
                ))}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddProcessPage;
