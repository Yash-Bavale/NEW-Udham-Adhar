import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn, g as getRequest } from "./server-BFjd5iLF.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
const FALLBACK = {
  websiteId: "",
  domain: "udyamadhar.in",
  siteName: "Udyam Aadhar",
  legalEntity: "Business Help Services",
  companyName: "Business Help Services",
  supportEmail: "help@businesshelpservices.com",
  supportPhone: null,
  whatsappNumber: null,
  businessHours: null,
  primaryColor: "#1e3a8a",
  logoAssetUrl: null,
  faviconAssetUrl: null,
  sampleCertificateAssetUrl: null,
  postalAddress: null,
  footerUnlockCode: null,
  legalFooterLine: "Udyam Aadhar is operated by Business Help Services, a private consultancy. We are not affiliated with, authorised by, endorsed by, or associated with any government authority or department.",
  googleSiteVerification: null,
  gtagId: null,
  baseUrl: "https://udyamadhar.in",
  isPrimary: true,
  allowAdmin: true
};
const getCurrentBrand_createServerFn_handler = createServerRpc({
  id: "3adfbbffa09a08986dadc258d343ab0ad93d2bb4e8b7fd791b5c562740a75971",
  name: "getCurrentBrand",
  filename: "src/lib/websites/current-brand.functions.ts"
}, (opts) => getCurrentBrand.__executeServer(opts));
const getCurrentBrand = createServerFn({
  method: "GET"
}).handler(getCurrentBrand_createServerFn_handler, async () => {
  try {
    const {
      resolveCurrentWebsite
    } = await import("./current-website.server-D9vbN4Zc.mjs");
    const request = getRequest();
    const row = await resolveCurrentWebsite(request);
    return {
      websiteId: row.id,
      domain: row.domain,
      siteName: row.brand_name || row.name || FALLBACK.siteName,
      legalEntity: row.legal_entity || FALLBACK.legalEntity,
      companyName: row.company_name || FALLBACK.companyName,
      supportEmail: row.support_email || FALLBACK.supportEmail,
      supportPhone: row.support_phone,
      whatsappNumber: row.whatsapp_number,
      businessHours: row.business_hours,
      primaryColor: row.primary_color,
      logoAssetUrl: row.logo_asset_url,
      faviconAssetUrl: row.favicon_asset_url,
      sampleCertificateAssetUrl: row.sample_certificate_asset_url,
      legalFooterLine: row.legal_footer_line || FALLBACK.legalFooterLine,
      postalAddress: row.postal_address,
      footerUnlockCode: row.footer_unlock_code,
      googleSiteVerification: row.google_site_verification,
      gtagId: row.gtag_id,
      baseUrl: `https://${row.domain}`,
      isPrimary: !!row.is_primary,
      allowAdmin: row.allow_admin !== false
    };
  } catch (err) {
    console.warn("[getCurrentBrand] falling back to defaults", err);
    return FALLBACK;
  }
});
export {
  getCurrentBrand_createServerFn_handler
};
