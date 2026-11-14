const SERVICES = [
  { slug: "new-udyam-registration", label: "New Udyam Registration", price: 99 },
  { slug: "update-udyam-certificate", label: "Update Udyam Certificate", price: 99 },
  { slug: "download-udyam-certificate", label: "Download Udyam Certificate", price: 99 },
  { slug: "migrate-udyog-aadhaar-to-udyam", label: "Udyog Aadhaar to Udyam Migration", price: 99 },
  { slug: "forgot-mobile-email", label: "Forgot Registered Mobile / Email", price: 99 },
  { slug: "correct-pan-aadhaar", label: "Correct PAN / Aadhaar Name in Udyam", price: 99 },
  { slug: "talk-to-expert", label: "Talk to Expert – Suitable Service Selection", price: 99 }
];
SERVICES.map((s) => s.label);
const INDIAN_STATES = [
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
  "Uttarakhand",
  "Uttar Pradesh",
  "West Bengal"
];
const LANGUAGES = ["Hindi", "English"];
const NAV_LINKS = [
  { to: "/new-udyam-registration", label: "New Udyam" },
  { to: "/update-udyam-certificate", label: "Update Udyam" },
  { to: "/download-udyam-certificate", label: "Download Udyam" },
  { to: "/migrate-udyog-aadhaar-to-udyam", label: "Migrate Udyog Aadhar" },
  { to: "/other-problem", label: "Other Problem" },
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact us" },
  { to: "/important-notice", label: "Important Notice" },
  { to: "/complaint-grievance-policy", label: "Complaint & Grievance Policy" }
];
const DISCLAIMER_TEXT = "Disclaimer: Business Help Services is an independent business assistance and support service provider and is not affiliated with, authorized by, endorsed by, or associated with any government authority or department. All charges collected through this website are solely for assistance, processing, documentation, and support services and do not constitute any government fee or statutory fee payable to any government authority.";
export {
  DISCLAIMER_TEXT as D,
  INDIAN_STATES as I,
  LANGUAGES as L,
  NAV_LINKS as N,
  SERVICES as S
};
