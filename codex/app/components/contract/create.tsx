import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { contractSchema } from "@/app/model/contractValidation";
import { z } from "zod";

const CreateContract = () => {
    const [formData, setFormData] = useState({
        contractName: "",
        contractTotal: "",
        contractStart: "",
        contractEnd: "",
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
        eoiAmount: "",
        eoiRate: "",
        eoeAmount: "",
        eoeRate: ""
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //Complete this code section
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBackClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        router.push("/dashboard/contract");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //console.log(formData);
        
        try {
            const parsedData = contractSchema.parse(formData);

            //console.log("Validation Data", parsedData);

            const response = await fetch("/api/Contracts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsedData),
            })

            if (!response.ok) {
                const err = await response.json().catch(() => null);
                
                if (err?.errors) {
                    const messages: string[] = [];
                    /*
                    for (const key of Object.keys(err.errors)) {
                        const fieldErrors: string[] = err.errors[key];
                        fieldErrors.forEach((message) => {
                            messages.push(`${key}: ${message}`);
                        });
                    }
                    */
                    for (const key of Object.keys(err.errors)) {
                        const fieldErrors: string[] = err.errors[key];
                        fieldErrors.forEach((message: string) => {
                            messages.push(`${key}: ${message}`);
                        });
                    }
                    alert(`${err.message}\n\n${messages.join("\n")}`);
                    return;
                }
                throw new Error(err?.message || "Failed to create contract")  
            }

            const savedContract = await response.json();
            //console.log("Saved contract:", savedContract);

            setSuccessMessage("Contract created successfully! you will be rerouted shortly.");
            setTimeout(() => router.push("/dashboard/contract"), 2500);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.issues.map(
                    (issue) => `${issue.path.join(".")}: ${issue.message}`
                );
                alert(`Validation failed: \n\n${errorMessages.join("\n")}`)
            } else {
                console.error("Unexpected error:", error);
                alert("An unexpected error ocurred.")
            }
        }
    }

    return (
        <>
            <div className="flex flex-col items-center">
                <h1 className="mb-4 text-4xl">Create Budget</h1>
                <form
                    className="flex flex-col items-center"
                    onSubmit={handleSubmit}
                >
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

                        <div className="flex flex-col">
                            <label className="mb-1 font-semibold text-gray-600">
                                Contract Start Date
                            </label>
                            <input
                                type="date"
                                name="contractStart"
                                className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                                onChange={handleInputChange}
                                value={formData.contractStart}
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-semibold text-gray-600">
                                Contract End Date
                            </label>
                            <input
                                type="date"
                                name="contractEnd"
                                className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                                onChange={handleInputChange}
                                value={formData.contractEnd}
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
                    <div className="mt-6 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                            Education & Outreach Section
                        </h2>

                        <label className="mb-1 font-semibold text-gray-600">
                            Education & Outreach Individual Amount
                        </label>

                        <input
                            type="number"
                            name="eoiAmount"
                            placeholder="Enter numbers only"
                            className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                            onChange={handleInputChange}
                            value={formData.eoiAmount}
                            required
                        />

                        <label className="mb-1 font-semibold text-gray-600">
                           E&O Individual Rate
                        </label>

                        <input
                            type="number"
                            name="eoiRate"
                            placeholder="Enter numbers only"
                            className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                            onChange={handleInputChange}
                            value={formData.eoiRate}
                            required
                        />

                        <label className="mb-1 font-semibold text-gray-600">
                            Education & Outreach Events Amount
                        </label>

                        <input
                            type="number"
                            name="eoeAmount"
                            placeholder="Enter numbers only"
                            className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                            onChange={handleInputChange}
                            value={formData.eoeAmount}
                            required
                        />

                        <label className="mb-1 font-semibold text-gray-600">
                            E&O Event Rate
                        </label>

                        <input
                            type="number"
                            name="eoeRate"
                            placeholder="Enter numbers only"
                            className="w-full rounded border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
                            onChange={handleInputChange}
                            value={formData.eoeRate}
                            required
                        />
                    </div>
                    <div className="m-3 flex flex-row gap-4">
                        <button
                            type="submit"
                            className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                        >
                            Submit
                        </button>
                        <button
                            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
                            onClick={handleBackClick}
                        >
                            Back to Contracts
                        </button>
                    </div>
                </form>
                {successMessage && (
                    <div className="mt-4 text-center">
                        <p className="font-bold text-green-500">{successMessage}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default CreateContract;