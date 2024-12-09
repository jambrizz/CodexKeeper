"use client";

import React, { useState } from "react";
import { processSchema } from "@/app/model/processValidation";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { processes } from "@/app/demo/processes";
import { users } from "@/app/demo/users";
import { eligibility } from "@/app/demo/eligibility";
import { additionalForms } from "@/app/demo/tiers";

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

    // Function to set the tier based on process type
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Set the tier when the form is submitted based on selected process type
        setTier(formData.processtype);

        try {
            const parsedData = processSchema.parse(formData);
            const response = await fetch("/api/processes", {
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
                alert("Validation failed. Please review your inputs.");
            } else {
                alert("An error occurred during submission.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl mb-4">Add Process</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                {Object.keys(formData).map((field) =>
                    field !== "datetimestamp" && field !== "createdby" && field !== "tier" ? (
                        <div key={field} className="flex flex-col items-start mb-2">
                            <label className="font-semibold mb-1">
                                {fieldDisplayNames[field] || field}
                            </label>
                            {field === "clientcasenumber" || field === "contractyear" ? (
                                <input
                                    type="text"
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                />
                            ) : field === "processtype" ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                >
                                    <option value="" disabled>
                                        Select {fieldDisplayNames[field]}
                                    </option>
                                    {processes.map((process) => (
                                        <option key={process} value={process}>
                                            {process}
                                        </option>
                                    ))}
                                </select>
                            ) : ["staffdropoff", "dataentryassignment", "staffpickup"].includes(field) ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                >
                                    <option value="" disabled>
                                        Select {fieldDisplayNames[field]}
                                    </option>
                                    {users.map((user) => (
                                        <option key={user} value={user}>
                                            {user}
                                        </option>
                                    ))}
                                </select>
                            ) : field === "granteligibility" ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                >
                                    <option value="" disabled>
                                        Select {fieldDisplayNames[field]}
                                    </option>
                                    {eligibility.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : field === "additionalforms" ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                >
                                    <option value="" disabled>
                                        Select {fieldDisplayNames[field]}
                                    </option>
                                    {additionalForms.map((form) => (
                                        <option key={form} value={form}>
                                            {form}
                                        </option>
                                    ))}
                                </select>
                            ) : field === "casenotes" ? (
                                <textarea
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                />
                            ) : (
                                <input
                                    type="text"
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                />
                            )}
                        </div>
                    ) : null
                )}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                    Submit
                </button>
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

/*
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
*/

/*
"use client";

import React, { useState } from "react";
import { processSchema } from "@/app/model/processValidation";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { processes } from "@/app/demo/processes";
import { users } from "@/app/demo/users";
import { eligibility } from "@/app/demo/eligibility";
import { additionalForms } from "@/app/demo/tiers";

const fieldDisplayNames: { [key: string]: string } = {
    clientid: "Client",
    clientcasenumber: "Client Cerenade Number",
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const parsedData = processSchema.parse(formData);
            const response = await fetch("/api/processes", {
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
                alert("Validation failed. Please review your inputs.");
            } else {
                alert("An error occurred during submission.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl mb-4">Add Process</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                {Object.keys(formData).map((field) =>
                    field !== "datetimestamp" && field !== "createdby" ? (
                        <div key={field} className="flex flex-col items-start mb-2">
                            <label className="font-semibold mb-1">
                                {fieldDisplayNames[field] || field}
                            </label>
                            {field === "processtype" ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                >
                                    <option value="" disabled>
                                        Select {fieldDisplayNames[field]}
                                    </option>
                                    {processes.map((process) => (
                                        <option key={process} value={process}>
                                            {process}
                                        </option>
                                    ))}
                                </select>
                            ) : ["staffdropoff", "dataentryassignment", "staffpickup"].includes(field) ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                >
                                    <option value="" disabled>
                                        Select {fieldDisplayNames[field]}
                                    </option>
                                    {users.map((user) => (
                                        <option key={user} value={user}>
                                            {user}
                                        </option>
                                    ))}
                                </select>
                            ) : ["dateofdropoff", "dataentrycompletion", "dateofpickup"].includes(field) ? (
                                <input
                                    type="date"
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                />
                            ) : field === "granteligibility" ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                >
                                    <option value="" disabled>
                                        Select {fieldDisplayNames[field]}
                                    </option>
                                    {eligibility.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : ["householdsize", "income", "translations"].includes(field) ? (
                                <input
                                    type="number"
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                />
                            ) : field === "additionalforms" ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                >
                                    <option value="" disabled>
                                        Select {fieldDisplayNames[field]}
                                    </option>
                                    {additionalForms.map((form) => (
                                        <option key={form} value={form}>
                                            {form}
                                        </option>
                                    ))}
                                </select>
                            ) : field === "casenotes" ? (
                                <textarea
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                />
                            ) : field === "grantreferenceno" ? (
                                <input
                                    type="text"
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                />
                            ) : field === "reported" ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            ) : null}
                        </div>
                    ) : null
                )}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                    Submit
                </button>
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
*/