"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Budget {
    id: number;
    contractname: string;
    amount: number;
}

const BudgetsPage = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]); // Ensure budgets is an array
    const router = useRouter();

    const handleAddBudgetClick = () => {
        router.push("/dashboard/budgets/addBudget");
    };

    const handleView = (id: number) => {
        console.log(`View budget with id: ${id}`);
    };

    const handleEdit = (id: number) => {
        console.log(`Edit budget with id: ${id}`);
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this budget?");
        if (!confirmed) return;

        try {
            const response = await fetch(`/api/Budgets`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) throw new Error(`Failed to delete budget: ${response.statusText}`);

            const updatedBudgets = budgets.filter((budget) => budget.id !== id);
            setBudgets(updatedBudgets);
        } catch (error) {
            console.error("Failed to delete budget", error);
        }
    };

    const getBudgetsFromAPI = async (): Promise<Budget[]> => {
        const response = await fetch("/api/Budgets");
        if (!response.ok) {
            throw new Error("Failed to fetch budgets");
        }
        return await response.json(); // Ensure this returns an array
    };

    const getAllBudgets = async () => {
        try {
            const budgetData = await getBudgetsFromAPI();
            console.log("Fetched budgets from API", budgetData);
            setBudgets(budgetData || []); // Defensive check
        } catch (error) {
            console.log("Error fetching budgets", error);
        }
    };

    useEffect(() => {
        getAllBudgets();
    }, []);

    return (
        <>
            <div className="flex flex-col items-center">
                <h1>Budget Portal</h1>
                <div>
                    <button
                        onClick={handleAddBudgetClick}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Budget
                    </button>
                </div>
            </div>
            <div id="searchBudgets" className="flex flex-col items-center">
                {/* Add search functionality here */}
            </div>
            <div id="displayBudgets" className="flex flex-col items-center">
                {budgets.length > 0 ? (
                    budgets.map((budget) => (
                        <div
                            key={budget.id} // Correct key usage
                            className="flex flex-row border p-3 m-2 w-[600px] space-x-4 items-center"
                        >
                            <div className="flex-grow">
                                <p>
                                    <strong>Contract:</strong> {budget.contractname}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                    onClick={() => handleView(budget.id)}
                                >
                                    View
                                </button>
                                <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                    onClick={() => handleEdit(budget.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    onClick={() => handleDelete(budget.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No budgets found</p>
                )}
            </div>
        </>
    );
};

export default BudgetsPage;
