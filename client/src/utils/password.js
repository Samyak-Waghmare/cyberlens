/** Password strength estimation + secure generation (no dependencies). */

const COMMON = [
  "password", "123456", "123456789", "qwerty", "abc123", "111111", "password1",
  "12345678", "iloveyou", "admin", "welcome", "monkey", "dragon", "letmein",
  "football", "login", "princess", "qwerty123", "000000", "1q2w3e4r", "secret",
];

const SEQS = ["abcdefghijklmnopqrstuvwxyz", "01234567890", "qwertyuiop", "asdfghjkl", "zxcvbnm"];

function charsetSize(pw) {
  let size = 0;
  if (/[a-z]/.test(pw)) size += 26;
  if (/[A-Z]/.test(pw)) size += 26;
  if (/[0-9]/.test(pw)) size += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) size += 33;
  return size || 1;
}

function hasSequence(pw) {
  const lower = pw.toLowerCase();
  for (const seq of SEQS) {
    for (let i = 0; i < seq.length - 2; i++) {
      const chunk = seq.slice(i, i + 3);
      if (lower.includes(chunk) || lower.includes([...chunk].reverse().join(""))) return true;
    }
  }
  return false;
}

function humanTime(seconds) {
  if (seconds < 1) return "instantly";
  const units = [
    ["centuries", 60 * 60 * 24 * 365 * 100],
    ["years", 60 * 60 * 24 * 365],
    ["months", 60 * 60 * 24 * 30],
    ["days", 60 * 60 * 24],
    ["hours", 60 * 60],
    ["minutes", 60],
    ["seconds", 1],
  ];
  for (const [name, secs] of units) {
    if (seconds >= secs) {
      const v = Math.round(seconds / secs);
      return `${v.toLocaleString()} ${name}`;
    }
  }
  return "instantly";
}

const LABELS = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];

export function analyzePassword(pw) {
  if (!pw) {
    return { score: 0, label: "—", entropyBits: 0, crackTime: "—", suggestions: [], length: 0 };
  }

  const size = charsetSize(pw);
  let entropy = pw.length * Math.log2(size);

  const lower = pw.toLowerCase();
  const suggestions = [];

  // Penalties
  if (COMMON.includes(lower)) {
    entropy = Math.min(entropy, 10);
    suggestions.push("This is one of the most common passwords — never use it.");
  }
  if (/^(.)\1+$/.test(pw)) {
    entropy = Math.min(entropy, 12);
    suggestions.push("Avoid repeating a single character.");
  }
  if (hasSequence(pw)) {
    entropy -= 12;
    suggestions.push("Avoid keyboard or alphabet sequences (e.g. abc, qwerty, 123).");
  }
  if (/(.)\1\1/.test(pw)) {
    entropy -= 8;
    suggestions.push("Avoid 3+ repeated characters in a row.");
  }

  entropy = Math.max(0, Math.round(entropy));

  // Suggestions for improvement
  if (pw.length < 12) suggestions.push("Use at least 12–16 characters.");
  if (!/[A-Z]/.test(pw)) suggestions.push("Add uppercase letters.");
  if (!/[0-9]/.test(pw)) suggestions.push("Add numbers.");
  if (!/[^a-zA-Z0-9]/.test(pw)) suggestions.push("Add symbols (!@#$…).");

  // Crack time: offline fast hash ~ 1e11 guesses/sec, average half the space.
  const guesses = Math.pow(2, entropy) / 2;
  const crackTime = humanTime(guesses / 1e11);

  let score;
  if (entropy < 28) score = 0;
  else if (entropy < 40) score = 1;
  else if (entropy < 60) score = 2;
  else if (entropy < 80) score = 3;
  else score = 4;

  return {
    score,
    label: LABELS[score],
    entropyBits: entropy,
    crackTime,
    suggestions: [...new Set(suggestions)].slice(0, 4),
    length: pw.length,
  };
}

const SETS = {
  lower: "abcdefghijkmnopqrstuvwxyz",
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  digits: "23456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?",
};

export function generatePassword(length = 16, opts = {}) {
  const o = { lower: true, upper: true, digits: true, symbols: true, ...opts };
  const pools = Object.keys(SETS).filter((k) => o[k]);
  if (pools.length === 0) pools.push("lower");

  const all = pools.map((k) => SETS[k]).join("");
  const out = [];
  const rand = (max) => {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  };

  // Guarantee one char from each selected pool.
  pools.forEach((k) => out.push(SETS[k][rand(SETS[k].length)]));
  while (out.length < length) out.push(all[rand(all.length)]);

  // Fisher–Yates shuffle.
  for (let i = out.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.join("");
}
