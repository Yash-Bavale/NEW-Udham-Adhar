import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-certificate.html?raw";

const TITLE = "Download Udyam Certificate – Official MSME PDF Download Online";
const DESC =
  "Download Udyam Certificate enables businesses to obtain their official MSME registration document instantly from the Udyam portal by entering the Udyam Registration Number and verifying via OTP.";

export const Route = createFileRoute("/download-udyam-certificate")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam-certificate" },
    ],
  }),
  component: () => (
    <SeoLandingPage
      title="Download Udyam Certificate"
      linkTitle="Download Udyam Certificate – Official MSME PDF Download Online"
      html={html}
    />
  ),
});
