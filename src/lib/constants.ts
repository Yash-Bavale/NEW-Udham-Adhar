// Single source of truth for static dropdown data, services, and pricing.

export const SERVICES = [
  { slug: "new-udyam-registration", label: "New Udyam Registration", price: 99 },
  { slug: "update-udyam-certificate", label: "Update Udyam Certificate", price: 99 },
  { slug: "download-udyam-certificate", label: "Download Udyam Certificate", price: 99 },
  { slug: "migrate-udyog-aadhaar-to-udyam", label: "Migrate Udyog Aadhaar to Udyam", price: 99 },
  { slug: "forgot-mobile-email", label: "Forgot Registered Mobile / Email", price: 99 },
  { slug: "correct-pan-aadhaar", label: "Correct PAN / Aadhaar Name in Udyam", price: 99 },
  { slug: "talk-to-expert", label: "Talk to Expert – Suitable Service Selection", price: 99 },
] as const;

export const SERVICE_LABELS = SERVICES.map(s => s.label);

export const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttarakhand",
  "Uttar Pradesh","West Bengal",
];

export const LANGUAGES = ["English", "Hindi", "Marathi"];

export const GST_RATE = 0.18;

export function computeAmounts(base: number) {
  const baseAmount = Math.round(base * 100) / 100;
  const gstAmount = Math.round(base * GST_RATE * 100) / 100;
  const totalAmount = Math.round((base + gstAmount) * 100) / 100;
  return { baseAmount, gstAmount, totalAmount };
}

export const NAV_LINKS = [
  { to: "/new-udyam-registration", label: "New Udyam" },
  { to: "/update-udyam-certificate", label: "Update Udyam" },
  { to: "/download-udyam-certificate", label: "Download Udyam" },
  { to: "/migrate-udyog-aadhaar-to-udyam", label: "Migrate Udyog Aadhar" },
  { to: "/other-problem", label: "Other Problem" },
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact us" },
  { to: "/important-notice", label: "Important Notice" },
  { to: "/complaint-grievance-policy", label: "Complaint & Grievance Policy" },
] as const;

export const DISCLAIMER_TEXT =
  "Disclaimer: Business Help Services Is A Private Consultancy And Assistance Service Provider And Is Not Affiliated With, Authorized By, Endorsed By, Or Associated With Any Government Authority Or Department. All Charges Collected On This Website Are Strictly Consultancy & Assistance Service Fees Only, And Not Any Government Fee.";
