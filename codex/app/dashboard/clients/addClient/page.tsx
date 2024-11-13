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
import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';

const AddClient = () => {

    return (
        <>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl mb1">Add Client</h1>
                <form className="flex flex-col items-center">
                    {['First Name', 'Last Name', 'Race/Ethnic Identity', 'Service Language', 'Country of Origin', 'Gender', 'Sexual Orientation',
                        'Age', 'Education Level', 'County of Residence'].map(field => (
                            <div key={field} className="flex flex-col items-start mb-2">
                                <label className="font-semibold mb-1">{field}</label>

                                {field === 'Race/Ethnic Identity' ? (
                                    <select
                                        name={field}
                                        className="border border-gray-400 rounded p-2"

                                        required
                                    >
                                        <option value="" disabled selected>Select {field}</option>
                                        {racialEthnicIdentity.map((identity: string) => (
                                            <option key={identity} value={identity}>
                                                {identity}
                                            </option>
                                        ))}
                                    </select>
                                ) : field === 'Service Language' ? (
                                    <select
                                        name={field}
                                        className="border border-gray-400 rounded p-4"
                                        required
                                    >
                                        <option value="" disabled selected>Select {field}</option>
                                        {serviceLanguages.map((language: string) => (
                                            <option key={language} value={language}>
                                                {language}
                                            </option>
                                        ))}
                                    </select>
                                ) : field ==='Country of Origin' ? (
                                    <select
                                        name={field}
                                        className="border border-gray-400 rounded p-4"
                                        required
                                    >
                                        <option value="" disabled selected>Select {field}</option>
                                        {countryOfOrigin.map((country: string) => (
                                            <option key={country} value={country}>
                                                {country}
                                            </option>
                                        ))}
                                    </select>
                                ) : field === 'Gender' ? (
                                    <select
                                        name={field}
                                        className="border border-gray-400 rounded p-4"
                                        required
                                    >
                                        <option value="" disabled selected>Select {field}</option>
                                        {gender.map((gender: string) => (
                                            <option key={gender} value={gender}>
                                                {gender}
                                            </option>
                                        ))}
                                    </select>
                                ) : field === 'Sexual Orientation' ? (
                                    <select
                                        name={field}
                                        className="border border-gray-400 rounded p-4"
                                        required
                                    >
                                    <option value="" disabled selected>Select {field}</option>
                                        {sexualOrientation.map((orientation: string) => (
                                            <option key={orientation} value={orientation}>
                                                {orientation}
                                            </option>
                                        ))}
                                    </select>
                                ) : field === 'Age' ? (
                                    <select
                                        name={field}
                                        className="border border-gray-400 rounded p-4"
                                        required
                                    >
                                    <option value="" disabled selected>Select {field}</option>
                                        {age.map((age: string) => (
                                            <option key={age} value={age}>
                                                {age}
                                            </option>
                                        ))}
                                    </select>
                                ) : field === 'Education Level' ? (
                                    <select
                                        name={field}
                                        className="border border-gray-400 rounded p-4"
                                        required
                                    >
                                    <option value="" disabled selected>Select {field}</option>
                                        {educationLevel.map((level: string) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                ) : field === 'County of Residence' ? (
                                <select
                                    name={field}
                                    className="border border-gray-400 rounded p-4"
                                    required
                                >
                                <option value="" disabled selected>Select {field}</option>
                                {countyOfResidence.map((county: string) => (
                                        <option key={county} value={county}>
                                            {county}
                                        </option>
                                ))}
                                </select>
                                ) : (
                                    <input
                                        type="text"
                                        name={field}
                                        placeholder={field}
                                        className="border border-gray-400 rounded p-4"
                                        required
                                    />
                                )}
                            </div>
                        ))}
                </form>
            </div>
        </>
    );
};

/*
<input
                                        type="text"
                                        name={field}
                                        placeholder={field}
                                        className="border border-gray-400 rounded p-2"
                                        required
                                    />
*/
export default AddClient;

