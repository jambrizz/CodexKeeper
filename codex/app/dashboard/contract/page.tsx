"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import inDollarFormat from "@/app/components/dollar/dollarFormat";

interface Contract {
    id: number;
    contractname: string;
    contracttotal: number;
    tieramount: number;
    supportamount: number;
    eoiamount: number;
    eoeamount: number;
}

const ContractsPage = () => {
    const [contracts, setContracts] = useState<Contract[]>([]); // Ensure contracts is an array
    const router = useRouter();

    const handleAddContractClick = () => {
        router.push("/dashboard/contract/addContract");
    };

    const handleView = (id: number) => {
        //console.log(`View contract with id: ${id}`);
        if (!id) {
            console.error("No Contract ID available for viewing")
            return;
        }
        router.push(`/dashboard/contract//viewContract?id=${id}`);
    };

    const handleEdit = (id: number) => {
        console.log(`Edit contract with id: ${id}`);
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this contract?");
        if (!confirmed) return;

        try {
            const response = await fetch(`/api/Contracts`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) throw new Error(`Failed to delete contracts: ${response.statusText}`);

            const updatedContracts = contracts.filter((contract) => contract.id !== id);
            setContracts(updatedContracts);
        } catch (error) {
            console.error("Failed to delete contract", error);
        }
    };

    const getContractsFromAPI = async (): Promise<Contract[]> => {
        const response = await fetch("/api/Contracts");
        if (!response.ok) {
            throw new Error("Failed to fetch contracts");
        }
        return await response.json(); // Ensure this returns an array
    };

    const getAllContracts = async () => {
        try {
            const contractData = await getContractsFromAPI();
            console.log("Fetched contracts from API", contractData);
            setContracts(contractData || []); // Defensive check
        } catch (error) {
            console.log("Error fetching contracts", error);
        }
    };

    useEffect(() => {
        getAllContracts();
    }, []);

    return (
        <>
            <div className="flex flex-col items-center">
                <h1>Contract Portal</h1>
                <div>
                    <button
                        onClick={handleAddContractClick}
                        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    >
                        Add Contract
                    </button>
                </div>
            </div>
            <div id="searchContracts" className="flex flex-col items-center">
                {/* Add search functionality here */}
            </div>
            <div id="displayContracts" className="flex flex-col items-center">
                {contracts.length > 0 ? (
                    contracts.map((contract) => (
                        <div
                            key={contract.id}
                            className="m-3 w-[700px] rounded-2xl border border-gray-200 bg-white p-5 shadow-md"
                        >
                            <div className="mb-4">
                                <h2 className="text-2xl font-semibold text-gray-700">
                                    {contract.contractname}
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                                <p>
                                    <strong>Contract Total:</strong> {inDollarFormat(contract.contracttotal)}
                                </p>
                                <p>
                                    <strong>Tiers Amount:</strong> {inDollarFormat(contract.tieramount)}
                                </p>
                                <p>
                                    <strong>Support Services Amount:</strong> {inDollarFormat(contract.supportamount)}
                                </p>
                                <p>
                                    <strong>E&O Individuals Amount:</strong> {inDollarFormat(contract.eoiamount)}
                                </p>
                                <p>
                                    <strong>E&O Events Amount:</strong> {inDollarFormat(contract.eoeamount)}
                                </p>
                            </div>

                            <div className="mt-4 flex space-x-2">
                                <button
                                    className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                                    onClick={() => handleView(contract.id)}
                                >
                                    View
                                </button>
                                <button
                                    className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                                    onClick={() => handleEdit(contract.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                                    onClick={() => handleDelete(contract.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No contracts found</p>
                )}
            </div>
        </>
    );
};

export default ContractsPage;
