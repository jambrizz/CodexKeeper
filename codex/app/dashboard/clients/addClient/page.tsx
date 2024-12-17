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

const AddClient = () => {
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
        datetimestamp: new Date().toISOString(),
        createdby: "Jovani Ambriz",
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const router = useRouter();

    const handleBackClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        router.push("/dashboard/clients");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const normalizedData = {
                ...formData,
                middlename: formData.middlename.trim() || null,
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
                    field !== "datetimestamp" && field !== "createdby" ? (
                        <div key={field} className="flex flex-col items-start mb-2">
                            <label className="font-semibold mb-1">
                                {fieldDisplayNames[field] || field}
                            </label>
                            {[
                                "raceethnicidentity",
                                "servicelanguage",
                                "countryoforigin",
                                "gender",
                                "sexualorientation",
                                "age",
                                "educationlevel",
                                "countyofresidence",
                            ].includes(field) ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required={field !== "middlename"}
                                >
                                    <option value="" disabled>
                                        Select {fieldDisplayNames[field]}
                                    </option>
                                    {(field === "raceethnicidentity" ? racialEthnicIdentity :
                                        field === "servicelanguage" ? serviceLanguages :
                                            field === "countryoforigin" ? countryOfOrigin :
                                                field === "gender" ? gender :
                                                    field === "sexualorientation" ? sexualOrientation :
                                                        field === "age" ? age :
                                                            field === "educationlevel" ? educationLevel :
                                                                countyOfResidence
                                    ).map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field === "dob" ? "date" : "text"}
                                    name={field}
                                    placeholder={fieldDisplayNames[field]}
                                    className="border border-gray-400 rounded p-2 w-64"
                                    onChange={handleInputChange}
                                    value={formData[field as keyof typeof formData]}
                                    required={field !== "middlename"}
                                />
                            )}
                        </div>
                    ) : null
                )}
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
                        Back to Clients
                    </button>
                </div>

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