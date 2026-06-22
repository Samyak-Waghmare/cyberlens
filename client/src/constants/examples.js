/** Demo content users can auto-fill from the analyzer. */

export const PHISHING_EXAMPLE = `From: security@paypa1.com
Subject: URGENT: Your account has been limited!

Dear Customer,

We have detected suspicious activity on your PayPal account. Your account access has been temporarily limited.

To restore your account access immediately, please verify your information within 24 hours or your account will be permanently suspended.

Click here to verify: http://paypal-secure-login.suspicious-domain.xyz/verify?user=target

PayPal Security Team`;

export const URL_EXAMPLE =
  "http://amaz0n-prime-renewal.tk/login?redirect=https://amazon.com&session=abc123&confirm=payment";

export const EXAMPLES = [
  { label: "Try phishing email example", value: PHISHING_EXAMPLE },
  { label: "Try suspicious URL example", value: URL_EXAMPLE },
];

export const MIN_CHARS = 10;
