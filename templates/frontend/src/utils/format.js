/** "IN" → "India" */
export function countryName(code) {
  if (!code) return "";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

/** ["a", "b", "c"] → "a, b and c" */
export function formatList(items = []) {
  const list = items.filter(Boolean);
  if (list.length < 2) return list.join("");
  return `${list.slice(0, -1).join(", ")} and ${list.at(-1)}`;
}

/** One line from siteConfig.address: "12 Hill Road, Mumbai, Maharashtra 400050, India" */
export function formatAddress({ street, city, state, postalCode, country } = {}) {
  if (!street && !city) return "";
  const region = [state, postalCode].filter(Boolean).join(" ");
  return [street, city, region, countryName(country)].filter(Boolean).join(", ");
}

/** "+91 98765 43210" → "tel:+919876543210" */
export function telHref(phone = "") {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** "919876543210" → "https://wa.me/919876543210" */
export function whatsappHref(number = "") {
  return `https://wa.me/${number.replace(/\D/g, "")}`;
}
