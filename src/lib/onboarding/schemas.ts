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
const TALK_TO_EXPERT_OPTIONS = [
  "New Udyam Registration",
  "Update Udyam Certificate",
  "Download Udyam Certificate",
  "Migrate Udyog Aadhaar to Udyam",
  "Forgot Registered Mobile / Email",
  "Correct PAN / Aadhaar Name in Udyam",
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
    { key: "aadhaar_number", label: "Aadhaar Number", type: "text", required: true, pattern: "^\\d{12}$", placeholder: "12 digit Aadhaar number" },
    { key: "applicant_name", label: "Your Name (as per Aadhaar)", type: "text", required: true, maxLength: 120 },
    { key: "business_type", label: "Type of Organisation", type: "select", required: true, options: BUSINESS_TYPES },
    { key: "pan_number", label: "PAN Number", type: "text", required: true, pattern: "^[A-Z]{5}\\d{4}[A-Z]$", placeholder: "ABCDE1234F", maxLength: 10 },
    { key: "pan_holder_name", label: "Name of PAN Card Holder", type: "text", required: true, maxLength: 120 },
    { key: "pan_dob", label: "Date of Birth as per PAN Card", type: "date", required: true },
    { key: "itr_previous_year", label: "Have you filed ITR for Previous Year 2024–25?", type: "select", required: true, options: YES_NO },
    { key: "gstin_status", label: "Do you have GSTIN?", type: "select", required: true, options: GST_OPTIONS },
    { key: "written_down_value", label: "Written Down Value (WDV) as on 31 March 2024–25", type: "number", required: true, placeholder: "Example: 200000" },
    { key: "exclusion_cost", label: "Exclusion cost for pollution control/R&D/industrial safety devices during 2024–25", type: "number", required: false, placeholder: "Example: 20000" },
    { key: "total_turnover", label: "Total Turnover during 2024–25", type: "number", required: true, placeholder: "Example: 200000" },
    { key: "business_name", label: "Name of Enterprise", type: "text", required: true, maxLength: 200 },
    { key: "aadhaar_mobile", label: "Mobile Number (+91)", type: "tel", required: true, pattern: "^[6-9]\\d{9}$", placeholder: "10 digit mobile number" },
    { key: "email", label: "Email", type: "email", required: true, placeholder: "info@gmail.com" },
    { key: "social_category", label: "Social Category", type: "select", required: true, options: SOCIAL_CATEGORY },
    { key: "gender", label: "Gender", type: "select", required: true, options: GENDER },
    { key: "specially_abled", label: "Specially Abled (Divyang)", type: "select", required: true, options: YES_NO },
    { key: "address_flat", label: "Flat / Door / Block No.", type: "text", required: true, maxLength: 120 },
    { key: "address_premises", label: "Name of Premises / Building", type: "text", required: false, maxLength: 160 },
    { key: "address_village", label: "Village / Town", type: "text", required: true, maxLength: 120 },
    { key: "address_block", label: "Block", type: "text", required: false, maxLength: 120 },
    { key: "address_road", label: "Road / Street / Lane", type: "text", required: false, maxLength: 160 },
    { key: "city", label: "City", type: "text", required: true, maxLength: 80 },
    { key: "pincode", label: "PIN Code", type: "text", required: true, pattern: "^\\d{6}$", maxLength: 6 },
    { key: "state", label: "State", type: "text", required: true, maxLength: 80 },
    { key: "district", label: "District", type: "text", required: true, maxLength: 80 },
    { key: "previous_registration", label: "Previous EM-II/UAM Registration Number, if any", type: "select", required: true, options: REGISTRATION_HISTORY },
    { key: "incorporation_date", label: "Date of Incorporation / Registration", type: "date", required: true },
    { key: "business_commenced", label: "Whether production/business commenced", type: "select", required: true, options: YES_NO },
    { key: "commencement_date", label: "Date of Commencement", type: "date", required: false },
    { key: "bank_name", label: "Bank Name", type: "text", required: true, maxLength: 120 },
    { key: "bank_ifsc", label: "IFSC Code", type: "text", required: true, pattern: "^[A-Z]{4}0[A-Z0-9]{6}$", maxLength: 11 },
    { key: "bank_account_no", label: "Bank Account Number", type: "text", required: true, maxLength: 30 },
    { key: "major_activity", label: "Major Activity of Unit", type: "select", required: true, options: ACTIVITY_TYPES },
    { key: "nic_2_digit", label: "NIC 2 Digit Code", type: "text", required: false, maxLength: 120 },
    { key: "nic_4_digit", label: "NIC 4 Digit Code", type: "text", required: false, maxLength: 120 },
    { key: "nic_5_digit", label: "NIC 5 Digit Code", type: "text", required: false, maxLength: 120 },
    { key: "employees_male", label: "Number of persons employed — Male", type: "number", required: false },
    { key: "employees_female", label: "Number of persons employed — Female", type: "number", required: false },
    { key: "employees_others", label: "Number of persons employed — Others", type: "number", required: false },
    { key: "gem_registration", label: "Interested in Government e-Marketplace (GeM) Portal?", type: "select", required: false, options: YES_NO },
    { key: "treds_registration", label: "Interested in TReDS Portals?", type: "select", required: false, options: YES_NO },
    { key: "ncs_registration", label: "Interested in National Career Service (NCS) Portal?", type: "select", required: false, options: YES_NO },
    { key: "nsic_b2b_registration", label: "Interested in NSIC B2B Portal?", type: "select", required: false, options: YES_NO },
    { key: "skill_india_registration", label: "Interested in Skill India Digital Portal?", type: "select", required: false, options: YES_NO },
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
    { key: "udyam_number", label: "Udyam Registration Number", type: "text", required: true, placeholder: "UDYAM-XX-00-0000000" },
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
  title: "Download Udyam Certificate — Incomplete Information",
  description: "Provide the existing Udyam number and registered mobile number/email ID so we can assist with certificate download.",
  fields: [
    { key: "applicant_name", label: "Applicant Name", type: "text", required: true, maxLength: 120 },
    { key: "udyam_number", label: "Udyam Registration Number", type: "text", required: true, placeholder: "UDYAM-XX-00-0000000" },
    { key: "registered_mobile", label: "Registered Mobile Number", type: "tel", required: true, pattern: "^[6-9]\\d{9}$" },
    { key: "registered_email", label: "Registered Email ID", type: "email", required: false },
  ],
  documents: [],
};

const MIGRATE: OnboardingSchema = {
  title: "Migrate Udyog Aadhaar to Udyam — Incomplete Information",
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
    { key: "udyam_number", label: "Udyam Registration Number", type: "text", required: true, placeholder: "UDYAM-XX-00-0000000" },
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

const DEFAULT: OnboardingSchema = {
  title: "Talk to Expert — Suitable Service Selection",
  description: "Select the service you need help with and share any context so our expert can guide the next step.",
  fields: [
    { key: "applicant_name", label: "Applicant Name", type: "text", required: true, maxLength: 120 },
    { key: "selected_service", label: "Select Service", type: "select", required: true, options: TALK_TO_EXPERT_OPTIONS },
    { key: "alt_mobile", label: "Alternate Mobile", type: "tel", required: false, pattern: "^[6-9]\\d{9}$" },
    { key: "details", label: "Describe your requirement", type: "textarea", required: false, maxLength: 1200 },
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
  "correct-pan-aadhaar": CORRECT_PAN_AADHAAR,
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
