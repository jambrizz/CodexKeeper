"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ContractForm from "@/app/components/contract/ContractForm";

const UpdateContract = () => {
    const searchParams = useSearchParams();
    const id = searchParams?.get("id");

    const [initialData, setInitialData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchContract = async () => {
            try {
                const response = await fetch(`/api/Contracts?id=${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch contract");
                }

                const data = await response.json();

                setInitialData({
                    contractName: data.contractname ?? "",
                    contractTotal: String(data.contracttotal ?? ""),
                    contractStart: data.contractstart
                        ? new Date(data.contractstart).toISOString().split("T")[0]
                        : "",
                    contractEnd: data.contractend
                        ? new Date(data.contractend).toISOString().split("T")[0]
                        : "",
                    tierAmount: String(data.tieramount ?? ""),
                    tier1Rate: String(data.tier1rate ?? ""),
                    tier2Rate: String(data.tier2rate ?? ""),
                    tier3Rate: String(data.tier3rate ?? ""),
                    tier4Rate: String(data.tier4rate ?? ""),
                    tier5Rate: String(data.tier5rate ?? ""),
                    tier6Rate: String(data.tier6rate ?? ""),
                    supportAmount: String(data.supportamount ?? ""),
                    translationRate: String(data.translationrate ?? ""),
                    interpretationRate: String(data.interpretationrate ?? ""),
                    fpRate: String(data.fprate ?? ""),
                    eoiAmount: String(data.eoiamount ?? ""),
                    eoiRate: String(data.eoirate ?? ""),
                    eoeAmount: String(data.eoeamount ?? ""),
                    eoeRate: String(data.eoerate ?? ""),
                });
            } catch (error) {
                console.error("Error fetching contract:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContract();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!initialData || !id) return <p>Contract not found.</p>;

    return <ContractForm mode="update" contractId={Number(id)} initialData={initialData} />;
};

export default UpdateContract;