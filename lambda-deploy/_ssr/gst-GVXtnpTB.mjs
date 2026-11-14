const GST_RATE = 0.18;
const r2 = (n) => Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
function fromTotal(total) {
  const t = Math.max(0, Number(total) || 0);
  const base = r2(t / (1 + GST_RATE));
  const gst = r2(t - base);
  return { base, gst, total: r2(t) };
}
function fromBase(base) {
  const b = Math.max(0, Number(base) || 0);
  const gst = r2(b * GST_RATE);
  const total = r2(b + gst);
  return { base: r2(b), gst, total };
}
export {
  fromBase as a,
  fromTotal as f
};
