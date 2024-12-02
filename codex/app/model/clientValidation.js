import { z } from "zod";

export const clientSchema = z.object({
    FirstName: z.string().min(1, "First Name is required"),
    MiddleName: z.string().nullable().optional(), // Optional field, allows null or undefined
    LastName: z.string().min(1, "Last Name is required"),
    DOB: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth needs to be formatted as YYYY-MM-DD"), // Enforcing date picker format
    RaceEthnicIdentity: z.string().min(1, "Race/Ethnic Identity is required"),
    ServiceLanguage: z.string().min(1, "Service Language is required"),
    CountryOfOrigin: z.string().min(1, "Country of Origin is required"),
    Gender: z.string().min(1, "Gender is required"),
    SexualOrientation: z.string().min(1, "Sexual Orientation is required"),
    Age: z.string().min(1, "Age is required"),
    EducationLevel: z.string().min(1, "Education Level is required"),
    CountyOfResidence: z.string().min(1, "County of Residence is required"),
    datetimeStamp: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid datetime format"),
    createdBy: z.string().min(1, "Creator's name is required"),
});
