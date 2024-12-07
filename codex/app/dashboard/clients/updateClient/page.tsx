"use client";

import {
    racialEthnicIdentity,
    gender,
    serviceLanguages,
    countryOfOrigin,
    sexualOrientation,
    age,
    educationLevel,
    countyOfResidence,
} from "@/app/demo/demographics";
import React, { useState, useEffect } from "react";
import { clientSchema } from "@/app/model/clientValidation";
import { z } from "zod";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const fieldDisplayNames: { [key: string]: string } = {
    FirstName: "First Name",
    MiddleName: "Middle Name",
    LastName: "Last Name",
    DOB: "Date of Birth",
    RaceEthnicIdentity: "Race/Ethnic Identity",
    ServiceLanguage: "Service Language",
    CountryOfOrigin: "Country of Origin",
    Gender: "Gender",
    SexualOrientation: "Sexual Orientation",
    Age: "Age",
    EducationLevel: "Education Level",
    CountyOfResidence: "County of Residence",
};

const ComponentWithSearchParams = () => {
    const searchParams = useSearchParams();
    const clientId = searchParams?.get("id") || null;

    return (
        <div>
            Client ID: {clientId}
        </div>
    );
};

const UpdateClient = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clientId = searchParams?.get("id") || null; // Ensure clientId is not null

    const [formData, setFormData] = useState({
        FirstName: "",
        MiddleName: "",
        LastName: "",
        DOB: "",
        RaceEthnicIdentity: "",
        ServiceLanguage: "",
        CountryOfOrigin: "",
        Gender: "",
        SexualOrientation: "",
        Age: "",
        EducationLevel: "",
        CountyOfResidence: "",
    });

    const [hiddenFields, setHiddenFields] = useState({
        id: clientId,
        datetimeStamp: "",
        createdBy: "",
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!clientId) {
            console.warn("No client ID provided.");
            return;
        }

        const fetchClientData = async () => {
            try {
                const response = await fetch(`/api/Clients?id=${clientId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch client: ${response.statusText}`);
                }

                const clientData = await response.json();
                const { id, datetimeStamp, createdBy, ...visibleData } = clientData;

                setFormData(visibleData);
                setHiddenFields({ id, datetimeStamp, createdBy });
            } catch (error) {
                console.error("Error fetching client data:", error);
                alert("Failed to load client data. Please try again.");
            }
        };

        fetchClientData();
    }, [clientId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const normalizedData = {
                ...formData,
                ...hiddenFields, // Include hidden fields in the submission
                MiddleName: formData.MiddleName.trim() || null,
            };

            clientSchema.parse(normalizedData);

            const response = await fetch(`/api/Clients`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(normalizedData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            setSuccessMessage("Client updated successfully!");
            setTimeout(() => {
                router.push("/dashboard/clients");
            }, 2000); // Redirect after 2 seconds
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation errors:", error.errors);
                alert("Validation failed. Please check your inputs.");
            } else if (error instanceof Error) {
                console.error("Submission error:", error.message);
                alert(`Submission failed: ${error.message}`);
            }
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl mb-4">Update Client</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                {Object.keys(formData).map((field) => (
                    <div key={field} className="flex flex-col items-start mb-2">
                        <label className="font-semibold mb-1">
                            {fieldDisplayNames[field] || field}
                        </label>
                        {[
                            "RaceEthnicIdentity",
                            "ServiceLanguage",
                            "CountryOfOrigin",
                            "Gender",
                            "SexualOrientation",
                            "Age",
                            "EducationLevel",
                            "CountyOfResidence",
                        ].includes(field) ? (
                            <select
                                name={field}
                                className="border border-gray-400 rounded p-2 w-64"
                                onChange={handleInputChange}
                                value={formData[field as keyof typeof formData]}
                                required={field !== "MiddleName"}
                            >
                                <option value="" disabled>
                                    Select {fieldDisplayNames[field]}
                                </option>
                                {(field === "RaceEthnicIdentity"
                                    ? racialEthnicIdentity
                                    : field === "ServiceLanguage"
                                        ? serviceLanguages
                                        : field === "CountryOfOrigin"
                                            ? countryOfOrigin
                                            : field === "Gender"
                                                ? gender
                                                : field === "SexualOrientation"
                                                    ? sexualOrientation
                                                    : field === "Age"
                                                        ? age
                                                        : field === "EducationLevel"
                                                            ? educationLevel
                                                            : countyOfResidence
                                ).map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field === "DOB" ? "date" : "text"}
                                name={field}
                                placeholder={fieldDisplayNames[field]}
                                className="border border-gray-400 rounded p-2 w-64"
                                onChange={handleInputChange}
                                value={formData[field as keyof typeof formData]}
                                required={field !== "MiddleName"}
                            />
                        )}
                    </div>
                ))}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                    Update
                </button>
            </form>
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
        </div>
    );
};

export default UpdateClient;
