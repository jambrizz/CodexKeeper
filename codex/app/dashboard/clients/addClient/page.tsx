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
//import { connectDb } from '@/app/lib/db';

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
    });

    const createClient = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const validatedData = clientSchema.parse({
                ...formData,
                MiddleName: formData.MiddleName || null, // Convert empty MiddleName to null
            });

            const payload = {
                ...validatedData,
                datetimeStamp: new Date().toISOString(),
                createdBy: "Jovani Ambriz",
            };

            const response = await fetch("/api/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text(); // Try to parse error response as text
                console.error("Error response:", errorText);
                throw new Error("Failed to add client: " + errorText);
            }

            const result = await response.json();
            console.log("Client added successfully:", result);
            alert("Client added successfully!");
            setFormData({
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
        } catch (error: unknown) { // Explicitly type the error as unknown
            if (error instanceof z.ZodError) { // Check if it's a ZodError
                console.error("Validation errors:", error.errors);
                alert(error.errors.map((err) => err.message).join("\n"));
            } else if (error instanceof Error) { // Check if it's a generic Error
                console.error("Unexpected error:", error.message);
                alert(error.message || "An unexpected error occurred. Please try again.");
            } else {
                console.error("Unknown error:", error);
                alert("An unexpected error occurred. Please try again.");
            }
        }
    };
   

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl mb-4">Add Client</h1>
            <form onSubmit={createClient} className="flex flex-col items-center">
                {Object.keys(formData).map((field) => (
                    <div key={field} className="flex flex-col items-start mb-2">
                        <label className="font-semibold mb-1">
                            {fieldDisplayNames[field] || field}
                        </label>
                        {["RaceEthnicIdentity", "ServiceLanguage", "CountryOfOrigin", "Gender", "SexualOrientation", "Age", "EducationLevel", "CountyOfResidence"].includes(field) ? (
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
                ))}
                {/* Hidden Inputs */}
                <input type="hidden" name="datetimeStamp" value={new Date().toISOString()} />
                <input type="hidden" name="createdBy" value="Jovani Ambriz" />

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

export default AddClient;
