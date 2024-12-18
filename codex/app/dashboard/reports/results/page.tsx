"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ReportRow {
    [key: string]: any;
}

export default function ReportResultsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [data, setData] = useState<ReportRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchReportData = async () => {
        // Use non-null assertion or a safe fallback
        const query = searchParams?.toString() ?? "";
        try {
            const response = await fetch(`/api/Reports?${query}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch report data: ${response.statusText}`);
            }
            const result = await response.json();
            setData(result);
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [searchParams]);

    const handleBack = () => {
        router.push("/dashboard/reports");
    };

    const exportAsPDF = () => {
        // I need to implement this feature and figure out if I need to get a license for it
        alert("PDF export coming soon!");
    };

    const exportAsExcel = () => {
        // I need to implement this feature and figure out if I need to get a license for it
        // This one is crucial to make things easier for the user
        alert("Excel export coming soon!");
    };

    if (error) {
        return (
            <div className="flex flex-col items-center p-4">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={handleBack}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    Back to Reports
                </button>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center p-4">
                <p>Loading report data...</p>
            </div>
        );
    }

    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-4xl mb-4">Report Results</h1>
            <div className="mb-4 flex space-x-4">
                <button
                    onClick={exportAsPDF}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Export as PDF
                </button>
                <button
                    onClick={exportAsExcel}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Export as Excel
                </button>
                <button
                    onClick={handleBack}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    Back to Reports
                </button>
            </div>
            <div className="overflow-x-auto w-full max-w-4xl">
                <table className="border-collapse w-full">
                    <thead>
                        <tr className="border-b">
                            {columns.map((col) => (
                                <th key={col} className="p-2 border-b font-semibold text-left">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr key={idx} className="border-b">
                                {columns.map((col) => (
                                    <td key={col} className="p-2 border-b">
                                        {row[col]?.toString() || "None"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
