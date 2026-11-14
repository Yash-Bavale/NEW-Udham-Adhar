import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { m as motion } from "../_libs/motion.mjs";
import { isFieldVisible, clearHiddenFields, CHECKBOX_ON, INDIA_STATES } from "./schemas-DClqju6h.mjs";
import { j as useServerFn, H as Button, a as cn, b6 as Popover, b7 as PopoverTrigger, b8 as PopoverContent, b9 as Calendar$1 } from "./router-QgJicixe.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { promoteNicActivities, parseNicActivities, extractNicCode, searchNicUnified, getNicDivisions, getNicClasses, getNicSubclasses, nicLabel } from "./nic-fill-ia8FfFhd.mjs";
import { E as Check, L as LoaderCircle, v as Search, X, l as CircleCheck, aw as Plus, az as Trash2, z as Calendar } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { o as object, n as number, _ as _enum, s as string } from "../_libs/zod.mjs";
const INDIA_DISTRICTS = {
  "Andaman and Nicobar Islands": [
    "Nicobars",
    "North And Middle Andaman",
    "South Andamans"
  ],
  "Andhra Pradesh": [
    "Alluri Sitharama Raju",
    "Anakapalli",
    "Ananthapuramu",
    "Annamayya",
    "Bapatla",
    "Chittoor",
    "Dr. B.R. Ambedkar Konaseema",
    "East Godavari",
    "Eluru",
    "Guntur",
    "Kakinada",
    "Krishna",
    "Kurnool",
    "Markapuram",
    "Nandyal",
    "Ntr",
    "Palnadu",
    "Parvathipuram Manyam",
    "Polavaram",
    "Prakasam",
    "Sri Potti Sriramulu Nellore",
    "Sri Sathya Sai",
    "Srikakulam",
    "Tirupati",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
    "Y.S.R. Kadapa"
  ],
  "Arunachal Pradesh": [
    "Anjaw",
    "Bichom",
    "Changlang",
    "Dibang Valley",
    "East Kameng",
    "East Siang",
    "Kamle",
    "Keyi Panyor",
    "Kra Daadi",
    "Kurung Kumey",
    "Leparada",
    "Lohit",
    "Longding",
    "Lower Dibang Valley",
    "Lower Siang",
    "Lower Subansiri",
    "Namsai",
    "Pakke Kessang",
    "Papum Pare",
    "Shi Yomi",
    "Siang",
    "Tawang",
    "Tirap",
    "Upper Siang",
    "Upper Subansiri",
    "West Kameng",
    "West Siang"
  ],
  "Assam": [
    "Bajali",
    "Baksa",
    "Barpeta",
    "Biswanath",
    "Bongaigaon",
    "Cachar",
    "Charaideo",
    "Chirang",
    "Darrang",
    "Dhemaji",
    "Dhubri",
    "Dibrugarh",
    "Dima Hasao",
    "Goalpara",
    "Golaghat",
    "Hailakandi",
    "Hojai",
    "Jorhat",
    "Kamrup",
    "Kamrup Metro",
    "Karbi Anglong",
    "Kokrajhar",
    "Lakhimpur",
    "Majuli",
    "Marigaon",
    "Nagaon",
    "Nalbari",
    "Sivasagar",
    "Sonitpur",
    "South Salmara Mancachar",
    "Sribhumi",
    "Tamulpur",
    "Tinsukia",
    "Udalguri",
    "West Karbi Anglong"
  ],
  "Bihar": [
    "Araria",
    "Arwal",
    "Aurangabad",
    "Banka",
    "Begusarai",
    "Bhagalpur",
    "Bhojpur",
    "Buxar",
    "Darbhanga",
    "Gaya",
    "Gopalganj",
    "Jamui",
    "Jehanabad",
    "Kaimur (Bhabua)",
    "Katihar",
    "Khagaria",
    "Kishanganj",
    "Lakhisarai",
    "Madhepura",
    "Madhubani",
    "Munger",
    "Muzaffarpur",
    "Nalanda",
    "Nawada",
    "Pashchim Champaran",
    "Patna",
    "Purbi Champaran",
    "Purnia",
    "Rohtas",
    "Saharsa",
    "Samastipur",
    "Saran",
    "Sheikhpura",
    "Sheohar",
    "Sitamarhi",
    "Siwan",
    "Supaul",
    "Vaishali"
  ],
  "Chandigarh": [
    "Chandigarh"
  ],
  "Chhattisgarh": [
    "Balod",
    "Balodabazar-Bhatapara",
    "Balrampur-Ramanujganj",
    "Bastar",
    "Bemetara",
    "Bijapur",
    "Bilaspur",
    "Dakshin Bastar Dantewada",
    "Dhamtari",
    "Durg",
    "Gariyaband",
    "Gaurela-Pendra-Marwahi",
    "Janjgir-Champa",
    "Jashpur",
    "Kabeerdham",
    "Khairagarh-Chhuikhadan-Gandai",
    "Kondagaon",
    "Korba",
    "Korea",
    "Mahasamund",
    "Manendragarh-Chirmiri-Bharatpur(M C B)",
    "Mohla-Manpur-Ambagarh Chouki",
    "Mungeli",
    "Narayanpur",
    "Raigarh",
    "Raipur",
    "Rajnandgaon",
    "Sakti",
    "Sarangarh-Bilaigarh",
    "Sukma",
    "Surajpur",
    "Surguja",
    "Uttar Bastar Kanker"
  ],
  "Delhi": [
    "Central",
    "Central North",
    "East",
    "New Delhi",
    "North",
    "North East",
    "North West",
    "Old Delhi",
    "Outer North",
    "South",
    "South East",
    "South West",
    "West"
  ],
  "Goa": [
    "Kushavati",
    "North Goa",
    "South Goa"
  ],
  "Gujarat": [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Arvalli",
    "Banas Kantha",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhotaudepur",
    "Dahod",
    "Dangs",
    "Devbhumi Dwarka",
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kachchh",
    "Kheda",
    "Mahesana",
    "Mahisagar",
    "Morbi",
    "Narmada",
    "Navsari",
    "Panch Mahals",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabar Kantha",
    "Surat",
    "Surendranagar",
    "Tapi",
    "Vadodara",
    "Valsad",
    "Vav-Tharad"
  ],
  "Haryana": [
    "Ambala",
    "Bhiwani",
    "Charkhi Dadri",
    "Faridabad",
    "Fatehabad",
    "Gurugram",
    "Hansi",
    "Hisar",
    "Jhajjar",
    "Jind",
    "Kaithal",
    "Karnal",
    "Kurukshetra",
    "Mahendragarh",
    "Nuh",
    "Palwal",
    "Panchkula",
    "Panipat",
    "Rewari",
    "Rohtak",
    "Sirsa",
    "Sonipat",
    "Yamunanagar"
  ],
  "Himachal Pradesh": [
    "Bilaspur",
    "Chamba",
    "Hamirpur",
    "Kangra",
    "Kinnaur",
    "Kullu",
    "Lahaul And Spiti",
    "Mandi",
    "Shimla",
    "Sirmaur",
    "Solan",
    "Una"
  ],
  "Jammu and Kashmir": [
    "Anantnag",
    "Bandipora",
    "Baramulla",
    "Budgam",
    "Doda",
    "Ganderbal",
    "Jammu",
    "Kathua",
    "Kishtwar",
    "Kulgam",
    "Kupwara",
    "Poonch",
    "Pulwama",
    "Rajouri",
    "Ramban",
    "Reasi",
    "Samba",
    "Shopian",
    "Srinagar",
    "Udhampur"
  ],
  "Jharkhand": [
    "Bokaro",
    "Chatra",
    "Deoghar",
    "Dhanbad",
    "Dumka",
    "East Singhbum",
    "Garhwa",
    "Giridih",
    "Godda",
    "Gumla",
    "Hazaribagh",
    "Jamtara",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Pakur",
    "Palamu",
    "Ramgarh",
    "Ranchi",
    "Sahebganj",
    "Saraikela Kharsawan",
    "Simdega",
    "West Singhbhum"
  ],
  "Karnataka": [
    "Bagalkote",
    "Ballari",
    "Belagavi",
    "Bengaluru Rural",
    "Bengaluru South",
    "Bengaluru Urban",
    "Bidar",
    "Chamarajanagar",
    "Chikkaballapura",
    "Chikkamagaluru",
    "Chitradurga",
    "Dakshina Kannada",
    "Davanagere",
    "Dharwad",
    "Gadag",
    "Hassan",
    "Haveri",
    "Kalaburagi",
    "Kodagu",
    "Kolar",
    "Koppal",
    "Mandya",
    "Mysuru",
    "Raichur",
    "Shivamogga",
    "Tumakuru",
    "Udupi",
    "Uttara Kannada",
    "Vijayanagara",
    "Vijayapura",
    "Yadgir"
  ],
  "Kerala": [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad"
  ],
  "Ladakh": [
    "Kargil",
    "Leh Ladakh"
  ],
  "Lakshadweep": [
    "Lakshadweep District"
  ],
  "Madhya Pradesh": [
    "Agar-Malwa",
    "Alirajpur",
    "Anuppur",
    "Ashoknagar",
    "Balaghat",
    "Barwani",
    "Betul",
    "Bhind",
    "Bhopal",
    "Burhanpur",
    "Chhatarpur",
    "Chhindwara",
    "Damoh",
    "Datia",
    "Dewas",
    "Dhar",
    "Dindori",
    "Guna",
    "Gwalior",
    "Harda",
    "Indore",
    "Jabalpur",
    "Jhabua",
    "Katni",
    "Khandwa (East Nimar)",
    "Khargone (West Nimar)",
    "Maihar",
    "Mandla",
    "Mandsaur",
    "MAUGANJ",
    "Morena",
    "Narmadapuram",
    "Narsimhapur",
    "Neemuch",
    "Niwari",
    "Pandhurna",
    "Panna",
    "Raisen",
    "Rajgarh",
    "Ratlam",
    "Rewa",
    "Sagar",
    "Satna",
    "Sehore",
    "Seoni",
    "Shahdol",
    "Shajapur",
    "Sheopur",
    "Shivpuri",
    "Sidhi",
    "Singrauli",
    "Tikamgarh",
    "Ujjain",
    "Umaria",
    "Vidisha"
  ],
  "Maharashtra": [
    "Ahilyanagar",
    "Akola",
    "Amravati",
    "Beed",
    "Bhandara",
    "Buldhana",
    "Chandrapur",
    "Chhatrapati Sambhajinagar",
    "Dharashiv",
    "Dhule",
    "Gadchiroli",
    "Gondia",
    "Hingoli",
    "Jalgaon",
    "Jalna",
    "Kolhapur",
    "Latur",
    "Mumbai",
    "Mumbai Suburban",
    "Nagpur",
    "Nanded",
    "Nandurbar",
    "Nashik",
    "Palghar",
    "Parbhani",
    "Pune",
    "Raigad",
    "Ratnagiri",
    "Sangli",
    "Satara",
    "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Washim",
    "Yavatmal"
  ],
  "Manipur": [
    "Bishnupur",
    "Chandel",
    "Churachandpur",
    "Imphal East",
    "Imphal West",
    "Jiribam",
    "Kakching",
    "Kamjong",
    "Kangpokpi",
    "Noney",
    "Pherzawl",
    "Senapati",
    "Tamenglong",
    "Tengnoupal",
    "Thoubal",
    "Ukhrul"
  ],
  "Meghalaya": [
    "East Garo Hills",
    "East Jaintia Hills",
    "East Khasi Hills",
    "Eastern West Khasi Hills",
    "North Garo Hills",
    "Ri Bhoi",
    "South Garo Hills",
    "South West Garo Hills",
    "South West Khasi Hills",
    "West Garo Hills",
    "West Jaintia Hills",
    "West Khasi Hills"
  ],
  "Mizoram": [
    "Aizawl",
    "Champhai",
    "Hnahthial",
    "Khawzawl",
    "Kolasib",
    "Lawngtlai",
    "Lunglei",
    "Mamit",
    "Saitual",
    "Serchhip",
    "Siaha"
  ],
  "Nagaland": [
    "Chumoukedima",
    "Dimapur",
    "Kiphire",
    "Kohima",
    "Longleng",
    "Meluri",
    "Mokokchung",
    "Mon",
    "Niuland",
    "Noklak",
    "Peren",
    "Phek",
    "Shamator",
    "Tseminyu",
    "Tuensang",
    "Wokha",
    "Zunheboto"
  ],
  "Odisha": [
    "Anugola",
    "Balangir",
    "Baleshwar",
    "Baragada",
    "Bhadrak",
    "Boudh",
    "Debagada",
    "Dhenkanal",
    "Gajapati",
    "Ganjam",
    "Jagatsinghapur",
    "Jajpur",
    "Jharsuguda",
    "Kalahandi",
    "Kandhamala",
    "Kataka",
    "Kendrapada",
    "Kendujhar",
    "Khordha",
    "Koraput",
    "Malkangiri",
    "Mayurbhanj",
    "Nabarangpur",
    "Nayagada",
    "Nuapada",
    "Puri",
    "Rayagada",
    "Sambalpur",
    "Subarnapur",
    "Sundaragada"
  ],
  "Puducherry": [
    "Karaikal",
    "Puducherry"
  ],
  "Punjab": [
    "Amritsar",
    "Barnala",
    "Bathinda",
    "Faridkot",
    "Fatehgarh Sahib",
    "Fazilka",
    "Ferozepur",
    "Gurdaspur",
    "Hoshiarpur",
    "Jalandhar",
    "Kapurthala",
    "Ludhiana",
    "Malerkotla",
    "Mansa",
    "Moga",
    "Pathankot",
    "Patiala",
    "Rupnagar",
    "S.A.S Nagar",
    "Sangrur",
    "Shahid Bhagat Singh Nagar",
    "Sri Muktsar Sahib",
    "Tarn Taran"
  ],
  "Rajasthan": [
    "Ajmer",
    "Alwar",
    "Balotra",
    "Banswara",
    "Baran",
    "Barmer",
    "Beawar",
    "Bharatpur",
    "Bhilwara",
    "Bikaner",
    "Bundi",
    "Chittorgarh",
    "Churu",
    "Dausa",
    "Deeg",
    "Dholpur",
    "Didwana-Kuchaman",
    "Dungarpur",
    "Ganganagar",
    "Hanumangarh",
    "Jaipur",
    "Jaisalmer",
    "Jalore",
    "Jhalawar",
    "Jhunjhunu",
    "Jodhpur",
    "Karauli",
    "Khairthal-Tijara",
    "Kota",
    "Kotputli-Behror",
    "Nagaur",
    "Pali",
    "Phalodi",
    "Pratapgarh",
    "Rajsamand",
    "Salumbar",
    "Sawai Madhopur",
    "Sikar",
    "Sirohi",
    "Tonk",
    "Udaipur"
  ],
  "Sikkim": [
    "Gangtok",
    "Gyalshing",
    "Mangan",
    "Namchi",
    "Pakyong",
    "Soreng"
  ],
  "Tamil Nadu": [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Kanniyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "The Nilgiris",
    "Theni",
    "Thiruvallur",
    "Thiruvarur",
    "Thoothukkudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvannamalai",
    "Vellore",
    "Viluppuram",
    "Virudhunagar"
  ],
  "Telangana": [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hanumakonda",
    "Hyderabad",
    "Jagitial",
    "Jangoan",
    "Jayashankar Bhupalapally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Kumuram Bheem Asifabad",
    "Mahabubabad",
    "Mahabubnagar",
    "Mancherial",
    "Medak",
    "Medchal Malkajgiri",
    "Mulugu",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Ranga Reddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal",
    "Yadadri Bhuvanagiri"
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Dadra And Nagar Haveli",
    "Daman",
    "Diu"
  ],
  "Tripura": [
    "Dhalai",
    "Gomati",
    "Khowai",
    "North Tripura",
    "Sepahijala",
    "South Tripura",
    "Unakoti",
    "West Tripura"
  ],
  "Uttar Pradesh": [
    "Agra",
    "Aligarh",
    "Ambedkar Nagar",
    "Amethi",
    "Amroha",
    "Auraiya",
    "Ayodhya",
    "Azamgarh",
    "Baghpat",
    "Bahraich",
    "Ballia",
    "Balrampur",
    "Banda",
    "Bara Banki",
    "Bareilly",
    "Basti",
    "Bhadohi",
    "Bijnor",
    "Budaun",
    "Bulandshahr",
    "Chandauli",
    "Chitrakoot",
    "Deoria",
    "Etah",
    "Etawah",
    "Farrukhabad",
    "Fatehpur",
    "Firozabad",
    "Gautam Buddha Nagar",
    "Ghaziabad",
    "Ghazipur",
    "Gonda",
    "Gorakhpur",
    "Hamirpur",
    "Hapur",
    "Hardoi",
    "Hathras",
    "Jalaun",
    "Jaunpur",
    "Jhansi",
    "Kannauj",
    "Kanpur Dehat",
    "Kanpur Nagar",
    "Kasganj",
    "Kaushambi",
    "Kheri",
    "Kushinagar",
    "Lalitpur",
    "Lucknow",
    "Mahoba",
    "Mahrajganj",
    "Mainpuri",
    "Mathura",
    "Mau",
    "Meerut",
    "Mirzapur",
    "Moradabad",
    "Muzaffarnagar",
    "Pilibhit",
    "Pratapgarh",
    "Prayagraj",
    "Rae Bareli",
    "Rampur",
    "Saharanpur",
    "Sambhal",
    "Sant Kabir Nagar",
    "Shahjahanpur",
    "Shamli",
    "Shrawasti",
    "Siddharthnagar",
    "Sitapur",
    "Sonbhadra",
    "Sultanpur",
    "Unnao",
    "Varanasi"
  ],
  "Uttarakhand": [
    "Almora",
    "Bageshwar",
    "Chamoli",
    "Champawat",
    "Dehradun",
    "Haridwar",
    "Nainital",
    "Pauri Garhwal",
    "Pithoragarh",
    "Rudraprayag",
    "Tehri Garhwal",
    "Udham Singh Nagar",
    "Uttarkashi"
  ],
  "West Bengal": [
    "Alipurduar",
    "Bankura",
    "Birbhum",
    "Cooch Behar",
    "Dakshin Dinajpur",
    "Darjeeling",
    "Hooghly",
    "Howrah",
    "Jalpaiguri",
    "Jhargram",
    "Kalimpong",
    "Kolkata",
    "Malda",
    "Murshidabad",
    "Nadia",
    "North 24 Parganas",
    "Paschim Bardhaman",
    "Paschim Medinipur",
    "Purba Bardhaman",
    "Purba Medinipur",
    "Purulia",
    "South 24 Parganas",
    "Uttar Dinajpur"
  ]
};
const Input = object({
  q: string().trim().max(120).default(""),
  activity: _enum(["Manufacturing", "Services", "Trading"]).nullable().optional(),
  limit: number().int().min(1).max(50).default(20)
});
const searchNicCodes = createServerFn({
  method: "POST"
}).inputValidator((i) => Input.parse(i)).handler(createSsrRpc("fdd3883e9759e666d09c7eb23a1c3a7f7093102c8bbd05cc15ab961af17da738"));
const inputCls$1 = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";
const selectCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow disabled:bg-muted/50 disabled:text-muted-foreground disabled:cursor-not-allowed";
function NicCodeSection({
  sectionLabel = "20. National Industrial Classification (NIC) Code for Activities",
  hideHeader = false,
  values,
  onChange,
  setMany,
  activity
}) {
  const [adding, setAdding] = reactExports.useState(false);
  const [draft, setDraft] = reactExports.useState({ nic_2_digit: "", nic_4_digit: "", nic_5_digit: "" });
  const [draftActivity, setDraftActivity] = reactExports.useState(activity ?? "Services");
  const [activityError, setActivityError] = reactExports.useState("");
  const extras = reactExports.useMemo(() => parseNicActivities(values.nic_activities), [values.nic_activities]);
  const selected = adding ? draft : values;
  const updateSelection = (patch) => {
    if (adding) setDraft((previous) => ({ ...previous, ...patch }));
    else setMany(patch);
    setActivityError("");
  };
  const updateField = (key, value) => {
    if (adding) updateSelection({ [key]: value });
    else onChange(key, value);
  };
  const firstActivity = values.nic_5_digit ? {
    nic_2_digit: values.nic_2_digit,
    nic_4_digit: values.nic_4_digit,
    nic_5_digit: values.nic_5_digit,
    activity_type: activity ?? ""
  } : null;
  const activities = firstActivity ? [firstActivity, ...extras] : extras;
  function addActivity() {
    if (!adding) {
      if (!firstActivity) {
        setActivityError("Select a 5-digit NIC activity first.");
        return;
      }
      setDraft({ nic_2_digit: "", nic_4_digit: "", nic_5_digit: "" });
      setDraftActivity(activity ?? "Services");
      setAdding(true);
      setActivityError("");
      inputRef.current?.focus();
      return;
    }
    const code2 = extractNicCode(draft.nic_2_digit);
    const code4 = extractNicCode(draft.nic_4_digit);
    const code5 = extractNicCode(draft.nic_5_digit);
    if (code2.length !== 2 || code4.length !== 4 || code5.length !== 5 || !code5.startsWith(code4) || !code4.startsWith(code2)) {
      setActivityError("Select a complete 5-digit NIC activity before adding it.");
      return;
    }
    if (activities.some((item) => extractNicCode(item.nic_5_digit) === code5)) {
      setActivityError("This activity has already been added.");
      return;
    }
    const next = { nic_2_digit: draft.nic_2_digit, nic_4_digit: draft.nic_4_digit, nic_5_digit: draft.nic_5_digit, activity_type: draftActivity };
    setMany({ nic_activities: JSON.stringify([...extras, next]) });
    setDraft({ nic_2_digit: "", nic_4_digit: "", nic_5_digit: "" });
    setAdding(false);
    setActivityError("");
  }
  function removeActivity(index) {
    const extraIndex = firstActivity ? index - 1 : index;
    if (extraIndex < 0) return;
    setMany({ nic_activities: JSON.stringify(extras.filter((_, i) => i !== extraIndex)) });
  }
  const fetchNic = useServerFn(searchNicCodes);
  const [open, setOpen] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState("");
  const [activeIndex, setActiveIndex] = reactExports.useState(0);
  const [dbResults, setDbResults] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const wrapRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  const current2Code = extractNicCode(selected.nic_2_digit);
  const current4Code = extractNicCode(selected.nic_4_digit);
  const current5Code = extractNicCode(selected.nic_5_digit);
  reactExports.useEffect(() => {
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  reactExports.useEffect(() => {
    if (!open || !q.trim() || q.trim().length < 2) {
      setDbResults([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setErr(null);
    const t = window.setTimeout(async () => {
      try {
        const res = await fetchNic({
          data: { q: q.trim(), activity: activity ?? null, limit: 30 }
        });
        if (cancelled) return;
        setDbResults(res.results);
        if (res.error) setErr(res.error);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Search failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [q, open, activity, fetchNic]);
  const unifiedResults = reactExports.useMemo(() => {
    const needle = q.trim();
    if (!needle) return [];
    const local = searchNicUnified(needle, 35);
    const seenCodes = new Set(local.map((item) => item.code));
    const merged = [...local];
    for (const r of dbResults) {
      if (!seenCodes.has(r.code)) {
        seenCodes.add(r.code);
        merged.push({
          code: r.code,
          description: r.description,
          level: 5,
          label: `${r.code} — ${r.description}`
        });
      }
    }
    return merged.slice(0, 35);
  }, [q, dbResults]);
  const divisionOptions = reactExports.useMemo(() => getNicDivisions(), []);
  const classOptions = reactExports.useMemo(() => getNicClasses(current2Code), [current2Code]);
  const subclassOptions = reactExports.useMemo(() => {
    if (!current4Code) return [];
    const list = getNicSubclasses(current4Code);
    if (selected.nic_5_digit && !list.some((o) => o.code === current5Code || o.label === selected.nic_5_digit)) {
      list.unshift({ code: current5Code, label: selected.nic_5_digit });
    }
    return list;
  }, [current4Code, selected.nic_5_digit, current5Code]);
  function pickOption(option) {
    if (option.level === 5) {
      const l2 = nicLabel(option.code, 2);
      const l4 = nicLabel(option.code, 4);
      const l5 = nicLabel(option.code, 5, option.description) ?? option.label;
      updateSelection({
        nic_2_digit: l2 ?? "",
        nic_4_digit: l4 ?? "",
        nic_5_digit: l5
      });
    } else if (option.level === 4) {
      const l2 = nicLabel(option.code, 2);
      const l4 = nicLabel(option.code, 4, option.description) ?? option.label;
      updateSelection({
        nic_2_digit: l2 ?? "",
        nic_4_digit: l4,
        nic_5_digit: ""
      });
    } else if (option.level === 2) {
      const l2 = nicLabel(option.code, 2, option.description) ?? option.label;
      updateSelection({
        nic_2_digit: l2,
        nic_4_digit: "",
        nic_5_digit: ""
      });
    }
    setOpen(false);
    setQ("");
  }
  function handleClear() {
    updateSelection({
      nic_2_digit: "",
      nic_4_digit: "",
      nic_5_digit: ""
    });
    setQ("");
    setOpen(false);
    inputRef.current?.focus();
  }
  function onSearchKeyDown(e) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    const count = unifiedResults.length;
    if (e.key === "ArrowDown" && count > 0) {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, count - 1));
    } else if (e.key === "ArrowUp" && count > 0) {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && open && count > 0) {
      e.preventDefault();
      if (unifiedResults[activeIndex]) {
        pickOption(unifiedResults[activeIndex]);
      }
    }
  }
  const hasAnySelection = Boolean(selected.nic_2_digit || selected.nic_4_digit || selected.nic_5_digit);
  const displaySummary = selected.nic_5_digit || selected.nic_4_digit || selected.nic_2_digit || "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `md:col-span-2 space-y-4 ${hideHeader ? "" : "pt-4 mt-2 border-t border-border"}`, children: [
    !hideHeader && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base md:text-lg font-bold font-display text-brand-navy-deep", children: sectionLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Search your business activity or choose from the official classification hierarchy below." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: wrapRef, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "f-nic-unified-search", className: "block text-sm font-semibold text-foreground mb-1.5", children: "Search NIC Activity / Code" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Search,
            {
              "aria-hidden": "true",
              className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: inputRef,
              id: "f-nic-unified-search",
              value: open ? q : displaySummary,
              onFocus: () => {
                setQ("");
                setActiveIndex(0);
                setOpen(true);
              },
              onClick: () => setOpen(true),
              onChange: (e) => {
                setQ(e.target.value);
                setActiveIndex(0);
                setOpen(true);
              },
              onKeyDown: onSearchKeyDown,
              role: "combobox",
              "aria-expanded": open,
              "aria-controls": "f-nic-unified-results",
              "aria-autocomplete": "list",
              autoComplete: "off",
              placeholder: "Search by activity or code (e.g. software, wholesale, 4651, 62011)…",
              className: inputCls$1 + " pl-10 pr-9"
            }
          ),
          loading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" })
        ] }),
        (hasAnySelection || q) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            onClick: handleClear,
            variant: "outline",
            size: "icon",
            className: "h-auto min-h-10 shrink-0 text-muted-foreground hover:text-foreground",
            "aria-label": "Clear NIC selection",
            title: "Clear NIC selection",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
          }
        )
      ] }),
      open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          id: "f-nic-unified-results",
          role: "listbox",
          className: "absolute z-30 mt-1.5 w-full rounded-xl border border-border bg-background shadow-xl overflow-hidden max-h-80 overflow-y-auto",
          children: [
            loading && !unifiedResults.length && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 text-sm text-muted-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin text-primary" }),
              "Searching NIC codes…"
            ] }),
            err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 text-sm text-destructive", children: err }),
            !loading && !err && unifiedResults.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-6 text-center text-sm text-muted-foreground", children: q ? `No NIC codes found for "${q}". Try another keyword or 2/4-digit code.` : "Type a keyword or NIC code to search." }),
            unifiedResults.map((opt, index) => {
              const isSelected = selected.nic_5_digit.startsWith(`${opt.code} `) || selected.nic_4_digit.startsWith(`${opt.code} `) || selected.nic_2_digit.startsWith(`${opt.code} `);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  role: "option",
                  "aria-selected": isSelected,
                  onClick: () => pickOption(opt),
                  onMouseEnter: () => setActiveIndex(index),
                  className: `w-full whitespace-normal text-left px-3.5 py-2.5 flex items-start gap-2.5 border-b border-border/40 last:border-0 transition-colors ${activeIndex === index ? "bg-muted/70 text-foreground" : "text-foreground hover:bg-muted/40"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-brand-navy bg-brand-navy/10 px-2 py-0.5 rounded shrink-0", children: opt.code }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm leading-snug", children: opt.description }),
                    isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mt-0.5 size-4 text-emerald-600 shrink-0" })
                  ]
                },
                `${opt.level}-${opt.code}`
              );
            })
          ]
        }
      )
    ] }),
    selected.nic_5_digit ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 shrink-0 text-emerald-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Activity selected: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selected.nic_5_digit })
      ] })
    ] }) : selected.nic_4_digit ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      "4-digit class chosen. ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Select a 5-digit activity below" }),
      " to complete your application."
    ] }) }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "f-nic_2_digit", className: "block text-sm font-semibold text-foreground mb-1.5", children: [
          "NIC 2 Digit Code ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "f-nic_2_digit",
            value: current2Code ? nicLabel(current2Code, 2) ?? selected.nic_2_digit : "",
            onChange: (e) => {
              const val = e.target.value;
              updateSelection({
                nic_2_digit: val,
                nic_4_digit: "",
                nic_5_digit: ""
              });
            },
            className: selectCls,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select 2 Digit Code…" }),
              divisionOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.label, children: opt.label }, opt.code))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "f-nic_4_digit", className: "block text-sm font-semibold text-foreground mb-1.5", children: [
          "NIC 4 Digit Code ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "f-nic_4_digit",
            value: current4Code ? nicLabel(current4Code, 4) ?? selected.nic_4_digit : "",
            disabled: !current2Code,
            onChange: (e) => {
              const val = e.target.value;
              updateSelection({
                nic_4_digit: val,
                nic_5_digit: ""
              });
            },
            className: selectCls,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: current2Code ? "Select 4 Digit Code…" : "Select 2 Digit Code first" }),
              classOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.label, children: opt.label }, opt.code))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "f-nic_5_digit", className: "block text-sm font-semibold text-foreground mb-1.5", children: [
          "NIC 5 Digit Code ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "f-nic_5_digit",
            value: selected.nic_5_digit || "",
            disabled: !current4Code,
            onChange: (e) => {
              updateField("nic_5_digit", e.target.value);
            },
            className: selectCls,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: current4Code ? "Select 5 Digit Activity…" : "Select 4 Digit Code first" }),
              subclassOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.label, children: opt.label }, opt.code))
            ]
          }
        )
      ] })
    ] }),
    adding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "nic-activity-type", className: "text-sm font-medium text-foreground", children: "Activity type" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "nic-activity-type", value: draftActivity, onChange: (e) => setDraftActivity(e.target.value), className: selectCls + " w-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Manufacturing", children: "Manufacturing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Services", children: "Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Trading", children: "Trading" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", onClick: addActivity, className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " ",
        adding ? "Save Activity" : "Add Activity"
      ] }),
      adding && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => {
        setAdding(false);
        setActivityError("");
      }, children: "Cancel" })
    ] }),
    activityError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { role: "alert", className: "text-sm text-destructive", children: activityError }),
    activities.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border border-border rounded-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[580px] text-sm text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "No." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "NIC 2 Digit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "NIC 4 Digit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "NIC 5 Digit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Activity Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Remove" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: activities.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: index + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: item.nic_2_digit }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: item.nic_4_digit }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: item.nic_5_digit }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: item.activity_type || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: index === 0 && firstActivity ? "Primary" : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "icon", variant: "ghost", "aria-label": `Remove NIC activity ${index + 1}`, title: "Remove activity", onClick: () => removeActivity(index), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) }) })
      ] }, `${extractNicCode(item.nic_5_digit)}-${index}`)) })
    ] }) })
  ] });
}
function NicCodePicker({
  value,
  onChange,
  digits = 5,
  id,
  onPickCode,
  onPickLevel
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState("");
  const wrapRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const results = reactExports.useMemo(() => searchNicUnified(q, 25), [q]);
  function pick(opt) {
    if (onPickLevel) {
      onPickLevel(opt.code, opt.level);
    } else if (onPickCode) {
      onPickCode(opt.code);
    } else {
      onChange(nicLabel(opt.code, digits) ?? opt.label);
    }
    setOpen(false);
    setQ("");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: wrapRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id,
          value: open ? q : value,
          onFocus: () => setOpen(true),
          onClick: () => setOpen(true),
          onChange: (e) => {
            setQ(e.target.value);
            setOpen(true);
          },
          placeholder: "Search NIC code or activity description…",
          className: inputCls$1
        }
      ),
      value && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          onClick: () => onChange(""),
          variant: "outline",
          size: "icon",
          className: "h-auto min-h-10 shrink-0 text-muted-foreground",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
        }
      )
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-30 mt-1.5 w-full rounded-xl border border-border bg-background shadow-xl overflow-hidden max-h-72 overflow-y-auto", children: [
      results.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-6 text-center text-sm text-muted-foreground", children: q ? "No NIC codes match your search." : "Type to search NIC codes." }),
      results.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => pick(opt),
          className: "w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 border-b border-border/40 last:border-0 hover:bg-muted/50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-brand-navy bg-brand-navy/10 px-2 py-0.5 rounded shrink-0", children: opt.code }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm", children: opt.description })
          ]
        },
        `${opt.level}-${opt.code}`
      ))
    ] })
  ] });
}
function getTodayStart() {
  const d = /* @__PURE__ */ new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function isTodayOrFutureIso(iso) {
  if (!iso) return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return false;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  d.setHours(0, 0, 0, 0);
  return d >= getTodayStart();
}
function isoToDmy(iso) {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return "";
  return `${m[3]}/${m[2]}/${m[1]}`;
}
function dmyToIso(dmy, allowFuture = false) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dmy.trim());
  if (!m) return { iso: null };
  const [, dd, mm, yyyy] = m;
  const d = Number(dd), mo = Number(mm), y = Number(yyyy);
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || y < 1900 || y > 2100) return { iso: null };
  const test = new Date(Date.UTC(y, mo - 1, d));
  if (test.getUTCFullYear() !== y || test.getUTCMonth() !== mo - 1 || test.getUTCDate() !== d) return { iso: null };
  const selectedDate = new Date(y, mo - 1, d);
  selectedDate.setHours(0, 0, 0, 0);
  if (!allowFuture && selectedDate >= getTodayStart()) {
    return { iso: null, error: "Date cannot be today or a future date" };
  }
  return { iso: `${yyyy}-${mm}-${dd}` };
}
function maskDmy(input) {
  const digits = input.replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join("/");
}
function DateInputDMY({
  id,
  name,
  value,
  onChange,
  required,
  placeholder = "DD/MM/YYYY",
  className,
  disabled,
  allowFuture = false
}) {
  const [text, setText] = reactExports.useState(isoToDmy(value));
  const [open, setOpen] = reactExports.useState(false);
  const [errorMsg, setErrorMsg] = reactExports.useState(null);
  const wrapperRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    setText(isoToDmy(value));
    if (value && !allowFuture && isTodayOrFutureIso(value)) {
      setErrorMsg("Date cannot be today or a future date");
    } else {
      setErrorMsg(null);
    }
  }, [value, allowFuture]);
  const iso = value || "";
  const selected = iso ? /* @__PURE__ */ new Date(`${iso}T00:00:00`) : void 0;
  const inputCls2 = cn(
    "w-full rounded-xl border bg-background pl-4 pr-11 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow",
    errorMsg ? "border-destructive focus:ring-destructive" : "border-border"
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: wrapperRef, className: cn("relative", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        id,
        name,
        type: "text",
        inputMode: "numeric",
        autoComplete: "off",
        required,
        disabled,
        value: text,
        placeholder,
        maxLength: 10,
        onChange: (e) => {
          const masked = maskDmy(e.target.value);
          setText(masked);
          const res = dmyToIso(masked, allowFuture);
          if (res.error) {
            setErrorMsg(res.error);
            onChange("");
          } else if (res.iso) {
            setErrorMsg(null);
            onChange(res.iso);
          } else {
            setErrorMsg(null);
            if (!masked) onChange("");
          }
        },
        onBlur: () => {
          const res = dmyToIso(text, allowFuture);
          if (res.error) {
            setErrorMsg(res.error);
            onChange("");
            setText("");
          } else if (res.iso) {
            setErrorMsg(null);
            onChange(res.iso);
          } else if (!text) {
            setErrorMsg(null);
            onChange("");
          } else {
            setText(isoToDmy(value));
          }
        },
        className: inputCls2
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          disabled,
          "aria-label": "Open calendar",
          className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-ring",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4" })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-auto p-0", align: "end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Calendar$1,
        {
          mode: "single",
          selected,
          defaultMonth: selected,
          disabled: allowFuture ? void 0 : (date) => date >= getTodayStart(),
          onSelect: (d) => {
            if (!d) return;
            if (!allowFuture && d >= getTodayStart()) return;
            const y = d.getFullYear();
            const mo = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            const nextIso = `${y}-${mo}-${dd}`;
            setErrorMsg(null);
            onChange(nextIso);
            setText(isoToDmy(nextIso));
            setOpen(false);
          },
          className: cn("p-3 pointer-events-auto")
        }
      ) })
    ] }),
    errorMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive font-medium", children: errorMsg })
  ] });
}
const DateInputDMY$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DateInputDMY,
  getTodayStart,
  isTodayOrFutureIso
}, Symbol.toStringTag, { value: "Module" }));
const UPPERCASE_FIELDS = /* @__PURE__ */ new Set([
  "bank_ifsc",
  "udyam_number",
  "uam_number",
  "pan_number",
  "pan_holder_pan",
  "gstin"
]);
const TITLECASE_FIELDS = /* @__PURE__ */ new Set([
  "applicant_name",
  "pan_holder_name",
  "authorized_person_name",
  "bank_name",
  "branch_name",
  "enterprise_name",
  "organisation_name",
  "address_flat",
  "address_premises",
  "address_village",
  "address_block",
  "address_road",
  "city"
]);
const PRESERVE_UPPER = /* @__PURE__ */ new Set([
  "PVT",
  "LTD",
  "LLP",
  "HUF",
  "OPC",
  "INC",
  "CO",
  "PLC",
  "LLC",
  "SSI",
  "MSME",
  "IT",
  "BPO",
  "KPO",
  "HR",
  "R&D",
  "II",
  "III",
  "IV",
  "VI",
  "VII",
  "VIII",
  "IX",
  "XI",
  "XII"
]);
function toTitleCase(input) {
  if (!input) return input;
  return input.toLowerCase().replace(/\s+/g, " ").split(" ").map(
    (word) => word.split("-").map((seg) => {
      const upper = seg.toUpperCase();
      if (PRESERVE_UPPER.has(upper)) return upper;
      if (!seg) return seg;
      return seg.charAt(0).toUpperCase() + seg.slice(1);
    }).join("-")
  ).join(" ");
}
function validatePattern(pattern, val) {
  if (!pattern || !val) return true;
  const trimmed = val.trim();
  if (/^UDYAM-X+-X+-X+$/i.test(pattern.trim())) {
    pattern = "^(UDYAM-[A-Z]{2}-\\d{2}-\\d{7}|[A-Z0-9-]{8,25})$";
  }
  try {
    const anchored = pattern.startsWith("^") && pattern.endsWith("$") ? pattern : `^(${pattern})$`;
    return new RegExp(anchored, "i").test(trimmed);
  } catch {
    try {
      return new RegExp(pattern, "i").test(trimmed);
    } catch {
      return true;
    }
  }
}
const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";
function mergeDefaults(initial, fields) {
  const merged = { ...initial };
  for (const f of fields) {
    const current = merged[f.key];
    if ((current === void 0 || current === "") && f.default) {
      merged[f.key] = f.default;
    }
  }
  return merged;
}
function OnboardingForm({
  schema,
  initial,
  busy,
  onSubmit,
  onSubmitted,
  onSaveDraft,
  submitLabel = "Save & Continue",
  submittingLabel = "Opening next step…",
  successMessage = "Details submitted successfully. Opening next step…"
}) {
  const [values, setValues] = reactExports.useState(() => mergeDefaults(initial, schema.fields));
  const [err, setErr] = reactExports.useState(null);
  const [saveState, setSaveState] = reactExports.useState("idle");
  const [savedAt, setSavedAt] = reactExports.useState(null);
  const [submitSuccess, setSubmitSuccess] = reactExports.useState(false);
  const timer = reactExports.useRef(null);
  const lastSavedJson = reactExports.useRef(JSON.stringify(initial));
  const lastInitialJson = reactExports.useRef(JSON.stringify(initial));
  const onSaveDraftRef = reactExports.useRef(onSaveDraft);
  const mounted = reactExports.useRef(false);
  reactExports.useEffect(() => {
    onSaveDraftRef.current = onSaveDraft;
  }, [onSaveDraft]);
  reactExports.useEffect(() => {
    const nextInitialJson = JSON.stringify(initial);
    if (nextInitialJson === lastInitialJson.current) return;
    lastInitialJson.current = nextInitialJson;
    lastSavedJson.current = nextInitialJson;
    mounted.current = false;
    setValues(mergeDefaults(initial, schema.fields));
    setErr(null);
    setSubmitSuccess(false);
    setSaveState("idle");
    setSavedAt(null);
  }, [initial, schema.fields]);
  reactExports.useEffect(() => {
    if (!onSaveDraftRef.current) return;
    if (busy) {
      if (timer.current) window.clearTimeout(timer.current);
      return;
    }
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const current = JSON.stringify(values);
    if (current === lastSavedJson.current) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try {
        setSaveState("saving");
        await onSaveDraftRef.current?.(values);
        lastSavedJson.current = current;
        setSavedAt(Date.now());
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, 1500);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [values, busy]);
  function update(k, v) {
    setValues((s) => {
      const next = { ...s, [k]: v };
      if (k === "state" && s.state !== v) next.district = "";
      const cleared = clearHiddenFields(schema.fields, next);
      const nicFields = schema.fields.filter((field) => /^nic_[245]_digit$/.test(field.key));
      if (nicFields.length && nicFields.every((field) => !isFieldVisible(field, schema.fields, cleared))) {
        cleared.nic_activities = "";
      }
      return cleared;
    });
  }
  const stateValues = values;
  async function handle(e, values2 = promoteNicActivities(stateValues)) {
    e.preventDefault();
    if (timer.current) window.clearTimeout(timer.current);
    setErr(null);
    setSubmitSuccess(false);
    if (values2 !== stateValues) setValues(values2);
    for (const f of schema.fields) {
      if (f.type === "note" || f.type === "section") continue;
      if (!isFieldVisible(f, schema.fields, values2)) continue;
      if (f.required) {
        const v = values2[f.key];
        if (v === void 0 || v === null || String(v).trim() === "") {
          setErr(`Please fill out required field: ${f.label}`);
          setSubmitSuccess(false);
          return;
        }
      }
    }
    const plantsField = schema.fields.find((f) => f.type === "plants" || f.key === "plants");
    if (plantsField && isFieldVisible(plantsField, schema.fields, values2)) {
      const parsedPlants = parsePlants(values2[plantsField.key] ?? "");
      if (parsedPlants.length === 0) {
        setErr("At least one Plant / Unit detail is required. Please fill in address details for Plant / Unit #1.");
        setSubmitSuccess(false);
        return;
      }
      for (let i = 0; i < parsedPlants.length; i++) {
        const p = parsedPlants[i];
        if (!p.unit_name?.trim() || !p.address_flat?.trim() || !p.address_village?.trim() || !p.address_road?.trim() || !p.city?.trim() || !p.pincode?.trim() || !p.state?.trim() || !p.district?.trim()) {
          setErr(`Please complete all required address details for Plant / Unit #${i + 1} (Unit Name, Flat No, Village, Road, City, Pincode, State, District).`);
          setSubmitSuccess(false);
          return;
        }
      }
    }
    const { isTodayOrFutureIso: isTodayOrFutureIso2 } = await Promise.resolve().then(() => DateInputDMY$1);
    for (const f of schema.fields) {
      if (f.type === "date" && values2[f.key]) {
        if (isTodayOrFutureIso2(values2[f.key])) {
          setErr(`${f.label}: Date cannot be today or a future date. Please select a past date.`);
          setSubmitSuccess(false);
          return;
        }
      }
    }
    if (values2.incorporation_date && values2.commencement_date && values2.commencement_date < values2.incorporation_date) {
      setErr("Date of Commencement cannot be earlier than Date of Incorporation / Registration.");
      setSubmitSuccess(false);
      return;
    }
    for (const f of schema.fields) {
      if (f.type === "note" || f.type === "section") continue;
      if (f.pattern && values2[f.key] && String(values2[f.key]).trim() !== "") {
        let val = String(values2[f.key]).trim();
        const isEmail = f.type === "email" || f.key.toLowerCase().includes("email") || f.label.toLowerCase().includes("email");
        if (isEmail) {
          val = val.toLowerCase();
          values2[f.key] = val;
        }
        if (!validatePattern(f.pattern, val)) {
          const hint = f.help ? ` (${f.help})` : f.placeholder ? ` (e.g. ${f.placeholder})` : "";
          setErr(`Invalid format for ${f.label}${hint}.`);
          setSubmitSuccess(false);
          return;
        }
      }
    }
    try {
      await onSubmit(values2);
      setSubmitSuccess(true);
      setSaveState("saved");
      setSavedAt(Date.now());
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      await onSubmitted?.();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Could not save. Please try again.");
      setSubmitSuccess(false);
    }
  }
  const sectionGroups = reactExports.useMemo(() => {
    const groups = [];
    let currentGroup = {
      key: "section_default",
      label: "",
      isNic: false,
      fields: []
    };
    for (const f of schema.fields) {
      if (f.type === "note") continue;
      const isNicKey = f.key === "nic_2_digit" || f.key === "nic_4_digit" || f.key === "nic_5_digit";
      if (f.type === "section") {
        const isNic = f.key === "section_nic";
        if (currentGroup.fields.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = {
          key: f.key,
          label: f.label,
          isNic,
          fields: []
        };
        continue;
      }
      if (isNicKey) {
        if (!currentGroup.isNic) {
          if (currentGroup.fields.length > 0) {
            groups.push(currentGroup);
          }
          currentGroup = {
            key: `section_nic_${f.key}`,
            label: currentGroup.fields.length === 0 && currentGroup.label ? currentGroup.label : "National Industrial Classification (NIC) Code",
            isNic: true,
            fields: [f]
          };
        } else {
          currentGroup.fields.push(f);
        }
        continue;
      }
      if (currentGroup.isNic) {
        if (currentGroup.fields.length > 0) groups.push(currentGroup);
        currentGroup = {
          key: `section_${f.key}`,
          label: "",
          isNic: false,
          fields: []
        };
      }
      currentGroup.fields.push(f);
    }
    if (currentGroup.fields.length > 0) {
      groups.push(currentGroup);
    }
    return groups;
  }, [schema.fields]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handle, className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: sectionGroups.map((group, groupIdx) => {
      const visibleFields = group.fields.filter((f) => isFieldVisible(f, schema.fields, values));
      if (visibleFields.length === 0) {
        return null;
      }
      const showHeader = Boolean(group.label && (sectionGroups.length > 1 || group.label !== "Details"));
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all",
          children: [
            showHeader && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-slate-100 bg-gradient-to-r from-slate-50 via-slate-50/70 to-white px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex size-6 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-white text-xs font-bold shadow-xs", children: groupIdx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate", children: group.label })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 sm:p-5", children: group.isNic ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              NicCodeSection,
              {
                sectionLabel: group.label || "National Industrial Classification (NIC) Code for Activities",
                hideHeader: showHeader,
                values,
                onChange: (k, v) => update(k, v),
                setMany: (patch) => setValues((s) => clearHiddenFields(schema.fields, { ...s, ...patch })),
                activity: values.major_activity === "Manufacturing" || values.major_activity === "Services" || values.major_activity === "Trading" ? values.major_activity : null
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: visibleFields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              FieldRenderer,
              {
                field: f,
                value: values[f.key] ?? "",
                allValues: values,
                onChange: (v) => update(f.key, v),
                setMany: (patch) => setValues((s) => ({ ...s, ...patch }))
              },
              f.key
            )) }) })
          ]
        },
        group.key
      );
    }) }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm px-3 py-2", children: err }),
    submitSuccess && !err && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-sm px-3 py-2 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }),
      " ",
      successMessage
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col-reverse sm:flex-row gap-3 justify-between items-stretch sm:items-center pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SaveIndicator, { state: saveState, savedAt }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "submit",
          disabled: busy || submitSuccess,
          className: "inline-flex items-center justify-center gap-2 rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold px-8 py-2.5 transition-colors disabled:opacity-60",
          children: [
            (busy || submitSuccess) && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
            busy || submitSuccess ? submittingLabel : submitLabel
          ]
        }
      )
    ] })
  ] });
}
function SaveIndicator({ state, savedAt }) {
  const [, force] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const id = window.setInterval(() => force((n) => n + 1), 3e4);
    return () => window.clearInterval(id);
  }, []);
  const rel = savedAt ? relativeTime(savedAt) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground flex items-center gap-1.5 min-h-[20px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
    state === "saving" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.span,
      {
        initial: { opacity: 0, y: 4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
        className: "flex items-center gap-1.5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }),
          " Saving draft…"
        ]
      },
      "saving"
    ),
    state === "saved" && rel && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.span,
      {
        initial: { opacity: 0, y: 4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
        className: "flex items-center gap-1.5 text-emerald-600",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }),
          " Saved ",
          rel
        ]
      },
      "saved"
    ),
    state === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.span,
      {
        initial: { opacity: 0, y: 4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
        className: "text-destructive",
        children: "Couldn't autosave — your edits stay on this page."
      },
      "error"
    )
  ] }) });
}
function relativeTime(ts) {
  const s = Math.round((Date.now() - ts) / 1e3);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  return `${Math.round(m / 60)}h ago`;
}
function FieldRenderer({
  field,
  value,
  allValues,
  onChange,
  setMany
}) {
  const nicDigitsFromKey = field.key === "nic_2_digit" ? 2 : field.key === "nic_4_digit" ? 4 : field.key === "nic_5_digit" ? 5 : null;
  const isNicField = field.type === "nic" || nicDigitsFromKey !== null;
  const colSpan = field.type === "textarea" || isNicField || field.type === "plants" ? "md:col-span-2" : "";
  const id = `f-${field.key}`;
  const isState = field.type === "state" || field.key === "state";
  const isDistrict = field.type === "district" || field.key === "district";
  const pat = field.pattern ?? "";
  const isPincode = field.key === "pincode" || /^(\^|\()?(\\d|\[0-9\])\{6\}(\$|\))?$/.test(pat);
  const isMobile = field.type === "tel" || /^(\^|\()?\[6-9\](\\d|\[0-9\])\{9\}(\$|\))?$/.test(pat);
  const isAadhaar = field.key === "aadhaar_number" || /^(\^|\()?(\\d|\[0-9\])\{12\}(\$|\))?$/.test(pat);
  const isPan = field.key === "pan_number" || /^(\^|\()?\[A-Z\]\{5\}(\\d|\[0-9\])\{4\}\[A-Z\](\$|\))?$/i.test(pat);
  const isUpper = UPPERCASE_FIELDS.has(field.key);
  const isTitle = TITLECASE_FIELDS.has(field.key);
  const transform = (raw) => {
    if (isPincode) return raw.replace(/\D/g, "").slice(0, 6);
    if (isMobile) return raw.replace(/\D/g, "").slice(0, 10);
    if (isAadhaar) return raw.replace(/\D/g, "").slice(0, 12);
    if (isPan) return raw.toUpperCase().replace(/\s/g, "").slice(0, 10);
    if (isUpper) return raw.toUpperCase();
    return raw;
  };
  const handleBlur = (e) => {
    if (isTitle) {
      const titled = toTitleCase(e.target.value);
      if (titled !== e.target.value) onChange(titled);
    }
  };
  const common = {
    id,
    name: field.key,
    required: field.required,
    placeholder: field.placeholder,
    maxLength: field.maxLength,
    pattern: field.pattern,
    value,
    onChange: (e) => onChange(transform(e.target.value)),
    className: inputCls
  };
  const activityRaw = field.activityFrom ? allValues[field.activityFrom] : isNicField ? allValues.major_activity : void 0;
  const activity = activityRaw === "Manufacturing" || activityRaw === "Services" || activityRaw === "Trading" ? activityRaw : null;
  let htmlType = field.type;
  let inputMode;
  if (isPincode || isMobile || isAadhaar) {
    htmlType = "tel";
    inputMode = "numeric";
  } else if (field.type === "number") {
    inputMode = "decimal";
  } else if (isPan || isUpper) {
    htmlType = "text";
  }
  const currentState = allValues.state ?? "";
  const districtOptions = isDistrict ? INDIA_DISTRICTS[currentState] ?? [] : [];
  if (field.type === "checkbox") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: id, className: "flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id,
            name: field.key,
            type: "checkbox",
            className: "h-4 w-4 accent-primary",
            checked: value === CHECKBOX_ON,
            onChange: (e) => onChange(e.target.checked ? CHECKBOX_ON : "")
          }
        ),
        field.label,
        field.required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: " *" })
      ] }),
      field.help && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: field.help })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: colSpan, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: id, className: "block text-sm font-semibold text-foreground mb-1.5", children: [
      field.label,
      field.required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: " *" })
    ] }),
    field.type === "textarea" ? /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { ...common, onBlur: handleBlur, rows: 3 }) : field.type === "date" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      DateInputDMY,
      {
        id,
        name: field.key,
        value,
        onChange,
        required: field.required,
        placeholder: field.placeholder ?? "DD/MM/YYYY"
      }
    ) : field.type === "plants" ? /* @__PURE__ */ jsxRuntimeExports.jsx(PlantsField, { value, onChange }) : isState ? /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { ...common, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select state…" }),
      value && !INDIA_STATES.includes(value) && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value, children: value }),
      INDIA_STATES.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: s, children: [
        i + 1,
        ". ",
        s
      ] }, s))
    ] }) : isDistrict ? /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { ...common, disabled: !currentState, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: currentState ? "Select district…" : "Select state first" }),
      value && !districtOptions.includes(value) && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value, children: value }),
      districtOptions.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: d, children: [
        i + 1,
        ". ",
        d
      ] }, d))
    ] }) : field.type === "select" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { ...common, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select…" }),
      (field.options ?? []).map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o, children: o }, o))
    ] }) : isNicField ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      NicCodePicker,
      {
        id,
        value,
        onChange,
        digits: field.nicDigits ?? nicDigitsFromKey ?? 5,
        activity,
        required: field.required,
        onPickCode: nicDigitsFromKey !== null && setMany ? (code5) => {
          const patch = {};
          for (const d of [2, 4, 5]) {
            const k = `nic_${d}_digit`;
            const l = nicLabel(code5, d);
            if (l && k in allValues) patch[k] = l;
          }
          patch[field.key] = nicLabel(code5, nicDigitsFromKey) ?? value;
          setMany(patch);
        } : void 0
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: htmlType,
        inputMode,
        autoCapitalize: isPan || isUpper ? "characters" : isTitle ? "words" : void 0,
        autoComplete: isMobile ? "tel" : field.type === "email" ? "email" : void 0,
        onBlur: handleBlur,
        ...common
      }
    ),
    field.help && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: field.help })
  ] });
}
function emptyPlant() {
  return {
    unit_name: "",
    address_flat: "",
    address_premises: "",
    address_village: "",
    address_block: "",
    address_road: "",
    city: "",
    pincode: "",
    state: "",
    district: ""
  };
}
function parsePlants(value) {
  if (!value) return [];
  try {
    const arr = JSON.parse(value);
    if (!Array.isArray(arr)) return [];
    return arr.map((p) => ({ ...emptyPlant(), ...p }));
  } catch {
    return [];
  }
}
function PlantsField({ value, onChange }) {
  const parsed = parsePlants(value);
  const plants = parsed.length > 0 ? parsed : [emptyPlant()];
  const commit = (next) => {
    onChange(next.length ? JSON.stringify(next) : "");
  };
  const setField = (idx, key, v) => {
    const next = plants.map((p, i) => {
      if (i !== idx) return p;
      const updated = { ...p, [key]: v };
      if (key === "state") updated.district = "";
      if (key === "pincode") updated.pincode = v.replace(/\D/g, "").slice(0, 6);
      return updated;
    });
    commit(next);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "At least 1 Plant / Unit / Branch address details entry is compulsory." }),
    plants.map((p, i) => {
      const districtOpts = INDIA_DISTRICTS[p.state] ?? [];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/30 p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-semibold text-brand-navy-deep", children: [
            "Plant / Unit #",
            i + 1,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          plants.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => commit(plants.filter((_, j) => j !== i)),
              className: "text-xs inline-flex items-center gap-1 text-destructive hover:underline",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" }),
                " Remove"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlantInput, { label: "Unit / Plant Name *", value: p.unit_name, onChange: (v) => setField(i, "unit_name", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlantInput, { label: "Flat / Door / Block No. *", value: p.address_flat, onChange: (v) => setField(i, "address_flat", v), maxLength: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlantInput, { label: "Name of Premises / Building", value: p.address_premises, onChange: (v) => setField(i, "address_premises", v), maxLength: 50 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlantInput, { label: "Village / Town *", value: p.address_village, onChange: (v) => setField(i, "address_village", v), maxLength: 30 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlantInput, { label: "Block", value: p.address_block, onChange: (v) => setField(i, "address_block", v), maxLength: 30 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlantInput, { label: "Road / Street / Lane *", value: p.address_road, onChange: (v) => setField(i, "address_road", v), maxLength: 30 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlantInput, { label: "City *", value: p.city, onChange: (v) => setField(i, "city", v), maxLength: 25 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlantInput, { label: "PIN Code *", value: p.pincode, onChange: (v) => setField(i, "pincode", v), inputMode: "numeric", maxLength: 6 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PlantSelect,
            {
              label: "State *",
              value: p.state,
              onChange: (v) => setField(i, "state", v),
              options: INDIA_STATES,
              placeholder: "Select state…"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PlantSelect,
            {
              label: "District *",
              value: p.district,
              onChange: (v) => setField(i, "district", v),
              options: districtOpts,
              placeholder: p.state ? "Select district…" : "Select state first",
              disabled: !p.state
            }
          )
        ] })
      ] }, i);
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => commit([...plants, emptyPlant()]),
        className: "inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          " Add another plant / unit"
        ]
      }
    )
  ] });
}
function PlantInput({
  label,
  value,
  onChange,
  inputMode,
  maxLength
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground mb-1 block", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "text",
        value,
        onChange: (e) => onChange(e.target.value),
        inputMode,
        maxLength,
        className: inputCls
      }
    )
  ] });
}
function PlantSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground mb-1 block", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "select",
      {
        value,
        onChange: (e) => onChange(e.target.value),
        disabled,
        className: inputCls,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: placeholder }),
          options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o, children: o }, o))
        ]
      }
    )
  ] });
}
export {
  OnboardingForm as O
};
