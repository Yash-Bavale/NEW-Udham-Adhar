const DEFAULT_BUSINESS_HOURS = {
  timezone: "Asia/Kolkata",
  openTime: "10:00",
  closeTime: "18:00",
  workingDays: [1, 2, 3, 4, 5, 6],
  holidays: []
};
function addBusinessSeconds(from, seconds, cfg = DEFAULT_BUSINESS_HOURS) {
  return new Date(from.getTime() + seconds * 1e3);
}
export {
  DEFAULT_BUSINESS_HOURS as D,
  addBusinessSeconds as a
};
