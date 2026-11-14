function numberToWordsIndian(num) {
  if (num === 0) return "Zero";
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen"
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const twoDigits = (n) => {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  };
  const threeDigits = (n) => {
    const h = Math.floor(n / 100);
    const r = n % 100;
    return (h ? ones[h] + " Hundred" + (r ? " " : "") : "") + (r ? twoDigits(r) : "");
  };
  const crore = Math.floor(num / 1e7);
  const lakh = Math.floor(num % 1e7 / 1e5);
  const thousand = Math.floor(num % 1e5 / 1e3);
  const rest = num % 1e3;
  let out = "";
  if (crore) out += threeDigits(crore) + " Crore ";
  if (lakh) out += twoDigits(lakh) + " Lakh ";
  if (thousand) out += twoDigits(thousand) + " Thousand ";
  if (rest) out += threeDigits(rest);
  return out.trim();
}
function amountInWordsINR(n) {
  const rupees = Math.floor(n);
  const paise = Math.round((n - rupees) * 100);
  const word = numberToWordsIndian(rupees);
  const paiseWord = paise > 0 ? ` and ${numberToWordsIndian(paise)} Paise` : "";
  return `Indian Rupees ${word}${paiseWord} Only`;
}
export {
  amountInWordsINR
};
