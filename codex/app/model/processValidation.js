import { z } from "zod";

export const processSchema = z.object({
	clientid: z.number().nonnegative(),
	clientcasenumber: z.string().min(1, "Client case number from Cerenade is required"),
	contractyear: z.string().min(1, "Contract year is required"),
	processtype: z.string().min(1, "Process type is required"),
	tier: z.string().min(1, "Tier level is required"),
	staffdropoff: z.string().min(1, "Staff member name is required"),
	dateofdropoff: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date time format" }),
	dataentryassignment: z.string().nullable().optional(),
	dataentrycompletion: z
		.string()
		.refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date time format" })
		.optional(),
	staffpickup: z.string().nullable().optional(),
	dateofpickup: z
		.string()
		.refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date time format" })
		.optional(),
	granteligibility: z.string().min(1, "Grant Eligibility is required"),
	householdsize: z.number().optional(),
	income: z.number().nonnegative().optional(),
	translations: z.number().nonnegative().optional(),
	additionalforms: z.string().nullable().optional(),
	casenotes: z.string().nullable().optional(),
	grantreferenceno: z.string().nullable().optional(),
	reported: z.string().min(1, "Invalid input please select true or false"),
	datetimestamp: z
		.string()
		.refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date time format" }),
	createdby: z.string().min(1, "Name of who created the process is required"),
});