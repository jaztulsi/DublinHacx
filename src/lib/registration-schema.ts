import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .refine((value) => {
    const digits = value.replace(/\D/g, "");
    return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
  }, "Use a valid 10-digit phone number");

const optionalProfileUrl = (host: string, label: string) =>
  z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(""))
    .refine((value) => {
      if (!value) return true;
      try {
        const url = new URL(value.startsWith("http") ? value : `https://${value}`);
        return url.hostname === host || url.hostname === `www.${host}`;
      } catch {
        return false;
      }
    }, `Enter a valid ${label} URL`);

const emailListSchema = z
  .string()
  .max(500)
  .optional()
  .or(z.literal(""))
  .refine((value) => {
    if (!value) return true;
    const emails = value
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);
    return (
      emails.length <= 3 && emails.every((email) => z.string().email().safeParse(email).success)
    );
  }, "Enter up to 3 valid emails, separated by commas");

export const registrationSchema = z.object({
  // Access
  passcode: z.string().min(1, "Required"),
  // Hacker
  first_name: z.string().trim().min(1, "Required").max(80),
  last_name: z.string().trim().min(1, "Required").max(80),
  email: z.string().trim().email("Invalid email").max(255),
  phone: phoneSchema,
  school: z.string().trim().min(1, "Required").max(160),
  grad_year: z.string().min(1, "Select a year"),
  exp_level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  dietary: z.string().min(1, "Select an option"),
  tshirt: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
  idea: z.string().max(1000).optional().or(z.literal("")),
  github: optionalProfileUrl("github.com", "GitHub"),
  linkedin: optionalProfileUrl("linkedin.com", "LinkedIn"),
  // Parent
  parent_name: z.string().trim().min(1, "Required").max(120),
  parent_email: z.string().trim().email("Invalid email").max(255),
  parent_phone: phoneSchema,
  emergency_contact: z.string().trim().min(3, "Required").max(255),
  // Team
  team_name: z.string().max(80).optional().or(z.literal("")),
  teammate_emails: emailListSchema,
  // Agreements
  code_of_conduct: z.literal(true, { message: "Required" }),
  photo_release: z.literal(true, { message: "Required" }),
  parent_signature: z.literal(true, { message: "Required" }),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const HACKER_CAP = 170;
