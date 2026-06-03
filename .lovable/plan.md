## Final Plan (confirmed)

### 1. SQL migration — reorder `seo_pages.sort_order` to 1..130

Exact slug sequence (Home `/` stays separate, not numbered):

```
1   udyamregistration
2   udyam-regn
3   udyam
4   udyog-aadhar
5   udyam-certificate
6   register-for-msme
7   register-msme
8   udyam-aadhar
9   udyam-reg-certificate
10  udyam-regn-certificate
11  udyog-aadhar-registration
12  msme-certificate
13  msme-certificate-download
14  aadhar-udyog
15  udyam-certificate-download
16  msme-online-registration
17  aadhar-udyam
18  udyam-portal
19  udyog-aadhar-download
20  msme-udyam-download
21  udyog-aadhar-registration-2        (duplicate kept as-is)
22  udyam-download
23  msme-udyam-registration
24  udyam-aadhar-registration
25  udyam-registration-certificate-download
26  udyam-registration-download
27  udyam-registration-form
28  udyam-registration-number
29  udyam-registration-online
30  udyam-registration-portal
31  aadhar-udyog-registration
32  udyog-aadhar-certificate
33  udyam-certificate-registration
34  msme-certificate-registration
35  udyog-aadhaar
36  udyog-aadhar-update
37  msme-udyog-aadhar
38  udyam-online-registration
39  msme-udyam-certificate-download
40  download-msme-certificate
41  udyog-aadhar-certificate-download
42  udyam-register
43  udyam-new-registration
44  udyam-update
45  udyam-certificate-update
46  udyam-msme-certificate
47  udyam-adhaar
48  udyam-number
49  aadhar-udyam-certificate
50  udyog-aadhaar-number
51  www-udyamregistration-gov-in
52  udyam-aadhaar-registration
53  udyog-aadhar-free-registration
54  udyam-certificate-apply
55  udyam-update-online
56  udyam-msme-certificate-2           (duplicate kept as-is)
57  msme-certificate-update
58  udyam-card
59  udyog-aadhar-card
60  msme-updation
61  aadhaar-udyam
62  udyam-register-certificate-download
63  udyam-download-certificate
64  aadhar-udyam-download
65  aadhar-udyam-registration
66  download-udyam
67  free-msme-registration-certificate-download
68  msme-registration-charges
69  msme-registration-fee
70  msme-registration-portal
71  msme-registration-process
72  udyam-card-download
73  udyam-edit
74  udyam-msme-registration
75  udyog-aadhaar-government-in
76  udyog-aadhaar-no
77  udyog-aadhaar-register
78  udyog-aadhaar-update
79  udyog-aadhaar-govin
80  www-udyamregistration
81  udyam-aadhaar-download-pdf
82  msme-registration-free
83  https-udyamregistration-gov-in
84  msme-registration-certificate-download
85  download-udyam-certificate
86  print-udyam-certificate
87  udyam-certificate-print
88  udyam-application
89  msme-certificate-print
90  print-msme-certificate
91  udhar-aadhar-registration
92  udyog-aadhaar-to-udyam-migration
93  download-udyam-certificate-online
94  udyam-adhar-2                      (duplicate kept as-is)
95  msme-apply-online
96  udyam-certificate-download-pdf
97  ms-me-certificate
98  msme-cer
99  download-udyam-aadhar
100 udham-aadhar-download
101 udhayam-aadhar-download
102 udyam-print
103 print-udyam
104 udyam-register-print
105 udyam-print-download
106 udyam-reprint
107 udyam-print-certificate
108 msme-print-udyam-certificate
109 aadhar-udyam-print
110 msme-print-certificate
111 print-msme-udyam-certificate
112 print-udyam-certificate-download
113 udyam-print-with-annexure
114 udyam-adhar-download
115 udyog-aadhaar-download
116 udyam-aadhaar-verify
117 udyam-aadhaar-status
118 udyam-registration-number-verify
119 udyam-pan-registration
120 udyam-aadhaar-login
121 udyog-aadhar-registration-online
122 udyam-apply
123 udyam-certificate-apply-online
124 msme-registration-login
125 udyam-registration-check
126 udyam-download-online
127 udyam-certificate-status
128 udyam-registration-update
129 udyam-certificate-reprint
130 udyam-msme-certificate-download
```

This single update drives **Footer order, admin list, and sitemap.xml** — all read `seo_pages.sort_order` ASC.

### 2. Restore linked H1 + H2 on ALL 130 SEO pages (from XML)

In `src/components/site/SeoLandingPage.tsx`:

- **Remove** the sanitizer block currently stripping these headings.
- **Preserve as-is** from the XML content:
  - Real `<h1>` = slug name (e.g., "Udyamregistration") — bold, visible
  - Real `<h2><a href="/">…</a></h2>` = linked descriptive heading (e.g., "Udyamregistration – Official MSME Registration Portal India") — bold blue (the circled element in the screenshot)
- **Remove** the existing `sr-only` root `<h1>` so each page has exactly one `<h1>` (proper SEO — single H1 rule).
- Result: linked H2 appears on **every one of the 130 SEO pages**, fully crawlable (DOM + View Source) and browser-searchable (Ctrl+F).

### 3. Form header = single complete line

In `src/components/site/LeadForm.tsx`:

- Remove split/subtitle logic.
- Render full title as one bold heading line (e.g., "Udyam Reg Certificate - Download MSME Registration Certificate"). No lighter subtitle.

### 4. Footer category rename

In `src/components/site/Footer.tsx`:

- "Business Help Services Online" → "Udyam Registration Online"

### Execution order

1. SQL UPDATEs for all 130 `sort_order` values (via insert tool — data update).
2. Edit `SeoLandingPage.tsx` — keep H1 + linked H2 block, drop sr-only h1.
3. Edit `LeadForm.tsx` — single-line header.
4. Edit `Footer.tsx` — category rename.

Approve to implement.