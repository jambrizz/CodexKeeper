import { z } from "zod";

export const clientSchema = z.object({
    FirstName: z.string().min(1, "First Name is required"),
    LastName: z.string().min(1, "Last Name is required"),
    RaceEthnicIdentity: z.string().min(1, "Race/Ethnic Identity is required"),
    ServiceLanguage: z.string().min(1, "Service Language is required"),
    CountryOfOrigin: z.string().min(1, "Country of Origin is required"),
    Gender: z.string().min(1, "Gender is required"),
    SexualOrientation: z.string().min(1, "Sexual Orientation is required"),
    Age: z.string().min(1, "Age is required"),
    EducationLevel: z.string().min(1, "Education Level is required"),
    CountyOfResidence: z.string().min(1, "County of Residence is required"),
});