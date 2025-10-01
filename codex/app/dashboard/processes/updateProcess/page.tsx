"use client"
//updatePrcess Page
/*
import { processes } from "@/app/demo/processes";
import React, { useState, useEffect, Suspense } from "react";
import { processSchema } from "@/app/model/processValidation";
import { z } from 'zod';
import { useRouter, useSearchParams } from "next/navigation";
*/

import React, { useState, useEffect } from "react";
import { processSchema } from "@/app/model/processValidation";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { processes } from "@/app/demo/processes";
import { users } from "@/app/demo/users";
import { eligibility } from "@/app/demo/eligibility";
import { additionalForms } from "@/app/demo/tiers";

interface Client {
    firstname: string;
    middlename: string;
    lastname: string;
    id: number;
    dob: string; 
}

const fieldDisplayNames: { [key: string]: string } = {
    clientid: "Client",
    clientcasenumber: "Client Case Number",
    contractyear: "Contract Year",
    processtype: "Process Type",
    staffdropoff: "Staff who picked up Client's Process",
    dateofdropoff: "Date client Dropped Off Process",
    dataentryassignment: "Staff Assigned for Data Entry",
    dataentrycompletion: "Data Entry Completed On",
    staffpickup: "Staff who turned in Client's Process",
    dateofpickup: "Date client signed for Process",
    granteligibility: "Grant Eligibility",
    householdsize: "Household Size",
    income: "Client Income",
    translations: "Translations Completed",
    additionalforms: "Additional Forms",
    casenotes: "Case Notes",
    grantreferenceno: "Grant Reference Number",
    reported: "Reported to DSS",
}

const UpdateProcessComponent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams?.get("id") || null; // Ensure id is not null
    const datetimeStamp = searchParams?.get("datetimeStamp") || null;
    const createdBy = searchParams?.get("createdBy") || null;

    const [formData, setFormData] = useState({


    })

    return (
        <>
            <div> Update Process</div>
        </>
    );
}

export default UpdateProcessComponent;