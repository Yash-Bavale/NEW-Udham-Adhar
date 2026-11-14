import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const STANDARD_CLOSE_REASONS = [{
  id: "A1",
  category: "A",
  number: 1,
  label: "Government Platform Assumption",
  standard_reply: "Your query has been reviewed. During our communication, it was noted that the order was placed under the assumption that Business Help Services was an official Government website or Government portal.\nBusiness Help Services is an independent private consultancy and assistance service provider. The applicable service information and website notices remain applicable to this order.",
  sort_order: 1
}, {
  id: "A2",
  category: "A",
  number: 2,
  label: "Change of Mind",
  standard_reply: "Your request has been reviewed. During our communication, you informed us that you no longer wish to continue with the requested service after placing the order.\nYour request has been recorded and will be processed in accordance with our applicable policies.",
  sort_order: 2
}, {
  id: "A3",
  category: "A",
  number: 3,
  label: "User Does Not Wish to Proceed",
  standard_reply: "Based on your communication, you have indicated that you do not wish to proceed further with the requested service.\nYour request has been noted and the order will be handled in accordance with our applicable policies.",
  sort_order: 3
}, {
  id: "A4",
  category: "A",
  number: 4,
  label: "OTP / Verification Assistance Not Provided",
  standard_reply: "Further processing requires OTP verification, authentication, confirmation, or other verification details.\nKindly reply to this email with the required verification information so that further processing can continue.",
  sort_order: 4
}, {
  id: "A5",
  category: "A",
  number: 5,
  label: "Change in Service Requirement",
  standard_reply: "During our communication, it was observed that your current service requirement differs from the service originally selected while placing the order.\nKindly confirm the required service so that we may guide you regarding the appropriate next steps.",
  sort_order: 5
}, {
  id: "A6",
  category: "A",
  number: 6,
  label: "Incorrect Information",
  standard_reply: "The information or documents currently available are Incorrect or incomplete, inconsistent, or require clarification before further processing can continue.\nKindly provide the correct requested information by replying to this email.",
  sort_order: 6
}, {
  id: "A7",
  category: "A",
  number: 7,
  label: "Required Documents or Communication Not Received",
  standard_reply: "The required documents, confirmations, or communication necessary for further processing have not yet been received.\nKindly reply with the requested information so that we may continue processing your request.",
  sort_order: 7
}, {
  id: "A8",
  category: "A",
  number: 8,
  label: "Customer Unreachable / Non-Responsive",
  standard_reply: "Multiple attempts were made to contact you; however, we were unable to complete the required communication.\nKindly reply to this email at your convenience so that further assistance can be provided.",
  sort_order: 8
}, {
  id: "A9",
  category: "A",
  number: 9,
  label: "Eligibility / Verification Related Issue",
  standard_reply: "During verification, certain eligibility requirements or verification conditions were identified that require clarification before further processing can continue.\nKindly review the requested information and reply to this email.",
  sort_order: 9
}, {
  id: "A10",
  category: "A",
  number: 10,
  label: "Service Activities Already Initiated",
  standard_reply: "Our records indicate that consultation, documentation review, coordination, or other service-related activities have already commenced under this order.\nFurther handling of your request will therefore be governed by the applicable Terms & Conditions and Refund & Cancellation Policy.",
  sort_order: 10
}, {
  id: "B11",
  category: "B",
  number: 11,
  label: "Government Portal Down / Unavailability",
  standard_reply: "The concerned Government portal is presently unavailable or experiencing technical issues, preventing further processing of your application.\nProcessing will continue once the portal becomes operational.",
  sort_order: 11
}, {
  id: "B12",
  category: "B",
  number: 12,
  label: "External System / Portal Dependency Issue",
  standard_reply: "Processing of your request is presently affected due to dependency on an external Government portal, authority, or third-party system.\nWe will continue processing once the required external services become available.",
  sort_order: 12
}, {
  id: "C13",
  category: "C",
  number: 13,
  label: "Technical / Server Interruption",
  standard_reply: "Further processing is temporarily affected due to technical issues, server interruption, or portal unavailability.\nProcessing will resume once the technical issue is resolved.",
  sort_order: 13
}, {
  id: "C14",
  category: "C",
  number: 14,
  label: "Operational / Technical Issue Beyond Control",
  standard_reply: "Further processing is temporarily delayed due to operational or technical conditions beyond our reasonable control.\nWe appreciate your patience while the matter is being addressed.",
  sort_order: 14
}];
const listCloseReasons = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("cf6e6729a8ff40c24ef20d7be8c0c6bd9c885baa44053e5f2a3fb94965cf62b6"));
export {
  STANDARD_CLOSE_REASONS,
  listCloseReasons
};
