// View contract page
"use client";

import ViewContract from "@/app/components/contract/view";

const safeDisplay = (value: any) => {
    if (value == null || value === "") {
        return "None";
    }
    return value;
}

const ContractDetails = () => {

    return (
        <ViewContract />
    );
}

export default ContractDetails;