"use client";

import {
    racialEthnicIdentity,
    gender,
    serviceLanguages,
    countryOfOrigin,
    sexualOrientation,
    age,
    educationLevel,
    countyOfResidence
} from '@/app/demo/demographics';
import React, { useState } from 'react';

const fieldDisplayNames: { [key: string]: string } = {
    FirstName: "First Name",
    LastName: "Last Name",
    RaceEthnicIdentity: "Race/Ethnic Identity",
    ServiceLanguage: "Service Language",
    CountryOfOrigin: "Country of Origin",
    Gender: "Gender",
    SexualOrientation: "Sexual Orientation",
    Age: "Age",
    EducationLevel: "Education Level",
    CountyOfResidence: "County of Residence"
};

const AddClient = () => {
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        RaceEthnicIdentity: '',
        ServiceLanguage: '',
        CountryOfOrigin: '',
        Gender: '',
        SexualOrientation: '',
        Age: '',
        EducationLevel: '',
        CountyOfResidence: ''
    });

    const createClient = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic
        console.log(formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl mb1">Add Client</h1>
                <form onSubmit={createClient} className="flex flex-col items-center">
                    {Object.keys(formData).map(field => (
                        <div key={field} className="flex flex-col items-start mb-2">
                            <label className="font-semibold mb-1">
                                {fieldDisplayNames[field] || field}
                            </label>
                            {field === 'RaceEthnicIdentity' ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-4 w-64"
                                    onChange={handleInputChange}
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Select {fieldDisplayNames[field]}</option>
                                    {racialEthnicIdentity.map(identity => (
                                        <option key={identity} value={identity}>
                                            {identity}
                                        </option>
                                    ))}
                                </select>
                            ) : field === 'ServiceLanguage' ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-4 w-64"
                                    onChange={handleInputChange}
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Select {fieldDisplayNames[field]}</option>
                                    {serviceLanguages.map(language => (
                                        <option key={language} value={language}>
                                            {language}
                                        </option>
                                    ))}
                                </select>
                            ) : field === 'CountryOfOrigin' ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-4 w-64"
                                    onChange={handleInputChange}
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Select {fieldDisplayNames[field]}</option>
                                    {countryOfOrigin.map(country => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            ) : field === 'Gender' ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-4 w-64"
                                    onChange={handleInputChange}
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Select {fieldDisplayNames[field]}</option>
                                    {gender.map(gender => (
                                        <option key={gender} value={gender}>
                                            {gender}
                                        </option>
                                    ))}
                                </select>
                            ) : field === 'SexualOrientation' ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-4 w-64"
                                    onChange={handleInputChange}
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Select {fieldDisplayNames[field]}</option>
                                    {sexualOrientation.map(orientation => (
                                        <option key={orientation} value={orientation}>
                                            {orientation}
                                        </option>
                                    ))}
                                </select>
                            ) : field === 'Age' ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-4 w-64"
                                    onChange={handleInputChange}
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Select {fieldDisplayNames[field]}</option>
                                    {age.map(age => (
                                        <option key={age} value={age}>
                                            {age}
                                        </option>
                                    ))}
                                </select>
                            ) : field === 'EducationLevel' ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-4 w-64"
                                    onChange={handleInputChange}
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Select {fieldDisplayNames[field]}</option>
                                    {educationLevel.map(level => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            ) : field === 'CountyOfResidence' ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-4 w-64"
                                    onChange={handleInputChange}
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Select {fieldDisplayNames[field]}</option>
                                    {countyOfResidence.map(county => (
                                        <option key={county} value={county}>
                                            {county}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name={field}
                                    placeholder={fieldDisplayNames[field]}
                                    className="border border-gray-400 rounded p-4 w-64"
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
        </>
    );
};

export default AddClient;
