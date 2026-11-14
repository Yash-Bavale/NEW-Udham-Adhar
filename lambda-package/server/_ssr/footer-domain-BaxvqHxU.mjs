const DEFAULT_DOMAIN = "udyamadhar.in";
const POLICY_PATHS = [
  "terms-conditions",
  "refund-cancellation-policy",
  "privacy-policy",
  "disclaimer",
  "service-delivery-policy"
];
function normalizeSiteDomain(domain) {
  const d = String(domain ?? "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(d) ? d : null;
}
function applyFooterDomain(html, domain) {
  const target = normalizeSiteDomain(domain);
  if (!html || !target || target === DEFAULT_DOMAIN) return html;
  let out = html;
  for (const p of POLICY_PATHS) {
    out = out.split(`https://${DEFAULT_DOMAIN}/${p}`).join(`https://${target}/${p}`);
    out = out.split(`https://www.${DEFAULT_DOMAIN}/${p}`).join(`https://${target}/${p}`);
  }
  out = out.replace(/href=(["'])https:\/\/(www\.)?udyamadhar\.in\/?\1/gi, `href=$1https://${target}$1`);
  out = out.replace(/>\s*https:\/\/(www\.)?udyamadhar\.in\/?\s*</gi, `>https://${target}<`);
  out = out.replace(/www\.udyamadhar\.in(?![\w/.-])/gi, `www.${target}`);
  out = out.replace(/(&nbsp;\|&nbsp;\s*|\|\s*)udyamadhar\.in(?![\w/.-])/gi, `$1${target}`);
  return out;
}
export {
  applyFooterDomain,
  normalizeSiteDomain
};
