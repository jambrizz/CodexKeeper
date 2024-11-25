"use client";

import React, { useState } from 'react';
//import { processValidation } from '@/app/model/processValidation';
import { z } from "zod";
import { processes } from '@/app/demo/processes';
import { tiers } from '@/app/demo/tiers';

const fieldDisplayNames: { [key: string]: string } = {
    ClientName: "Client Name",
    CaseNumber: "Case Number",
    ContractYear: "DSS Contract Year",
    ProcessType: "Process Type",
    Tier: "Tier Level",
    StaffDropOff: "Staff Member who did Drop Off",
    DateOfDropOff: "Date Case Dropped Off",
    DateEntryAssignment: "Staff Member Assigned for Data Entry",
    DateEntryCompletion: "Data Entry Completition",
    StaffPickUp: "Staff Member who did Pick Up",
    DateOfPickUp: "Date of Pick Up",
    GrantEligibility: "Grant Eligibility",
    HouseholdSize: "Household Size",
    Income: "Client Income",
    Translations: "Translations Completed",
    AdditionalForms: "Additional Forms",
    CaseNotes: "Case Notes",
    GrantReferrenceNo: "Grant Referrence No.",
    Reported: "Reported to DSS"
};

const AddProcessPage = () => {
    const [processData, setProcessData] = useState({
        //Add the fields here that are in the processValidation schema
        ClientName: "",
        CaseNumber: "",
        ContractYear: "",
        ProcessType: "",
        Tier: "",
        StaffDropOff: "",
        DateOfDropOff: "",
        DateEntryAssignment: "",
        DateEntryCompletion: "",
        StaffPickUp: "",
        DateOfPickUp: "",
        GrantEligibility: "",
        HouseholdSize: "",
        Income: "",
        Translations: "",
        AdditionalForms: "",
        CaseNotes: "",
        GrantReferrenceNo: "",
        Reported: ""
    });

    /*
    const createProcess = async (e. React.FormEvent) => {
        e.preventDefault();

        try {

        } catch (error) {

        }
    };
    */

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        //setFormData(prev => ({ ...prev, [name]: value}));
    };

    return (
        <>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl mb1">Add Process</h1>
                <form className="flex flex-col items-start mb-2">
                    
                </form>
            </div>
        </>
    );
};

export default AddProcessPage;