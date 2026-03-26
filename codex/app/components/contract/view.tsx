"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import inDollarFormat from "@/app/components/dollar/dollarFormat";

interface Contract {
    id: number;
    contractname: string;
    contracttotal: number;
    contractstart: string;
    contractend: string;
    tieramount: number;
    tier1rate: number;
    tier2rate: number;
    tier3rate: number;
    tier4rate: number;
    tier5rate: number;
    tier6rate: number;
    supportamount: number;
    translationrate: number;
    interpretationrate: number;
    fprate: number;
    eoiamount: number;
    eoirate: number;
    eoeamount: number;
    eoerate: number;
}

const safeDisplay = (value: any) => {
    if (value == null || value === "") {
        return "None";
    }
    return value;
};

const safeDollarDisplay = (value: any) => {
    if (value == null || value === "") {
        return "None";
    }
    return inDollarFormat(Number(value));
};

const safeDateDisplay = (value: any) => {
    if (value == null || value === "") {
        return "None";
    }
    return new Date(value).toLocaleDateString("en-US");
};


const ViewContract = () => {
    const searchParams = useSearchParams();
    const id = searchParams?.get("id");

    const [contract, setContract] = useState<Contract | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const handleBackClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        router.push("/dashboard/contract");
    };

    useEffect(() => {
        if (!id) return;

        const fetchContract = async () => {
            try {
                const response = await fetch(`/api/Contracts?id=${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch contract");
                }

                const data = await response.json();
                //console.log("Fetched contract:", data);
                setContract(data);
            } catch (error) {
                console.error("Error fetching contract:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContract();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!contract) return <p>Contract not found.</p>;

    return (
    <>
        <div className="flex flex-col items-center">
            <h1 className="mb-4 text-4xl">Contract Details</h1>

            {/* Contract Info */}
            <div className="mt-6 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                    Contract Information
                </h2>

                <div className="space-y-2 text-gray-700">
                    <p><strong>Contract Name:</strong> {safeDisplay(contract.contractname)}</p>
                    <p><strong>Contract Total:</strong> {safeDollarDisplay(contract.contracttotal)}</p>
                    <p><strong>Start Date:</strong> {safeDateDisplay(contract.contractstart)}</p>
                    <p><strong>End Date:</strong> {safeDateDisplay(contract.contractend)}</p>
                </div>
            </div>

            {/* Tiers */}
            <div className="mt-6 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                    Tiers Section
                </h2>

                <div className="space-y-2 text-gray-700">
                    <p><strong>Tier Amount:</strong> {safeDollarDisplay(contract.tieramount)}</p>
                    <p><strong>Tier 1 Rate:</strong> {safeDollarDisplay(contract.tier1rate)}</p>
                    <p><strong>Tier 2 Rate:</strong> {safeDollarDisplay(contract.tier2rate)}</p>
                    <p><strong>Tier 3 Rate:</strong> {safeDollarDisplay(contract.tier3rate)}</p>
                    <p><strong>Tier 4 Rate:</strong> {safeDollarDisplay(contract.tier4rate)}</p>
                    <p><strong>Tier 5 Rate:</strong> {safeDollarDisplay(contract.tier5rate)}</p>
                    <p><strong>Tier 6 Rate:</strong> {safeDollarDisplay(contract.tier6rate)}</p>
                </div>
            </div>

            {/* Support */}
            <div className="mt-6 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                    Support Services Section
                </h2>

                <div className="space-y-2 text-gray-700">
                    <p><strong>Support Amount:</strong> {safeDollarDisplay(contract.supportamount)}</p>
                    <p><strong>Translation Rate:</strong> {safeDollarDisplay(contract.translationrate)}</p>
                    <p><strong>Interpretation Rate:</strong> {safeDollarDisplay(contract.interpretationrate)}</p>
                    <p><strong>Fingerprinting Rate:</strong> {safeDollarDisplay(contract.fprate)}</p>
                </div>
            </div>

            {/* Education */}
            <div className="mt-6 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                    Education & Outreach Section
                </h2>

                <div className="space-y-2 text-gray-700">
                    <p><strong>E&O Individual Amount:</strong> {safeDollarDisplay(contract.eoiamount)}</p>
                    <p><strong>E&O Individual Rate:</strong> {safeDollarDisplay(contract.eoirate)}</p>
                    <p><strong>E&O Event Amount:</strong> {safeDollarDisplay(contract.eoeamount)}</p>
                    <p><strong>E&O Event Rate:</strong> {safeDollarDisplay(contract.eoerate)}</p>
                    </div>
            </div>
                <div className="m-3 flex flex-row gap-4">
                    <button
                        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
                        onClick={handleBackClick}
                    >
                        Back to Contracts
                    </button>
                </div>
        </div>
        
    </>
);
};

export default ViewContract;