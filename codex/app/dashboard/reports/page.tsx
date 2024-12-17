"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { processes as processList } from "@/app/demo/processes";

const clientColumns = [
    { name: "firstname", label: "First Name" },
    { name: "middlename", label: "Middle Name" },
    { name: "lastname", label: "Last Name" },
    { name: "dob", label: "Date of Birth" },
    { name: "raceethnicidentity", label: "Race/Ethnic Identity" },
    { name: "servicelanguage", label: "Service Language" },
    { name: "countryoforigin", label: "Country of Origin" },
    { name: "gender", label: "Gender" },
    { name: "sexualorientation", label: "Sexual Orientation" },
    { name: "age", label: "Age" },
    { name: "educationlevel", label: "Education Level" },
    { name: "countyofresidence", label: "County of Residence" },
    { name: "datetimestamp", label: "Client Date Timestamp" },
    { name: "createdby", label: "Client Created By" },
];

const processColumns = [
    { name: "clientid", label: "Client ID" },
    { name: "clientcasenumber", label: "Client Case Number" },
    { name: "contractyear", label: "Contract Year" },
    { name: "processtype", label: "Process Type" },
    { name: "tier", label: "Tier" },
    { name: "staffdropoff", label: "Staff Dropoff" },
    { name: "dateofdropoff", label: "Date of Dropoff" },
    { name: "dataentryassignment", label: "Data Entry Assignment" },
    { name: "dataentrycompletion", label: "Data Entry Completion" },
    { name: "staffpickup", label: "Staff Pickup" },
    { name: "dateofpickup", label: "Date of Pickup" },
    { name: "granteligibility", label: "Grant Eligibility" },
    { name: "householdsize", label: "Household Size" },
    { name: "income", label: "Income" },
    { name: "translations", label: "Translations" },
    { name: "additionalforms", label: "Additional Forms" },
    { name: "casenotes", label: "Case Notes" },
    { name: "grantreferenceno", label: "Grant Reference No." },
    { name: "reported", label: "Reported" },
    { name: "datetimestamp", label: "Process Date Timestamp" },
    { name: "createdby", label: "Process Created By" },
];

export default function ReportsPage() {
    const router = useRouter();
    const [selectedClientColumns, setSelectedClientColumns] = useState<string[]>([]);
    const [selectedProcessColumns, setSelectedProcessColumns] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [selectedProcessType, setSelectedProcessType] = useState<string>("All");
    const [filterName, setFilterName] = useState<string>("");

    const handleRunReport = () => {
        const query = new URLSearchParams();
        if (selectedClientColumns.length > 0) {
            query.append("clientColumns", selectedClientColumns.join(","));
        }
        if (selectedProcessColumns.length > 0) {
            query.append("processColumns", selectedProcessColumns.join(","));
        }
        if (startDate) query.append("startDate", startDate);
        if (endDate) query.append("endDate", endDate);
        if (selectedProcessType !== "All") query.append("processtype", selectedProcessType);
        if (filterName) query.append("name", filterName);

        router.push(`/dashboard/reports/results?${query.toString()}`);
    };

    const handleCancel = () => {
        router.push("/dashboard");
    };

    const toggleSelection = (
        column: string,
        setFunction: React.Dispatch<React.SetStateAction<string[]>>,
        current: string[]
    ) => {
        if (current.includes(column)) {
            setFunction(current.filter((c) => c !== column));
        } else {
            setFunction([...current, column]);
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-4xl mb-4">Build Custom Report</h1>
            <div className="flex flex-col items-center mb-4">
                <h2 className="text-2xl mb-2">Select Columns</h2>
                <div className="flex flex-row gap-8">
                    <div>
                        <h3 className="font-semibold mb-2">Client Columns</h3>
                        {clientColumns.map((col) => (
                            <label key={col.name} className="flex items-center space-x-2 mb-1">
                                <input
                                    type="checkbox"
                                    checked={selectedClientColumns.includes(col.name)}
                                    onChange={() => toggleSelection(col.name, setSelectedClientColumns, selectedClientColumns)}
                                />
                                <span>{col.label}</span>
                            </label>
                        ))}
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Process Columns</h3>
                        {processColumns.map((col) => (
                            <label key={col.name} className="flex items-center space-x-2 mb-1">
                                <input
                                    type="checkbox"
                                    checked={selectedProcessColumns.includes(col.name)}
                                    onChange={() => toggleSelection(col.name, setSelectedProcessColumns, selectedProcessColumns)}
                                />
                                <span>{col.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center mb-4">
                <h2 className="text-2xl mb-2">Filters</h2>
                <label className="flex flex-col mb-2">
                    <span className="font-semibold">Start Date (YYYY-MM-DD):</span>
                    <input
                        type="date"
                        className="border border-gray-400 rounded p-2 w-64"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>
                <label className="flex flex-col mb-2">
                    <span className="font-semibold">End Date (YYYY-MM-DD):</span>
                    <input
                        type="date"
                        className="border border-gray-400 rounded p-2 w-64"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>
                <label className="flex flex-col mb-2">
                    <span className="font-semibold">Filter by Process Type:</span>
                    <select
                        value={selectedProcessType}
                        onChange={(e) => setSelectedProcessType(e.target.value)}
                        className="border border-gray-400 rounded p-2 w-64"
                    >
                        <option value="All">All</option>
                        {processList.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col mb-2">
                    <span className="font-semibold">Filter by Client Name:</span>
                    <input
                        type="text"
                        placeholder="Type to filter by name"
                        className="border border-gray-400 rounded p-2 w-64"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                    />
                </label>
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={handleRunReport}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Run Report
                </button>
                <button
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
