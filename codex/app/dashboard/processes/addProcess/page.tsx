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
        AdditionalForms: [],
        CaseNotes: "",
        GrantReferrenceNo: "",
        Reported: "false",
    });

    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        /*
        // Fetch clients from the database
        const fetchClients = async () => {
            const response = await fetch('/api/clients'); // Adjust API endpoint as needed
            const data = await response.json();
            setClients(data.map(client => ({
                value: client.id,
                label: `${client.firstname} ${client.middlename || ''} ${client.lastname}`.trim()
            })));
        };
        */
        // Fetch users from the database
        const fetchUsers = async () => {
            const response = await fetch('/api/users'); // Adjust API endpoint as needed
            const data = await response.json();
            setUsers(data.map(user => ({
                value: user.id,
                label: `${user.firstname} ${user.lastname}`
            })));
        };

        //fetchClients();
        fetchUsers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProcessData(prev => ({ ...prev, [name]: value }));
    };

    const handleMultipleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, fieldName: string) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setProcessData(prev => ({ ...prev, [fieldName]: selectedOptions }));
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
                        ) : field === 'ProcessType' ? (
                            <select
                                name={field}
                                className="border border-gray-400 rounded p-2 w-64"
                                onChange={handleInputChange}
                                defaultValue=""
                                required
                            >
                                <option value="" disabled>Select {fieldDisplayNames[field]}</option>
                                {processes.map(process => (
                                    <option key={process} value={process}>
                                        {process}
                                    </option>
                                ))}
                            </select>
                        ) : field === 'Tier' ? (
                            <select
                                name={field}
                                className="border border-gray-400 rounded p-2 w-64"
                                onChange={handleInputChange}
                                defaultValue=""
                                required
                            >
                                <option value="" disabled>Select {fieldDisplayNames[field]}</option>
                                {tiers.map(tier => (
                                    <option key={tier} value={tier}>
                                        {tier}
                                    </option>
                                ))}
                            </select>
                        ) : ['StaffDropOff', 'DataEntryAssignment', 'StaffPickUp'].includes(field) ? (
                            <select
                                name={field}
                                className="border border-gray-400 rounded p-2 w-64"
                                onChange={handleInputChange}
                                defaultValue=""
                                required
                            >
                                <option value="" disabled>Select {fieldDisplayNames[field]}</option>
                                {users.map(user => (
                                    <option key={user.value} value={user.value}>
                                        {user.label}
                                    </option>
                                ))}
                            </select>
                        ) : ['DateOfDropOff', 'DateEntryCompletion', 'DateOfPickUp'].includes(field) ? (
                            <input
                                type="date"
                                name={field}
                                className="border border-gray-400 rounded p-2 w-64"
                                onChange={handleInputChange}
                                required
                            />
                        ) : field === 'GrantEligibility' ? (
                            <select
                                name={field}
                                className="border border-gray-400 rounded p-2 w-64"
                                onChange={handleInputChange}
                                defaultValue=""
                                required
                            >
                                <option value="" disabled>Select {fieldDisplayNames[field]}</option>
                                {['Medical', 'SSI', 'CalFresh'].map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : ['HouseholdSize', 'Translations'].includes(field) ? (
                            <select
                                name={field}
                                className="border border-gray-400 rounded p-2 w-64"
                                onChange={handleInputChange}
                                defaultValue=""
                                required
                            >
                                <option value="" disabled>Select {fieldDisplayNames[field]}</option>
                                {[...Array(21).keys()].map(number => (
                                    <option key={number} value={number}>
                                        {number}
                                    </option>
                                ))}
                            </select>
                        ) : field === 'AdditionalForms' ? (
                            <select
                                name={field}
                                className="border border-gray-400 rounded p-2 w-64"
                                onChange={(e) => handleMultipleSelectChange(e, field)}
                                multiple
                                required
                            >
                                {['N-648', 'I-912', 'I-290B'].map(form => (
                                    <option key={form} value={form}>
                                        {form}
                                    </option>
                                ))}
                            </select>
                        ) : field === 'CaseNotes' ? (
                            <textarea
                                name={field}
                                className="border border-gray-400 rounded p-2 w-64"
                                onChange={handleInputChange}
                                placeholder={fieldDisplayNames[field]}
                                rows={4}
                            />
                        ) : field === 'Reported' ? (
                            <div className="flex gap-4">
                                <label>
                                    <input
                                        type="radio"
                                        name={field}
                                        value="true"
                                        checked={processData.Reported === "true"}
                                        onChange={handleInputChange}
                                    />
                                    True
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name={field}
                                        value="false"
                                        checked={processData.Reported === "false"}
                                        onChange={handleInputChange}
                                    />
                                    False
                                </label>
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
