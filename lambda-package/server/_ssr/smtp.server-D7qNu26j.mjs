function renderTemplate(source, variables) {
  const res = source.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, k) => {
    const v = variables[k];
    if (v === null || v === void 0) return "";
    return String(v);
  });
  return res.replace(/₹\s*₹/g, "₹");
}
function escapeHtml(input) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function renderTemplateHtml(source, variables) {
  const res = source.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, k) => {
    const v = variables[k];
    if (v === null || v === void 0) return "";
    const raw = String(v);
    const isTrustedRaw = k.startsWith("__") || /_(html|raw)$/i.test(k);
    return isTrustedRaw ? raw : escapeHtml(raw);
  });
  return res.replace(/₹\s*₹/g, "₹");
}
export {
  renderTemplate,
  renderTemplateHtml
};
