import { z } from "zod";

export const clientSchema = z.object({
    firstname: z.string().min(1, "First Name is required"),
    middlename: z.string().nullable().optional(), // Optional field, allows null or undefined
    lastname: z.string().min(1, "Last Name is required"),
    dob: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth needs to be formatted as YYYY-MM-DD"), // Enforcing date picker format
    raceethnicidentity: z.string().min(1, "Race/Ethnic Identity is required"),
    servicelanguage: z.string().min(1, "Service Language is required"),
    countryoforigin: z.string().min(1, "Country of Origin is required"),
    gender: z.string().min(1, "Gender is required"),
    sexualorientation: z.string().min(1, "Sexual Orientation is required"),
    age: z.string().min(1, "Age is required"),
    educationlevel: z.string().min(1, "Education Level is required"),
    countyofresidence: z.string().min(1, "County of Residence is required"),
    datetimestamp: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid datetime format"),
    createdby: z.string().min(1, "Creator's name is required"),
});
