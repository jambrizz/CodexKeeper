import React, { useState } from "react";

const CreateBudget = () => {
    const [formData, setFormData] = useState({
        contractName: "",
        contractTotal: "",
        tierAmount: "",
        tier1Rate: "",
        tier2Rate: "",
        tier3Rate: "",
        tier4Rate: "",
        tier5Rate: "",
        tier6Rate: "",
        supportAmount: "",
        translationRate: "",
        interpretationRate: "",
        fpRate: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //Complete this code section
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <div className="flex flex-col items-center">
                <h1 className="mb-4 text-4xl">Create Budget</h1>
                <form className="flex flex-col items-center">
                    <div className="mt-6 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                            Contract Information
                        </h2>

                        <div className="mb-4 flex flex-col">
                            <label className="mb-1 font-semibold text-gray-600">
                                Contract Name
                            </label>
                            <input
                                type="text"
                                name="contractName"
                                placeholder="Title"
                                className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                                onChange={handleInputChange}
                                value={formData.contractName}
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-semibold text-gray-600">
                                Contract Total
                            </label>
                            <input
                                type="number"
                                name="contractTotal"
                                placeholder="Enter numbers only"
                                className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                                onChange={handleInputChange}
                                value={formData.contractTotal}
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-6 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                            Tiers Section
                        </h2>

                        <label className="mb-1 font-semibold text-gray-600">
                            Tier Service Total
                        </label>

                        <input
                            type="number"
                            name="tierAmount"
                            placeholder="Enter numbers only"
                            className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                            onChange={handleInputChange}
                            value={formData.tierAmount}
                            required
                        />

                        <label className="mb-1 font-semibold text-gray-600">
                            Tier 1 Rate
                        </label>

                        <input
                            type="number"
                            name="tier1Rate"
                            placeholder="Enter rate paid for this tier"
                            className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                            onChange={handleInputChange}
                            value={formData.tier1Rate}
                            required
                        />

                        <label className="mb-1 font-semibold text-gray-600">
                            Tier 2 Rate
                        </label>

                        <input
                            type="number"
                            name="tier2Rate"
                            placeholder="Enter rate paid for this tier"
                            className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                            onChange={handleInputChange}
                            value={formData.tier2Rate}
                            required
                        />

                        <label className="mb-1 font-semibold text-gray-600">
                            Tier 3 Rate
                        </label>

                        <input
                            type="number"
                            name="tier3Rate"
                            placeholder="Enter rate paid for this tier"
                            className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                            onChange={handleInputChange}
                            value={formData.tier3Rate}
                            required
                        />

                        <label className="mb-1 font-semibold text-gray-600">
                            Tier 4 Rate
                        </label>

                        <input
                            type="number"
                            name="tier4Rate"
                            placeholder="Enter rate paid for this tier"
                            className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                            onChange={handleInputChange}
                            value={formData.tier4Rate}
                            required
                        />

                        <label className="mb-1 font-semibold text-gray-600">
                            Tier 5 Rate
                        </label>

                        <input
                            type="number"
                            name="tier5Rate"
                            placeholder="Enter rate paid for this tier"
                            className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                            onChange={handleInputChange}
                            value={formData.tier5Rate}
                            required
                        />

                        <label className="mb-1 font-semibold text-gray-600">
                            Tier 6 Rate
                        </label>

                        <input
                            type="number"
                            name="tier6Rate"
                            placeholder="Enter rate paid for this tier"
                            className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                            onChange={handleInputChange}
                            value={formData.tier6Rate}
                            required
                        />
                    </div>
                    <div className="mt-6 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                            Support Services Section
                        </h2>

                        <label className="mb-1 font-semibold text-gray-600">
                            Support Service Amount
                        </label>

                        <input
                            type="number"
                            name="supportAmount"
                            placeholder="Enter numbers only"
                            className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                            onChange={handleInputChange}
                            value={formData.supportAmount}
                            required
                        />

                        <label className="mb-1 font-semibold text-gray-600">
                            Translation Rate
                        </label>

                        <input
                            type="number"
                            name="translationRate"
                            placeholder="Enter rate for this service"
                            className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                            onChange={handleInputChange}
                            value={formData.translationRate}
                            required
                        />

                        <label className="mb-1 font-semibold text-gray-600">
                            Interpretation Rate
                        </label>

                        <input
                            type="number"
                            name="interpretationRate"
                            placeholder="Enter rate for this service"
                            className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                            onChange={handleInputChange}
                            value={formData.interpretationRate}
                            required
                        />

                        <label className="mb-1 font-semibold text-gray-600">
                            Fingerprinting Rate
                        </label>

                        <input
                            type="number"
                            name="fpRate"
                            placeholder="Enter rate for this service"
                            className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                            onChange={handleInputChange}
                            value={formData.fpRate}
                            required
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateBudget;