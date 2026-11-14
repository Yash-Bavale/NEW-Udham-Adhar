async function resolveApplicationCode(leadId, opts = {}) {
  const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
  const timeoutMs = opts.timeoutMs ?? 3e3;
  const intervalMs = opts.intervalMs ?? 400;
  const deadline = Date.now() + timeoutMs;
  const readOnce = async () => {
    if (opts.applicationId) {
      const { data: data2 } = await supabaseAdmin.from("applications").select("application_code").eq("id", opts.applicationId).maybeSingle();
      const code2 = data2?.application_code;
      if (code2) return code2;
    }
    const { data } = await supabaseAdmin.from("applications").select("application_code").eq("lead_id", leadId).order("created_at", { ascending: false }).limit(1).maybeSingle();
    return data?.application_code ?? null;
  };
  let code = await readOnce();
  while (!code && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, intervalMs));
    code = await readOnce();
  }
  return code;
}
export {
  resolveApplicationCode
};
