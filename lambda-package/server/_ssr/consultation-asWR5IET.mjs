function normalizeConsultationText(value) {
  return (value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}
function isConsultationSource(source) {
  const s = normalizeConsultationText(source);
  return s.includes("talktoexpert") || s.includes("expertconsultation");
}
function isConsultationServiceName(serviceName) {
  const s = normalizeConsultationText(serviceName);
  return s.includes("expertconsultation") || s.includes("talktoexpert") || s.includes("suitableserviceselection");
}
function isTalkToExpertLead(input) {
  return isConsultationSource(input?.lead_source ?? input?.source) || isConsultationServiceName(input?.service ?? input?.service_name);
}
function isUnconvertedConsultationLead(input) {
  return isTalkToExpertLead(input) && isConsultationServiceName(input?.service ?? input?.service_name);
}
function isConvertedConsultationLead(input) {
  return isConsultationSource(input?.lead_source ?? input?.source) && !isConsultationServiceName(input?.service ?? input?.service_name);
}
export {
  isTalkToExpertLead as a,
  isConvertedConsultationLead as b,
  isUnconvertedConsultationLead as i
};
