// Per-service onboarding field schemas and required document lists.
// Client-safe (no server imports).

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "date"
  | "select"
  | "textarea";

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: readonly string[];
  placeholder?: string;
  pattern?: string;
  maxLength?: number;
  help?: string;
};

export type DocDef = {
  key: string;
  label: string;
  required?: boolean;
  help?: string;
};

export type OnboardingSchema = {
  title: string;
  description: string;
  fields: FieldDef[];
  documents: DocDef[];
};

const BUSINESS_TYPES = [
  "Proprietorship",
  "Partnership",
  "LLP",
  "Private Limited",
  "Public Limited",
  "HUF",
  "Co-operative",
  "Society / Trust",
  "Other",
] as const;

const SOCIAL_CATEGORY = ["General", "OBC", "SC", "ST"] as const;
const GENDER = ["Male", "Female", "Other"] as const;

const COMMON_DOCS: DocDef[] = [
  { key: "aadhaar_front", label: "Aadhaar Card (front)", required: true },
  { key: "aadhaar_back", label: "Aadhaar Card (back)", required: true },
  { key: "pan_card", label: "PAN Card", required: true },
];

const NEW_UDYAM: OnboardingSchema = {
  title: "Applicant & Business Details",
  description:
    "Please share the details exactly as they appear on your Aadhaar and PAN. Mismatched details cause OTP failures.",
  fields: [
    { key: "applicant_name", label: "Applicant Name (as on Aadhaar)", type: "text", required: true, maxLength: 120 },
    { key: "aadhaar_number", label: "Aadhaar Number", type: "text", required: true, pattern: "^\\d{12}$", placeholder: "12 digit number", help: "We never store this in plain text." },
    { key: "aadhaar_mobile", label: "Mobile linked to Aadhaar", type: "tel", required: true, pattern: "^[6-9]\\d{9}$", placeholder: "10 digits, starts 6-9", help: "OTP will come on this number." },
    { key: "pan_number", label: "PAN Number", type: "text", required: true, pattern: "^[A-Z]{5}\\d{4}[A-Z]$", placeholder: "ABCDE1234F", maxLength: 10 },
    { key: "date_of_birth", label: "Date of Birth (as on Aadhaar)", type: "date", required: true },
    { key: "gender", label: "Gender", type: "select", required: true, options: GENDER },
    { key: "social_category", label: "Social Category", type: "select", required: true, options: SOCIAL_CATEGORY },
    { key: "business_name", label: "Business / Enterprise Name", type: "text", required: true, maxLength: 200 },
    { key: "business_type", label: "Type of Organisation", type: "select", required: true, options: BUSINESS_TYPES },
    { key: "commencement_date", label: "Date of Commencement of Business", type: "date", required: true },
    { key: "nic_activity", label: "Main Business Activity (NIC Code or description)", type: "text", required: true, help: "e.g. 47711 - Retail trade in textiles", maxLength: 200 },
    { key: "address_line", label: "Business Address", type: "textarea", required: true, maxLength: 400 },
    { key: "city", label: "City / Town", type: "text", required: true, maxLength: 80 },
    { key: "pincode", label: "PIN Code", type: "text", required: true, pattern: "^\\d{6}$", maxLength: 6 },
    { key: "bank_account_no", label: "Bank Account Number", type: "text", required: true, maxLength: 30 },
    { key: "bank_ifsc", label: "Bank IFSC", type: "text", required: true, pattern: "^[A-Z]{4}0[A-Z0-9]{6}$", maxLength: 11 },
  ],
  documents: [
    ...COMMON_DOCS,
    { key: "bank_proof", label: "Bank Passbook / Cancelled Cheque", required: true },
    { key: "business_proof", label: "Business Address Proof (rent / electricity)", required: false },
  ],
};

const UDYAM_UPDATE: OnboardingSchema = {
  title: "Update Your Existing Udyam Certificate",
  description: "Tell us what needs to change. We'll request OTP on your Aadhaar-linked mobile.",
  fields: [
    { key: "applicant_name", label: "Applicant Name", type: "text", required: true, maxLength: 120 },
    { key: "udyam_number", label: "Existing Udyam Registration Number", type: "text", required: true, placeholder: "UDYAM-XX-00-0000000" },
    { key: "aadhaar_number", label: "Aadhaar Number", type: "text", required: true, pattern: "^\\d{12}$" },
    { key: "aadhaar_mobile", label: "Mobile linked to Aadhaar", type: "tel", required: true, pattern: "^[6-9]\\d{9}$" },
    { key: "fields_to_update", label: "What do you want to update?", type: "textarea", required: true, maxLength: 600, help: "List each field and its new value." },
  ],
  documents: COMMON_DOCS,
};

const UDYAM_DOWNLOAD: OnboardingSchema = {
  title: "Download / Print Udyam Certificate",
  description: "We need your existing Udyam number and Aadhaar-linked mobile to fetch the certificate.",
  fields: [
    { key: "applicant_name", label: "Applicant Name", type: "text", required: true, maxLength: 120 },
    { key: "udyam_number", label: "Udyam Registration Number", type: "text", required: true, placeholder: "UDYAM-XX-00-0000000" },
    { key: "aadhaar_mobile", label: "Mobile linked to Aadhaar", type: "tel", required: true, pattern: "^[6-9]\\d{9}$" },
  ],
  documents: [],
};

const MIGRATE: OnboardingSchema = {
  title: "Migrate Udyog Aadhaar to Udyam",
  description: "Old UAM number plus your current Aadhaar and PAN.",
  fields: [
    { key: "applicant_name", label: "Applicant Name", type: "text", required: true, maxLength: 120 },
    { key: "uam_number", label: "Existing Udyog Aadhaar (UAM) Number", type: "text", required: true, maxLength: 30 },
    { key: "aadhaar_number", label: "Aadhaar Number", type: "text", required: true, pattern: "^\\d{12}$" },
    { key: "pan_number", label: "PAN Number", type: "text", required: true, pattern: "^[A-Z]{5}\\d{4}[A-Z]$", maxLength: 10 },
    { key: "aadhaar_mobile", label: "Mobile linked to Aadhaar", type: "tel", required: true, pattern: "^[6-9]\\d{9}$" },
  ],
  documents: COMMON_DOCS,
};

const FORGOT_MOBILE: OnboardingSchema = {
  title: "Recover Registered Mobile / Email",
  description: "Help us identify your record so we can reset the registered contact details.",
  fields: [
    { key: "applicant_name", label: "Applicant Name", type: "text", required: true, maxLength: 120 },
    { key: "udyam_number", label: "Udyam Number (if known)", type: "text", required: false, maxLength: 40 },
    { key: "aadhaar_number", label: "Aadhaar Number", type: "text", required: true, pattern: "^\\d{12}$" },
    { key: "new_mobile", label: "New mobile to register", type: "tel", required: true, pattern: "^[6-9]\\d{9}$" },
    { key: "new_email", label: "New email to register", type: "email", required: true },
    { key: "reason", label: "Reason / details", type: "textarea", required: false, maxLength: 600 },
  ],
  documents: COMMON_DOCS,
};

const DEFAULT: OnboardingSchema = {
  title: "Tell us more about your requirement",
  description: "Share details and any supporting documents so our expert can call you with a clear plan.",
  fields: [
    { key: "applicant_name", label: "Applicant Name", type: "text", required: true, maxLength: 120 },
    { key: "alt_mobile", label: "Alternate Mobile", type: "tel", required: false, pattern: "^[6-9]\\d{9}$" },
    { key: "details", label: "Describe your requirement", type: "textarea", required: true, maxLength: 1200 },
  ],
  documents: [
    { key: "aadhaar_front", label: "Aadhaar Card (front)", required: false },
    { key: "pan_card", label: "PAN Card", required: false },
  ],
};

export const ONBOARDING_SCHEMAS: Record<string, OnboardingSchema> = {
  "new-udyam-registration": NEW_UDYAM,
  "update-udyam-certificate": UDYAM_UPDATE,
  "download-udyam-certificate": UDYAM_DOWNLOAD,
  "migrate-udyog-aadhaar-to-udyam": MIGRATE,
  "forgot-mobile-email": FORGOT_MOBILE,
  "correct-pan-aadhaar": UDYAM_UPDATE,
  "talk-to-expert": DEFAULT,
};

export function getSchema(serviceCode: string | null | undefined): OnboardingSchema {
  if (!serviceCode) return DEFAULT;
  return ONBOARDING_SCHEMAS[serviceCode] ?? DEFAULT;
}

export const MAX_DOC_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_DOC_MIME = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
