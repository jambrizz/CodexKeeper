//This file is for contract data validation
import { z } from "zod";

export const contractSchema = z.object({
    contractName: z.string().min(1, "Contract name is required"),
    contractTotal: z.coerce.number().min(0, "Contract total must be 0 or greater"),
    //Tier section
    tierAmount: z.coerce.number().min(0, "Tier amount must be 0 or greater"),
    tier1Rate: z.coerce.number().min(0, "Tier 1 rate must be 0 or greater"),
    tier2Rate: z.coerce.number().min(0, "Tier 2 rate must be 0 or greater"),
    tier3Rate: z.coerce.number().min(0, "Tier 3 rate must be 0 or greater"),
    tier4Rate: z.coerce.number().min(0, "Tier 4 rate must be 0 or greater"),
    tier5Rate: z.coerce.number().min(0, "Tier 5 rate must be 0 or greater"),
    tier6Rate: z.coerce.number().min(0, "Tier 6 rate must be 0 or greater"),
    //Support service section
    supportAmount: z.coerce.number().min(0, "Support Service amount must be 0 or greater"),
    translationRate: z.coerce.number().min(0, "Translation rate must be 0 or greater"),
    interpretationRate: z.coerce.number().min(0, "Interpretation rate must be 0 or greater"),
    fpRate: z.coerce.number().min(0, "Fingerprinting rate must 0 or greater"),
    //Education & Outreach section
    eoiAmount: z.coerce.number().min(0, "Education & Outreach Individual amount must 0 or greater"),
    eoiRate: z.coerce.number().min(0, "Education & Outreach Individual rate must 0 or greater"),
    eoeAmount: z.coerce.number().min(0, "Education & Outreach Event amount must be 0 or greater"),
    eoeRate: z.coerce.number().min(0, "Education & Outreach Event rate must be 0 or greater") 

});
/*
export const updateContractSchema = z.object({
    id: z.number().nonnegative(),

    contractName: z.string().min(1, "Contract name is required"),
    contractTotal: z.coerce.number().min(0, "Contract total must be 0 or greater"),
    //Tier section
    tierAmount: z.coerce.number().min(0, "Tier amount must be 0 or greater"),
    tier1Rate: z.coerce.number().min(0, "Tier 1 rate must be 0 or greater"),
    tier2Rate: z.coerce.number().min(0, "Tier 2 rate must be 0 or greater"),
    tier3Rate: z.coerce.number().min(0, "Tier 3 rate must be 0 or greater"),
    tier4Rate: z.coerce.number().min(0, "Tier 4 rate must be 0 or greater"),
    tier5Rate: z.coerce.number().min(0, "Tier 5 rate must be 0 or greater"),
    tier6Rate: z.coerce.number().min(0, "Tier 6 rate must be 0 or greater"),
    //Support service section
    supportAmount: z.coerce.number().min(0, "Support Service amount must be 0 or greater"),
    translationRate: z.coerce.number().min(0, "Translation rate must be 0 or greater"),
    interpretationRate: z.coerce.number().min(0, "Interpretation rate must be 0 or greater"),
    fpRate: z.coerce.number().min(0, "Fingerprinting rate must 0 or greater"),
    //Education & Outreach section
    eoiAmount: z.coerce.number().min(0, "Education & Outreach Individual amount must 0 or greater"),
    eoiRate: z.coerce.number().min(0, "Education & Outreach Individual rate must 0 or greater"),
    eoeAmount: z.coerce.number().min(0, "Education & Outreach Event amount must be 0 or greater"),
    eoeRate: z.coerce.number().min(0, "Education & Outreach Event rate must be 0 or greater")
});
*/

export type ContractFormData = z.infer<typeof contractSchema>;