import { z } from "zod";

export const usersValidation = z.object({
    firstname: z.string().min(1, "First name required"),
    lastname: z.string().min(1, "Last name required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(10, "Password must be at least 10 characters long")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[!@#$%?]/, "Must contain at least one special character (!@#$%?)"),
    position: z.string().min(1, "Position is required"),
    auth_level: z.number().min(0).max(2),
});