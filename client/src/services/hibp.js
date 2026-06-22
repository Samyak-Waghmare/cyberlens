/**
 * Privacy-preserving breach check using the Have I Been Pwned
 * "Pwned Passwords" range API and k-anonymity.
 *
 * We hash the password with SHA-1 locally and send ONLY the first 5 hex
 * characters of the hash to the API. The full password — and even its full
 * hash — never leaves the browser. The API returns all suffixes that share
 * that 5-char prefix; we match the rest locally.
 */
export async function checkPwnedPassword(password) {
  if (!password) return { count: 0, prefix: "" };

  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-1", data);
  const hash = [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { "Add-Padding": "true" },
  });
  if (!res.ok) throw new Error(`Breach service returned ${res.status}`);

  const text = await res.text();
  let count = 0;
  for (const line of text.split("\n")) {
    const [suf, c] = line.trim().split(":");
    if (suf === suffix) {
      count = parseInt(c, 10) || 0;
      break;
    }
  }
  return { count, prefix };
}
