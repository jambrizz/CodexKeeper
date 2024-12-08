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
import React, { useState, useEffect, Suspense } from "react";
import { clientSchema } from "@/app/model/clientValidation";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

const fieldDisplayNames: { [key: string]: string } = {
    firstname: "First Name",
    middlename: "Middle Name",
    lastname: "Last Name",
    dob: "Date of Birth",
    raceethnicidentity: "Race/Ethnic Identity",
    servicelanguage: "Service Language",
    countryoforigin: "Country of Origin",
    gender: "Gender",
    sexualorientation: "Sexual Orientation",
    age: "Age",
    educationlevel: "Education Level",
    countyofresidence: "County of Residence",
};

const UpdateClientComponent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clientId = searchParams?.get("id") || null; // Ensure clientId is not null
    const datetimeStamp = searchParams?.get("datetimeStamp") || null;
    const createdBy = searchParams?.get("createdBy") || null;

    const [formData, setFormData] = useState({
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
        countyofresidence: "",
    });

    const [hiddenFields, setHiddenFields] = useState({
        id: clientId,
        datetimestamp: "",
        createdby: "",
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
                const { id, datetimestamp, createdby, ...visibleData } = clientData;

                // Log the id, datetimeStamp, and createdBy
                console.log("Client ID:", id);
                console.log("DateTime Stamp:", datetimestamp);
                console.log("Created By:", createdby);

                setFormData(visibleData);
                setHiddenFields({ id, datetimestamp, createdby });
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
                middlename: formData.middlename.trim() || null,
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
                {/* First Name */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">First Name</label>
                    <input
                        type="text"
                        name="FirstName"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.firstname}
                        required
                    />
                </div>

                {/* Middle Name */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Middle Name</label>
                    <input
                        type="text"
                        name="MiddleName"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.middlename || ""}
                    />
                </div>

                {/* Last Name */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Last Name</label>
                    <input
                        type="text"
                        name="LastName"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.lastname}
                        required
                    />
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Date of Birth</label>
                    <input
                        type="date"
                        name="DOB"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.dob ? formData.dob.split("T")[0] : ""}
                        required
                    />
                </div>

                {/* Race/Ethnic Identity */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Race/Ethnic Identity</label>
                    <select
                        name="RaceEthnicIdentity"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.raceethnicidentity}
                        required
                    >
                        <option value="" disabled>
                            Select Race/Ethnic Identity
                        </option>
                        {racialEthnicIdentity.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Service Language */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Service Language</label>
                    <select
                        name="ServiceLanguage"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.servicelanguage}
                        required
                    >
                        <option value="" disabled>
                            Select Service Language
                        </option>
                        {serviceLanguages.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Country of Origin */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Country of Origin</label>
                    <select
                        name="CountryOfOrigin"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.countryoforigin}
                        required
                    >
                        <option value="" disabled>
                            Select Country of Origin
                        </option>
                        {countryOfOrigin.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Gender */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Gender</label>
                    <select
                        name="Gender"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.gender}
                        required
                    >
                        <option value="" disabled>
                            Select Gender
                        </option>
                        {gender.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sexual Orientation */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Sexual Orientation</label>
                    <select
                        name="SexualOrientation"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.sexualorientation}
                        required
                    >
                        <option value="" disabled>
                            Select Sexual Orientation
                        </option>
                        {sexualOrientation.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Age */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Age</label>
                    <input
                        name="Age"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.age}
                        required
                    />
                </div>

                {/* Education Level */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">Education Level</label>
                    <select
                        name="EducationLevel"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.educationlevel}
                        required
                    >
                        <option value="" disabled>
                            Select Education Level
                        </option>
                        {educationLevel.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* County of Residence */}
                <div className="flex flex-col items-start mb-2">
                    <label className="font-semibold mb-1">County of Residence</label>
                    <select
                        name="CountyOfResidence"
                        className="border border-gray-400 rounded p-2 w-64"
                        onChange={handleInputChange}
                        value={formData.countyofresidence}
                        required
                    >
                        <option value="" disabled>
                            Select County of Residence
                        </option>
                        {countyOfResidence.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Hidden Fields */}
                <input type="hidden" name="id" value={hiddenFields.id ?? ""} />
                <input type="hidden" name="datetimeStamp" value={hiddenFields.datetimestamp ?? ""} />
                <input type="hidden" name="createdBy" value={hiddenFields.createdby ?? ""} />

                <button
                    type="submit"
                    className="mt-4 py-2 px-6 bg-blue-500 text-white rounded"
                >
                    Update Client
                </button>
            </form>

            {successMessage && (
                <div className="mt-4 text-green-500 font-semibold">{successMessage}</div>
            )}
        </div>
    );
};

const UpdateClientPage = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <UpdateClientComponent />
    </Suspense>
);

export default UpdateClientPage;
