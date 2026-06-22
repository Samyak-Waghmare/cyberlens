/** Training rounds for the Phishing Dojo. isScam = correct answer. */
export const DOJO_ROUNDS = [
  {
    kind: "Email",
    content:
      "From: support@paypal.com\nYour payment of $2.99 to Spotify was successful. View your receipt in the PayPal app.",
    isScam: false,
    why: "Legit. Real sender domain, no urgency, no link asking for credentials, and it points you to the official app rather than a link.",
  },
  {
    kind: "SMS",
    content:
      "AMAZON: Your account is on hold. Verify now to avoid suspension: http://amzn-verify.account-secure.tk",
    isScam: true,
    why: "Scam. Urgency + a look-alike domain (amzn-verify.account-secure.tk) on a high-risk .tk TLD. Amazon never uses domains like this.",
  },
  {
    kind: "Email",
    content:
      "Dear Customer, We noticed unusual sign-in activity. Confirm your identity within 24 hours or your account will be permanently closed. Click: http://secure-login.micros0ft-support.com",
    isScam: true,
    why: "Scam. Generic greeting, a 24-hour deadline, and a homoglyph domain (micros0ft with a zero). Classic phishing.",
  },
  {
    kind: "URL",
    content: "https://github.com/login",
    isScam: false,
    why: "Legit. The registrable domain is exactly github.com over HTTPS — no look-alike tricks or extra subdomains.",
  },
  {
    kind: "SMS",
    content:
      "Congratulations! You've won a $1000 gift card. Claim now before it expires: bit.ly/free-reward-now",
    isScam: true,
    why: "Scam. Too-good-to-be-true prize + urgency + a shortened link hiding the real destination.",
  },
  {
    kind: "Email",
    content:
      "From: no-reply@netflix.com\nWe're updating our Terms of Service on March 1. No action is needed. Read the summary at help.netflix.com.",
    isScam: false,
    why: "Legit. No urgency, no credential request, and it links to the official help.netflix.com subdomain of netflix.com.",
  },
];
