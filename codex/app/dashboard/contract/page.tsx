"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Contract {
    id: number;
    contractname: string;
    amount: number;
}

const ContractsPage = () => {
    const [contracts, setContracts] = useState<Contract[]>([]); // Ensure contracts is an array
    const router = useRouter();

    const handleAddContractClick = () => {
        router.push("/dashboard/contract/addContract");
    };

    const handleView = (id: number) => {
        console.log(`View contract with id: ${id}`);
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
                            key={contract.id} // Correct key usage
                            className="m-2 flex w-[600px] flex-row items-center space-x-4 border p-3"
                        >
                            <div className="flex-grow">
                                <p>
                                    <strong>Contract:</strong> {contract.contractname}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                                    onClick={() => handleView(contract.id)}
                                >
                                    View
                                </button>
                                <button
                                    className="rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600"
                                    onClick={() => handleEdit(contract.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
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
