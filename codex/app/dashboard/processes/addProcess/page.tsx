/*
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

const AddProcessPage = () => {
    const [processData, setProcessData] = useState({
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
        AdditionalForms: [], // Changed to store an array
        CaseNotes: "",
        GrantReferrenceNo: "",
        Reported: "false",
    });

    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch clients and users (similar to original)
        const fetchClients = async () => {
            const response = await fetch('/api/clients');
            const data = await response.json();
            setClients(data.map(client => ({
                value: client.id,
                label: `${client.firstname} ${client.middlename || ''} ${client.lastname}`.trim()
            })));
        };

        const fetchUsers = async () => {
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data.map(user => ({
                value: user.id,
                label: `${user.firstname} ${user.lastname}`
            })));
        };

        fetchClients();
        fetchUsers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProcessData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const { value, checked } = e.target;
        setProcessData(prev => ({
            ...prev,
            [fieldName]: checked
                ? [...prev[fieldName], value] // Add to array if checked
                : prev[fieldName].filter((item: string) => item !== value) // Remove if unchecked
        }));
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl mb-4">Add Process</h1>
            <form className="flex flex-col items-start">
                {Object.keys(processData).map(field => (
                    <div key={field} className="flex flex-col items-start mb-4">
                        <label className="font-semibold mb-2">
                            {fieldDisplayNames[field] || field}
                        </label>
                        {field === 'ClientName' ? (
                            <select
                                name={field}
                                className="border border-gray-400 rounded p-2 w-64"
                                onChange={handleInputChange}
                                defaultValue=""
                                required
                            >
                                <option value="" disabled>Select {fieldDisplayNames[field]}</option>
                                {clients.map(client => (
                                    <option key={client.value} value={client.value}>
                                        {client.label}
                                    </option>
                                ))}
                            </select>
                        ) : field === 'AdditionalForms' ? (
                            <div className="flex flex-col">
                                {['N-648', 'I-912', 'I-290B'].map(form => (
                                    <label key={form} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            value={form}
                                            checked={processData.AdditionalForms.includes(form)}
                                            onChange={(e) => handleCheckboxChange(e, field)}
                                        />
                                        <span>{form}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            // Other fields remain the same
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
*/