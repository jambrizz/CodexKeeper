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
import React, { useState } from "react";
import { clientSchema } from "@/app/model/clientValidation";
import { z } from "zod";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

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

const AddClient = () => {
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
        datetimeStamp: new Date().toISOString(),
        createdBy: "Jovani Ambriz",
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const normalizedData = {
                ...formData,
                MiddleName: formData.MiddleName.trim() || null,
            };

            clientSchema.parse(normalizedData);

            const response = await fetch("/api/Clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(normalizedData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Client created successfully:", result);

            // Set the success message and start countdown
            setSuccessMessage("Client added successfully!");
            let timer = 3; // Countdown time in seconds
            setCountdown(timer);

            const interval = setInterval(() => {
                timer -= 1;
                setCountdown(timer);

                if (timer === 0) {
                    clearInterval(interval);
                    router.push("/dashboard/clients"); // Redirect to the clients page
                }
            }, 1000);
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
            <h1 className="text-4xl mb-4">Add Client</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                {Object.keys(formData).map((field) =>
                    field !== "datetimeStamp" && field !== "createdBy" ? (
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
                                    {(field === "RaceEthnicIdentity" ? racialEthnicIdentity :
                                        field === "ServiceLanguage" ? serviceLanguages :
                                            field === "CountryOfOrigin" ? countryOfOrigin :
                                                field === "Gender" ? gender :
                                                    field === "SexualOrientation" ? sexualOrientation :
                                                        field === "Age" ? age :
                                                            field === "EducationLevel" ? educationLevel :
                                                                countyOfResidence
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
                    {countdown !== null && <p>Redirecting in {countdown} seconds...</p>}
                </div>
            )}
        </div>
    );
};

export default AddClient;