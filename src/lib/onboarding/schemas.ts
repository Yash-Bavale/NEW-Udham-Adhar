// Per-service onboarding field schemas and required document lists.
// Client-safe (no server imports).

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "date"
  | "select"
  | "textarea"
  | "nic";

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
  nicDigits?: 2 | 4 | 5;
  /** For nic fields: read activity_type from this sibling field key */
  activityFrom?: string;
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
  "Proprietary / एकल स्वामित्व",
  "Hindu Undivided Family / हिंदू अविभाजित परिवार (HUF)",
  "Partnership / पार्टनरशिप",
  "Co-Operative / सहकारी",
  "Private Limited Company / प्राइवेट लिमिटेड कंपनी",
  "Public Limited Company / पब्लिक लिमिटेड कंपनी",
  "Self Help Group / स्वयं सहायता समूह",
  "Limited Liability Partnership / सीमित दायित्व भागीदारी",
  "Society / सोसाइटी",
  "Trust / ट्रस्ट",
  "Others / अन्य",
] as const;

const SOCIAL_CATEGORY = ["General", "SC", "ST", "OBC"] as const;
const GENDER = ["Male", "Female", "Others"] as const;
const YES_NO = ["Yes", "No"] as const;
const GST_OPTIONS = ["Yes", "No", "Exempted"] as const;
const ACTIVITY_TYPES = ["Manufacturing", "Services", "Trading"] as const;
const REGISTRATION_HISTORY = ["N/A", "EM-II", "Previous UAM"] as const;
const FORGOT_USER_TYPES = [
  "MSME unit with UAM or Udyam Registration",
  "MSME unit without UAM or Udyam Registration",
  "Individuals or Others",
  "Associations",
] as const;

export const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

const COMMON_DOCS: DocDef[] = [
  { key: "aadhaar_front", label: "Aadhaar Card (front)", required: true },
  { key: "aadhaar_back", label: "Aadhaar Card (back)", required: true },
  { key: "pan_card", label: "PAN Card", required: true },
];

const NEW_UDYAM: OnboardingSchema = {
  title: "New Udyam Registration — Incomplete Information",
  description:
    "Fill the Aadhaar, PAN, enterprise, bank and activity details required to prepare your Udyam registration request.",
  fields: [
    { key: "aadhaar_number", label: "1. Aadhaar Number", type: "text", required: true, pattern: "^\\d{12}$", placeholder: "12 digit Aadhaar number" },
    { key: "applicant_name", label: "2. Your Name (as per Aadhaar)", type: "text", required: true, maxLength: 120 },
    { key: "business_type", label: "3. Type of Organisation", type: "select", required: true, options: BUSINESS_TYPES },
    { key: "pan_number", label: "4.1 PAN Number", type: "text", required: true, pattern: "^[A-Z]{5}\\d{4}[A-Z]$", placeholder: "ABCDE1234F", maxLength: 10 },
    { key: "pan_holder_name", label: "4.1.1 Name of PAN Card Holder", type: "text", required: true, maxLength: 120 },
    { key: "pan_dob", label: "4.1.2 Date of Birth as per PAN Card", type: "date", required: true },
    { key: "itr_previous_year", label: "4.2 Have you filed ITR for PY 2024–25?", type: "select", required: true, options: YES_NO },
    { key: "gstin_status", label: "4.3 Do you have GSTIN?", type: "select", required: true, options: GST_OPTIONS },
    { key: "written_down_value", label: "5. Written Down Value (WDV) as on 31 March 2024–25 (A)", type: "number", required: true, placeholder: "Example: 200000" },
    { key: "exclusion_cost", label: "6. Exclusion of cost — Pollution Control / R&D / Industrial Safety Devices 2024–25 (B)", type: "number", required: false, placeholder: "Example: 20000" },
    { key: "total_turnover", label: "7. Total Turnover during 2024–25", type: "number", required: true, placeholder: "Example: 200000" },
    { key: "business_name", label: "8. Name of Enterprise", type: "text", required: true, maxLength: 200 },
    { key: "aadhaar_mobile", label: "9. Mobile Number (+91)", type: "tel", required: true, pattern: "^[6-9]\\d{9}$", placeholder: "10 digit mobile number" },
    { key: "email", label: "10. Email", type: "email", required: true, placeholder: "info@gmail.com" },
    { key: "social_category", label: "11. Social Category", type: "select", required: true, options: SOCIAL_CATEGORY },
    { key: "gender", label: "12. Gender", type: "select", required: true, options: GENDER },
    { key: "specially_abled", label: "13. Specially Abled (Divyang)", type: "select", required: true, options: YES_NO },
    { key: "address_flat", label: "14. Flat / Door / Block No.", type: "text", required: true, maxLength: 120 },
    { key: "address_premises", label: "14a. Name of Premises / Building", type: "text", required: false, maxLength: 160 },
    { key: "address_village", label: "14b. Village / Town", type: "text", required: true, maxLength: 120 },
    { key: "address_block", label: "14c. Block", type: "text", required: false, maxLength: 120 },
    { key: "address_road", label: "14d. Road / Street / Lane", type: "text", required: false, maxLength: 160 },
    { key: "city", label: "14e. City", type: "text", required: true, maxLength: 80 },
    { key: "pincode", label: "14f. PIN Code", type: "text", required: true, pattern: "^\\d{6}$", maxLength: 6 },
    { key: "state", label: "14g. State", type: "text", required: true, maxLength: 80 },
    { key: "district", label: "14h. District", type: "text", required: true, maxLength: 80 },
    { key: "previous_registration", label: "16. Previous EM-II / UAM Registration Number, if any", type: "select", required: true, options: REGISTRATION_HISTORY },
    { key: "incorporation_date", label: "17a. Date of Incorporation / Registration", type: "date", required: true },
    { key: "business_commenced", label: "17b. Whether production/business commenced", type: "select", required: true, options: YES_NO },
    { key: "commencement_date", label: "17c. Date of Commencement", type: "date", required: false },
    { key: "bank_name", label: "18a. Bank Name", type: "text", required: true, maxLength: 120 },
    { key: "bank_ifsc", label: "18b. IFSC Code", type: "text", required: true, pattern: "^[A-Z]{4}0[A-Z0-9]{6}$", maxLength: 11 },
    { key: "bank_account_no", label: "18c. Bank Account Number", type: "text", required: true, maxLength: 30 },
    { key: "major_activity", label: "19. Major Activity of Unit", type: "select", required: true, options: ACTIVITY_TYPES },
    { key: "nic_2_digit", label: "20a. NIC 2 Digit Code", type: "nic", required: true, nicDigits: 2, activityFrom: "major_activity", help: "Search and select your business division." },
    { key: "nic_4_digit", label: "20b. NIC 4 Digit Code", type: "nic", required: true, nicDigits: 4, activityFrom: "major_activity", help: "Narrow down to your business group." },
    { key: "nic_5_digit", label: "20c. NIC 5 Digit Code", type: "nic", required: true, nicDigits: 5, activityFrom: "major_activity", help: "Pick the exact 5-digit sub-class for your activity." },
    { key: "employees_male", label: "21a. Persons employed — Male", type: "number", required: false },
    { key: "employees_female", label: "21b. Persons employed — Female", type: "number", required: false },
    { key: "employees_others", label: "21c. Persons employed — Others", type: "number", required: false },
    { key: "gem_registration", label: "22. Interested in Government e-Marketplace (GeM) Portal?", type: "select", required: false, options: YES_NO },
    { key: "treds_registration", label: "23. Interested in TReDS Portals?", type: "select", required: false, options: YES_NO },
    { key: "ncs_registration", label: "24. Interested in National Career Service (NCS) Portal?", type: "select", required: false, options: YES_NO },
    { key: "nsic_b2b_registration", label: "25. Interested in NSIC B2B Portal?", type: "select", required: false, options: YES_NO },
    { key: "skill_india_registration", label: "26. Interested in Skill India Digital Portal?", type: "select", required: false, options: YES_NO },
  ],
  documents: [
    ...COMMON_DOCS,
    { key: "bank_proof", label: "Bank Passbook / Cancelled Cheque", required: true },
    { key: "business_proof", label: "Business Address Proof (rent / electricity)", required: false },
  ],
};

const UDYAM_UPDATE: OnboardingSchema = {
  title: "Update Udyam Certificate — Incomplete Information",
  description: "Share your existing Udyam number and registered contact details so our team can process the update request.",
  fields: [
    { key: "applicant_name", label: "Applicant Name", type: "text", required: true, maxLength: 120 },
    { key: "udyam_number", label: "Udyam Registration Number", type: "text", required: true, pattern: "^UDYAM-[A-Z]{2}-\\d{2}-\\d{7}$", maxLength: 19, placeholder: "UDYAM-MH-26-0276396", help: "Format: UDYAM-<State>-<Year>-<7 digits>, e.g. UDYAM-MH-26-0276396" },
    { key: "registered_mobile", label: "Registered Mobile Number", type: "tel", required: true, pattern: "^[6-9]\\d{9}$", placeholder: "10 digit registered mobile" },
    { key: "registered_email", label: "Registered Email ID", type: "email", required: false, placeholder: "Registered email, if available" },
    { key: "fields_to_update", label: "What details need to be updated?", type: "textarea", required: false, maxLength: 1200, help: "Mention any details our team should update or verify." },
  ],
  documents: [
    { key: "current_udyam_certificate", label: "Current Udyam Certificate", required: false },
    { key: "aadhaar_card", label: "Aadhaar Card", required: false },
    { key: "pan_card", label: "PAN Card", required: false },
  ],
};

const UDYAM_DOWNLOAD: OnboardingSchema = {
  title: "Udyam Registration Certificate Download — Incomplete Information",
  description: "Provide the existing Udyam number and registered mobile number/email ID so we can assist with certificate download.",
  fields: [
    { key: "applicant_name", label: "Applicant Name", type: "text", required: true, maxLength: 120 },
    { key: "udyam_number", label: "Udyam Registration Number", type: "text", required: true, pattern: "^UDYAM-[A-Z]{2}-\\d{2}-\\d{7}$", maxLength: 19, placeholder: "UDYAM-MH-26-0276396", help: "Format: UDYAM-<State>-<Year>-<7 digits>, e.g. UDYAM-MH-26-0276396" },
    { key: "registered_mobile", label: "Registered Mobile Number", type: "tel", required: true, pattern: "^[6-9]\\d{9}$" },
    { key: "registered_email", label: "Registered Email ID", type: "email", required: false },
  ],
  documents: [],
};

const MIGRATE: OnboardingSchema = {
  title: "Migrate — Incomplete Information",
  description: "Share your Udyog Aadhaar number so our experts can verify migration requirements.",
  fields: [
    { key: "applicant_name", label: "Applicant Name", type: "text", required: true, maxLength: 120 },
    { key: "uam_number", label: "Udyog Aadhaar Number", type: "text", required: true, pattern: "^[A-Z]{2}\\d{2}[A-Z]\\d{7}$", placeholder: "DL05A0000001", maxLength: 12, help: "Format: first 2 alphabets, then 2 digits, then 1 alphabet, then 7 digits." },
    { key: "registered_mobile", label: "Registered Mobile Number", type: "tel", required: false, pattern: "^[6-9]\\d{9}$" },
    { key: "registered_email", label: "Registered Email ID", type: "email", required: false },
  ],
  documents: [
    { key: "udyog_aadhaar_certificate", label: "Existing Udyog Aadhaar / UAM Certificate", required: false },
    { key: "aadhaar_card", label: "Aadhaar Card", required: false },
    { key: "pan_card", label: "PAN Card", required: false },
  ],
};

const FORGOT_MOBILE: OnboardingSchema = {
  title: "Forgot Registered Mobile / Email — Incomplete Information",
  description: "Fill the applicant contact and identity details required to prepare the update request and signed application.",
  fields: [
    { key: "user_type", label: "Select Type of User", type: "select", required: true, options: FORGOT_USER_TYPES },
    { key: "aadhaar_number", label: "Aadhaar Number", type: "text", required: true, pattern: "^\\d{12}$" },
    { key: "applicant_name", label: "Name (as per Aadhaar)", type: "text", required: true, maxLength: 120 },
    { key: "aadhaar_address", label: "Address (as per Aadhaar)", type: "textarea", required: true, maxLength: 600 },
    { key: "pan_number", label: "PAN Card Number", type: "text", required: true, pattern: "^[A-Z]{5}\\d{4}[A-Z]$", maxLength: 10 },
    { key: "pincode", label: "PIN Code", type: "text", required: true, pattern: "^\\d{6}$", maxLength: 6 },
    { key: "state", label: "State", type: "text", required: true, maxLength: 80 },
    { key: "district", label: "District", type: "text", required: true, maxLength: 80 },
    { key: "new_email", label: "Email ID (please enter correct email)", type: "email", required: true },
    { key: "new_mobile", label: "Mobile Number (+91)", type: "tel", required: true, pattern: "^[6-9]\\d{9}$" },
    { key: "udyam_or_uam_number", label: "UAM / Udyam Registration Number (if available)", type: "text", required: false, maxLength: 40 },
  ],
  documents: [
    { key: "aadhaar_card_pdf", label: "Aadhaar Card PDF", required: true },
    { key: "pan_card_pdf", label: "PAN Card PDF", required: true },
    { key: "signed_application_format", label: "Signed Application Format", required: false, help: "Download the generated application, sign it, then upload it here." },
  ],
};

const CORRECT_PAN_AADHAAR: OnboardingSchema = {
  title: "Correct PAN / Aadhaar Name in Udyam — Incomplete Information",
  description: "Provide your Udyam number and registered contact details so our team can assist with correction requirements.",
  fields: [
    { key: "applicant_name", label: "Applicant Name", type: "text", required: true, maxLength: 120 },
    { key: "udyam_number", label: "Udyam Registration Number", type: "text", required: true, pattern: "^UDYAM-[A-Z]{2}-\\d{2}-\\d{7}$", maxLength: 19, placeholder: "UDYAM-MH-26-0276396", help: "Format: UDYAM-<State>-<Year>-<7 digits>, e.g. UDYAM-MH-26-0276396" },
    { key: "registered_mobile", label: "Registered Mobile Number", type: "tel", required: true, pattern: "^[6-9]\\d{9}$" },
    { key: "registered_email", label: "Registered Email ID", type: "email", required: false },
    { key: "correction_needed", label: "Correction required", type: "textarea", required: false, maxLength: 800, help: "Mention whether PAN name, Aadhaar name, or both require correction." },
  ],
  documents: [
    { key: "current_udyam_certificate", label: "Current Udyam Certificate", required: false },
    { key: "aadhaar_card", label: "Aadhaar Card", required: false },
    { key: "pan_card", label: "PAN Card", required: false },
  ],
};

// Talk-to-Expert is a paid consultation. After payment we skip the intake form
// and go straight to the thank-you page — but we still register a stub schema
// so getSchema() and the onboarding pipeline have a known mapping.
const TALK_TO_EXPERT: OnboardingSchema = {
  title: "Talk to Expert — Consultation Booked",
  description: "Your consultation request has been received. Our expert will contact you on your registered mobile.",
  fields: [],
  documents: [],
};

// Default fallback used when a lead's service can't be mapped to a known schema.
const DEFAULT: OnboardingSchema = NEW_UDYAM;

export const ONBOARDING_SCHEMAS: Record<string, OnboardingSchema> = {
  "new-udyam-registration": NEW_UDYAM,
  "update-udyam-certificate": UDYAM_UPDATE,
  "download-udyam-certificate": UDYAM_DOWNLOAD,
  "migrate-udyog-aadhaar-to-udyam": MIGRATE,
  "forgot-mobile-email": FORGOT_MOBILE,
  "correct-pan-aadhaar": CORRECT_PAN_AADHAAR,
  "talk-to-expert": TALK_TO_EXPERT,
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
